import React, { ChangeEvent, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Icon, IconColor, IconSize, Suggestion, Tag, TagColor, TagSize } from "@essnextgen/ui-kit";

import { envConfig } from "../../../shared/utils/constants";
import { handleKeyPress } from "./utils/InputHandlers";
import SearchView from "./Search.view";
import fetchSearchSuggestions from "./utils/FetchSearchSuggestions";
import searchInputValidation from "./utils/SearchInputValidation";
import useEffectForSearchQuery from "./utils/useQueryToSearch";
import useQuery from "../../../shared/utils/useQuery";
import { logger } from "../../../shared/components/AppInsights";
import { ISearchSuggestionsResultsApiResponse } from "../../../shared/model/SearchSuggestions/SearchResultsApiResponse";
import { ILearnerSearchResult } from "./models/LearnerSearchResult";
import getClassDetails from "./utils/GetClassDetails";



interface ISearchProps {
  // boxStyle?: SearchBoxStyle;
}

interface IPupilSuggestions {
  pupilSearched: string;
  suggestions: Array<Suggestion>;
}

const Search: React.FC<ISearchProps> = (props: ISearchProps) => {
  logger.info("Search Feature is executing");
console.log(props)
  const queryParams: any = useQuery();
  const searchedName: string = queryParams.get("name");

  // const { boxStyle }: ISearchProps = props;
  const history: any = useHistory();
  const pagePath: string = history.location.pathname;

  // const dispatch: Dispatch<AnyAction> = useDispatch();
  // const inputText: string = useAppSelector(
  //   (state: RootState) => state.searchInput.value
  // );
  const [inputText, setUserInput]=useState("");

  const [suggestionsResult, setSuggestionsResult]: [IPupilSuggestions[], React.Dispatch<React.SetStateAction<IPupilSuggestions[]>>] =
    useState<IPupilSuggestions[]>([]);

  // const errorState: boolean = useAppSelector(
  //   (state: RootState) => state.searchInput.error
  // );
  const [value, setValue]: any = useState<string>(
    searchedName ?? ""
  );
  // const onRollState: string = useAppSelector(
  //   (state: RootState) => state.onRoleState.value
  // );
  // const [onRoleState, setOnRoleState]: [
  //   string,
  //   React.Dispatch<React.SetStateAction<string>>
  // ] = useState<string>("Current");

  const [suggestions, setSuggestions]: [Array<Suggestion>, React.Dispatch<React.SetStateAction<Array<Suggestion>>>]
    = useState<Array<Suggestion>>([]);
    const [learnerInput, setLearnerInput]: [ILearnerSearchResult[], React.Dispatch<React.SetStateAction<ILearnerSearchResult[]>>]
    = useState<ILearnerSearchResult[]>([]);
  const [isLoading, setIsLoading]: [boolean, React.Dispatch<React.SetStateAction<boolean>>] = useState<boolean>(false);
  
  const onKeyPress: (e: React.SyntheticEvent<EventTarget>) => void = (
    e: any
  ) => {
    if (e.key === "Enter" || e.type === "click") {      
      handleKeyPress({
        e,
        inputText,
        pagePath
      }, e.target.value);
      setLearnerInput([]);
      // dispatch(learnerSearchResultSlice.actions.setLearnerInput([]));
      const url=`${envConfig.LEARNER_UI_URL}/search?name=${e.target.value}`;
      console.log(url);
      window.location.href=url;
    }
  };

  const learnerProfilePhotoToggleEnabled: boolean = true;

  useEffectForSearchQuery(searchedName,setUserInput);

  useEffect(() => {
    logger.info("Re rendering the Search feature");
    console.log(searchedName);
    console.log(value)
    console.log(learnerInput);
    // if (inputText !== "" && !errorState) {

    // if (inputText !== "") {
    //   fetchSearchResults(inputText, "Current")
    //     .then((result: ISearchResultsApiResponse[]) => {
    //       if (result.length === 0) {
    //         setLearnerInput([learnerEmptySearchResult]);
           
    //       } else {
    //         const learnerSearchResultsList: ILearnerSearchResult[] =
    //           ProcessSearchResults(result);
    //           setLearnerInput(learnerSearchResultsList);
           
    //       }
    //     })
    //     .catch((error: Error) => {
    //       // dispatch(ApiErrorSlice.actions.setError());
    //     });
    // }
    // if (errorState) {
    //   dispatch(
    //     learnerSearchResultSlice.actions.setLearnerInput([])
    //   );
    // }
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

          const dataItems: any = [{
            name: "",
            link: "/profile/{externalId}",
            values: getValues(data, "/profile/{externalId}", learnerProfilePhotoToggleEnabled)
          }];

          setIsLoading(false);
          setSuggestions(dataItems);
 /* eslint-disable */
          setSuggestionsResult((suggestionsResult: IPupilSuggestions[]) => [...suggestionsResult, {
            pupilSearched: suggestionValue,
            suggestions: dataItems
          }]);
           /* eslint-enable */
        })
        .catch((error: Error) => {
          setIsLoading(false);
          setSuggestions([]);
          console.log(error);
        });
    }
    else {
      setIsLoading(false);
      setSuggestions([]);
    }
  };
  

  return (
    <SearchView
      handleKeyPress={onKeyPress}
      // boxStyle={boxStyle || SearchBoxStyle.Large}
      value={value}
      setValue={setValue}
      suggestions={suggestions}
      isLoading={isLoading}
      setSuggestions={setSuggestions}
      onChange={onChange}
      handleOnChange={onKeyPress}      
      
    />
  );
};

// Search.defaultProps = {
//   boxStyle: SearchBoxStyle.Large
// };

export default Search;
export function getValues(data: ISearchSuggestionsResultsApiResponse[], redirectLink: string, learnerProfilePhotoToggleEnabled: boolean): Array<{
  icon: JSX.Element,
  text: string,
  props: {
    externalId: string,
    link: string,
    name: string
  },
  value: JSX.Element
}> {
  return data.map((v: any) => ({
    icon: (
      <>{(v.imagePath === "" || !learnerProfilePhotoToggleEnabled) &&
        <Icon
          name="user--filled"
          size={IconSize.Large}
          color={IconColor.Neutral400}
        />
        ||
        <img src={v.imagePath} alt="" className="elr-search__profile-icon" />
      }
      </>
    ),
    text: `${v.preferredForename || v.legalForename} ${v.preferredSurname}  (${v.legalForename} ${v.legalSurname})`,
    props: {
      externalId: v.learnerExternalId,
      link: redirectLink.replace("{externalId}", v.learnerExternalId),
      name: `${v.preferredForename} ${v.preferredSurname}  (${v.legalForename} ${v.legalSurname})`
    },    
     value: (<Tag text={getClassDetails({ yearGroup: v.yearGroup, classGroup: v.classGroup })} color={TagColor.Warning} size={TagSize.Small} />)
  }));
}

