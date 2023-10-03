import "./Style.scss";

const ErrorFallBack: () => JSX.Element = (): JSX.Element => (
  <div className="elr-maindiv">
    <h3 className="elr-loading">Loading failed</h3>
    <div>Something went wrong.</div>
  </div>
);

export default ErrorFallBack;
