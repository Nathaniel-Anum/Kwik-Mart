import React, { Component } from "react";

class ErrorBoundary extends Component {
  state = { hasError: false, errorMessage: "" };

  static getDerivedStateFromError(error) {
    // Update state to indicate an error has occurred
    return { hasError: true, errorMessage: error.message };
  }

  componentDidCatch(error, info) {
    // Log the error to an error reporting service (optional)
    console.log("Error caught:", error);
    console.log("Error info:", info);
  }

  render() {
    if (this.state.hasError) {
      // Display a fallback UI when an error is caught
      return (
        <div
          style={{ padding: "20px", backgroundColor: "red", color: "white" }}
        >
          <h2>Something went wrong!</h2>
          <p>{this.state.errorMessage}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
