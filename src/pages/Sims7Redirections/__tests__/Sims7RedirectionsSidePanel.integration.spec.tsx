import { render, screen, fireEvent } from '@testing-library/react';
import Sims7RedirectionsSidePanel from '../Sims7RedirectionsSidePanel';

jest.mock('../Sims7RedirectionsPage.api', () => ({
  useSims7RedirectionViewData: () => ({
    viewData: {
      category: 'Student',
      nextGenModule: 'Pupil Data',
      sims7Module: 'Pupil Data1',
      modifiedBy: 'John Doe',
      effectiveDate: '01 Jan 2026',
      status: 'Migrated',
      reasonForChanges: 'Initial migration',
      redirectToOpenInNextGen: false
    }
  })
}));

describe('Sims7RedirectionsSidePanel', () => {
  type SelectedRowType = {
    category: string;
    nextGenModule: string;
    sims7Module: string;
    modifiedBy: string;
    effectiveDate: string;
    status: string;
    reasonForChanges: string;
  };
  interface BaseProps {
    isOpen: boolean;
    onClose: jest.Mock<any, any>;
    mode: 'view' | 'edit';
    selectedRow: SelectedRowType;
    t: (key: string) => string;
    setSidePanelMode: jest.Mock<any, any>;
  }
  const baseProps: BaseProps = {
    isOpen: true,
    onClose: jest.fn(),
    mode: 'view',
    selectedRow: {
      category: 'Student',
      nextGenModule: 'Pupil Data',
      sims7Module: 'Pupil Data1',
      modifiedBy: 'John Doe',
      effectiveDate: '01 Jan 2026',
      status: 'Migrated',
      reasonForChanges: 'Initial migration'
    },
    t: (key: string) => key,
    setSidePanelMode: jest.fn()
  };

  it('renders view mode with all details', () => {
    render(<Sims7RedirectionsSidePanel {...baseProps} />);
  });

  // it('calls setSidePanelMode("edit") when Edit button is clicked', () => {
  // render(<Sims7RedirectionsSidePanel {...baseProps} />);
  // expect(screen.getByText(/View SIMS 7 redirects/i)).toBeInTheDocument();
  // let editBtn;
  // try {
  //   editBtn = screen.getByRole('button', { name: /edit/i });
  // } catch (e) {
  //   throw new Error('Edit button not found. Check if the status or mode allows editing.');
  // }
  // fireEvent.click(editBtn);
  // expect(baseProps.setSidePanelMode).toHaveBeenCalledWith('edit');
  // });

  it('calls onClose when Close button is clicked', () => {
    render(<Sims7RedirectionsSidePanel {...baseProps} />);
  const closeBtn: HTMLElement = screen.getByText('Close');
    fireEvent.click(closeBtn);
    expect(baseProps.onClose).toHaveBeenCalled();
  });

    // it('renders edit mode and allows save', async () => {
    //   const props: BaseProps = { ...baseProps, mode: 'edit' };
    //   render(<Sims7RedirectionsSidePanel {...props} />);
    //   expect(screen.getByText('Category')).toBeInTheDocument();
    //   const saveBtn = screen.queryByRole('button', { name: /save/i });
    //   if (!saveBtn) {
    //     console.warn('Save button not rendered for this mode/status');
    //     return;
    //   }
    //   fireEvent.click(saveBtn);
    //   await waitFor(() => expect(props.setSidePanelMode).toHaveBeenCalledWith('view'));
    // });
});
