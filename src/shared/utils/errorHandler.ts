type ErrorHandlerType = {
  handle401Error: (statusCode: number) => void;
};

export const errorHandler: ErrorHandlerType = {
  handle401Error: (statusCode: number): void => {
    if (statusCode === 401) {
      console.error(
        "Unauthorized access detected. Redirecting to /unauthorized..."
      );
      window.location.href = "/unauthorized";
    }
  }
};
