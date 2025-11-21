
import { FormLabel, DateInput, CheckBox } from "@essnextgen/ui-kit";
import "./style.scss";

export const DialogContent = () => (
    <div className="dialog-content-container"
    >
        <div>
            <FormLabel forId="select" className="status-label">
                Status
            </FormLabel>
            <div className="status-checkboxes">
                <CheckBox
                    dataTestId="test-id"
                    id="element-id-1"
                    label="Read"
                    onChange={() => { }}
                    value="read"
                />
                <CheckBox
                    dataTestId="test-id"
                    id="element-id-2"
                    label="Unread"
                    onChange={() => { }}
                    value="unread"
                />
                <div />
            </div>
            <div style={{ marginTop: "24px" }}>
                <FormLabel forId="select" className="priority-label">
                    Priority
                </FormLabel>
                <div className="priority-checkboxes">
                    <CheckBox
                        dataTestId="test-id"
                        id="element-id-1"
                        label="Low"
                        onChange={() => { }}
                        value="low"
                    />
                    <CheckBox
                        dataTestId="test-id"
                        id="element-id-2"
                        label="Medium"
                        onChange={() => { }}
                        value="medium"
                    />
                    <CheckBox
                        dataTestId="test-id"
                        id="element-id-2"
                        label="High"
                        onChange={() => { }}
                        value="high"
                    />
                    <div />
                </div>
            </div>
        </div>
        <div className="date-selection"
        >
            <div className="start-end-date-container"
            >
                <FormLabel>
                    Start date
                </FormLabel>
                <DateInput
                    dataTestId="test-id"
                    id="element-id"
                    onChange={() => { }}
                    onError={() => { }}
                    onValidateDate={() => { }}
                    showDatePicker
                />
            </div>
            <div className="start-end-date-container">
                <FormLabel>
                    End date
                </FormLabel>
                <DateInput
                    dataTestId="test-id"
                    id="element-id"
                    onChange={() => { }}
                    onError={() => { }}
                    onValidateDate={() => { }}
                    showDatePicker
                />
            </div>
        </div>
    </div>
);