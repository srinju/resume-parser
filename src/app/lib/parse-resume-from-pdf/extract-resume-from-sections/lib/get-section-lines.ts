import type { ResumeSectionToLines } from "lib/parse-resume-from-pdf/types";
import { FRENCH_SECTION_KEYWORDS } from "../../constants/french";

// Add type for the French keywords object
type FrenchSectionKeywordsType = typeof FRENCH_SECTION_KEYWORDS;
type FrenchSectionKey = keyof FrenchSectionKeywordsType;

/**
 * Return section lines that contain any of the keywords.
 */
export const getSectionLinesByKeywords = (
  sections: ResumeSectionToLines,
  keywords: string[]
) => {
  // Convert keywords to lowercase for case-insensitive matching
  const lowercaseKeywords = keywords.map(k => k.toLowerCase());
  
  // Add type assertion for the key
  const sectionType = Object.keys(FRENCH_SECTION_KEYWORDS).find(key => 
    FRENCH_SECTION_KEYWORDS[key as FrenchSectionKey].some(k => 
      lowercaseKeywords.includes(k.toLowerCase())
    )
  ) as FrenchSectionKey | undefined;
  
  const frenchKeywords = sectionType ? FRENCH_SECTION_KEYWORDS[sectionType] : [];
  
  // Combine English and French keywords
  const allKeywords = [...lowercaseKeywords, ...frenchKeywords.map(k => k.toLowerCase())];
  
  // Find matching sections
  const matchingSections = Object.entries(sections)
    .filter(([sectionName]) => 
      allKeywords.some(keyword => sectionName.toLowerCase().includes(keyword))
    )
    .map(([_, lines]) => lines);

  return matchingSections.flat();
};
