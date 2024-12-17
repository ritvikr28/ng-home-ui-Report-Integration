import { handle401Error } from "../errorHandler"; // Adjust path as necessary

describe("handle401Error", () => {
  let originalLocation: Location;

  beforeAll(() => {
    // Save the original window.location object
    originalLocation = window.location;
    delete (window as any).location; // Delete location to allow mocking
    window.location = { href: "" } as Location;
  });

  afterAll(() => {
    // Restore the original window.location object
    window.location = originalLocation;
  });

  it("should redirect to /unauthorized when status code is 401", () => {
    const mockConsoleError = jest.spyOn(console, "error").mockImplementation();

    handle401Error(401);

    expect(window.location.href).toBe("/unauthorized");
    expect(mockConsoleError).toHaveBeenCalledWith(
      "Unauthorized access detected. Redirecting to /unauthorized..."
    );

    mockConsoleError.mockRestore();
  });

  it("should not redirect or log anything for non-401 status codes", () => {
    const mockConsoleError = jest.spyOn(console, "error").mockImplementation();
    const initialHref = window.location.href;

    handle401Error(500); // Non-401 status code

    expect(window.location.href).toBe(initialHref); // No change to href
    expect(mockConsoleError).not.toHaveBeenCalled();

    mockConsoleError.mockRestore();
  });
});
