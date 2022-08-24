/* eslint-disable quote-props,quotes */
const AF = 'af'; const AM = 'am'; const AR = 'ar'; const AZ = 'az-AZ'; const BE = 'be';
const BG = 'bg'; const BN_BD = 'bn-BD'; const CA = 'ca'; const CS_ZK = 'cs-ZK';
const DA_DK = 'da-DK'; const DE_DE = 'de-DE'; const IW_IL = 'iw_IL';
const EL_GR = 'el-GR'; const EN_US = 'en-US'; const EN_AU = 'en-AU'; const EN_CA = 'en-CA';
const EN_GB = 'en-GB'; const ES419 = 'es-419'; const ESES = 'es-ES'; const ESUS = 'es-US';
const ET = 'et'; const EU_ES = 'eu-ES'; const FA = 'fa'; const FI_FI = 'fi-FI'; const FJ = 'fj';
const FR_CA = 'fr-CA'; const FR_FR = 'fr-fr'; const MY_MM = 'my-MM'; const HR = 'hr';
const NL_NL = 'nl-NL'; const FIL = 'fil'; const GL_ES = 'gl-ES'; const KA_GE = 'ka-GE';
const HY = 'hy-AM'; const ZH_HK = 'zh-HK'; const ZH_CN = 'zh-CN'; const ZH_TW = 'zh-TW';
const HI_IN = 'hi_IN'; const HU_HU = 'hu-HU'; const IS_IS = 'is-IS'; const ID = 'id';
const IT_IT = 'it-IT'; const JA_JP = 'ja-JP'; const KN_IN = 'kn-IN'; const KZ = 'kz';
const KM_KH = 'km-KH'; const KO_KR = 'ko-KR'; const KY_KG = 'ko-KG'; const LO_LA = 'lo-LA';
const LV = 'lv'; const MK_MK = 'mk'; const MS = 'MS'; const MS_MY = 'ms-MY'; const ML_IN = 'ml-IN';
const LT = 'lt'; const MN_IN = 'mn-IN'; const MN_MN = 'mn-MN'; const NE_NP = 'ne-NP';
const NO_NO = 'no-NO'; const PL_PL = 'pl-PL'; const PT_BR = 'pt-BR'; const PT_PT = 'pt-PT';
const PA = 'PA'; const RO = 'ro'; const RM = 'rm'; const RU_RU = 'ru-RU'; const SR = 'sr';
const SI_LK = 'si-LK'; const SK = 'sk'; const SL = 'sl'; const SW = 'sw'; const SV_SE = 'sv-SE';
const TA_IN = 'ta-IN'; const TE_IN = 'te-IN'; const TH = 'th'; const TR_TR = 'tr-TR';
const UK = 'uk'; const VI = 'vi'; const ZU = 'zu';

const LANGUAGES_ENUM = [AF, AM, AR, AZ, BE, BG, BN_BD, CA, CS_ZK, DA_DK, DE_DE, EL_GR, EN_US,
    EN_AU, EN_CA, EN_GB, ES419, ESES, ESUS, ET, EU_ES, FA, FI_FI, FJ, FR_CA, FR_FR, FIL, GL_ES,
    HU_HU, HY, ID, IT_IT, JA_JP, KA_GE, KZ, KM_KH, KN_IN, KO_KR, KY_KG, LO_LA, LT, MK_MK, ML_IN,
    MN_IN, NE_NP, NL_NL, NO_NO, PA, PL_PL, PT_PT, PT_BR, RM, RO, RU_RU, SI_LK, SK, SL, SR, SV_SE,
    SW, TA_IN, TE_IN, TH, TR_TR, UK, VI, ZH_HK, ZH_CN, ZH_TW, IS_IS, ZU, HI_IN, HR];

const LANGUAGES = {
    [AF]: "Afrikaans",
    [AM]: "Amharic",
    [AR]: "Arabic",
    [HY]: "Armenian",
    [AZ]: "Azerbaijani",
    [BN_BD]: "Bangla",
    [EU_ES]: "Basque",
    [BE]: "Belarusian",
    [BG]: "Bulgarian",
    [MY_MM]: "Burmese",
    [CA]: "Catalan",
    [ZH_HK]: "Chinese (Hong Kong)",
    [ZH_CN]: "Chinese (Simplified)",
    [ZH_TW]: "Chinese (Traditional)",
    [HR]: "Croatian",
    [CS_ZK]: "Czech",
    [DA_DK]: "Danish",
    [NL_NL]: "Dutch",
    [EN_US]: "English",
    [EN_AU]: "English (Australia)",
    [EN_CA]: "English (Canada)",
    [EN_GB]: "English (United Kingdom)",
    [ET]: "Estonian",
    [FIL]: "Filipino",
    [FI_FI]: "Finnish",
    [FR_CA]: "French",
    [FR_FR]: "French (Canada)",
    [GL_ES]: "Galician",
    [KA_GE]: "Georgian",
    [DE_DE]: "German",
    [EL_GR]: "Greek",
    [IW_IL]: "Hebrew",
    [HI_IN]: "Hindi",
    [HU_HU]: "Hungarian",
    [IS_IS]: "Icelandic",
    [ID]: "Indonesian",
    [IT_IT]: "Italian",
    [JA_JP]: "Japanese",
    [KN_IN]: "Kannada",
    [KZ]: "Kazakh",
    [KM_KH]: "Khmer",
    [KO_KR]: "Korean (South Korea)",
    [KY_KG]: "Kyrgyz",
    [LO_LA]: "Lao",
    [LV]: "Latvian",
    [LT]: "Lithuanian",
    [MK_MK]: "Macedonian",
    [MS]: "Malay",
    [MS_MY]: "Malay (Malaysia)",
    [ML_IN]: "Malayalam",
    [MN_IN]: "Marathi",
    [MN_MN]: "Mongolian",
    [NE_NP]: "Nepali",
    [NO_NO]: "Norwegian",
    [FA]: "Persian",
    [PL_PL]: "Polish",
    [PT_BR]: "Portuguese (Brazil)",
    [PT_PT]: "Portuguese (Portugal)",
    [PA]: "Punjabi",
    [RO]: "Romanian",
    [RM]: "Romansh",
    [RU_RU]: "Russian",
    [SR]: "Serbian",
    [SI_LK]: "Sinhala",
    [SK]: "Slovak",
    [SL]: "Slovenian",
    [ES419]: "Spanish (Latin America)",
    [ESES]: "Spanish (Spain)",
    [ESUS]: "Spanish (United States)",
    [SW]: "Swahili",
    [SV_SE]: "Swedish",
    [TA_IN]: "Tamil",
    [TE_IN]: "Telugu",
    [TH]: "Thai",
    [TR_TR]: "Turkish",
    [UK]: "Ukrainian",
    [VI]: "Vietnamese",
    [ZU]: "Zulu – zu",
};

module.exports = {
    LANGUAGES_ENUM,
    LANGUAGES,
};