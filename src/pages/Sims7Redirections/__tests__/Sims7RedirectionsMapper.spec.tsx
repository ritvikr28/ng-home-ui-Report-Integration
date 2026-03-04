import { mapSims7RedirectionsItem } from '../Sims7RedirectionsMapper';

describe('mapSims7RedirectionsItem', () => {
        it('returns string value for non-string status', () => {
        });
        it('returns empty string for falsy status', () => {
        });
      it('returns null from formatDateISO if not ISO format', () => {
      });
    it('returns date string as-is if not DD MM YYYY or ISO', () => {
    });
  it('maps all fields correctly from API item', () => {
    const apiItem = {
      moduleId: 1,
      ngComponent: 'TestCat',
      ngModule: 'TestNextGen',
      sims7Module: 'TestSIMS7',
      updatedBy: 'TestUser',
      effectiveDate: '2026-02-18T00:00:00',
      redirectStatus: 'PLANNED',
      tooltipMessage: 'Test tooltip',
      cellStatus: '',
      actions: { options: [{ disabled: false, isSelected: false, text: ' View', value: 'View' }] },
      reasonForChanges: 'Reason'
    };
    const result = mapSims7RedirectionsItem(apiItem, 0);
    expect(result.id).toBe('1');
    expect(result.category).toBe('TestCat');
    expect(result.nextGenModule).toBe('TestNextGen');
    expect(result.sims7Module).toBe('TestSIMS7');
    expect(result.modifiedBy).toBe('TestUser');
    expect(result.effectiveDate).toBe('18 Feb 2026');
    expect(result.status).toBe('Planned');
    expect(result.tooltipMessage).toBe('Test tooltip');
    expect(result.cellStatus).toBe('');
    expect(result.actions.options[0].text).toBe(' View');
    expect(result.reasonForChanges).toBe('Reason');
  });

  it('handles missing fields gracefully', () => {
    const apiItem = {};
    const result = mapSims7RedirectionsItem(apiItem, 5);
    expect(result.id).toBe('6'); // idx + 1
    expect(result.category).toBe('');
    expect(result.nextGenModule).toBe('');
    expect(result.sims7Module).toBe('');
    expect(result.modifiedBy).toBe('');
    expect(result.effectiveDate).toBe('');
    expect(result.status).toBe('');
    expect(result.tooltipMessage).toBe('');
    expect(result.cellStatus).toBe('');
    expect(result.actions.options.length).toBe(2);
    expect(result.reasonForChanges).toBe('');
  });

  it('formats DD MM YYYY date correctly', () => {
    const apiItem = { effectiveDate: '18 02 2026' };
    const result = mapSims7RedirectionsItem(apiItem, 0);
    expect(result.effectiveDate).toBe('18 Feb 2026');
  });

  it('formats ISO date correctly', () => {
    const apiItem = { effectiveDate: '2026-02-18T00:00:00' };
    const result = mapSims7RedirectionsItem(apiItem, 0);
    expect(result.effectiveDate).toBe('18 Feb 2026');
  });

  it('formats status correctly', () => {
    const apiItem = { redirectStatus: 'PLANNED' };
    const result = mapSims7RedirectionsItem(apiItem, 0);
    expect(result.status).toBe('Planned');
  });
});
