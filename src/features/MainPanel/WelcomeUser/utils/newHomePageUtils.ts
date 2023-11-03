export const capitalizeFirstLetterOfEachWord = (text: string): string => 
    text.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');