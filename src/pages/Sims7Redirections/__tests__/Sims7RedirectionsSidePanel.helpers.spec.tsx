import React from 'react';
/* eslint-disable import/newline-after-import, global-require */
import * as helpers from '../Sims7RedirectionsSidePanel.helpers';
jest.mock('../Sims7RedirectionsSidePanelRedirect.logic', () => ({ handleRedirectToNextGenChange: jest.fn() }));
jest.mock('../Sims7RedirectionsSidePanelDate.logic', () => ({ handleDateChange: jest.fn() }));
jest.mock('../Sims7RedirectionsSidePanelSaveHelpers', () => ({ buildRequest: jest.fn() }));
jest.mock('../Sims7RedirectionsPage.api', () => ({ updateSims7Redirection: jest.fn() }));

describe('Sims7RedirectionsSidePanel.helpers', () => {
  it('setReasonForChangesHandler calls setReasonForChangesRaw and validateReason', () => {
    const setReasonForChangesRaw = jest.fn();
    const validateReason = jest.fn();
    const requiresReason = jest.fn().mockReturnValue(true);
    helpers.setReasonForChangesHandler({
      val: 'reason',
      setReasonForChangesRaw,
      validateReason,
      requiresReason,
      selectedRow: { status: 'Active' },
      redirectToNextGen: 'yes',
      setReasonError: jest.fn()
    });
    expect(setReasonForChangesRaw).toHaveBeenCalledWith('reason');
    expect(validateReason).toHaveBeenCalled();
  });
  it('onRedirectToNextGenChangeHandler calls handleRedirectToNextGenChange', () => {
    const { handleRedirectToNextGenChange } = require('../Sims7RedirectionsSidePanelRedirect.logic');
    const mockEvent = { preventDefault: jest.fn() } as unknown as React.SyntheticEvent<Element, Event>;
    helpers.onRedirectToNextGenChangeHandler({
      event: mockEvent,
      value: 'yes',
      selectedRow: { status: 'Active' },
      setRedirectToNextGen: jest.fn(),
      setEffectiveDate: jest.fn(),
      setDateParts: jest.fn(),
      setIsDirty: jest.fn(),
      effectiveDate: new Date(),
      reasonForChanges: ''
    });
    expect(handleRedirectToNextGenChange).toHaveBeenCalled();
  });

  it('onDateChangeHandler calls handleDateChange', () => {
    const { handleDateChange } = require('../Sims7RedirectionsSidePanelDate.logic');
    helpers.onDateChangeHandler({
      t: jest.fn(),
      arg1: 1,
      arg2: 2,
      arg3: 3,
      setDateParts: jest.fn(),
      setEffectiveDate: jest.fn(),
      setDateError: jest.fn(),
      setIsDirty: jest.fn(),
      selectedRow: { status: 'Active' },
      redirectToNextGen: '',
      reasonForChanges: ''
    });
    expect(handleDateChange).toHaveBeenCalled();
  });

  it('onValidateDateHandler calls handleValidateDate', () => {
    const mock = jest.fn();
    const date = new Date('2026-03-09');
    helpers.onValidateDateHandler({ date, setDateError: jest.fn(), handleValidateDate: mock });
    expect(mock).toHaveBeenCalledWith(date, expect.any(Function));
  });

  it('canEditSidePanel returns true for edit mode and valid row', () => {
    expect(helpers.canEditSidePanel('edit', { id: 1 })).toBe(true);
    expect(helpers.canEditSidePanel('view', { id: 1 })).toBe(false);
    expect(helpers.canEditSidePanel('edit', null)).toBe(false);
  });

  it('shouldShowSuccessToast returns true for any status when not dirty', () => {
    expect(helpers.shouldShowSuccessToast({ status: 'Migrated' }, false)).toBe(true);
    expect(helpers.shouldShowSuccessToast({ status: 'Not migrated' }, false)).toBe(false);
    expect(helpers.shouldShowSuccessToast({ status: 'Planned' }, false)).toBe(true);
    expect(helpers.shouldShowSuccessToast({ status: 'Reversing' }, false)).toBe(true);
    expect(helpers.shouldShowSuccessToast({ status: 'Migrated' }, true)).toBe(false);
    expect(helpers.shouldShowSuccessToast({ status: 'Not migrated' }, true)).toBe(false);
  });

  it('showSuccessAndClose calls all callbacks and onSaveSuccess', () => {
    jest.useFakeTimers();
    const setShowSuccessToast = jest.fn();
    const setShowFailureBanner = jest.fn();
    const setSidePanelMode = jest.fn();
    const onSaveSuccess = jest.fn();
    helpers.showSuccessAndClose(setShowSuccessToast, setShowFailureBanner, setSidePanelMode, onSaveSuccess);
    expect(setShowSuccessToast).toHaveBeenCalledWith(true);
    expect(setShowFailureBanner).toHaveBeenCalledWith(false);
    jest.runAllTimers();
    expect(setShowSuccessToast).toHaveBeenCalledWith(false);
    expect(setSidePanelMode).toHaveBeenCalledWith('view');
    expect(onSaveSuccess).toHaveBeenCalled();
    jest.useRealTimers();
  });

  it('hasValidDfeNumber returns true for valid dfeNumber', () => {
    expect(helpers.hasValidDfeNumber({ dfeNumber: '123' }, jest.fn())).toBe(true);
    expect(helpers.hasValidDfeNumber({ DfeNumber: '456' }, jest.fn())).toBe(true);
  });

  it('hasValidDfeNumber returns false and calls setDateError for missing dfeNumber', () => {
    const setDateError = jest.fn();
    expect(helpers.hasValidDfeNumber({}, setDateError)).toBe(false);
    expect(setDateError).toHaveBeenCalledWith('DFE Number is missing from the selected row.');
  });

  it('buildRedirectionRequest calls buildRequest', () => {
    const { buildRequest } = require('../Sims7RedirectionsSidePanelSaveHelpers');
    helpers.buildRedirectionRequest({}, '2026-03-09', 'Planned');
    expect(buildRequest).toHaveBeenCalledWith({}, '2026-03-09', 'Planned');
  });

  it('tryUpdateRedirection calls updateSims7Redirection and showSuccessAndClose on success', async () => {
    const { updateSims7Redirection } = require('../Sims7RedirectionsPage.api');
    updateSims7Redirection.mockResolvedValue(undefined);
    await helpers.tryUpdateRedirection({}, jest.fn(), jest.fn(), jest.fn(), jest.fn());
    expect(updateSims7Redirection).toHaveBeenCalled();
  });

  it('tryUpdateRedirection calls setShowSuccessToast(false) and setShowFailureBanner(true) on error', async () => {
    const { updateSims7Redirection } = require('../Sims7RedirectionsPage.api');
    updateSims7Redirection.mockImplementation(() => { throw new Error('fail'); });
    const setShowSuccessToast = jest.fn();
    const setShowFailureBanner = jest.fn();
    await helpers.tryUpdateRedirection({}, setShowSuccessToast, setShowFailureBanner, jest.fn(), jest.fn());
    expect(setShowSuccessToast).toHaveBeenCalledWith(false);
    expect(setShowFailureBanner).toHaveBeenCalledWith(true);
  });
});
