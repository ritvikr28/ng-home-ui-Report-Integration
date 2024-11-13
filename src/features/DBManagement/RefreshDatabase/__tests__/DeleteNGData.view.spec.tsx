import { render, screen, fireEvent } from "@testing-library/react";
import DeleteNGDataView from "../DeleteNGData.view"; // Adjust the import path accordingly

// Mock the service module
jest.mock("../../../../shared/utils", () => ({
  service: {
    get: jest.fn()
  }
}));

interface ConfirmDialogProps {
  confirmActionButtonText: string;
  cancelActionButtonText: string;
  optionalButton: boolean;
  title: string;
  onCloseHandle: () => void;
  onSubmitHandle: () => void;
  description: string;
}

// Mock the ConfirmDialog component with typed props
jest.mock("../ConfirmationDialog.logic", () => {
  return ({ onCloseHandle, onSubmitHandle, ...props }: ConfirmDialogProps) => (
    <div>
      <button onClick={onSubmitHandle}>Delete</button>
      <button onClick={onCloseHandle}>Cancel</button>
      <h1>{props.title}</h1>
      <p>{props.description}</p>
    </div>
  );
});

describe("DeleteNGDataView Component", () => {
  const statusMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the component and button", () => {
    render(<DeleteNGDataView status={statusMock} />);

    expect(screen.getByText(/Proceed/i)).toBeInTheDocument();
  });

  it("should show confirmation dialog when button is clicked", () => {
    render(<DeleteNGDataView status={statusMock} />);

    fireEvent.click(screen.getByText(/Proceed/i));

    expect(screen.getByText(/Delete Next Gen Data?/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Deleting the Next gen data will clear all records/i)
    ).toBeInTheDocument();
  });
});
