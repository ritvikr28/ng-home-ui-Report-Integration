export const CapitalizeFirstLetter = (str: string): string => {
  if (!str) return str;
  return str?.charAt(0)?.toUpperCase() + str?.slice(1);
}

export const truncatedString: (str: string, maxLimit: number) => {
  truncated: string;
  full: string;
} = (str: string, maxLimit: number) => {

  const truncatedDescription: string =
    str?.length > maxLimit
      ? `${str.substring(0, maxLimit)}...`
      : "";

  return {
    truncated: `${truncatedDescription} `,
    full: `${str}`
  };
};