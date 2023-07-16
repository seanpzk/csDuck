import firebaseAuth from "../../../firebase.config";
import { backendURL } from "../serverUrl";

export default async function ScheduleEvent(eventDetails) {
  const idToken = await firebaseAuth.currentUser?.getIdToken();
  await fetch(`${backendURL}/googlecalendar/schedule_event`, {
    method: "POST",
    body: JSON.stringify(eventDetails),
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + idToken,
    },
  });

  // don't need navigate since this function is used in Create.jsx and will navigate for us at end of onSubmit function
}
