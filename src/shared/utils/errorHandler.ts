export const handle401Error = (statusCode: number) => {
    if (statusCode === 401) {
      console.error("Unauthorized access detected. Redirecting to /unauthorized...");
      window.location.href = "/unauthorized"; // Redirect to Unauthorized page
    }
  };