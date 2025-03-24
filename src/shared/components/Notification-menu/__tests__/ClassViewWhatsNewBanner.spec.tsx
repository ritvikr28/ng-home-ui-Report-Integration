import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { WhatsNewBanner } from '../ClassViewWhatsNewBanner';

describe('WhatsNewBanner Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should render the banner when isBannerVisible is true', () => {
    render(<WhatsNewBanner />);
    expect(screen.getByTestId('whatsnew-banner')).toBeInTheDocument();
  });

  it('should hide the banner when the close button is clicked', () => {
    render(<WhatsNewBanner />);
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(screen.queryByTestId('whatsnew-banner')).not.toBeInTheDocument();
  });

  it('should not render the banner if localStorage item isBannerClosed is true', () => {
    window.localStorage.setItem('isBannerClosed', 'true');
    render(<WhatsNewBanner />);
    expect(screen.queryByTestId('whatsnew-banner')).not.toBeInTheDocument();
  });
});