import { FilterDialogLogicProps } from "./FilterDialog.props";
import FilterDialogView from "./FilterDialog.view";


const FilterDialogLogic = ({ setFilterBtnClicked }: FilterDialogLogicProps) => (
    <FilterDialogView setFilterBtnClicked={setFilterBtnClicked} />
)


export default FilterDialogLogic;