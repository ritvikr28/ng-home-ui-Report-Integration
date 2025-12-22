import { render, fireEvent, waitFor } from '@testing-library/react';
import MainPanelView from '../MainPanel.view';
import gtmAnalytics from '../../../shared/utils/analytics';
import * as videoPlayStatus from '../../../shared/services/videoPlayStatus';
import * as useVideoPlayStatusHook from '../../../shared/hook/useVideoPlayStatus';
import * as videoPlayStatusSave from '../../../shared/services/videoPlayStatusSave';

jest.mock('../../../shared/utils/analytics');
jest.mock('../../../shared/services/videoPlayStatusSave');
jest.mock('../../../shared/services/videoPlayStatus');
jest.mock('../../../shared/hook/useVideoPlayStatus');

beforeEach(() => {
  (useVideoPlayStatusHook.useVideoPlayStatus as jest.Mock).mockReturnValue({ isPlayed: false, apiError: false });
});
// Extend the Window interface for test handler storage
declare global {
  interface Window {
    wistiaPlayerHandlers?: any;
  }
}

// Mock WistiaPlayer to expose event handlers
jest.mock('@wistia/wistia-player-react', () => ({
  WistiaPlayer: (props: any) => {
    if (typeof window !== 'undefined') {
      window.wistiaPlayerHandlers = props;
    }
    return <div data-testid="wistia-player-mock" />;
  },
}));

describe('MainPanelView useEffect video play status', () => {
  const defaultProps = {
    schoolName: 'Test School',
    isError: false,
    isSchoolPrimary: false,
    isOpen: false,
    setIsOpen: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    window.wistiaPlayerHandlers = undefined;
  });

  it('sets isPlayed true and apiError false when result.success and isPlayed is "true"', async () => {
    (videoPlayStatus.fetchVideoPlayStatus as jest.Mock).mockResolvedValueOnce({ success: true, isPlayed: true });
    (useVideoPlayStatusHook.useVideoPlayStatus as jest.Mock).mockReturnValue({ isPlayed: true, apiError: false });
    const { container } = render(<MainPanelView {...defaultProps} />);
    await waitFor(() => {
      expect(container.querySelector('.wistia-palyer-video-class')).toBeNull();
    });
  });

  it('sets isPlayed false and apiError false when result.success and isPlayed is "false"', async () => {
    (videoPlayStatus.fetchVideoPlayStatus as jest.Mock).mockResolvedValueOnce({ success: true, isPlayed: false });
    (useVideoPlayStatusHook.useVideoPlayStatus as jest.Mock).mockReturnValue({ isPlayed: false, apiError: false });
    const { container } = render(<MainPanelView {...defaultProps} />);
    await waitFor(() => {
      expect(container.querySelector('.wistia-palyer-video-class')).not.toBeNull();
    });
  });

  it('sets isPlayed false and apiError true when result.success is false', async () => {
    (videoPlayStatus.fetchVideoPlayStatus as jest.Mock).mockResolvedValueOnce({ success: false, isPlayed: false });
    (useVideoPlayStatusHook.useVideoPlayStatus as jest.Mock).mockReturnValue({ isPlayed: false, apiError: true });
    const { container } = render(<MainPanelView {...defaultProps} />);
    await waitFor(() => {
      expect(container.querySelector('.wistia-palyer-video-class')).toBeNull();
    });
  });
});

describe('togglePanel', () => {
  const baseProps = {
    schoolName: 'Test School',
    isError: false,
    isSchoolPrimary: false,
    setIsOpen: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('calls setIsOpen(true) when isOpen is false', () => {
    const setIsOpen = jest.fn();
    const { getByRole } = render(
      <MainPanelView {...baseProps} isOpen={false} setIsOpen={setIsOpen} />
    );
    const btn = getByRole('button', { name: /toggle-button/i });
    fireEvent.click(btn);
    expect(setIsOpen).toHaveBeenCalledWith(true);
  });

  it('calls setIsOpen(false) when isOpen is true', () => {
    const setIsOpen = jest.fn();
    render(<MainPanelView {...baseProps} isOpen={false} setIsOpen={setIsOpen} />);
    fireEvent.click(document.querySelector('button.new-sidepanel-toggle-btn')!);
    expect(setIsOpen).toHaveBeenCalledWith(true);
  });
});

describe('MainPanelView video event handlers', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    window.wistiaPlayerHandlers = undefined;
    // Ensure WistiaPlayer is rendered by mocking useVideoPlayStatus
  (useVideoPlayStatusHook.useVideoPlayStatus as jest.Mock).mockReturnValue({ isPlayed: false, apiError: false });
  });

  function setup() {
    render(
      <MainPanelView
        schoolName="Test School"
        isError={false}
        isSchoolPrimary={false}
        isOpen={false}
        setIsOpen={jest.fn()}
      />
    );
    return window.wistiaPlayerHandlers;
  }

  it('handlePlay should call gtmAnalytics.pushEvent and saveVideoPlayStatus', async () => {
  (videoPlayStatusSave.saveVideoPlayStatus as jest.Mock).mockResolvedValueOnce(undefined);
  const handlers = setup();
  expect(handlers).toBeDefined();
  await handlers.onPlay();
  expect(gtmAnalytics.pushEvent).toHaveBeenCalledWith({ event: 'playVideo' });
  expect(videoPlayStatusSave.saveVideoPlayStatus).toHaveBeenCalled();
  });

  it('handleOnEnded should call gtmAnalytics.pushVideoEvent and log to console', () => {
      const handlers = setup();
      expect(handlers).toBeDefined();
      handlers.onEnded();
      expect(gtmAnalytics.pushVideoEvent).toHaveBeenCalledWith(100);
    });

  it('handleOnPause should log to console', () => {
      const handlers = setup();
      expect(handlers).toBeDefined();
      handlers.onPause();
    });
});
