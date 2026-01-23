import { render } from '@testing-library/react';
import Sims7RedirectionsLayout from '../Sims7RedirectionsLayout.logic';

jest.mock('../Sims7RedirectionsPage.view', () => () => <div data-testid="mock-sims7-page" />);

describe('Sims7RedirectionsLayout', () => {
  it('renders Sims7RedirectionsPage', () => {
    const { getByTestId } = render(<Sims7RedirectionsLayout />);
    expect(getByTestId('mock-sims7-page')).toBeInTheDocument();
  });
});
