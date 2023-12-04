import { ReactNode } from "react";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import ErrorFallBack from "./ErrorFallBack";

type ErrorBoundaryProps = {
  children: ReactNode;
};

const ErrorBoundary: ({}: ErrorBoundaryProps) => JSX.Element = ({
  children
}: ErrorBoundaryProps): JSX.Element => {
  const handleError: ({}: Error, {}: { componentStack: string }) => void = (
    error: Error,
    info: { componentStack: string }
  ) => {
      console.log(error);
    console.log(info);
  };

  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallBack} onError={handleError}>
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
