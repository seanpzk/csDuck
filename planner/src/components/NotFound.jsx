import { useEffect } from "react"
import { Navigate } from "react-router-dom";

export default function NotFound() {

    useEffect(() =>console.log("returning to homepage"), []);
    window.alert("Page not found! Redirecting to homepage");
    return (
        <Navigate to = "/" />
    )
}