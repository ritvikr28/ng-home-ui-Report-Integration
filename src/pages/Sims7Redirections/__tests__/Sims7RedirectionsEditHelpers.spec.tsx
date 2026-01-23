import { render, fireEvent, screen } from '@testing-library/react';
import { EffectiveDateInput, ReasonTextarea } from '../Sims7RedirectionsEditHelpers';

describe('EffectiveDateInput', () => {
  const getDateParts = () => ({ day: 1, month: 2, year: 2026 });
  const handleDateChange = jest.fn();
  const handleValidateDate = jest.fn();

  it('renders DateInput with correct props', () => {
    render(
      <EffectiveDateInput
        getDateParts={getDateParts}
        effectiveDate={new Date(2026, 1, 1)}
        handleDateChange={handleDateChange}
        handleValidateDate={handleValidateDate}
        dateError=''
      />
    );
  });

  it('shows error message if dateError is set', () => {
    render(
      <EffectiveDateInput
        getDateParts={getDateParts}
        effectiveDate={new Date(2026, 1, 1)}
        handleDateChange={handleDateChange}
        handleValidateDate={handleValidateDate}
        dateError='Date is invalid'
      />
    );
    expect(screen.getByText('Date is invalid')).toBeInTheDocument();
  });
});

describe('ReasonTextarea', () => {
  const setReasonForChanges = jest.fn();
  const setIsDirty = jest.fn();
  const isFormDirty = jest.fn(() => true);

  it('renders Textarea and updates value', () => {
    render(
      <ReasonTextarea
        reasonForChanges=''
        setReasonForChanges={setReasonForChanges}
        setIsDirty={setIsDirty}
        isFormDirty={isFormDirty}
        redirectToNextGen='no'
        effectiveDate={null}
        reasonError=''
      />
    );
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New reason' } });
    expect(setReasonForChanges).toHaveBeenCalledWith('New reason');
    expect(setIsDirty).toHaveBeenCalledWith(true);
  });

  it('shows error message if reasonError is set', () => {
    render(
      <ReasonTextarea
        reasonForChanges=''
        setReasonForChanges={setReasonForChanges}
        setIsDirty={setIsDirty}
        isFormDirty={isFormDirty}
        redirectToNextGen='no'
        effectiveDate={null}
        reasonError='Reason required'
      />
    );
    expect(screen.getByText('Reason required')).toBeInTheDocument();
  });
});
