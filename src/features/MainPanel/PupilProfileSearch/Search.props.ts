import React from "react";
import { Suggestion } from "@essnextgen/ui-kit";

  
export interface ISearchViewProps {
    value: string,
    handleKeyPress: (e: React.SyntheticEvent<EventTarget>) => void;
    // boxStyle: SearchBoxStyle;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    suggestions: Array<Suggestion>;
    isLoading: boolean;
    setSuggestions: React.Dispatch<React.SetStateAction<Array<Suggestion>>>;
    onChange: (e: string) => void    
    handleOnChange: (e: React.SyntheticEvent<EventTarget>) => void;
    isOpen?:any;
  }