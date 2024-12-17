import { errorHandler } from "../errorHandler";

describe("ErrorHandler", () => {
  const originalConsoleError = console.error;
  const originalWindowLocation = window.location;

  beforeAll(() => {
    // Mock console.error
    global.console.error = jest.fn();

    // Mock window.location.href
    delete (window as any).location;
    window.location = { href: "" } as Location;
  });

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    window.location.href = ""; // Reset window location
  });

  afterAll(() => {
    // Restore the original implementations
    console.error = originalConsoleError;
    window.location = originalWindowLocation;
  });

  it("should log an error and redirect to /unauthorized when status code is 401", () => {
    // Arrange
    const statusCode = 401;

    // Act
    errorHandler.handle401Error(statusCode);

    // Assert
    expect(console.error).toHaveBeenCalledWith(
      "Unauthorized access detected. Redirecting to /unauthorized..."
    );
    expect(window.location.href).toBe("/unauthorized");
  });

  it("should not redirect or log an error for other status codes", () => {
    // Arrange
    const statusCode = 403; // Any status other than 401

    // Act
    errorHandler.handle401Error(statusCode);

    // Assert
    expect(console.error).not.toHaveBeenCalled(); // Verify console.error is not called
    expect(window.location.href).toBe(""); // Verify no redirection occurs
  });
});
