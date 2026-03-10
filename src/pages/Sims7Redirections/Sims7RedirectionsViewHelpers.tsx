import React from "react";
import {
    TagColor,
    Button,
    ButtonSize,
    ButtonColor,
    ButtonIconPosition
} from "@essnextgen/ui-kit";

export function getStatusTagColor(status: string): TagColor {
    if (status === 'Permanent' || status === 'Migrated') return TagColor.Success;
    if (status === 'Not migrated') return TagColor.Neutral;
    if (status === 'Planned' || status === 'Reversing') return TagColor.Outstanding;
    return TagColor.Neutral;
}

const redirectYesStatuses = new Set(["migrated", "permanent", "planned"]);

export const getRedirectToNextGenText = (status?: string): "Yes" | "No" => {
    if (status && redirectYesStatuses.has(status.toLowerCase())) {
        return "Yes";
    }
    return "No";
};

export const ModifiedByField: React.FC<{ modifiedBy: string }> = ({ modifiedBy }) => (
    modifiedBy && modifiedBy !== '-' ? (
        <div>
            <div className="heading-category">Modified by</div>
            <div className="details-category">{modifiedBy}</div>
        </div>
    ) : null
);

export const EffectiveDateField: React.FC<{ status: string, effectiveDate: string }> = ({ status, effectiveDate }) => (
    ((status !== 'Not migrated' && effectiveDate && effectiveDate !== '-') || (status === 'Not migrated' && effectiveDate && effectiveDate !== '-')) ? (
        <div>
            <div className="heading-category">Effective date</div>
            <div className="details-category">{effectiveDate}</div>
        </div>
    ) : null
);

export const ReasonForChangesField: React.FC<{ reasonForChanges: string }> = ({ reasonForChanges }) => (
    reasonForChanges ? (
        <div>
            <div className="heading-category">Reason for changes</div>
            <div className="details-category">{reasonForChanges}</div>
        </div>
    ) : null
);

export const EditButton: React.FC<{ status: string, t: (key: string) => string, setSidePanelMode: (mode: 'view' | 'edit') => void }> = ({ status, t, setSidePanelMode }) => (
    status !== 'Permanent' ? (
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
    ) : null
);
