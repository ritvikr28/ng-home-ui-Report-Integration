import { History } from "history";

type ErrorHandlerType = {
  handle401Error: (statusCode: number, history: History) => void;
};

export const errorHandler: ErrorHandlerType = {
  handle401Error: (statusCode: number, history: History): void => {
    if (statusCode === 401) {
      console.log(
        "Unauthorized access detected. Redirecting to /unauthorized..."
      );

      // Redirect using history
      history.replace("/unauthorized");
    }
  }
};
