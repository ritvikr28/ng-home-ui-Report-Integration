import dayjs from "dayjs";

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

export const isValidDate = (dateStr: string) => {
        if (!dayjs(dateStr, "YYYY-MM-DD", true).isValid()) return false;
        const [year, month, day] = dateStr.split("-").map(Number);
        return (
            year >= 1900 && year <= 2100 &&
            month >= 1 && month <= 12 &&
            day >= 1 && day <= 31
        );
        };