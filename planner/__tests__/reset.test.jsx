import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Reset from "../src/components/Reset.jsx";
import { BrowserRouter } from "react-router-dom";
import { toHaveAttribute } from '@testing-library/jest-dom/matchers.js';
import { sendPasswordResetEmail } from "firebase/auth";

jest.mock("firebase/auth", () => ({
    ...jest.requireActual("firebase/auth"),
    sendPasswordResetEmail: jest.fn(() => Promise.resolve({data: {}}))
}));

describe("Test Reset password page", () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <Reset />
            </BrowserRouter>
        );
    });

    test("Reset form Elements", async () => {
        expect(screen.getByTestId('email-label')).toBeInTheDocument();
        expect(screen.getByTestId('email-input')).toBeInTheDocument();
        let button = screen.getByTestId('submit-button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('type', 'submit');
        // required field
        fireEvent.change(screen.getByTestId('email-input'), {target: {value: "tempEmail"}})
        fireEvent.click(button);
        await waitFor(() => expect(sendPasswordResetEmail).toBeCalledTimes(1));
        // test navigation
    });
});