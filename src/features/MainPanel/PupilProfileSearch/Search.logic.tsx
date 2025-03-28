import React, { ChangeEvent, useEffect, useState } from "react";
import {
  Icon,
  IconColor,
  IconSize,
  Suggestion,
  Tag,
  TagColor,
  TagSize
} from "@essnextgen/ui-kit";

import { envConfig } from "../../../shared/utils/constants";
import { handleKeyPress } from "./utils/InputHandlers";
import SearchView from "./Search.view";
import fetchSearchSuggestions from "./utils/FetchSearchSuggestions";
import searchInputValidation from "./utils/SearchInputValidation";
import { logger } from "../../../shared/components/AppInsights";
import { ISearchSuggestionsResultsApiResponse } from "../../../shared/model/SearchSuggestions/SearchResultsApiResponse";
import getClassDetails from "./utils/GetClassDetails";
import gtmAnalytics from "../../../shared/utils/analytics";
import { IPupilSuggestions, ISearchProps } from "./Search.props";

const Search: React.FC<ISearchProps> = ({ isOpen }: ISearchProps) => {
  logger.info("Search Feature is executing");
  const pagePath = "";
  const [inputText] = useState("");
  const [suggestionsResult, setSuggestionsResult]: [
    IPupilSuggestions[],
    React.Dispatch<React.SetStateAction<IPupilSuggestions[]>>
  ] = useState<IPupilSuggestions[]>([]);
  const [value, setValue] = useState<string>("");
  const [suggestions, setSuggestions]: [
    Array<Suggestion>,
    React.Dispatch<React.SetStateAction<Array<Suggestion>>>
  ] = useState<Array<Suggestion>>([]);
  const [isLoading, setIsLoading]: [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>
  ] = useState<boolean>(false);

  const onKeyPress: (e: React.SyntheticEvent<EventTarget>) => void = (
    e: any
  ) => {
    /* istanbul ignore next */
    if (e.key === "Enter" || e.type === "click") {
      const validInput: boolean = handleKeyPress(
        {
          e,
          inputText,
          pagePath,
        },
        e.target.value
      );
      const url = `${envConfig.LEARNER_UI_URL}/search?name=${e.target.value}`;
      gtmAnalytics.pushEvent({
        event: "click",
        linkText: "Show all results",
        linkUrl: url,
        clickType: "search_field",
        clickLocation: "body",
      });
      if (validInput) window.location.href = url;
    }
  };

  const learnerProfilePhotoToggleEnabled = true;

  useEffect(() => {
    logger.info("Re rendering the Search feature");
  }, [inputText, value, suggestionsResult]);

  const onChange: any = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
    setIsLoading(true);
    setSuggestions([]);
    getSuggestions(event.target.value);
  };

  const getSuggestions: any = (suggestionValue: string) => {
    if (!searchInputValidation(suggestionValue).invalid) {
      fetchSearchSuggestions(suggestionValue, 8)
        .then((data: ISearchSuggestionsResultsApiResponse[]) => {
          const dataItems: any = [
            {
              name: "",
              link: "/profile/{externalId}",
              values: getValues(
                data,
                "/profile/{externalId}",
                learnerProfilePhotoToggleEnabled
              )
            }
          ];

          setIsLoading(false);
          setSuggestions(dataItems);
          /* eslint-disable */
          setSuggestionsResult((suggestionsResult: IPupilSuggestions[]) => [
            ...suggestionsResult,
            {
              pupilSearched: suggestionValue,
              suggestions: dataItems,
            },
          ]);
          /* eslint-enable */
        })
        .catch((error: Error) => {
          setIsLoading(false);
          setSuggestions([]);
          console.log(error);
        });
    } else {
      setIsLoading(false);
      setSuggestions([]);
    }
  };

  return (
    <SearchView
      handleKeyPress={onKeyPress}
      value={value}
      setValue={setValue}
      suggestions={suggestions}
      isLoading={isLoading}
      setSuggestions={setSuggestions}
      onChange={onChange}
      handleOnChange={onKeyPress}
      isOpen={isOpen}
    />
  );
};

export default Search;
export function getValues(
  data: ISearchSuggestionsResultsApiResponse[],
  redirectLink: string,
  learnerProfilePhotoToggleEnabled: boolean
): Array<{
  icon: JSX.Element;
  text: string;
  props: {
    externalId: string;
    link: string;
    name: string;
  };
  value: JSX.Element;
}> {
  return data.map((v: any) => ({
    icon: (
      <>
        {((v.imagePath === "" || !learnerProfilePhotoToggleEnabled) && (
          <Icon
            name="user--filled"
            size={IconSize.Large}
            color={IconColor.Neutral400}
          />
        )) || (
          <img src={v.imagePath} alt="" className="elr-search__profile-icon" />
        )}
      </>
    ),
    text: `${v.preferredForename || v.legalForename} ${v.preferredSurname}  (${
      v.legalForename
    } ${v.legalSurname})`,
    props: {
      externalId: v.learnerExternalId,
      link: redirectLink.replace("{externalId}", v.learnerExternalId),
      name: `${v.preferredForename} ${v.preferredSurname}  (${v.legalForename} ${v.legalSurname})`,
    },
    value: (
      <Tag
        text={getClassDetails({
          yearGroup: v.yearGroup,
          classGroup: v.classGroup,
        })}
        color={TagColor.Warning}
        size={TagSize.Small}
      />
    ),
  }));
}
