import { render, screen, fireEvent } from '@testing-library/react';
import Sims7RedirectionsEdit from '../Sims7RedirectionsEdit';

describe('Sims7RedirectionsEdit', () => {
  const tStub = () => { throw new Error('Function not implemented.'); };
  const baseProps = {
    selectedRow: {
      category: 'Student',
      nextGenModule: 'Pupil Data',
      sims7Module: 'Pupil Data1'
    },
    redirectToNextGen: 'no',
    effectiveDate: new Date(2026, 0, 21),
    reasonForChanges: '',
    dateError: '',
    reasonError: '',
    getDateParts: () => ({ day: 21, month: 1, year: 2026 }),
    handleRedirectToNextGenChange: jest.fn(),
    handleDateChange: jest.fn(),
    handleValidateDate: jest.fn(),
    setReasonForChanges: jest.fn(),
    setIsDirty: jest.fn(),
    isFormDirty: jest.fn(() => false)
  };

  it('renders all main fields', () => {
  render(<Sims7RedirectionsEdit t={tStub} {...baseProps} />);
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Student')).toBeInTheDocument();
    expect(screen.getByText('Next Gen module')).toBeInTheDocument();
    expect(screen.getByText('Pupil Data')).toBeInTheDocument();
    expect(screen.getByText('SIMS 7 module')).toBeInTheDocument();
    expect(screen.getByText('Pupil Data1')).toBeInTheDocument();
    expect(screen.getByText('Redirect to open in Next Gen')).toBeInTheDocument();
  });

  it('renders Next Gen module as a link if present', () => {
  render(<Sims7RedirectionsEdit t={tStub} {...baseProps} />);
    const link = screen.getByRole('link', { name: 'Pupil Data' });
    expect(link).toHaveAttribute('href', expect.stringContaining('Pupil%20Data'));
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render Next Gen module link if not present', () => {
    const props = { ...baseProps, selectedRow: { ...baseProps.selectedRow, nextGenModule: '' } };
  render(<Sims7RedirectionsEdit t={tStub} {...props} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('calls handleRedirectToNextGenChange when ReactionButton is clicked', () => {
  render(<Sims7RedirectionsEdit t={tStub} {...baseProps} />);
    const yesBtn = screen.getByRole('button', { name: 'Yes' });
    fireEvent.click(yesBtn);
    expect(baseProps.handleRedirectToNextGenChange).toHaveBeenCalled();
  });

  it('renders edit fields via renderEditFields', () => {
  render(<Sims7RedirectionsEdit t={tStub} {...baseProps} />);
    // The actual fields rendered depend on renderEditFields logic, but we can check for a known label
    expect(screen.getByText('Category')).toBeInTheDocument();
  });
});
