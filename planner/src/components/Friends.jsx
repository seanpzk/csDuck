import React, { useEffect, useState, useRef } from "react";
import firebaseAuth, { realtimeDb } from "../firebase.config";
import { backendURL } from "./helperFunctions/serverUrl";
import { ref, onValue, push, get, onChildAdded, onChildRemoved, set } from "firebase/database"
import "../stylesheets/Friend-sidebar-stylesheets/Friend-stylesheet.css";
import addFriendIcon from "../assets/addFriend.png";
import clipboardIcon from "../assets/clipboardIcon.png";
import removeFriendIcon from "../assets/removeFriend.png";
import ShowBio from "./ShowBio";

const Friends = React.forwardRef((props, reactRef) => {
    // track current user's name
    const [currentUserName, setCurrentUserName] = useState("");
    // Tracks list of friend uids.
    const [friendList, setFriendList] = useState([]);
    // Track list of friend names. Order should correspond to friendList.
    const [friendNames, setFriendNames] = useState([]);
    // Track list of friend bio. ORder should correspond to friendList.
    const [friendBio, setFriendBio] = useState([]);
    // Form for creating user
    const [friendForm, setFriendForm] = useState({
        friendId : ""
    })
    const [currentTaskList, setCurrentTaskList] = useState({});
    // tracks listeners on friend's currentTask
    const [listeners, setListeners] = useState({});
    const [myUID, setUID] = useState("");
    const [collapseButtonStyle, setCollapseButtonStyle] = useState();
    const [errorMessage, setErrorMessage] = useState("");

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
     * Fetches the friendList whenever Friends is first loaded.
     * Adds listener to friendList in realtime database to react respond when friends are removed/added.
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
        });
        // Retrieve currentUser name
        firebaseAuth.currentUser?.getIdToken()
            .then(idToken => uidToUser(currentUserUID, idToken))
                .then(user => setCurrentUserName(user.username));
    }, []);

    /**
     * Obtains the respective user from mongodb corresponding to uid.
     * 
     * @param {String} uid 
     * @param {String} idToken Used for authentication to backend
     * @return Promise(user) of uid
     */
    function uidToUser(uid, idToken) {
        return new Promise((resolve) => {
            const response = fetch(`${backendURL}/setting?UID=${uid}`, {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + idToken,  
                    "Content-Type": "application/json",
                }
            }).then(res => res.json()
                .then(data => {
                    console.log(data[0]);
                    resolve(data[0]);
                    }
                ));
        });
    }

    /**
     * Update (currentTaskList, friendNames) whenever friendList is updated.
     */
    useEffect(() => {
        obtainCurrentTask(friendList);
        updateFriendNamesBio(friendList);
    }, [friendList]);

    /**
     * Updates the state of friendNames and friendBio in react based on friendList.
     * 
     * @param {Array} friendList array containing the uid of friends
     */
    function updateFriendNamesBio(friendList) {
        const currentUser = firebaseAuth.currentUser;
        currentUser.getIdToken()
            .then(idToken => {
                // obtain the respective array of names
                const promises = friendList.map(frienduid => {
                    return uidToUser(frienduid, idToken);
                });
                Promise.all(promises)
                    .then(users => {
                        setFriendNames(users.map(user => user.username));
                        setFriendBio(users.map(user => user.bio));
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
        // Add for currentUser
        const friendListRef = ref(realtimeDb, 'users/' + currentUserUID + '/friendList');
        const friendRef = ref(realtimeDb, 'users/' + friendUID);
        await get(friendRef).then(snapshot => {
            if (snapshot.exists()) {
                push(friendListRef, friendUID, error => console.log(error));
                console.log("Updated in realtime db");
                // Add for friend
                console.log(friendUID);
                const friend_friendListRef = ref(realtimeDb, 'users/' + friendUID + '/friendList');
                push(friend_friendListRef, currentUserUID, error => console.log(error));
        
            } else {
                console.log("User uid doesn't exist in realtime database")
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
        console.log(friendForm.friendId);
        if (friendForm.friendId == currentUser.uid || friendForm.friendId == "") {
            setErrorMessage("Enter your friend's User ID!");
            setTimeout(() => setErrorMessage(""), 5000);
        }
        else{
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
                        res.text().then(txt => {
                            setErrorMessage(txt);
                            setTimeout(() => setErrorMessage(""), 5000);
                            throw new Error("Error: " + txt)
                        });
                    }
                })
                .then(data => {
                    addFriendList(friendForm.friendId)
                })
                .catch(error => console.log(error));
            }
        }
        setFriendForm({
            friendId: ""
        });
        event.target.reset();
    }

    /** 
     * Removes friend UID from friendlist in realtime database + react state
    */
    function removeFriendList(uid) {
        const friendListRef = ref(realtimeDb, '/users/' + myUID + '/friendList');
        get(friendListRef)
            .then(snapshot => {
                snapshot.forEach(child => console.log(child.val()));
                const friendArr = snapshot.val() || [];
                // remove array from the existing array
                const modifiedArr = Object.values(friendArr).filter(item => item != uid);
                // remove listener and update state
                listeners[uid]();
                const modifiedListeners = {...props.listeners}
                delete modifiedListeners.uid
                setListeners(modifiedListeners);

                set(friendListRef, modifiedArr);
                setFriendList(modifiedArr);
            })
        const friend_friendListRef = ref(realtimeDb, '/users/' + uid + '/friendList');
        get(friend_friendListRef)
            .then(snapshot => {
                const friend_friendArr = snapshot.val() || [];
                const modifiedArr = Object.values(friend_friendArr).filter(item => item != myUID);
                set(friend_friendListRef, modifiedArr);
            })
    }

    function deleteFriend(friendList, index) {
        firebaseAuth.currentUser?.getIdToken()
        .then(idToken => {
            fetch(`${backendURL}/removeFriend?currentUserUID=${myUID}&friendUID=${friendList[index]}`, {
                method: "DELETE",
                headers: {
                Authorization: "Bearer " + idToken,
                "Content-Type": "application/json"
                }
            }).then(res => {
                if (res.ok) {
                    return res.json()
                } else {
                    console.log(res.json());
                    throw new Error("Error: " + res.status);
                }
            })
            .then(data => removeFriendList(friendList[index]))
            .catch(error => console.log(error));
        });
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
                const bio = friendBio[index];
                return (
                    <>
                    <div key = {index} className = "userBox">
                        {/* <div className="username">{name}</div> */}
                        <ShowBio 
                        bio = {bio} 
                        username = {name}
                        setIsBioOpen={props.setIsBioOpen}
                        />
                        <div className="user-currentTask">{item || "Chilling at the moment"}</div>
                        <button
                            onClick={(event) => deleteFriend(friendList, index)}
                        >
                            <img src ={removeFriendIcon} alt ="delete friend" height="100%" width="100%"/>
                        </button>
                    </div>
                    </>
                )
            });
    }

    return (
        <>
            <div 
            ref = {reactRef}
            className = "side-bar"
            style={props.sideBarStyle}
            >
                <div
                    className="collapse-button"
                    style = {collapseButtonStyle}
                >
                    <button type = "button" 
                    style={{'background-color': "#D90202", height: "100%", width: "3vw", border: "2px solid black", "border-radius": "50%"}}
                        onClick={event => {
                            props.setSideBarStyle({
                                width: "0px",
                                position:"fixed"});
                            props.setSideBarButtonStyle({
                                position: "fixed",
                                right: "0px",
                                bottom: "0px",
                                backgroundColor: "transparent"
                            })
                        }}
                    >x</button>
                </div>
                <div className="currentUserInfo">
                    {
                        myUID != "" 
                        ? <>
                            <div className="username">{currentUserName}</div>
                            <div className={"uid-info"} title="User-id">{myUID}</div>
                            <button type = "button" onClick={(event) => navigator.clipboard.writeText(myUID)}>
                                <img src={clipboardIcon} height = "100%" width="100%"/>
                            </button>
                        </> 
                        : <></>
                    }
                    <form 
                        onSubmit={addFriend}
                        className={"friend"}
                        title="Enter Your Friend's User ID which is shown below the username!"
                    >
                        <input 
                        className = {"input-field"}
                        placeholder = {"User-id"} 
                        required
                        maxLength={"36"}
                        onInput={(event) => updateForm({friendId: event.target.value})}
                        />
                        <div className={"error-message"}>{errorMessage}</div>
                        <button type = "submit" className={"button-submit"}>
                            <img src = {addFriendIcon} alt = "Add Friend" />
                        </button>
                    </form>
                </div>
                <div className = "friendList">{Object.keys(currentTaskList).length > 0 
                    ? displayUserItems(currentTaskList, friendNames)
                    : <h3>No Friends At The Moment</h3>
                    }</div>
            </div>
        </>
    )
});

export default Friends;