export type Lang = "en" | "fr";

export type LocalizedString = {
  en: string;
  fr?: string;
};

export type PageLink = {
  label: Partial<LocalizedString>;
  url: string;
};

export type TimelineItem = {
  year: string;
  title: Partial<LocalizedString>;
  description: Partial<LocalizedString>;
  url?: string;
};

export type MediaItem = {
  url: string;
  title: string;
  type: "video" | "audio" | "document";
  category: "djelis" | "donsos" | "journalists" | "other";
};

export type GovernanceBranch = {
  name: Partial<LocalizedString>;
  powers: Partial<LocalizedString>;
  selection: Partial<LocalizedString>;
  url?: string;
};

export type GovernanceData = {
  chiefdom: Partial<LocalizedString>;
  chiefdomUrl?: string;
  mandenMansa: Partial<LocalizedString>;
  mandenMansaUrl?: string;
  mandenDjeliba: Partial<LocalizedString>;
  mandenDjelibaUrl?: string;
  mandenMory: Partial<LocalizedString>;
  mandenMoryUrl?: string;
  governmentName: Partial<LocalizedString>;
  governmentNameUrl?: string;
  constitution: Partial<LocalizedString>;
  constitutionUrl?: string;
  governmentType: Partial<LocalizedString>;
  corruptionIndex: string;
  corruptionSummary: Partial<LocalizedString>;
  riskIndex: string;
  riskSummary: Partial<LocalizedString>;
  taxInformation: Partial<LocalizedString>;
  branches: GovernanceBranch[];
  phone: string;
};

export type DirectoryItem = {
  name: Partial<LocalizedString>;
  description: Partial<LocalizedString>;
};

export type DirectoryData = {
  countries: DirectoryItem[];
  organizations: DirectoryItem[];
};

export type UtilityCard = {
  id: string;
  title: Partial<LocalizedString>;
  description: Partial<LocalizedString>;
  url?: string;
};

export type BiographyItem = {
  slug: string;
  name: Partial<LocalizedString>;
  role: Partial<LocalizedString>;
  kind: "person" | "institution";
  content: Partial<LocalizedString>;
  images: string[];
  meta?: Array<{ label: Partial<LocalizedString>; value: Partial<LocalizedString> }>;
};

export type EconomyTableRow = {
  label: Partial<LocalizedString>;
  value: Partial<LocalizedString>;
  description?: Partial<LocalizedString>;
};

export type EconomyTable = {
  title: Partial<LocalizedString>;
  description?: Partial<LocalizedString>;
  rows: EconomyTableRow[];
};

export type EconomyData = {
  transferServices?: EconomyTable;
  recommendationLetters?: EconomyTable;
  duesSystem?: EconomyTable;
  currencyInfo?: Partial<LocalizedString>;
  bankInfo?: Partial<LocalizedString>;
};

export type Page = {
  _id: string;
  key: string;
  title: Partial<LocalizedString>;
  content: Partial<LocalizedString>;
  images: string[];
  links: PageLink[];
  timeline?: TimelineItem[];
  governance?: GovernanceData;
  media?: MediaItem[];
  directory?: DirectoryData;
  economy?: EconomyData;
  utilityCards?: UtilityCard[];
  biographies?: BiographyItem[];
};

export type Content = {
  _id: string;
  slug: string;
  title: Partial<LocalizedString>;
  content: Partial<LocalizedString>;
  icon: string;
  order: number;
  images: string[];
  links: PageLink[];
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};
