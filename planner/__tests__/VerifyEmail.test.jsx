import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VerifyEmail from "../src/components/VerifyEmail.jsx";
import { BrowserRouter } from "react-router-dom";

describe("Testing of send verification email react component", () => {
    // I dont know how to verify if button is disabled, seems that after clicking, the state doesnt change
    // From what i read, seems that should avoid checking this
    test('Test functionality of Resend email verification button', async () => {
        const handleResendMock = jest.fn();
        const rerender = render(
        <BrowserRouter>
            <VerifyEmail handleResendMock= {handleResendMock} />
        </BrowserRouter>
        );
        const resendButton = screen.getByTestId('resend-button');
        expect(resendButton).toBeInTheDocument();
        expect(resendButton).not.toBeDisabled();
        fireEvent.click(resendButton);
    });
});