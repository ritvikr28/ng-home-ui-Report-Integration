type StatusHandlers = {
  handleReversingStatus: (row: any, redirect: string, date: any, reason: string) => void;
  handleFutureDateStatus: (row: any, date: any) => void;
  handleMigratedStatus: (row: any, redirect: string, date: any, reason: string) => void;
  handlePlannedStatus: (row: any, redirect: string) => void;
};

export async function handleStatusLogic(
  updatedRow: any,
  redirectToNextGen: string,
  effectiveDate: any,
  reasonForChanges: string
): Promise<void> {
  const {
    handleReversingStatus: reversingStatusHandler,
    handleFutureDateStatus: futureDateStatusHandler,
    handleMigratedStatus: migratedStatusHandler,
    handlePlannedStatus: plannedStatusHandler
  }: StatusHandlers = await import('./Sims7RedirectionsSaveStatus.logic');

  if (updatedRow.status === 'Reversing') {
    reversingStatusHandler(
      updatedRow,
      redirectToNextGen,
      effectiveDate,
      reasonForChanges
    );
  }

  futureDateStatusHandler(updatedRow, effectiveDate);

  if (updatedRow.status === 'Migrated') {
    migratedStatusHandler(
      updatedRow,
      redirectToNextGen,
      effectiveDate,
      reasonForChanges
    );
  }

  if (updatedRow.status === 'Planned') {
    plannedStatusHandler(updatedRow, redirectToNextGen);
  }
}