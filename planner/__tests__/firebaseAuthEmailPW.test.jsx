import { createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser, sendEmailVerification } from "firebase/auth";
import firebaseAuth from "../src/firebase.config.js";
import item,  { handleEmailPwLogin } from "../src/components/Login";

let error;

/**
 * Test single user creation.
 */
test("Test single user Creation, NO duplicates", async () => {
    error = false;
    try {
        await createUserWithEmailAndPassword(firebaseAuth, "testing1@gmail.com", "password1");
    } catch (err) {
        error = true;
    }
    expect(error).toBeFalsy();
    if (error == false) {
        await signInWithEmailAndPassword(firebaseAuth,  "testing1@gmail.com", "password1");
        const user = firebaseAuth.currentUser;
        deleteUser(user);
    }
})

test("Test user successfully signs out" , async () => {
    error = false;
    await createUserWithEmailAndPassword(firebaseAuth, "testing1@gmail.com", "password1");
    await signInWithEmailAndPassword(firebaseAuth, "testing1@gmail.com", "password1");
    const user = firebaseAuth.currentUser;
    error = !firebaseAuth.signOut();
    expect(error).toBeFalsy;
    await signInWithEmailAndPassword(firebaseAuth, "testing1@gmail.com", "password1");
    deleteUser(user);
})

describe("Test multiple user creation and login", () => {
    beforeEach(async () => {
        error = false;
        await createUserWithEmailAndPassword(firebaseAuth, "testing1@gmail.com", "password1");
    });

    afterEach(async () => {
        await signInWithEmailAndPassword(firebaseAuth, "testing1@gmail.com", "password1");
        const user = firebaseAuth.currentUser;
        deleteUser(user);
    });

    test("Test Login for first user", async () => {
        await signInWithEmailAndPassword(firebaseAuth, "testing1@gmail.com", "password1");
        if (!firebaseAuth.currentUser) {
            error = true;
        }
        expect(error).toBeFalsy();
        await firebaseAuth.signOut();
    });

    test("Test Creation for second user, NO DUPLICATE Email", async () => {
        try {
            await createUserWithEmailAndPassword(firebaseAuth, "testing2@gmail.com", "password2");
        } catch (err) {
            error = true;
        }
        expect(error).toBeFalsy();
        await signInWithEmailAndPassword(firebaseAuth, "testing2@gmail.com", "password2");
        const user = firebaseAuth.currentUser;
        deleteUser(user);
    });

    test("Test Creation for second user with DIFFERENT Email but same password", async () => {
        try {
            await createUserWithEmailAndPassword(firebaseAuth, "testing2@gmail.com", "password1");
        } catch (err) {
            error = true;
        }
        expect(error).toBeFalsy();
        await signInWithEmailAndPassword(firebaseAuth, "testing2@gmail.com", "password1");
        const user = firebaseAuth.currentUser;
        deleteUser(user);
    })

    test("Test Creation for second user, Duplicate Email", async () => {
        try {
            await createUserWithEmailAndPassword(firebaseAuth, "testing1@gmail.com", "password2");
        } catch (err) {
            error = true;
        }
        // In the event user is successfully created
        if (!error) {
            await signInWithEmailAndPassword(firebaseAuth, "testing1@gmail.com", "password2");
            const user = firebaseAuth.currentUser;
            deleteUser(user);
        }
        expect(error).toBeTruthy();
    });

    test("Test for sending of email verification", async () => {
        await signInWithEmailAndPassword(firebaseAuth, "testing1@gmail.com", "password1");
        try {
            const user = firebaseAuth.currentUser;
            await sendEmailVerification(user);
        } catch (err) {
            console.log(err);
            error = true;
        }
        expect(error).toBeFalsy();
        firebaseAuth.signOut();
    });
})

test("Test for invalid email input", async () => {
    error = false;
    try {
        await createUserWithEmailAndPassword(firebaseAuth, "invalidemail", "password1");    
    } catch (err) {
        error = true;
    }
    expect(error).toBeTruthy();
    if (!error) {
        await signInWithEmailAndPassword(firebaseAuth, "invalidemail", "password1");
        const user = firebaseAuth.currentUser;
        deleteUser(user);
    }
});

test("Test for invalid password input", async () => {
    error = false;
    try {
        await createUserWithEmailAndPassword(firebaseAuth, "testing1@gmail.com", "123");    
    } catch (err) {
        error = true;
    }
    expect(error).toBeTruthy();
    if (!error) {
        await signInWithEmailAndPassword(firebaseAuth, "testing1@gmail.com", "123");
        const user = firebaseAuth.currentUser;
        deleteUser(user);
    }
});

test("Test for invalid email", () => {
    error = false;
    try {
        handleEmailPwLogin(firebaseAuth, { email: "invalidemail", password: "password1" });
    } catch (err) {
        error = true;
    }
    expect(error).toBeTruthy();
});
