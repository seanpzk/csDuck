import { useEffect } from "react";
import firebaseAuth, { realtimeDb } from "../../firebase.config";
import { ref, serverTimestamp, set, onValue, onDisconnect } from "firebase/database";


//possible to add away status
/*
    User online status situations
    1) User is logged in and is connected (Online)
    2) User is logged in and is not connected (Offline)
    3) User is logged out and is connected (Offline)
    4) User is logged out and is not connected (Offline)    
*/

/**
 * Handles situations (1, 2, 4)
 * 
 * @param {Object} props 
 * @param {Boolean} props.auth The current authentication state of the user
 * @returns empty html
 */
export function UserPresence(props) {
    useEffect(() => {
        // create reference to user's connection status
        const currentUser = firebaseAuth.currentUser
        if (currentUser) {
            const uid = currentUser.uid
            // create reference to user's online status
            const userConnectionRef = ref(realtimeDb, 'users/' + uid + "/connection");
            // create reference to user's last online timestamp
            const userLastOnlineRef = ref(realtimeDb, 'users/' + uid + "/lastOnline");

            // Create a reference to the special '.info/connected' path in 
            // Realtime Database. This path returns `true` when connected
            // and `false` when disconnected.
            const connectedRef = ref(realtimeDb, ".info/connected");
            onValue(connectedRef, function(snapshot) {
                // If we're not currently connected, don't do anything.
                if (snapshot.val()) {
                    set(userConnectionRef, "Online");
                    onDisconnect(userConnectionRef).set("Offline");
                    onDisconnect(userLastOnlineRef).set(serverTimestamp());
                }
            });
        } 
    }, [props.auth]);
    return <></>
}

/**
 * Handles situation (3)
 * 
 * @param {Object} currentUser 
 * @param {string} currentUser.uid UID of the user logged in
 */
export function UserPresenceLogout(currentUser) {
    if (currentUser) {
        const uid = currentUser.uid;
        const userConnectionRef = ref(realtimeDb, 'users/' + uid + "/connection");
        // create reference to user's last online timestamp
        const userLastOnlineRef = ref(realtimeDb, 'users/' + uid + "/lastOnline");
        set(userConnectionRef, "Offline");
        set(userLastOnlineRef, serverTimestamp());
    }
}