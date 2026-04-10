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
};

export type GovernanceData = {
  chiefdom: Partial<LocalizedString>;
  mandenMansa: Partial<LocalizedString>;
  mandenDjeliba: Partial<LocalizedString>;
  mandenMory: Partial<LocalizedString>;
  governmentName: Partial<LocalizedString>;
  constitution: Partial<LocalizedString>;
  governmentType: Partial<LocalizedString>;
  corruptionIndex: string;
  corruptionSummary: Partial<LocalizedString>;
  riskIndex: string;
  riskSummary: Partial<LocalizedString>;
  taxInformation: Partial<LocalizedString>;
  branches: GovernanceBranch[];
  phone: string;
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
};

