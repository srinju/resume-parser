import type { TextItem, FeatureSet } from "lib/parse-resume-from-pdf/types";
import { FRENCH_MONTHS } from "../../constants/french";

const isTextItemBold = (fontName: string) =>
  fontName.toLowerCase().includes("bold");
export const isBold = (item: TextItem) => isTextItemBold(item.fontName);
export const hasLetter = (item: TextItem) => /[a-zA-Z]/.test(item.text);
export const hasNumber = (item: TextItem) => /[0-9]/.test(item.text);
export const hasComma = (item: TextItem) => item.text.includes(",");
export const getHasText = (text: string) => (item: TextItem) =>
  item.text.includes(text);
export const hasOnlyLettersSpacesAmpersands = (item: TextItem) =>
  /^[A-Za-z\s&]+$/.test(item.text);
export const hasLetterAndIsAllUpperCase = (item: TextItem) =>
  hasLetter(item) && item.text.toUpperCase() === item.text;

// Date Features
const hasYear = (item: TextItem) => /(?:19|20)\d{2}/.test(item.text);
// prettier-ignore
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const hasMonth = (item: TextItem) =>
  MONTHS.some(
    (month) =>
      item.text.includes(month) || item.text.includes(month.slice(0, 4))
  );
const SEASONS = ["Summer", "Fall", "Spring", "Winter"];
const hasSeason = (item: TextItem) =>
  SEASONS.some((season) => item.text.includes(season));
const hasPresent = (item: TextItem) => item.text.includes("Present");

const matchFrenchDate = (item: TextItem) => {
  // Match patterns like "janvier 2020" or "jan. 2020 - présent"
  const frenchMonthPattern = FRENCH_MONTHS.join('|');
  const pattern = new RegExp(`(${frenchMonthPattern}|[a-zéû]+\\.?)\\s+\\d{4}`);
  return item.text.toLowerCase().match(pattern);
};

const matchDate = (item: TextItem) => {
  // Match patterns like "January 2020" or "Jan 2020" or "01/2020"
  const pattern = /(?:\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\b|\d{1,2}\/)\s*\d{4}/i;
  return item.text.match(pattern);
};

export const DATE_FEATURE_SETS: FeatureSet[] = [
  [matchDate, 4, true],
  [matchFrenchDate, 4, true],
  [hasNumber, 2],
  [hasYear, 2],
];
