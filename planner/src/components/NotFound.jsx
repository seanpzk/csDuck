import { useEffect } from "react"
import { Navigate, redirect } from "react-router-dom";

export default function NotFound() {

    useEffect(() =>console.log("returning to homepage"));
    return (
        <Navigate to = "/" />
    )
}