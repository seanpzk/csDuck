import Ads from "./Ads";
export default function Homepage(props) {
  /* For testing purpose only--
    async function displayData() {
        console.log("Clicked");
        const idToken = await firebaseAuth.currentUser?.getIdToken();
        await fetch("http://localhost:5050/displayData", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + idToken,
            },
            body: JSON.stringify({message: "Hello there"}),
        }).then((response) => {
            if (response.ok) {
                const rep = response.json().then(msg => console.log(msg.message));
                return rep;
            } else {
              throw new Error("An error occured during login, Please try again!");
            }
          }).catch((error) => {
            window.alert(error);
            return;
        });
    }
    */

  return (
    <>
      <Ads></Ads>

      {/* {props.auth ? <TaskList /> : <></>} */}
    </>
  );
}
