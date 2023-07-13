import { useEffect, useState } from "react";
import firebaseAuth, { realtimeDb } from "../firebase.config";
import { backendURL } from "./helperFunctions/serverUrl";
import { ref, onValue, push, get, off, onChildAdded, onChildRemoved } from "firebase/database"
import RemoveFriend from "./removeFriend";
import "../stylesheets/Friend-sidebar-stylesheets/Friend-stylesheet.css";
import addFriendIcon from "../assets/addFriend.png";

export default function Friends(props) {
    const [friendList, setFriendList] = useState([]);
    const [friendNames, setFriendNames] = useState([]);
    const [friendForm, setFriendForm] = useState({
        friendId : ""
    })
    const [currentTaskList, setCurrentTaskList] = useState({});
    // tracks listeners on friend's currentTask
    const [listeners, setListeners] = useState({});
    const [myUID, setUID] = useState("");

    const updateForm = (value) => {
        return setFriendForm((prev) => {
          return { ...prev, ...value };
        });
      };

    useEffect(() => firebaseAuth.onAuthStateChanged(user => 
        user 
        ? setUID(user.uid) 
        : setUID(""))
    );

    /**
     * Fetches the friendList whenever Friends is first loaded
     */
    useEffect(() => {
        const currentUserUID = firebaseAuth.currentUser?.uid;
        const result = [];
        const friendListRef = ref(realtimeDb, 'users/' + currentUserUID + '/friendList');
        get(friendListRef)
        .then(snapshot => {
            snapshot.forEach(item => {
                result.push(item.val())
            })
            setFriendList(result);
        })
        .then(res => {
            // add listeners (Adding + removal of children)
            // Change the friendlist and name in react
            onChildAdded(friendListRef, snapshot => {
                let counter = 0;
                setFriendList(prev => {
                    // i don't understand why this keeps running twice
                    counter ++;
                    if (counter > 1) {
                        return prev;
                    }
                    const updated = [...prev, snapshot.val()]
                    return updated;
                });
            });
            onChildRemoved(friendListRef, snapshot => {
                setFriendList(prev => {
                    const copy = [...prev];
                    const index = copy.indexOf(snapshot.val());
                    copy.splice(index, 1);
                    return copy;
                })
            })
        })
    }, []);

    /**
     * Update currentTask items whenever friendList is updated
     */
    useEffect(() => {
        obtainCurrentTask(friendList);
        updateFriendNames(friendList);
    }, [friendList]);

    function updateFriendNames(friendList) {
        const currentUser = firebaseAuth.currentUser;
        currentUser.getIdToken()
            .then(idToken => {
                // obtain the respective array of names
                const promises = friendList.map(frienduid => {
                    return new Promise((resolve) => {
                        const response = fetch(`${backendURL}/setting?UID=${frienduid}`, {
                            method: "GET",
                            headers: {
                                Authorization: "Bearer " + idToken,  
                                "Content-Type": "application/json",
                            }
                        }).then(res => res.json()
                            .then(data => {
                                resolve(data[0].username);
                                }
                            ));
                    });
                });
                Promise.all(promises)
                    .then(names => {
                        setFriendNames(names)
                    })
            });
    }

    /**
     * Obtains an array of currentTask from an array of uids
     * Sets Listeners on friend's currentTask to know when they change currentTask.
     * 
     * @param {Array[String]} uids Array of friend's uid 
     * @return Array of currentTasks
     */
    function obtainCurrentTask(uids) {
        const result = {};
        const promise = uids.map(uid => {
            const friendCurrentTaskRef = ref(realtimeDb, 'users/' + uid + '/currentTask');

            // add listeners to track the value changes of friend's current task
            const listener = onValue(friendCurrentTaskRef, snapshot => {
                const parentKey = snapshot.ref.parent.key;
                setCurrentTaskList((prevCurrentTaskList) => ({
                    ...prevCurrentTaskList,
                    [parentKey] : snapshot.val()
                }));
            });
            setListeners(prevListeners => ({
                ...prevListeners,
                [uid] : listener
            }));
            // obtain current Tasks
            return get(friendCurrentTaskRef)
            .then(snapshot => {
                result[uid] = snapshot.val();
            })
        });
        Promise.all(promise)
            .then(res => setCurrentTaskList(result));
    }

    /**
     * Add new friend to realtime database.
     * 
     * @param {String} friendUID The uid of the new friend
     * @param {String} friendUsername The username of the new friend
     */
    async function addFriendList(friendUID) {
        const currentUserUID = firebaseAuth.currentUser?.uid;
        const friendListRef = ref(realtimeDb, 'users/' + currentUserUID + '/friendList');
        const friendRef = ref(realtimeDb, 'users/' + friendUID);
        await get(friendRef).then(snapshot => {
            if (snapshot.exists()) {
                push(friendListRef, friendUID, error => console.log(error));
                console.log("Updated in realtime db");
            } else {
                console.log("User uid doesn't exist in realtime database");
            }
        }, error => console.log(error));
    }

    /**
     * Handles submission of the add friend form.
     * Backend checks that there is no duplication of friend.
     * 
     * @param {Event} event
     */
    async function addFriend(event) { 
        event.preventDefault();
        friendForm["firebaseUID"] = firebaseAuth.currentUser?.uid;
        const currentUser = firebaseAuth.currentUser;
        const idToken = await firebaseAuth.currentUser?.getIdToken();
        if (currentUser) {
            await fetch(`${backendURL}/addFriend`, {
                method: "POST",
                headers: {
                  Authorization: "Bearer " + idToken,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(friendForm)
              }).then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    throw new Error("Error: " + res.status);
                }
              })
              .then(data => {
                addFriendList(friendForm.friendId)
              })
              .catch(error => console.log(error));
        }
        setFriendForm({
            friendId: ""
        });
        event.target.reset();
    }

    /**
     * Creates the component for the information (name, currentTask) of each friend.
     * Dynamically creates elements based on the state of (friendNames, currentTaskList).
     * 
     * @param {Array} currentTaskList 
     */
    function displayUserItems(currentTaskList, friendNames) {
        return Object.values(currentTaskList)
            .map((item, index) => {
                const name = friendNames[index];
                return (
                    <div key = {index}>
                        <div>{name}</div>
                        <div>{item}</div>
                    </div>
                )
            });
    }

    return (
        <>
            <div className = "side-bar">
                {
                    myUID != "" 
                    ? <>
                        <h1>Here is your user id</h1>    
                        <h3>{myUID}</h3>
                    </> 
                    : <></>
                }
                <form 
                    onSubmit={addFriend}
                >
                    <input 
                    placeholder = {"Friend-id"} 
                    required
                    onChange={(event) => updateForm({friendId: event.target.value})}
                    />r
                    <button type = "submit">
                        <img src = {addFriendIcon} alt = "Add Friend" height="20%" width="30px"/>
                    </button>
                </form>
                <RemoveFriend 
                    listeners = {listeners} 
                    setListeners={setListeners} 
                    friendList={friendList} 
                    setFriendList={setFriendList} 
                />
                <div>{Object.keys(currentTaskList).length > 0 
                    ? displayUserItems(currentTaskList, friendNames)
                    : <></>
                    }</div>
            </div>
        </>
    )
}