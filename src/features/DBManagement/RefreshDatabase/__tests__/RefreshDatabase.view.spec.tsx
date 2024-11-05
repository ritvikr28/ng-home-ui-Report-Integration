import RefreshDatabaseView from '../RefreshDatabase.view'; // Adjust the import path accordingly
import {handleComplete} from "../RefreshDatabase.view"
import { render, screen } from "@testing-library/react";


describe('RefreshDatabaseView Component', () => {
        it('should handle on complete on component rendering', () => {
        const setFlagValuesMock = jest.fn();
        const setActiveIndexMock = jest.fn();
        render(<RefreshDatabaseView/>);        
        
        //this handles console.log statements
        jest.spyOn(console, "log").mockImplementation(() => "error message");
      
        const index = 0;
        const inputValue = 'Detached';
        const flagValues = ["Detached", "ReAttached", "Deleted", "In Progress"];
        
        const result = handleComplete(index, inputValue, flagValues, setFlagValuesMock, setActiveIndexMock);

        expect(setFlagValuesMock).toHaveBeenCalledWith(flagValues);
        expect(setActiveIndexMock).toHaveBeenCalledWith(1); // Expect to go to the next index
        expect(result).toBe('Detached');
    });
});