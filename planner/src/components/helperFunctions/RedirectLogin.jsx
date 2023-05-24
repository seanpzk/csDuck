// Function is used whenever unauthorised user sends http request to backend
// response -> response from fetch req, navigator -> object returned from "useNavigate"
export default async function RedirectLogin(response, navigator) {
    const res = await response.json();
    const URL = res.url;
    navigator(URL);
    return(<></>)
}
