import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "fr";

const translations = {
  en: {
    // Nav
    introduction: "Introduction",
    history: "History",
    governance: "Governance",
    economy: "Economy",
    commerce: "Commerce",
    culture: "Culture",
    resources: "Resources",
    globalPerspectives: "Global Perspectives",
    referenceBureau: "Reference Bureau",
    academy: "Academy",
    intranet: "Intranet",
    search: "Search",
    // Intro
    introTitle: "Manden Empire",
    introSubtitle: "Sanunjara Reincarnate",
    introMotto: "Confiance · Noblesse · Persévérance",
    introP1: "Manden means 'union'. It is the amalgamation of all of the people of the land, irrespective of their nationality, ethnicity, religious or political background. The traditional chiefdom is the scaleup of the role of father, and serves the populations of all 16 countries of Manden.",
    introP2: "Sanun Jara is the administration that facilitates the reincarnation of 'Manden Mansaya.' Sanun Jara signifies 'golden lion.' Lions are not the strongest of cats, but lions are the most powerful because they are social animals. They can govern themselves due to mutual cooperation.",
    introP3: "Manden respects the Kouroukan Fouga, which is the world's first constitution that universally declares the rights of man.",
    // History
    historyTitle: "History of Manden",
    historySubtitle: "A civilization spanning millennia",
    // Governance
    governanceTitle: "Governance",
    governanceSubtitle: "Chiefdom Structure",
    flowchartTitle: "Legislative Process",
    chiefdom: "Chiefdom",
    mandenMansa: "Manden Mansa",
    mandenDjeliba: "Manden Djeliba",
    mandenMory: "Manden Mory",
    govName: "Government Name",
    constitution: "Constitution",
    govType: "Type of Government",
    monarchy: "Monarchy",
    branchesTitle: "Branches of Government",
    reflectionCommittee: "Reflection Committee",
    generalAssembly: "General Assembly",
    legislativeCommittee: "Legislative Committee",
    // Flowchart
    debut: "Start",
    reflectionCommitteeShort: "Reflection Committee",
    generalAssemblyShort: "General Assembly",
    protocolApproved: "Protocol Approved",
    // Economy
    economyTitle: "Economy",
    economyDesc: "Economic information, data analytics, service: means of transferring money, system of letters of recommendation, dues system.",
    donationsTitle: "Support Manden",
    donationsDesc: "Your contribution helps preserve the ancestral values and institutions of the Manden Empire.",
    donate: "Donate",
    donateAmount: "Enter Amount",
    // Footer
    coatOfArms: "Coat of arms of Manden Empire",
    sources: "Sources",
    phone: "International Number",
  },
  fr: {
    introduction: "Introduction",
    history: "Histoire",
    governance: "Gouvernance",
    economy: "Économie",
    commerce: "Commerce",
    culture: "Culture",
    resources: "Ressources",
    globalPerspectives: "Perspectives Globales",
    referenceBureau: "Bureau de Référence",
    academy: "Académie",
    intranet: "Intranet",
    search: "Recherche",
    introTitle: "Empire Manden",
    introSubtitle: "Sanunjara Réincarné",
    introMotto: "Confiance · Noblesse · Persévérance",
    introP1: "Manden signifie 'union'. C'est l'amalgame de tous les peuples de la terre, indépendamment de leur nationalité, ethnie, religion ou origine politique. La chefferie traditionnelle est l'extension du rôle de père et sert les populations des 16 pays du Manden.",
    introP2: "Sanun Jara est l'administration qui facilite la réincarnation du 'Manden Mansaya'. Sanun Jara signifie 'lion doré'. Les lions ne sont pas les plus forts des félins, mais ils sont les plus puissants car ce sont des animaux sociaux. Ils peuvent se gouverner grâce à la coopération mutuelle.",
    introP3: "Le Manden respecte le Kouroukan Fouga, qui est la première constitution au monde déclarant universellement les droits de l'homme.",
    historyTitle: "Histoire du Manden",
    historySubtitle: "Une civilisation millénaire",
    governanceTitle: "Gouvernance",
    governanceSubtitle: "Structure de la Chefferie",
    flowchartTitle: "Processus Législatif",
    chiefdom: "Chefferie",
    mandenMansa: "Manden Mansa",
    mandenDjeliba: "Manden Djeliba",
    mandenMory: "Manden Mory",
    govName: "Nom du Gouvernement",
    constitution: "Constitution",
    govType: "Type de Gouvernement",
    monarchy: "Monarchie",
    branchesTitle: "Branches du Gouvernement",
    reflectionCommittee: "Comité de Réflexion",
    generalAssembly: "Assemblée Générale",
    legislativeCommittee: "Comité Législatif",
    debut: "Début",
    reflectionCommitteeShort: "Comité de Réflexion",
    generalAssemblyShort: "Assemblée Générale",
    protocolApproved: "Protocole Approuvé",
    economyTitle: "Économie",
    economyDesc: "Informations économiques, analyse de données, service: moyens de transfert d'argent, système de lettres de recommandation, système de cotisations.",
    donationsTitle: "Soutenir le Manden",
    donationsDesc: "Votre contribution aide à préserver les valeurs ancestrales et les institutions de l'Empire Manden.",
    donate: "Donner",
    donateAmount: "Entrer le montant",
    coatOfArms: "Armoiries de l'Empire Manden",
    sources: "Sources",
    phone: "Numéro International",
  },
} as const;

type Translations = typeof translations.en;

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
