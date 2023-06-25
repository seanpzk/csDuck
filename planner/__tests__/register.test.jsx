import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Register from "../src/components/Register.jsx";
import { BrowserRouter } from "react-router-dom";
import { createUserWithEmailAndPassword } from 'firebase/auth';

jest.mock("firebase/auth", () => ({
    // tells jest that everything else remain the same
    ...jest.requireActual("firebase/auth"),
    getAuth: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(() => {
      console.log("MOCKED");
      return Promise.resolve({data: {}});
    })
}));

jest.mock("../src/components/helperFunctions/CreateUserMongo.jsx", () => ({
    __esModule: true,
    default: jest.fn()
}));

describe("Should render register form components", () => {
  beforeEach(() =>
    render(
      <BrowserRouter>
        <Register />
      </BrowserRouter>
    )
  );

  // Test registration form
  test("Test registration form", () => {
    const registerForm = screen.getByTestId("register-form");
    expect(registerForm).toBeInTheDocument();
  });

  // Test email label
  test("Test email label", () => {
    const labelEmail = screen.getByTestId("label-email");
    expect(labelEmail).toBeInTheDocument();
    expect(labelEmail).toContainHTML("Email: ");
  });

  // Test password label
  test("Test password label", () => {
    const labelPassword = screen.getByTestId("label-password");
    expect(labelPassword).toBeInTheDocument();
    expect(labelPassword).toContainHTML("Password: ");
  });

  // Test email-input
  test("Test email input box", () => {
    const inputPassword = screen.getByTestId("input-email");
    expect(inputPassword).toBeInTheDocument();
    fireEvent.change(inputPassword, {
      target: { value: "randomEmail" },
    });
    expect(inputPassword.value).toBe("randomEmail");
  });

  // Test password-input
  test("Test password input box", () => {
    const inputPassword = screen.getByTestId("input-password");
    expect(inputPassword).toBeInTheDocument();
    expect(inputPassword.value).toBe("");
    fireEvent.change(inputPassword, {
      target: { value: "number password" },
    });
    expect(inputPassword.value).toBe("number password");
  });

  // Test email-input
  test('Test email input box', () => {
      const inputPassword = screen.getByTestId('input-email');
      expect(inputPassword).toBeInTheDocument();
      fireEvent.change(inputPassword, {
          target: { value: "randomEmail" }
      });
      expect(inputPassword.value).toBe("randomEmail");
  });

  // Test password-input
  test('Test password input box', () => {
      const inputPassword = screen.getByTestId('input-password');
      expect(inputPassword).toBeInTheDocument();
      expect(inputPassword.value).toBe('');
      fireEvent.change(inputPassword, {
          target: { value: "number password" }
      });
      expect(inputPassword.value).toBe("number password");
  });
  // Test submit button
  test("Test submit button", () => {
      const submitButton = screen.getByTestId('submit-button');
      expect(submitButton).toBeInTheDocument();
      expect(submitButton).toHaveAttribute('type', 'submit', 'required');
      expect(submitButton).toBeEnabled();
      // Update fields to bypass 'required' attribute
      fireEvent.change(screen.getByTestId('input-email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByTestId('input-password'), { target: { value: 'password123' } });
      // Verifies that the form submission button is correctly linked
      fireEvent.click(submitButton);
      expect(createUserWithEmailAndPassword).toHaveBeenCalledTimes(1);
  });
});
