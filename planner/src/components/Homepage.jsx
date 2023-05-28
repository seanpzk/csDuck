import Ads from "./Ads";
import TaskListSS from "../assets/tasklistss.png";
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
      {/* <Ads></Ads> */}
      <div
        className="container-fluid "
        style={{ padding: "2%", backgroundColor: "white" }}
      >
        <div className="row">
          <div className="col-5 " style={{ padding: "3%" }}>
            <h1>Simple & minimalistic to-do-list app </h1>
            <body style={{ fontSize: 20 }}>
              Feeling overwhelmed from your work or clueless on where to start?
              <br />
              Let our app help you sort it out!
            </body>
          </div>
          {/* <div className="col-sm-6"> */}
          <img
            src={TaskListSS}
            className="col-7"
            style={{
              // filter: "background(110%)",
              // filter: "contrast(120%)",
              filter: "drop-shadow(10px 10px 10px black)",
              borderRadius: "3%",
            }}
          ></img>
          {/* </div> */}
        </div>
      </div>
      {/* {props.auth ? <TaskList /> : <></>} */}
    </>
  );
}
