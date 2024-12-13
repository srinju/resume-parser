import type { TextItem, FeatureSet } from "lib/parse-resume-from-pdf/types";
import { FRENCH_MONTHS } from "../../constants/french";

const isTextItemBold = (fontName: string) =>
  fontName.toLowerCase().includes("bold");

export const isBold = (item: TextItem) => isTextItemBold(item.fontName);
export const hasLetter = (item: TextItem) => /[a-zA-ZÀ-ÿ]/.test(item.text);
export const hasNumber = (item: TextItem) => /[0-9]/.test(item.text);
export const hasComma = (item: TextItem) => item.text.includes(",");
export const getHasText = (text: string) => (item: TextItem) =>
  item.text.includes(text);

// Enhanced regex to include French characters
export const hasOnlyLettersSpacesAmpersands = (item: TextItem) =>
  /^[A-Za-zÀ-ÿ\s&'-]+$/.test(item.text);

export const hasLetterAndIsAllUpperCase = (item: TextItem) =>
  hasLetter(item) && item.text.toUpperCase() === item.text;

// Date Features
const hasYear = (item: TextItem) => /(?:19|20)\d{2}/.test(item.text);

// Include both English and French months
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June', 
  'July', 'August', 'September', 'October', 'November', 'December',
  ...FRENCH_MONTHS
];

const hasMonth = (item: TextItem) =>
  MONTHS.some(
    (month) =>
      item.text.toLowerCase().includes(month.toLowerCase()) || 
      item.text.toLowerCase().includes(month.slice(0, 3).toLowerCase())
  );

// Include French seasons
const SEASONS = [
  "Summer", "Fall", "Spring", "Winter",
  "Été", "Automne", "Printemps", "Hiver"
];

const hasSeason = (item: TextItem) =>
  SEASONS.some((season) => 
    item.text.toLowerCase().includes(season.toLowerCase())
  );

const hasPresent = (item: TextItem) => 
  item.text.toLowerCase().includes("present") || 
  item.text.toLowerCase().includes("présent") ||
  item.text.toLowerCase().includes("actuel");

const matchFrenchDate = (item: TextItem) => {
  const frenchMonthPattern = FRENCH_MONTHS.join('|');
  const pattern = new RegExp(`(${frenchMonthPattern}|[a-zéû]+\\.?)\\s+\\d{4}`, 'i');
  return item.text.toLowerCase().match(pattern);
};

const matchDate = (item: TextItem) => {
  // Enhanced pattern to match various date formats
  const patterns = [
    // English format: January 2020 or Jan 2020
    /(?:\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\b|\d{1,2}\/)\s*\d{4}/i,
    // French format: janvier 2020 or janv. 2020
    /(?:\b(?:janv(?:ier)?|févr(?:ier)?|mars|avr(?:il)?|mai|juin|juil(?:let)?|août|sept(?:embre)?|oct(?:obre)?|nov(?:embre)?|déc(?:embre)?)\b|\d{1,2}\/)\s*\d{4}/i,
    // Numeric formats
    /\d{2}[-/.]\d{2}[-/.]\d{4}/,
    /\d{4}[-/.]\d{2}[-/.]\d{2}/
  ];

  for (const pattern of patterns) {
    const match = item.text.match(pattern);
    if (match) return match;
  }
  return null;
};

export const DATE_FEATURE_SETS: FeatureSet[] = [
  [matchDate, 4, true],
  [matchFrenchDate, 4, true],
  [hasNumber, 2],
  [hasYear, 2],
];

// Simple phone regex that matches (xxx)-xxx-xxxx where () and - are optional, - can also be space
export const matchPhone = (item: TextItem) =>
  item.text.match(/\(?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}/) || // French format
  item.text.match(/\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/); // Original format
