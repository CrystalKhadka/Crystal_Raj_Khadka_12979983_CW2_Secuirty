import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Profile from "./Profile";
import { getSingleprofileApi, updateProfileApi } from "../../apis/Api";
import { toast } from "react-toastify";
import { BrowserRouter as Router } from "react-router-dom";

// Mock the API functions and toast
jest.mock("../../apis/Api");
jest.mock("react-toastify");

describe("Profile Component Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // test case 1 : fetching user profile
  it("should fetch user profile", async () => {
    // Mock the API response
    getSingleprofileApi.mockResolvedValue({
      data: {
        user: {
          username: "testuser",
          phoneNumber: "1234567890",
          email: "test@example.com",
        },
      },
    });

    render(
      <Router>
        <Profile />
      </Router>
    );

    // Wait for the API call to complete
    await waitFor(() => {
      expect(getSingleprofileApi).toHaveBeenCalled();
    });
  });
});
