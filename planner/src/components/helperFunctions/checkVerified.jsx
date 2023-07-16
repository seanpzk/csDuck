import { backendURL } from './serverUrl';
import firebaseAuth from "../../firebase.config";

  /**
   * Checks if the user has registered their details
   * 
   * @param {Object} User - fireabse User object
   * @return {boolean} - If registered
   */
  async function checkRegistered(User) {
    const UID = User.uid;
    const idToken = await firebaseAuth.currentUser?.getIdToken();
    const response = await fetch(`${backendURL}/login?UID=${UID}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + idToken,
        "Content-Type": "application/json",
      },
    }).catch((error) => console.log(error));
    const resObj = await response.json();
    if (resObj.message === "not registered") {
      return false;
    }
    return true;
  }

  /**
   * Redirects user to /verifyEmail if have yet to register details.
   * 
   * @return {void}
   */
export async function checkVerified() {
    setUser(firebaseAuth.currentUser);
    // not the best way... This looks for any path with /reginfo
    if (user && !location.pathname.includes("/reginfo")) {
      user.reload();
      if (user.emailVerified) {
        const registered = await checkRegistered(user);
        if (!registered) {
          console.log("Email verified and not registered");
          navigate("/reginfo");
        }
      } else {
        navigate("/verifyEmail");
      }
    }
  }