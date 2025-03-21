// utils/grammarCorrection.ts

export async function correctGrammarWithLanguageTool(text: string, language: string): Promise<string> {
    type Language = {
      name: string;
      code: string;
      longCode: string;
    };
    
    function isLongCodeAvailable(longCode: string, languages: Language[]): boolean {
      return languages.some(lang => lang.longCode === longCode);
    }
    
    // Example usage:
    const languages: Language[] = [
      {
        "name": "German",
        "code": "de",
        "longCode": "de"
      },
      {
        "name": "German (Germany)",
        "code": "de",
        "longCode": "de-DE"
      },
      {
        "name": "German (Austria)",
        "code": "de",
        "longCode": "de-AT"
      },
      {
        "name": "German (Swiss)",
        "code": "de",
        "longCode": "de-CH"
      },
      {
        "name": "English",
        "code": "en",
        "longCode": "en"
      },
      {
        "name": "English (US)",
        "code": "en",
        "longCode": "en-US"
      },
      {
        "name": "English (Australian)",
        "code": "en",
        "longCode": "en-AU"
      },
      {
        "name": "English (GB)",
        "code": "en",
        "longCode": "en-GB"
      },
      {
        "name": "English (Canadian)",
        "code": "en",
        "longCode": "en-CA"
      },
      {
        "name": "English (New Zealand)",
        "code": "en",
        "longCode": "en-NZ"
      },
      {
        "name": "English (South African)",
        "code": "en",
        "longCode": "en-ZA"
      },
      {
        "name": "Spanish",
        "code": "es",
        "longCode": "es"
      },
      {
        "name": "Spanish (voseo)",
        "code": "es",
        "longCode": "es-AR"
      },
      {
        "name": "French",
        "code": "fr",
        "longCode": "fr"
      },
      {
        "name": "French (Canada)",
        "code": "fr",
        "longCode": "fr-CA"
      },
      {
        "name": "French (Switzerland)",
        "code": "fr",
        "longCode": "fr-CH"
      },
      {
        "name": "French (Belgium)",
        "code": "fr",
        "longCode": "fr-BE"
      },
      {
        "name": "Dutch",
        "code": "nl",
        "longCode": "nl"
      },
      {
        "name": "Dutch (Belgium)",
        "code": "nl",
        "longCode": "nl-BE"
      },
      {
        "name": "Portuguese (Angola preAO)",
        "code": "pt",
        "longCode": "pt-AO"
      },
      {
        "name": "Portuguese (Brazil)",
        "code": "pt",
        "longCode": "pt-BR"
      },
      {
        "name": "Portuguese (Moçambique preAO)",
        "code": "pt",
        "longCode": "pt-MZ"
      },
      {
        "name": "Portuguese (Portugal)",
        "code": "pt",
        "longCode": "pt-PT"
      },
      {
        "name": "Portuguese",
        "code": "pt",
        "longCode": "pt"
      },
      {
        "name": "Arabic",
        "code": "ar",
        "longCode": "ar"
      },
      {
        "name": "Asturian",
        "code": "ast",
        "longCode": "ast-ES"
      },
      {
        "name": "Belarusian",
        "code": "be",
        "longCode": "be-BY"
      },
      {
        "name": "Breton",
        "code": "br",
        "longCode": "br-FR"
      },
      {
        "name": "Catalan",
        "code": "ca",
        "longCode": "ca-ES"
      },
      {
        "name": "Catalan (Valencian)",
        "code": "ca",
        "longCode": "ca-ES-valencia"
      },
      {
        "name": "Catalan (Balearic)",
        "code": "ca",
        "longCode": "ca-ES-balear"
      },
      {
        "name": "Danish",
        "code": "da",
        "longCode": "da-DK"
      },
      {
        "name": "Simple German",
        "code": "de-DE-x-simple-language",
        "longCode": "de-DE-x-simple-language"
      },
      {
        "name": "Greek",
        "code": "el",
        "longCode": "el-GR"
      },
      {
        "name": "Esperanto",
        "code": "eo",
        "longCode": "eo"
      },
      {
        "name": "Persian",
        "code": "fa",
        "longCode": "fa"
      },
      {
        "name": "Irish",
        "code": "ga",
        "longCode": "ga-IE"
      },
      {
        "name": "Galician",
        "code": "gl",
        "longCode": "gl-ES"
      },
      {
        "name": "Italian",
        "code": "it",
        "longCode": "it"
      },
      {
        "name": "Japanese",
        "code": "ja",
        "longCode": "ja-JP"
      },
      {
        "name": "Khmer",
        "code": "km",
        "longCode": "km-KH"
      },
      {
        "name": "Polish",
        "code": "pl",
        "longCode": "pl-PL"
      },
      {
        "name": "Romanian",
        "code": "ro",
        "longCode": "ro-RO"
      },
      {
        "name": "Russian",
        "code": "ru",
        "longCode": "ru-RU"
      },
      {
        "name": "Slovak",
        "code": "sk",
        "longCode": "sk-SK"
      },
      {
        "name": "Slovenian",
        "code": "sl",
        "longCode": "sl-SI"
      },
      {
        "name": "Swedish",
        "code": "sv",
        "longCode": "sv"
      },
      {
        "name": "Tamil",
        "code": "ta",
        "longCode": "ta-IN"
      },
      {
        "name": "Tagalog",
        "code": "tl",
        "longCode": "tl-PH"
      },
      {
        "name": "Ukrainian",
        "code": "uk",
        "longCode": "uk-UA"
      },
      {
        "name": "Chinese",
        "code": "zh",
        "longCode": "zh-CN"
      },
      {
        "name": "Crimean Tatar",
        "code": "crh",
        "longCode": "crh-UA"
      },
      {
        "name": "Norwegian (Bokmål)",
        "code": "nb",
        "longCode": "nb"
      },
      {
        "name": "Norwegian (Bokmål)",
        "code": "no",
        "longCode": "no"
      },
      {
        "name": "Dutch",
        "code": "nl",
        "longCode": "nl-NL"
      },
      {
        "name": "Simple German",
        "code": "de-DE-x-simple-language",
        "longCode": "de-DE-x-simple-language-DE"
      },
      {
        "name": "Spanish",
        "code": "es",
        "longCode": "es-ES"
      },
      {
        "name": "Italian",
        "code": "it",
        "longCode": "it-IT"
      },
      {
        "name": "Persian",
        "code": "fa",
        "longCode": "fa-IR"
      },
      {
        "name": "Swedish",
        "code": "sv",
        "longCode": "sv-SE"
      },
      {
        "name": "German",
        "code": "de",
        "longCode": "de-LU"
      },
      {
        "name": "French",
        "code": "fr",
        "longCode": "fr-FR"
      }
    ];

    if ( isLongCodeAvailable(language, languages) ) {
      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          text,
          language,
        }),
      });
    
      const data = await response.json();
    
      if (data.matches && data.matches.length > 0) {
        // Apply grammar corrections
        let correctedText = text;
        for (const match of data.matches.reverse()) {
          const replacement = match.replacements[0]?.value || '';
          correctedText =
            correctedText.slice(0, match.offset) +
            replacement +
            correctedText.slice(match.offset + match.length);
        }
        return correctedText;
      }
    }
  
    // If no errors, return the original text
    return text;
  }