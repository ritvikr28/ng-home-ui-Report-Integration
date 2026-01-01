import React from "react";
import {
    SidePanel,
    SidePanelContent,
    SidePanelFooter,
    Button,
    ButtonColor,
    ButtonSize,
    ButtonIconPosition,
    Tag,
    TagSize,
    TagColor
} from "@essnextgen/ui-kit";

interface Sims7RedirectionsSidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'view' | 'edit';
    selectedRow: any;
    t: (key: string) => string;
    setSidePanelMode: (mode: 'view' | 'edit') => void;
}

const Sims7RedirectionsSidePanel: React.FC<Sims7RedirectionsSidePanelProps> = ({
    isOpen,
    onClose,
    mode,
    selectedRow,
    t,
    setSidePanelMode
}) => (
    <SidePanel
        isOpen={isOpen}
        onClose={onClose}
        isOnClose
        title={mode === 'view' ? 'View SIMS 7 redirects' : 'Edit Details'}
    >
        <SidePanelContent>
            <div>
                {mode === 'view' && selectedRow && (
                    <div className="view-mode-with-edit-button">
                        <div className="view-mode-content">
                            <div>
                                <div className="heading-category">Category</div>
                                <div className="details-category">{selectedRow.category}</div>
                            </div>
                            <div>
                                <div className="heading-category">Next Gen module</div> {selectedRow.nextGenModule ? (
                                    <a
                                        href={`https://example.com/module/${encodeURIComponent(selectedRow.nextGenModule)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        {selectedRow.nextGenModule}
                                    </a>
                                ) : null}
                            </div>
                            <div>
                                <div className="heading-category">SIMS7 module</div>
                                <div className="details-category">{selectedRow.sims7Module}</div>
                            </div>
                            {selectedRow.modifiedBy && selectedRow.modifiedBy !== '-' && (
                                <div>
                                    <div className="heading-category">Modified by</div>
                                    <div className="details-category">{selectedRow.modifiedBy}</div>
                                </div>
                            )}
                            <div>
                                <div className="heading-category">Redirect to open in Next Gen</div>
                                <div className="details-category">{selectedRow.status === 'Not migrated' ? 'No' : 'Yes'}</div>
                            </div>
                            {(selectedRow.status !== 'Not migrated' && selectedRow.effectiveDate && selectedRow.effectiveDate !== '-') || (selectedRow.status === 'Not migrated' && selectedRow.effectiveDate && selectedRow.effectiveDate !== '-') ? (
                                <div>
                                    <div className="heading-category">Effective date</div>
                                    <div className="details-category">{selectedRow.effectiveDate}</div>
                                </div>
                            ) : null}
                            {selectedRow.reasonForChanges && (
                                <div>
                                    <div className="heading-category">Reason for changes</div>
                                    <div className="details-category">{selectedRow.reasonForChanges}</div>
                                </div>
                            )}
                            <div>
                                <div className="heading-category">Status</div>
                                <div className="details-category">
                                    <Tag
                                        text={selectedRow.status}
                                        size={TagSize.Large}
                                        color={(() => {
                                            if (selectedRow.status === 'Permanent' || selectedRow.status === 'Migrated') {
                                                return TagColor.Success;
                                            }
                                            if (selectedRow.status === 'Not migrated') {
                                                return TagColor.Neutral;
                                            }
                                            if (selectedRow.status === 'Planned' || selectedRow.status === 'Reversing') {
                                                return TagColor.Outstanding;
                                            }
                                            return TagColor.Neutral;
                                        })()}
                                    />
                                </div>
                            </div>
                        </div>
                        {selectedRow.status !== 'Permanent' && (
                            <div>
                                <Button
                                    size={ButtonSize.Small}
                                    color={ButtonColor.Tertiary}
                                    iconName="edit--alt"
                                    iconPosition={ButtonIconPosition.Left}
                                    onClick={() => setSidePanelMode('edit')}
                                    dataTestId="edit-button"
                                >
                                    {t("UI_KIT_EditableSectionEditBtnText")}
                                </Button>
                            </div>
                        )}
                    </div>
                )
                }
                {mode === 'edit' && (
                    <div style={{ fontSize: '18px', fontWeight: 500 }}>This is edit page</div>
                )}
            </div>
        </SidePanelContent>
        <SidePanelFooter>
            <Button
                size={ButtonSize.Large}
                color={ButtonColor.Secondary}
                className="btn-full-width"
                onClick={onClose}
            >
                Close
            </Button>
        </SidePanelFooter>
    </SidePanel>
);

export default Sims7RedirectionsSidePanel;
