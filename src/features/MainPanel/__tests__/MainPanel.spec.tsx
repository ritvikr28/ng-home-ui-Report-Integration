import { render, screen, waitFor, act } from '@testing-library/react';
import MainPanel from '../MainPanel.logic';
import { useFetchSchoolNameData } from '../../../shared/services/schoolDomain/schoolServices';

jest.mock('../../../shared/services/schoolDomain/schoolServices', () => ({
  useFetchSchoolNameData: jest.fn(),
}));

describe('MainPanel Component', () => {
  it('renders MainPanelView with schoolName and isSchoolPrimary', async () => {
    const mockSchoolData = {
      schoolName: 'Mock School',
      isSchoolPrimary: true,
    };


    (useFetchSchoolNameData as jest.Mock).mockResolvedValue(mockSchoolData);

    render(<MainPanel />);

    await act(async () => {
      await waitFor(() => expect(useFetchSchoolNameData).toHaveBeenCalledTimes(1));
    });

    expect(screen.getByText('Mock School')).toBeInTheDocument();
    expect(screen.queryByText('Error Message')).not.toBeInTheDocument();
  });

});
