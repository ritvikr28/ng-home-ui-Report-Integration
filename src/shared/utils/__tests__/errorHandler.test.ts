import { errorHandler } from "../errorHandler";
import { createMemoryHistory, History } from "history";

describe("ErrorHandler", () => {
  let history: History;

  beforeEach(() => {
    // Create a mock history object
    history = createMemoryHistory();
    jest.spyOn(history, "replace"); // Spy on history.replace
    jest.spyOn(console, "log").mockImplementation(() => {}); // Mock console.log
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should redirect to '/unauthorized' when status code is 401", () => {
    // Arrange
    const statusCode = 401;

    // Act
    errorHandler.handle401Error(statusCode, history);

    // Assert
    expect(console.log).toHaveBeenCalledWith(
      "Unauthorized access detected. Redirecting to /unauthorized..."
    );
    expect(history.replace).toHaveBeenCalledWith("/unauthorized");
  });

  it("should not redirect when status code is not 401", () => {
    // Arrange
    const statusCode = 403;

    // Act
    errorHandler.handle401Error(statusCode, history);

    // Assert
    expect(console.log).not.toHaveBeenCalled();
    expect(history.replace).not.toHaveBeenCalled();
  });

  it("should handle history.replace being called only once for status code 401", () => {
    // Arrange
    const statusCode = 401;

    // Act
    errorHandler.handle401Error(statusCode, history);

    // Assert
    expect(history.replace).toHaveBeenCalledTimes(1);
    expect(history.replace).toHaveBeenCalledWith("/unauthorized");
  });
});
