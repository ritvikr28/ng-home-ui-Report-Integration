import React from 'react';
import { render } from '@testing-library/react';
import useEffectForSearchQuery from '../utils/useQueryToSearch';


// Mock the useState hook
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useState: jest.fn(),
}));

describe('useEffectForSearchQuery', () => {
  it('should set user input and not dispatch if searchedName is empty', () => {
    const searchedName = '';
    const setUserInputMock = jest.fn();
    
    // Mock the useState hook to return setUserInputMock when called
    (React.useState as jest.Mock).mockReturnValueOnce([{}, setUserInputMock]);

    render(<ComponentWithEffect searchedName={searchedName} />);
    
    // Your test assertions go here
  });
});

const ComponentWithEffect = ({ searchedName }: any) => {
  useEffectForSearchQuery(searchedName, jest.fn());
  return <div>Component with Effect</div>;
};