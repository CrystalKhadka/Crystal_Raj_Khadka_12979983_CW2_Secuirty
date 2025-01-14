// importing
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactUs from "./ContactUs";
import { contactUs, getSingleprofileApi } from "../../apis/Api";
import { toast } from "react-toastify";
import { MemoryRouter } from "react-router-dom";

// mocking
jest.mock("../../apis/Api");

// test cases
describe("ContactUs Component Test", () => {
  // clear all the mock data
  afterEach(() => {
    jest.clearAllMocks();
  });

  // test case 1: Contact form pre-fills user data
  it("Should pre-fill user data from API", async () => {
    // Mocking getSingleprofileApi response
    const mockProfileResponse = {
      data: {
        user: {
          username: "John Doe",
          email: "johndoe@example.com",
        },
      },
    };

    getSingleprofileApi.mockResolvedValue(mockProfileResponse);

    // rendering ContactUs Component
    render(
      <MemoryRouter>
        <ContactUs />
      </MemoryRouter>
    );

    // Testing pre-filled data
    await waitFor(() => {
      expect(screen.getByPlaceholderText("Your Name").value).toBe("John Doe");
      expect(screen.getByPlaceholderText("Your Email").value).toBe(
        "johndoe@example.com"
      );
    });
  });
});
