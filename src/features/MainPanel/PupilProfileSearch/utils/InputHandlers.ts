import searchInputValidation, {
  SearchInputProps
} from "./SearchInputValidation";

export interface IHandleKeyPressProps {
  e: any;
  inputText: string;
  pagePath: string;
}

export const handleKeyPress: (
  props: IHandleKeyPressProps,
  inputValue: string
) => boolean = (props: IHandleKeyPressProps, inputValue: string) => {
  const { e, inputText, pagePath }: IHandleKeyPressProps = props;
  const userInput: string = inputValue.trim();
  let searchValidity: boolean;

  if (pagePath === "/search") searchValidity = userInput !== inputText;
  else searchValidity = true;

  if ((e.key === "Enter" || e.type === "click") && searchValidity) {
    const result: SearchInputProps = searchInputValidation(userInput);
    if (result.invalid) {
      // dispatch(searchInputSlice.actions.setError({ value: userInput, error: true }));
      return false;
    }
    if (result.error && !result.invalid) console.log("error", true);

    return true;
  }
  return false;
};
