import React from 'react';
import { render, act } from '@testing-library/react';

import SchoolNameComponent from '../SchoolName';
import { useFetchSchoolNameData } from '../../../services/schoolDomain/schoolServices';


jest.mock('../../../services/schoolDomain/schoolServices', () => ({
    __esModule: true,
  useFetchSchoolNameData: jest.fn(),
}));


describe('SchoolNameComponent', () => {
  it('should set school names and handle error', async () => {
    // Mock the response data from the useFetchSchoolNameData function
    const mockSchoolData = {
      schoolName: 'example school',
    };

    // Mock the implementation of useFetchSchoolNameData
    /* eslint-disable */
    jest.spyOn(require('../../../services/schoolDomain/schoolServices'), 'useFetchSchoolNameData')
      .mockResolvedValueOnce(mockSchoolData);

    // Set up state mocks
    const setSchoolNamesMock = jest.fn();
    const setIsErrorMock = jest.fn();

    // Render the component
    await act(async () => {
      render(
        <SchoolNameComponent
          setSchoolNames={setSchoolNamesMock}
          setIsError={setIsErrorMock}
        />
      );
    });

    // Assertions
    expect(useFetchSchoolNameData).toHaveBeenCalled();
    expect(setSchoolNamesMock).toHaveBeenCalledWith('Example School'); // Assuming capitalizeFirstLetterOfEachWord is working as expected
    expect(setIsErrorMock).toHaveBeenCalledWith(false);
  });

  it('should handle error', async () => {
    // Mock the implementation of useFetchSchoolNameData to throw an error
    jest.spyOn(require('../../../services/schoolDomain/schoolServices'), 'useFetchSchoolNameData')
      .mockRejectedValueOnce(new Error('Example error'));

    // Set up state mocks
    const setSchoolNamesMock = jest.fn();
    const setIsErrorMock = jest.fn();

    // Render the component
    await act(async () => {
      render(
        <SchoolNameComponent
          setSchoolNames={setSchoolNamesMock}
          setIsError={setIsErrorMock}
        />
      );
    });

    // Assertions
   expect(useFetchSchoolNameData).toHaveBeenCalled();
    expect(setSchoolNamesMock).not.toHaveBeenCalled();
    expect(setIsErrorMock).toHaveBeenCalledWith(true);
  });
  it('should handle null schoolData', async () => {
    // Mock the implementation of useFetchSchoolNameData to return null
    jest.spyOn(require('../../../services/schoolDomain/schoolServices'), 'useFetchSchoolNameData')
      .mockResolvedValueOnce(null);
  
    // Mock the setSchoolNames and setIsError functions
    const setSchoolNamesMock = jest.fn();
    const setIsErrorMock = jest.fn();
  
    // Run the component
    await act(async () => {
      render(<SchoolNameComponent setSchoolNames={setSchoolNamesMock} setIsError={setIsErrorMock} />);
    });
  
    // Check if setSchoolNamesMock was called with an empty string
    expect(setSchoolNamesMock).toHaveBeenCalledWith('');
  
    // Check if setIsErrorMock was called with true (or based on your error handling logic)
    expect(setIsErrorMock).toHaveBeenCalledWith(false);
    expect(setIsErrorMock).toHaveBeenCalledTimes(2);
  });
   /* eslint-enable */
  
});
