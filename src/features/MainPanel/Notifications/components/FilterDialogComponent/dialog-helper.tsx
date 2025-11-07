
import { FormLabel, DateInput, Dropdown, DropdownItem } from "@essnextgen/ui-kit";

export const DialogContent = () => (
        <>
            <div style={{ display: "flex", gap: "40px", marginBottom: "24px" }}>
                <div>
                    <FormLabel forId="select">
                        Status
                    </FormLabel>
                    <Dropdown
                        dataTestId="test-id"
                        id="select"
                        onSelect={()=>{}}
                        scrollbarHeight={220}
                        selectedItem={{}}
                        threshold={0}
                    >
                        <DropdownItem
                            id="1"
                            text="Menu Item 1"
                            value="1"
                        >
                            Menu Item 1
                        </DropdownItem>
                        <DropdownItem
                            id="2"
                            text="Menu Item 2"
                            value="2"
                        >
                            Menu Item 2
                        </DropdownItem>
                    </Dropdown>
                </div>
                <div>
                    <FormLabel forId="select">
                        Priority
                    </FormLabel>
                    <Dropdown
                        dataTestId="test-id"
                        id="select"
                        onSelect={()=>{}}
                        scrollbarHeight={220}
                        selectedItem={{}}
                        threshold={0}
                    >
                        <DropdownItem
                            id="1"
                            text="Menu Item 1"
                            value="1"
                        >
                            Menu Item 1
                        </DropdownItem>
                        <DropdownItem
                            id="2"
                            text="Menu Item 2"
                            value="2"
                        >
                            Menu Item 2
                        </DropdownItem>
                    </Dropdown>
                </div>
            </div>
            <div style={{ display: "flex", gap: "40px" }}>
                <div>
                    <div style={{ width: '200px' }}>
                        <FormLabel>
                            Start date
                        </FormLabel>
                        <DateInput
                            dataTestId="test-id"
                            id="element-id"
                            onChange={()=>{}}
                            onError={()=>{}}
                            onValidateDate={()=>{}}
                            showDatePicker
                        />
                    </div>
                </div>
                <div>
                    <div style={{ width: '200px' }}>
                        <FormLabel>
                            End date
                        </FormLabel>
                        <DateInput
                            dataTestId="test-id"
                            id="element-id"
                            onChange={()=>{}}
                            onError={()=>{}}
                            onValidateDate={()=>{}}
                            showDatePicker
                        />
                    </div>
                </div>
            </div>
        </>
    );