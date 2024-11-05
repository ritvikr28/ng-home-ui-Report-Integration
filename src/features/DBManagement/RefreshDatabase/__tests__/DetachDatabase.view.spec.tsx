import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DetachDatabaseView from '../DetachDatabase.view'; // Adjust the import path accordingly
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('DetachDatabaseView Component', () => {
    const statusMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks(); // Clear previous mocks before each test
    });

    it('should render the component', () => {
        render(<DetachDatabaseView status={statusMock} />);
        expect(screen.getByText("Is the SIMS7 database detached?")).toBeInTheDocument();
        expect(screen.getByText("Please click on Yes to detach")).toBeInTheDocument();
        expect(screen.getByLabelText("Yes")).toBeInTheDocument();
        expect(screen.getByLabelText("No")).toBeInTheDocument();
    });

    it('should handle API errors gracefully', async () => {
        (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Network Error'));
        const consoleErrorMock = jest.spyOn(console, 'error').mockImplementation(() => {});

        render(<DetachDatabaseView status={statusMock} />);
        fireEvent.click(screen.getByLabelText("Yes"));

        // Wait for the effect of the click to propagate
        await waitFor(() => {
            expect(statusMock).not.toHaveBeenCalled(); // Ensure status function is not called
            expect(consoleErrorMock).toHaveBeenCalledWith("Failed to fetch data"); // Check for error logging
        });

        consoleErrorMock.mockRestore(); // Restore original console.error
    });
});
