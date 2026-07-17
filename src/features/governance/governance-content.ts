import type { GovernanceData, GovernanceBranch, LocalizedString, Page, PageLink } from "@/api/types";

const fallbackFlag = "/images/manden-flag-lion.svg";
const fallbackEmblem = "/images/coat-of-arms-manden.png";

const defaultGovernanceBranches: GovernanceBranch[] = [
  {
    name: { en: "Reflection Committee", fr: "Comité de réflexion" },
    powers: {
      en: "Filters ideas based on alignment with Manden principles.",
      fr: "Filtre les idées selon leur alignement avec les principes du Manden.",
    },
    selection: { en: "Meritocratic", fr: "Méritocratique" },
    url: "/government/reflection",
  },
  {
    name: { en: "General Assembly", fr: "Assemblée générale" },
    powers: {
      en: "Obtains consensus from within the Manden community.",
      fr: "Obtient le consensus au sein de la communauté du Manden.",
    },
    selection: { en: "Meritocratic", fr: "Méritocratique" },
    url: "/government/general-assembly",
  },
  {
    name: { en: "Legislative Committee", fr: "Comité législatif" },
    powers: {
      en: "Handles the promulgation of governing protocols.",
      fr: "Gère la promulgation des protocoles de gouvernance.",
    },
    selection: { en: "Meritocratic", fr: "Méritocratique" },
    url: "/government/legislative",
  },
  {
    name: { en: "Disciplinary Committee", fr: "Comité de discipline" },
    powers: {
      en: "Oversees enforcement of institutional discipline and conduct standards.",
      fr: "Supervise l'application de la discipline institutionnelle et des normes de conduite.",
    },
    selection: { en: "Meritocratic", fr: "Méritocratique" },
    url: "/government/disciplinary",
  },
  {
    name: { en: "Orientation Committee", fr: "Comité d'orientation" },
    powers: {
      en: "Responsible for onboarding new members, education, civic orientation, and institutional training.",
      fr: "Responsable de l'intégration des nouveaux membres, de l'éducation, de l'orientation civique et de la formation institutionnelle.",
    },
    selection: { en: "Meritocratic", fr: "Méritocratique" },
    url: "/government/orientation",
  },
  {
    name: { en: "Administration Committee", fr: "Comité d'administration" },
    powers: {
      en: "Responsible for administration, documentation, records, logistics, and organizational management.",
      fr: "Responsable de l'administration, de la documentation, des archives, de la logistique et de la gestion organisationnelle.",
    },
    selection: { en: "Meritocratic", fr: "Méritocratique" },
    url: "/government/administration",
  },
];

export const defaultGovernanceData: GovernanceData = {
  chiefdom: { en: "Manden Mansaya", fr: "Manden Mansaya" },
  chiefdomUrl: "/governance/biographies/manden-mansaya",
  mandenMansa: { en: "Mari Djata Keita V", fr: "Mari Djata Keita V" },
  mandenMansaUrl: "/governance/biographies/mari-djata-keita-v",
  mandenDjeliba: { en: "Mabougnata Djeliba Ibrahim Diabate", fr: "Mabougnata Djeliba Ibrahim Diabate" },
  mandenDjelibaUrl: "/governance/biographies/mabougnata-djeliba-ibrahim-diabate",
  mandenMory: { en: "Wana Papa Sylla", fr: "Wana Papa Sylla" },
  mandenMoryUrl: "/governance/biographies/wana-papa-sylla",
  governmentName: { en: "Manden Empire", fr: "Empire Manden" },
  governmentNameUrl: "/governance/biographies/manden-empire",
  constitution: { en: "Kouroukan Fouga, adopted in 1236", fr: "Kouroukan Fouga, adoptée en 1236" },
  constitutionUrl: "/governance/biographies/kouroukan-fouga",
  governmentType: { en: "Monarchy", fr: "Monarchie" },
  corruptionIndex: "01",
  corruptionSummary: {
    en: "Note that every country ranks on a scale from 1 to 195, where 1 is the least corrupt. Sanun Jara is one of the least corrupt governments in the world.",
    fr: "Chaque pays est classé sur une échelle de 1 à 195, où 1 est le moins corrompu. Sanun Jara est l'un des gouvernements les moins corrompus au monde.",
  },
  riskIndex: "A",
  riskSummary: {
    en: "Manden Empire is a stable government, with the majority of risks attenuated. Ancestral institutions are ingrained since four millennia.",
    fr: "L'Empire Manden est un gouvernement stable, avec la majorité des risques atténués. Les institutions ancestrales sont enracinées depuis quatre millénaires.",
  },
  taxInformation: { en: "Decided per region", fr: "Décidé par région" },
  branches: defaultGovernanceBranches,
  phone: "1 (800) 636-5913",
};

export const defaultGovernanceSources: PageLink[] = [
  {
    label: { en: "wikipedia.org/manden_empire", fr: "wikipedia.org/empire_manden" },
    url: "https://en.wikipedia.org/wiki/Mali_Empire",
  },
  {
    label: { en: "wikipedia.org/sanun_jara (in creation)", fr: "wikipedia.org/sanun_jara (en création)" },
    url: "",
  },
  {
    label: { en: "Le Djeliba", fr: "Le Djeliba" },
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
    corruptionIndex:
      governance?.corruptionIndex && governance.corruptionIndex !== "05"
        ? governance.corruptionIndex
        : defaultGovernanceData.corruptionIndex,
    corruptionSummary: mergeLocalized(defaultGovernanceData.corruptionSummary, governance?.corruptionSummary),
    riskIndex: governance?.riskIndex ?? defaultGovernanceData.riskIndex,
    riskSummary: mergeLocalized(defaultGovernanceData.riskSummary, governance?.riskSummary),
    taxInformation: mergeLocalized(defaultGovernanceData.taxInformation, governance?.taxInformation),
    branches: (() => {
      const dbBranches = governance?.branches ?? [];
      return defaultGovernanceBranches.map((defaultBranch, index) => {
        const dbBranch = dbBranches[index];
        if (!dbBranch) return defaultBranch;
        return {
          name: mergeLocalized(defaultBranch.name ?? { en: "" }, dbBranch.name),
          powers: mergeLocalized(defaultBranch.powers ?? { en: "" }, dbBranch.powers),
          selection: mergeLocalized(defaultBranch.selection ?? { en: "" }, dbBranch.selection),
          url: dbBranch.url || defaultBranch.url || "",
        };
      });
    })(),
    phone: governance?.phone ?? defaultGovernanceData.phone,
  };
}

export function resolveGovernanceImages(page?: Page) {
  return page?.images?.length ? page.images : defaultGovernanceImages;
}

export function resolveGovernanceSources(page?: Page) {
  return page?.links?.length ? page.links : defaultGovernanceSources;
}
