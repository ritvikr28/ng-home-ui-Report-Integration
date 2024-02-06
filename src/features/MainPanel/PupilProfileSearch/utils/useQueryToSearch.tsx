import React,{ useEffect } from "react";
import searchInputValidation, { SearchInputProps } from "./SearchInputValidation";

const useEffectForSearchQuery: any = (searchedName: string,setUserInput:React.Dispatch<React.SetStateAction<string>>) => {

 // const dispatch: Dispatch<AnyAction> = useDispatch();
    
  useEffect(() => {
    if (searchedName) {
      const result: SearchInputProps = searchInputValidation(searchedName);
      if (result.invalid) {
        setUserInput(searchedName);
        // dispatch(searchInputSlice.actions.setError({ value: searchedName, error: true }));
        return;
      }
      if (result.error)
      setUserInput(searchedName);
        // dispatch(searchInputSlice.actions.setError({ value: searchedName, error: true }));
      else {
        setUserInput(searchedName);
       // dispatch(searchInputSlice.actions.setUserInput({ value: searchedName.trim() }));
      }
    }
  }, [searchedName]);
};

export default useEffectForSearchQuery;