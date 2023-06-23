import { deleteUser, sendEmailVerification } from "firebase/auth";
import firebaseAuth from "../src/firebase.config.js";
import { handleEmailPwLogin } from "../src/components/Login.jsx";
import { handleEmailPwCreation } from "../src/components/Register.jsx";

/**
 * Abstracts away deletion of user from firebase.
 * 
 * @function deleteUserInstance
 * @async
 * @param {Object} auth  - firebase auth object
 * @param {Object} user  - js object of user to delete
 * @param {string} user.email - email of user
 * @param {string} user.password - password of user
 */
async function deleteUserInstance(auth, user) {
    await handleEmailPwLogin(auth, user);
    await deleteUser(firebaseAuth.currentUser);
}

/**
 * Boolean that tracks whether an error has occured.
 * Initial value should be set to false
 */
let error;

beforeEach(() => {
    error = false;
})

test("Test single user Creation, NO duplicates", async () => {
    const user1 = {email: "testing1@gmail.com", password: "password1"};
    try {
        await handleEmailPwCreation(firebaseAuth, user1);
    } catch (err) {
        error = true;
    }
    expect(error).toBeFalsy();
    if (error == false) {
        await deleteUserInstance(firebaseAuth, user1);
    }
});

test("Test Login for first user", async () => {
    const user1 = {email: "testing1@gmail.com", password: "password1"};
    await handleEmailPwCreation(firebaseAuth, user1);
    await handleEmailPwLogin(firebaseAuth, user1);
    if (!firebaseAuth.currentUser) {
        error = true;
    }
    expect(error).toBeFalsy();
    await firebaseAuth.signOut();
    if (!error) {
        await deleteUserInstance(firebaseAuth, user1);
    }
});

test("Test user successfully signs out" , async () => {
    const user1 = {email: "testing1@gmail.com", password: "password1"};
    await handleEmailPwCreation(firebaseAuth, user1);
    await handleEmailPwLogin(firebaseAuth, user1);
    error = !firebaseAuth.signOut();
    expect(error).toBeFalsy;
    await deleteUserInstance(firebaseAuth, user1);
})

describe("Test multiple user creation and login", () => {
    beforeEach(async () => {
        await handleEmailPwCreation(firebaseAuth, {email: "testing1@gmail.com", password: "password1"});
    });

    afterEach(async () => {
        await deleteUserInstance(firebaseAuth, {email: "testing1@gmail.com", password: "password1"});
    });

    test("Test Creation for second user, NO DUPLICATE Email", async () => {
        try {
            await handleEmailPwCreation(firebaseAuth, {email: "testing2@gmail.com", password: "password2"});
        } catch (err) {
            error = true;
        }
        expect(error).toBeFalsy();
        await deleteUserInstance(firebaseAuth, {email: "testing2@gmail.com", password: "password2"});
    });

    test("Test Creation for second user with DIFFERENT Email but same password", async () => {
        try {
            await handleEmailPwCreation(firebaseAuth, {email: "testing2@gmail.com", password: "password1"});
        } catch (err) {
            error = true;
        }
        expect(error).toBeFalsy();
        await deleteUserInstance(firebaseAuth, {email: "testing2@gmail.com", password: "password1"});
    })

    test("Test Creation for second user, Duplicate Email", async () => {
        try {
            await handleEmailPwCreation(firebaseAuth, {email: "testing1@gmail.com", password: "password2"});
        } catch (err) {
            error = true;
        }
        // In the event user is successfully created
        if (!error) {
            await deleteUserInstance(firebaseAuth, {email: "testing1@gmail.com", password: "password2"});
        }
        expect(error).toBeTruthy();
    });

    test("Test for sending of email verification", async () => {
        await handleEmailPwLogin(firebaseAuth, {email: "testing1@gmail.com", password: "password1"});
        try {
            const user = firebaseAuth.currentUser;
            await sendEmailVerification(user);
        } catch (err) {
            error = true;
        }
        expect(error).toBeFalsy();
        firebaseAuth.signOut();
    });
})

test("Test for invalid email input", async () => {
    try {
        await handleEmailPwCreation(firebaseAuth, {email: "invalidemail", password: "password1"});   
    } catch (err) {
        error = true;
    }
    expect(error).toBeTruthy();
    if (!error) {
        await deleteUserInstance(firebaseAuth, {email: "invalidemail", password: "password1"});
    }
});

test("Test for invalid password input", async () => {
    try {
        await handleEmailPwCreation(firebaseAuth, {email: "testing1@gmail.com", password: "123"});  
    } catch (err) {
        error = true;
    }
    expect(error).toBeTruthy();
    if (!error) {
        await deleteUserInstance(firebaseAuth, {email: "testing1@gmail.com", password: "123"});
    }
});
