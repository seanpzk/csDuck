import { useEffect, useState } from "react";
import firebaseAuth, { realtimeDb } from "../firebase.config";
import { backendURL } from "./helperFunctions/serverUrl";
import { ref, onValue, push, get, off, onChildAdded, onChildRemoved, set } from "firebase/database"

/**
 * 
 * @param {Object} props 
 * @param {Array.<string>} props.friendList List of friend UIDs
 * @param {Function} props.setFriendList Function to set state of props.friendList
 * @param {Object} props.listeners Tracks uid : listener -> used to track listeners for removal
 * @param {Function} props.setListeners Function to set state of props.listeners
 * @returns 
 */
export default function removeFriend(props) {
    const [friendForm, setFriendForm] = useState({
        friendId : ""
    })

    const updateForm = (value) => {
        return setFriendForm((prev) => {
          return { ...prev, ...value };
        });
      };

    /** 
     * Removes friend UID from friendlist in realtime database + react state
    */
    function removeFriendList(uid) {
        const currentUserUID = firebaseAuth.currentUser?.uid;
        console.log(currentUserUID)
        const friendListRef = ref(realtimeDb, '/users/' + currentUserUID + '/friendList');
        get(friendListRef)
            .then(snapshot => {
                snapshot.forEach(child => console.log(child.val()));
                const friendArr = snapshot.val() || [];
                // remove array from the existing array
                const modifiedArr = Object.values(friendArr).filter(item => item != uid);
                // remove listener and update state
                props.listeners[uid]();
                const modifiedListeners = {...props.listeners}
                delete modifiedListeners.uid
                props.setListeners(modifiedListeners);

                set(friendListRef, modifiedArr);
                props.setFriendList(modifiedArr);
            })
    }

    async function deleteFriend(event) {
        //check if present in mongodb
        // delete from mongoDB
        // check if present in realtime database within friendlist
        // delete from friendlist
        // update friendlist state here
        event.preventDefault();
        const currentUser = firebaseAuth.currentUser;
        const currentUserUID = currentUser?.uid;
        const friendUID = friendForm.friendId;
        const idToken = await currentUser?.getIdToken();
        await fetch(`${backendURL}/removeFriend?currentUserUID=${currentUserUID}&friendUID=${friendUID}`, {
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
          .then(data => removeFriendList(friendForm.friendId))
          .catch(error => console.log(error));
        setFriendForm({
            friendId: ""
        });
        event.target.reset();
    }

    return (
        <>
            <form onSubmit = {event => deleteFriend(event)}>
                <input 
                placeholder= "Friends UID"
                required
                onChange= {event => updateForm({friendId : event.target.value})}/>
                <button type = "submit">Delete friend</button>
            </form>
        </>
    )
}