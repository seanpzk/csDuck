import "../stylesheets/styles.css";
import "../stylesheets/VerifyEmail-stylesheet.css";
import firebaseAuth from "../firebase.config.js";
import { useEffect, useState } from "react";
import { sendEmailVerification } from "firebase/auth";

/**
 * Component that renders the verification email page if user has yet to do so.
 * 
 * @return {React.ReactElement} - Renders Resend email verification page.
 */
export default function VerifyEmail(props) {

    const [user, setUser] = useState(null);
    const [disableButton, setDisableButton] = useState(false);
    const [time, setTime] = useState(15);
    const [buttonLabel, setButtonLabel] = useState(false);

    useEffect(() => {
        setUser(firebaseAuth.currentUser), []
    });

    /**
     * Allows user to resend email verification every 15 seconds.
     * Disables button when clicked, enables button after 15 seconds.
     * 
     * @function handleResend
     * @async
     * @param {Object} props
     * @param {function} props.handleResendMock Mock version of handleResend for jest test
     * @return {void}
     */
    async function handleResend(event) {
        if (user) {
            setDisableButton(true);
            setButtonLabel(true);
            await sendEmailVerification(user)
                .catch(error => console.log(error));
            setTimeout(() => setDisableButton(false), 15000)
            const timer = setInterval(() => {
                setTime(prev => {
                    if (prev === 0) {
                        setButtonLabel(false);
                        clearInterval(timer);
                        return 15;
                    } else {
                        return prev - 1;
                    }
                });
            }, 1000);
        }
    }

    return (
        <>
            <div className="verify-Form">
                <h1>Verify your Account</h1>
                <div>
                    <h4>Did not receive the email?</h4>
                    <div className = {buttonLabel ? "button-label" : "hide"}>Try again in {time}</div>
                    <button onClick = { handleResend } 
                        className ="submit-button"
                        disabled= {disableButton}
                        data-testid='resend-button'>Resend Email</button>
                </div>
            </div>
        </>
    )
}