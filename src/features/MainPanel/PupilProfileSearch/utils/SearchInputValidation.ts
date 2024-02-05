export type SearchInputProps = {
  invalid?: boolean,
  error?: boolean
}

export const searchInputValidation = (value: string): SearchInputProps => {
  let invalidity: boolean = false;
  let errorStatus: boolean = false;

  if (value === "") {
    invalidity = true;
    return ({ invalid: invalidity, error: errorStatus });
  }

  const userInput: string[] = value.split(" ");
  let iterator: number = userInput.length;
  let minLengthGreaterThanTwo: boolean = false;

  while (iterator && !invalidity && !errorStatus) {
    iterator -= 1;
    if (userInput[iterator].length >= 2) {
      minLengthGreaterThanTwo = true;
    }
    if (userInput[iterator] !== "") {
      if (userInput[iterator].match(/[`!@#$%^&*()_+=[\]{};:"\\|,.<>/?~]/)) {
        invalidity = true; break;
      }
      if (!userInput[iterator].match(/^[a-zA-Z-']+$/)) {
        errorStatus = true; break;
      }
    }
  }
  if (minLengthGreaterThanTwo === false) {
    errorStatus = true;
  }
  return ({ invalid: invalidity, error: errorStatus });
};

export default searchInputValidation;