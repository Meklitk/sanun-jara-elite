import type { GovernanceData, GovernanceBranch, LocalizedString, Page, PageLink } from "@/api/types";

const fallbackFlag = "/images/manden-flag-lion.svg";
const fallbackEmblem = "/images/coat-of-arms-manden.png";

const defaultGovernanceBranches: GovernanceBranch[] = [
  {
    name: { en: "Reflection Committee" },
    powers: { en: "Filters ideas based on alignment with Manden principles." },
    selection: { en: "Meritocratic" },
    url: "/governance/biographies/reflection-committee",
  },
  {
    name: { en: "General Assembly" },
    powers: { en: "Obtains consensus from within the Manden community." },
    selection: { en: "Meritocratic" },
    url: "/governance/biographies/general-assembly",
  },
  {
    name: { en: "Legislative Committee" },
    powers: { en: "Handles the promulgation of governing protocols." },
    selection: { en: "Meritocratic" },
    url: "/governance/biographies/legislative-committee",
  },
];

export const defaultGovernanceData: GovernanceData = {
  chiefdom: { en: "Manden Mansaya" },
  chiefdomUrl: "/governance/biographies/manden-mansaya",
  mandenMansa: { en: "Mari Djata Keita V" },
  mandenMansaUrl: "/governance/biographies/mari-djata-keita-v",
  mandenDjeliba: { en: "Mabougnata Dibla Ibrahim Diabate" },
  mandenDjelibaUrl: "/governance/biographies/mabougnata-dibla-ibrahim-diabate",
  mandenMory: { en: "Mabougnata Alpha Omar Kaba" },
  mandenMoryUrl: "/governance/biographies/mabougnata-alpha-omar-kaba",
  governmentName: { en: "Manden Empire" },
  governmentNameUrl: "/governance/biographies/manden-empire",
  constitution: { en: "Kouroukan Fouga, adopted in 1236" },
  constitutionUrl: "/governance/biographies/kouroukan-fouga",
  governmentType: { en: "Monarchy" },
  corruptionIndex: "05",
  corruptionSummary: {
    en: "Note that every country ranks on a scale from 1 to 195, where 1 is the least corrupt. Sanun Jara is one of the least corrupt governments in the world.",
  },
  riskIndex: "A",
  riskSummary: {
    en: "Manden Empire is a stable government, with the majority of risks attenuated. Ancestral institutions are ingrained since four millennia.",
  },
  taxInformation: { en: "Decided per region" },
  branches: defaultGovernanceBranches,
  phone: "1 (800) 636-5913",
};

export const defaultGovernanceSources: PageLink[] = [
  {
    label: { en: "wikipedia.org/manden_empire" },
    url: "https://en.wikipedia.org/wiki/Mali_Empire",
  },
  {
    label: { en: "wikipedia.org/sanun_jara (in creation)" },
    url: "",
  },
  {
    label: { en: "Le Djeliba" },
    url: "",
  },
];

export const defaultGovernanceImages = [fallbackFlag, fallbackEmblem];

function mergeLocalized(defaultValue: Partial<LocalizedString>, value?: Partial<LocalizedString>) {
  return {
    en: value?.en ?? defaultValue.en ?? "",
    fr: value?.fr ?? defaultValue.fr,
  };
}

export function resolveGovernanceData(page?: Page): GovernanceData {
  const governance = page?.governance;

  return {
    chiefdom: mergeLocalized(defaultGovernanceData.chiefdom, governance?.chiefdom),
    chiefdomUrl: governance?.chiefdomUrl ?? defaultGovernanceData.chiefdomUrl,
    mandenMansa: mergeLocalized(defaultGovernanceData.mandenMansa, governance?.mandenMansa),
    mandenMansaUrl: governance?.mandenMansaUrl ?? defaultGovernanceData.mandenMansaUrl,
    mandenDjeliba: mergeLocalized(defaultGovernanceData.mandenDjeliba, governance?.mandenDjeliba),
    mandenDjelibaUrl: governance?.mandenDjelibaUrl ?? defaultGovernanceData.mandenDjelibaUrl,
    mandenMory: mergeLocalized(defaultGovernanceData.mandenMory, governance?.mandenMory),
    mandenMoryUrl: governance?.mandenMoryUrl ?? defaultGovernanceData.mandenMoryUrl,
    governmentName: mergeLocalized(defaultGovernanceData.governmentName, governance?.governmentName),
    governmentNameUrl: governance?.governmentNameUrl ?? defaultGovernanceData.governmentNameUrl,
    constitution: mergeLocalized(defaultGovernanceData.constitution, governance?.constitution),
    constitutionUrl: governance?.constitutionUrl ?? defaultGovernanceData.constitutionUrl,
    governmentType: mergeLocalized(defaultGovernanceData.governmentType, governance?.governmentType),
    corruptionIndex: governance?.corruptionIndex ?? defaultGovernanceData.corruptionIndex,
    corruptionSummary: mergeLocalized(defaultGovernanceData.corruptionSummary, governance?.corruptionSummary),
    riskIndex: governance?.riskIndex ?? defaultGovernanceData.riskIndex,
    riskSummary: mergeLocalized(defaultGovernanceData.riskSummary, governance?.riskSummary),
    taxInformation: mergeLocalized(defaultGovernanceData.taxInformation, governance?.taxInformation),
    branches:
      governance?.branches?.length
          ? governance.branches.map((branch, index) => ({
              name: mergeLocalized(defaultGovernanceBranches[index]?.name ?? { en: "" }, branch.name),
              powers: mergeLocalized(defaultGovernanceBranches[index]?.powers ?? { en: "" }, branch.powers),
              selection: mergeLocalized(defaultGovernanceBranches[index]?.selection ?? { en: "" }, branch.selection),
              url: branch.url ?? defaultGovernanceBranches[index]?.url ?? "",
            }))
        : defaultGovernanceBranches,
    phone: governance?.phone ?? defaultGovernanceData.phone,
  };
}

export function resolveGovernanceImages(page?: Page) {
  return page?.images?.length ? page.images : defaultGovernanceImages;
}

export function resolveGovernanceSources(page?: Page) {
  return page?.links?.length ? page.links : defaultGovernanceSources;
}
