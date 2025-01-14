// importing
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import Login from "./Login";
import Api, { loginUserApi } from "../../apis/Api";
import { toast } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";

// mocking
jest.mock("../../apis/Api");

// test cases
describe("Login Component Test", () => {
  // clear all the mock data
  afterEach(() => {
    jest.clearAllMocks();
  });

  // test case 1: Login failed messagae
  it("Show show error message on failed login", async () => {
    // rendering Login Components
    render(
      <GoogleOAuthProvider clientId="246294289310-k2b9u1mop3fn4vik2qr8diel4tp398ii.apps.googleusercontent.com">
        <Login />
      </GoogleOAuthProvider>
    ); // Built Screenw

    // Mocking login fail response
    const mockResponse = {
      data: {
        success: false,
        message: "Password not matched!",
      },
    };

    // config mock resolved value
    loginUserApi.mockResolvedValue(mockResponse);

    // config that error message as a test function
    toast.error = jest.fn();

    // Testing real UI components
    const email = await screen.getByPlaceholderText("Enter your email");
    const password = await screen.getByPlaceholderText("Enter your password");
    const loginBtn = screen.getByText("Login");

    // simulating user input and interaction
    fireEvent.change(email, { target: { value: "test@gmail.com" } });
    fireEvent.change(password, { target: { value: "test123" } });
    fireEvent.click(loginBtn);

    // After all the above actions, confirming the expected results
    waitFor(() => {
      expect(loginUserApi).toHaveBeenCalledWith({
        email: "test@gmail.com",
        password: "test123",
      });
      expect(toast.error).toHaveBeenCalledWith("Password not matched!");
    });
  });

  // test case 2: Login successfull messagae
  it("Show show success message on successful login", async () => {
    // rendering Login Components
    render(
      <GoogleOAuthProvider clientId="246294289310-k2b9u1mop3fn4vik2qr8diel4tp398ii.apps.googleusercontent.com">
        <Login />
      </GoogleOAuthProvider>
    );

    // Mocking login success response
    const mockResponse = {
      data: {
        success: true,
        message: "Login Success",
      },
    };

    // config mock resolved value
    loginUserApi.mockResolvedValue(mockResponse);

    // config that success message as a test function
    toast.success = jest.fn();

    // Testing real UI components
    const email = await screen.getByPlaceholderText("Enter your email");
    const password = await screen.getByPlaceholderText("Enter your password");
    const loginBtn = screen.getByText("Login");

    // simulating user input and interaction
    fireEvent.change(email, { target: { value: "test@gmail.com" } });
    fireEvent.change(password, { target: { value: "test123" } });
    fireEvent.click(loginBtn);

    // After all the above actions, confirming the expected results
    waitFor(() => {
      expect(loginUserApi).toHaveBeenCalledWith({
        email: "test@gmail.com",
        password: "test123",
      });
      expect(toast.success).toHaveBeenCalledWith("Login Success");
    });
  });
});
