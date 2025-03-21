// utils/addPunctuation.ts
export function addPunctuation(text: string): string {
    // Add a period at the end if the text doesn't already end with punctuation
    if (!/[.!?]$/.test(text)) {
      return text + '.';
    }
    return text;
  }