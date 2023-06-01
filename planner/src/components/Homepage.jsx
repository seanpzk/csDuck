import firebaseAuth from "../firebase.config";
import { sendEmailVerification } from "firebase/auth";
import { NavLink } from "react-router-dom";
import Ads from "./Ads";
import TaskListSS from "../assets/tasklistss.png";

export default function Homepage(props) {
  
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
    </>
  );
}
