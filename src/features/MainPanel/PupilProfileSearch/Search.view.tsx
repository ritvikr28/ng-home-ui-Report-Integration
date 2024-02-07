import React from "react";
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";
import { FormLabel, Search, Suggestion, TextInputSize,ISearchItemProp } from "@essnextgen/ui-kit";
import { ISearchViewProps } from "./Search.props";
import { envConfig } from "../../../shared/utils";
import "./Style.scss";
// import gtmAnalytics from "../../../shared/utils/analytics";

export const onItemClickFunc: any = (e: ISearchItemProp | null,  setSuggestions: any) => {

  const { link }: any = e;
  // gtmAnalytics.pushEvent({
  //   event: "click",
  //   linkText: "Search Pupil By Suggesion",
  //   linkUrl:`${envConfig.LEARNER_UI_URL}${link}`,
  //   clickType: "suggesionclick",
  //   clickLocation: "body"
  // })
 
  setSuggestions([]);
window.location.href=`${envConfig.LEARNER_UI_URL}${link}`;

 
};
const SearchView: React.FC<ISearchViewProps> = (props: ISearchViewProps) => {
  const {
    handleKeyPress,
   // boxStyle,
    value,
    setValue,
    suggestions,
    isLoading,
    setSuggestions,
    onChange,
    isOpen
  }: ISearchViewProps = props;
  const hasItems: boolean = suggestions.some((x: Suggestion) => x.values.length > 0);
  const onItemClick: any = (e: ISearchItemProp | null) => {
    onItemClickFunc(e, setSuggestions);
  };
  const { t }: UseTranslationResponse<"translation", undefined> =
  useTranslation();
  const noDataTemplateText: string =`${t("UI_KIT_SearchNoResultsFound.FirstPart")} - {value} - ${t(
      "UI_KIT_SearchNoResultsFound.SecondPart"
    )}`;
  return (
    <>
      <FormLabel forId="search" className="pupil-profile-font">
        Pupil Profile
      </FormLabel>      
      <div className={isOpen?"search-comp-boreder":"search-comp-boreder-close"}>
      <Search
      dataTestId="new-search-element"
                id="search"               
                suggestions={hasItems ? suggestions : []}
                className="pupil-profile-suggestion"
                headingText={t("description.homePage.searchHelper")}
                onKeyUpLenght={2}
                placeholderText={t("description.homePage.searchBar.placeHolder")}
                onItemClick={onItemClick}
                keyUpHandler={(e: any) => {
                  onChange(e);
                }}
                showLoading={isLoading}
                value={value}
                onCloseHandle={() => { setValue(""); }}
                onKeyDown={handleKeyPress}
                onFocus={(e: any) => {
                  onChange(e);
                }}
                size={TextInputSize.Large}     
                debouncerTreshold={1000}    
                noDataTemplate={noDataTemplateText}       
                 />
      </div>
    </>
  );
};

export default SearchView;
