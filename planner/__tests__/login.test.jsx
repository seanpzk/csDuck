import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Login from "../src/components/Login.jsx";
import { BrowserRouter } from "react-router-dom";

describe("Testing of the login form", () => {
  beforeEach(() =>
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    )
  );

  test("test login form loaded", () => {
    const loginForm = screen.getByTestId("login-form");
    expect(loginForm).toBeInTheDocument();
    expect(loginForm).toHaveClass("login-style-form");
  });

  test("Email label and input", () => {
    const emailLabel = screen.getByTestId("email-label");
    expect(emailLabel).toBeInTheDocument();
    expect(emailLabel).toContainHTML("Email:");
    const emailInput = screen.getByTestId("email-input");
    expect(emailInput).toBeInTheDocument();
    expect(emailInput.value).toBe("");
    fireEvent.change(emailInput, {
      target: { value: "randomEmail" },
    });
    expect(emailInput.value).toBe("randomEmail");
  });

  test("Password label and input", () => {
    const passwordLabel = screen.getByTestId("password-label");
    expect(passwordLabel).toBeInTheDocument();
    expect(passwordLabel).toContainHTML("Password:");
    const passwordInput = screen.getByTestId("password-input");
    expect(passwordInput).toBeInTheDocument();
    expect(passwordInput.value).toBe("");
    fireEvent.change(passwordInput, {
      target: { value: "randomPassword" },
    });
    expect(passwordInput.value).toBe("randomPassword");
  });
});

// Test submit button
test("Test login button", () => {
  const handleSubmitMock = jest.fn((e) => e.preventDefault());
  render(
    <BrowserRouter>
      <Login handleSubmitMock={handleSubmitMock} />
    </BrowserRouter>
  );
  const submitButton = screen.getByTestId("login-button");
  expect(submitButton).toBeInTheDocument();
  expect(submitButton).toHaveAttribute("type", "submit");
  expect(submitButton).toBeEnabled();

  // Verifies that the button calls handleSubmit
  fireEvent.click(submitButton);
  expect(handleSubmitMock).toHaveBeenCalled();
});

// Test Google login icon
test("Test Google login button", () => {
  const loginWithGoogleMock = jest.fn();
  render(
    <BrowserRouter>
      <Login loginWithGoogleMock={loginWithGoogleMock} />
    </BrowserRouter>
  );
  const googleLogin = screen.getByTestId("google-login");
  expect(googleLogin).toBeInTheDocument();
  expect(googleLogin).toBeEnabled();
  const googleImg = screen.getByTestId("googleImg");
  expect(googleImg).toBeInTheDocument();
  // Check if button is linked to the correct function
  fireEvent.click(googleLogin);
  expect(loginWithGoogleMock).toHaveBeenCalled();
});

// Test Facebook login icon
test("Test Facebook login button", () => {
  const loginWithFacebookMock = jest.fn();
  render(
    <BrowserRouter>
      <Login loginWithFacebookMock={loginWithFacebookMock} />
    </BrowserRouter>
  );
  const facebookLogin = screen.getByTestId("facebook-login");
  expect(facebookLogin).toBeInTheDocument();
  expect(facebookLogin).toBeEnabled();
  const facebookImg = screen.getByTestId("facebookImg");
  expect(facebookImg).toBeInTheDocument();
  // Check if button is linked to the correct function
  fireEvent.click(facebookLogin);
  expect(loginWithFacebookMock).toHaveBeenCalled();
});
