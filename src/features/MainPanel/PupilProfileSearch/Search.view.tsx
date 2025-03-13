import React from "react";
import {
  useTranslation,
  UseTranslationResponse
} from "@essnextgen/ui-intl-kit";
import {
  FormLabel,
  Search,
  Suggestion,
  TextInputSize,
  ISearchItemProp,
  Grid,
  GridItem
} from "@essnextgen/ui-kit";
import { ISearchViewProps } from "./Search.props";
import { envConfig } from "../../../shared/utils";
import "./Style.scss";
import gtmAnalytics from "../../../shared/utils/analytics";
import { SectionTitle } from "../../../shared/components/SectionTitle/SectionTitle";

export const onItemClickFunc: any = (
  e: ISearchItemProp | null,
  setSuggestions: any
) => {
  const { link }: any = e;
  gtmAnalytics.pushEvent({
    event: "click",
    linkText: "[RemovedPupilName]",
    linkUrl: `${envConfig.LEARNER_UI_URL}${link}`,
    clickType: "dropdown_option",
    clickLocation: "search_suggestion",
  });

  setSuggestions([]);
  window.location.href = `${envConfig.LEARNER_UI_URL}${link}`;
};
const SearchView: React.FC<ISearchViewProps> = (props: ISearchViewProps) => {
  const {
    handleKeyPress,
    value,
    setValue,
    suggestions,
    isLoading,
    setSuggestions,
    onChange
  }: ISearchViewProps = props;
  const hasItems: boolean = suggestions.some(
    (x: Suggestion) => x.values.length > 0
  );
  const onItemClick: any = (e: ISearchItemProp | null) => {
    onItemClickFunc(e, setSuggestions);
  };
  const { t }: UseTranslationResponse<"translation", undefined> =
    useTranslation();
  const noDataTemplateText = `${t(
    "UI_KIT_SearchNoResultsFound.FirstPart"
  )} - {value} - ${t("UI_KIT_SearchNoResultsFound.SecondPart")}`;
  const className = `pupil-profile-suggestion ${
    value ? "icon-search" : "no-icon-search"
  }`;

  return (
    <Grid>
      <GridItem sm md lg className="c-clear-padding-left">
        <FormLabel forId="search">
          <SectionTitle title="Pupil Profile" />
        </FormLabel>
        <div className="search-df65s76dfs new-search-container">
          <Search
            clear={false}
            dataTestId="new-search-element"
            id="search"
            suggestions={hasItems ? suggestions : []}
            headingText={t("searchpage.searchHelper")}
            onKeyUpLenght={2}
            className={className}
            placeholderText={t("searchpage.searchBar")}
            onItemClick={onItemClick}
            keyUpHandler={(e: any) => {
              onChange(e);
            }}
            showLoading={isLoading}
            value={value}
            onCloseHandle={() => {
              setValue("");
            }}
            onKeyDown={handleKeyPress}
            onFocus={(e: any) => {
              onChange(e);
            }}
            size={TextInputSize.Large}
            debouncerTreshold={1000}
            noDataTemplate={noDataTemplateText}
          />
        </div>
      </GridItem>
    </Grid>
  );
};

export default SearchView;
