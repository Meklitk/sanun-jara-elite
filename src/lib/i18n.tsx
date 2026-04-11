import { createContext, useContext, useState, type ReactNode } from "react";

const translationCache = new Map<string, string>();

type Lang = "en" | "fr";

const translations = {
  en: {
    introduction: "Introduction",
    history: "History",
    historyTimeline: "History Timeline",
    returnToHistory: "Back to history",
    timelineEvent: "Timeline event",
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
    quickSearchPlaceholder: "Quick search pages and sections",
    noResults: "No matching destination found.",
    openLink: "Open link",
    linkUnavailable: "Link coming soon",
    learnMore: "Learn more",
    reincarnate: "Reincarnate",
    overview: "Overview",
    role: "Role",
    category: "Category",
    person: "Person",
    institution: "Institution",
    returnToGovernance: "Back to governance",
    profileNotes: "Profile notes",
    featuredMedia: "Featured Media",
    servicePillars: "Service pillars",
    institutionalOverview: "Institutional overview",
    resourcesDirectory: "Resources directory",
    mobileMenu: "Menu",
    introTitle: "Manden Empire",
    introSubtitle: "Sanunjara Reincarnate",
    introMotto: "Confiance · Noblesse · Persévérance",
    introP1:
      "Manden means 'union'. It is the amalgamation of all of the people of the land, irrespective of their nationality, ethnicity, religious or political background. The traditional chiefdom is the scaleup of the role of father, and serves the populations of all 16 countries of Manden.",
    introP2:
      "Sanun Jara is the administration that facilitates the reincarnation of 'Manden Mansaya.' Sanun Jara signifies 'golden lion.' Lions are not the strongest of cats, but lions are the most powerful because they are social animals. They can govern themselves due to mutual cooperation.",
    introP3:
      "Manden respects the Kouroukan Fouga, which is the world's first constitution that universally declares the rights of man.",
    historyTitle: "History of Manden",
    historySubtitle: "A civilization spanning millennia",
    governanceTitle: "Governance",
    governanceSubtitle: "Chiefdom Structure",
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
    corruptionIndex: "Corruption Index",
    leastCorrupt: "Least Corrupt",
    mostCorrupt: "Most Corrupt",
    rankLabel: "Rank",
    corruptionDesc:
      "Every country ranks on a scale from 1 to 195, where 1 is the least corrupt. Sanun Jara is one of the least corrupt governments in the world.",
    riskIndex: "Risk Index",
    lowRisk: "Low Risk",
    highRisk: "High Risk",
    stableGov: "Stable Government",
    riskDesc:
      "Manden Empire is a stable government, with the majority of risks attenuated. Ancestral institutions are ingrained since four millennia.",
    taxInfo: "Tax Information",
    taxInfoDesc: "Decided per region",
    branch: "Branch",
    mainPowers: "Main powers",
    selection: "Selection",
    economyTitle: "Economy",
    economyDesc:
      "Economic information, data analytics, service: means of transferring money, system of letters of recommendation, dues system.",
    donationsTitle: "Support Manden",
    donationsDesc:
      "Your contribution helps preserve the ancestral values and institutions of the Manden Empire.",
    donate: "Donate",
    donateAmount: "Enter amount",
    economicInformation: "Economic Information",
    dataAnalytics: "Data Analytics",
    moneyTransfers: "Money Transfers",
    recommendations: "Recommendations",
    duesSystem: "Dues System",
    commerceDesc:
      "Promotion of merchandise from different merchants and entrepreneurs, with their contact information. A dedicated page for merchants in need of suppliers.",
    merchants: "Merchants",
    merchantsDesc: "Browse merchandise from entrepreneurs across Manden.",
    suppliers: "Suppliers",
    suppliersDesc: "Connect merchants in need of suppliers with trusted partners.",
    contactDirectory: "Contact Directory",
    contactDirectoryDesc:
      "Phone numbers and contact information for all listed merchants.",
    searchMerchants: "Search Merchants",
    searchPlaceholder: "Search by name, product, or region...",
    commerceComingSoon: "Full merchant directory coming soon...",
    cultureDesc: "Videos and interventions of Djelis, Donsos, and journalists of Manden.",
    djelisVideos: "Djelis",
    djelisVideosDesc:
      "Traditional griots preserving oral history and cultural heritage.",
    donsosInterventions: "Donsos",
    donsosInterventionsDesc:
      "Hunter brotherhood interventions and cultural ceremonies.",
    journalistsOfManden: "Journalists",
    journalistsOfMandenDesc: "News and reportage from journalists across the Manden region.",
    mediaGalleryComingSoon: "Cultural media gallery coming soon...",
    organizationalRubric: "Organizational Rubric",
    organizationalRubricDesc: "Structured framework for Manden organizations.",
    statistics: "Statistics",
    statisticsDesc: "Data and analytics for the Manden Empire.",
    mandenOrganizations: "Manden Organizations",
    mandenOrganizationsDesc: "Directory of affiliated entities across the empire.",
    wantToJoin: "I Want to Join",
    wantToJoinDesc:
      "Learn about membership and how to become part of the Manden community.",
    haveQuestions: "I Have Questions",
    haveQuestionsDesc:
      "Get answers about the Manden Empire, its governance, and its mission.",
    iAmEntrepreneur: "I Am an Entrepreneur",
    iAmEntrepreneurDesc:
      "Discover opportunities for entrepreneurs within the Manden network.",
    byCountry: "By Country",
    byCountryDesc: "",
    byOrganization: "By Organization",
    byOrganizationDesc: "Browse organizations affiliated with the Manden network.",
    byClassification: "By Classification",
    byClassificationDesc: "Alphabetical order A B C ... Z.",
    coursesNko: "Courses in N'ko",
    coursesNkoDesc: "Learn the N'ko script and language courses.",
    historyCourses: "History Courses",
    historyCoursesDesc: "Study the rich history of the Manden Empire.",
    otherCourses: "Other Courses",
    otherCoursesDesc: "Additional educational programs and training.",
    connection: "Login",
    connectBtn: "Login",
    notYetMember: "Not Yet a Member",
    joinBtn: "Sign Up",
    recommendSomeone: "Recommend Someone",
    recommendBtn: "Submit",
    openTimelineEntry: "Open timeline entry",
    coatOfArms: "Coat of arms of Manden Empire",
    sources: "Sources",
    phone: "International Number",
    pageError: "Failed to load content for this section.",
    pageNotFound: "This section has not been configured yet.",
  },
  fr: {
    introduction: "Introduction",
    history: "Histoire",
    historyTimeline: "Chronologie historique",
    returnToHistory: "Retour a l'histoire",
    timelineEvent: "Evenement chronologique",
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
    quickSearchPlaceholder: "Recherche rapide des pages et sections",
    noResults: "Aucune destination correspondante.",
    openLink: "Ouvrir le lien",
    linkUnavailable: "Lien bientôt disponible",
    learnMore: "En savoir plus",
    reincarnate: "Réincarné",
    overview: "Vue d'ensemble",
    role: "Role",
    category: "Catégorie",
    person: "Personne",
    institution: "Institution",
    returnToGovernance: "Retour à la gouvernance",
    profileNotes: "Notes de profil",
    featuredMedia: "Médias à la une",
    servicePillars: "Piliers de service",
    institutionalOverview: "Aperçu institutionnel",
    resourcesDirectory: "Répertoire des ressources",
    mobileMenu: "Menu",
    introTitle: "Empire Manden",
    introSubtitle: "Sanunjara Réincarné",
    introMotto: "Confiance · Noblesse · Persévérance",
    introP1:
      "Manden signifie 'union'. C'est l'amalgame de tous les peuples de la terre, indépendamment de leur nationalité, ethnie, religion ou origine politique. La chefferie traditionnelle est l'extension du rôle de père et sert les populations des 16 pays du Manden.",
    introP2:
      "Sanun Jara est l'administration qui facilite la réincarnation du 'Manden Mansaya'. Sanun Jara signifie 'lion doré'. Les lions ne sont pas les plus forts des félins, mais ils sont les plus puissants car ce sont des animaux sociaux. Ils peuvent se gouverner grâce à la coopération mutuelle.",
    introP3:
      "Le Manden respecte le Kouroukan Fouga, qui est la première constitution au monde déclarant universellement les droits de l'homme.",
    historyTitle: "Histoire du Manden",
    historySubtitle: "Une civilisation millénaire",
    governanceTitle: "Gouvernance",
    governanceSubtitle: "Structure de la Chefferie",
    chiefdom: "Chefferie",
    mandenMansa: "Manden Mansa",
    mandenDjeliba: "Manden Djeliba",
    mandenMory: "Manden Mory",
    govName: "Nom du gouvernement",
    constitution: "Constitution",
    govType: "Type de gouvernement",
    monarchy: "Monarchie",
    branchesTitle: "Branches du gouvernement",
    reflectionCommittee: "Comité de réflexion",
    generalAssembly: "Assemblée générale",
    legislativeCommittee: "Comité législatif",
    corruptionIndex: "Indice de corruption",
    leastCorrupt: "Moins corrompu",
    mostCorrupt: "Plus corrompu",
    rankLabel: "Rang",
    corruptionDesc:
      "Chaque pays est classé sur une échelle de 1 à 195, où 1 est le moins corrompu. Sanun Jara est l'un des gouvernements les moins corrompus au monde.",
    riskIndex: "Indice de risque",
    lowRisk: "Risque faible",
    highRisk: "Risque élevé",
    stableGov: "Gouvernement stable",
    riskDesc:
      "L'Empire Manden est un gouvernement stable, avec la majorité des risques atténués. Les institutions ancestrales sont enracinées depuis quatre millénaires.",
    taxInfo: "Information fiscale",
    taxInfoDesc: "Décidé par région",
    branch: "Branche",
    mainPowers: "Pouvoirs principaux",
    selection: "Sélection",
    economyTitle: "Économie",
    economyDesc:
      "Informations économiques, analyse de données, service : moyens de transfert d'argent, système de lettres de recommandation, système de cotisations.",
    donationsTitle: "Soutenir le Manden",
    donationsDesc:
      "Votre contribution aide à préserver les valeurs ancestrales et les institutions de l'Empire Manden.",
    donate: "Donner",
    donateAmount: "Entrer le montant",
    economicInformation: "Information économique",
    dataAnalytics: "Analyse de données",
    moneyTransfers: "Transferts d'argent",
    recommendations: "Recommandations",
    duesSystem: "Système de cotisations",
    commerceDesc:
      "Promotion de marchandises de différents commerçants et entrepreneurs, avec leurs coordonnées. Une page dédiée aux commerçants à la recherche de fournisseurs.",
    merchants: "Commerçants",
    merchantsDesc: "Parcourez les marchandises des entrepreneurs du Manden.",
    suppliers: "Fournisseurs",
    suppliersDesc:
      "Connecter les commerçants ayant besoin de fournisseurs avec des partenaires de confiance.",
    contactDirectory: "Répertoire des contacts",
    contactDirectoryDesc:
      "Numéros de téléphone et coordonnées de tous les commerçants répertoriés.",
    searchMerchants: "Rechercher des commerçants",
    searchPlaceholder: "Rechercher par nom, produit ou région...",
    commerceComingSoon: "Répertoire complet des commerçants à venir...",
    cultureDesc: "Vidéos et interventions des Djelis, Donsos et journalistes du Manden.",
    djelisVideos: "Djelis",
    djelisVideosDesc:
      "Griots traditionnels préservant l'histoire orale et le patrimoine culturel.",
    donsosInterventions: "Donsos",
    donsosInterventionsDesc:
      "Interventions de la confrérie des chasseurs et cérémonies culturelles.",
    journalistsOfManden: "Journalistes",
    journalistsOfMandenDesc: "Nouvelles et reportages des journalistes de la région du Manden.",
    mediaGalleryComingSoon: "Galerie de médias culturels à venir...",
    organizationalRubric: "Rubrique organisationnelle",
    organizationalRubricDesc: "Cadre structuré pour les organisations du Manden.",
    statistics: "Statistiques",
    statisticsDesc: "Données et analyses pour l'Empire Manden.",
    mandenOrganizations: "Organisations du Manden",
    mandenOrganizationsDesc: "Répertoire des entités affiliées à travers l'empire.",
    wantToJoin: "Je veux rejoindre",
    wantToJoinDesc:
      "Découvrez l'adhésion et comment faire partie de la communauté Manden.",
    haveQuestions: "J'ai des questions",
    haveQuestionsDesc:
      "Obtenez des réponses sur l'Empire Manden, sa gouvernance et sa mission.",
    iAmEntrepreneur: "Je suis entrepreneur",
    iAmEntrepreneurDesc:
      "Découvrez les opportunités pour les entrepreneurs au sein du réseau Manden.",
    byCountry: "Par pays",
    byCountryDesc: "Parcourez les pays par ordre alphabétique et ajoutez les informations pertinentes au fil du temps.",
    byOrganization: "Par organisation",
    byOrganizationDesc: "Parcourez les organisations affiliées au réseau du Manden.",
    byClassification: "Par classification",
    byClassificationDesc: "Ordre alphabétique A B C ... Z.",
    coursesNko: "Cours en N'ko",
    coursesNkoDesc: "Apprenez l'écriture N'ko et les cours de langue.",
    historyCourses: "Cours d'histoire",
    historyCoursesDesc: "Étudiez la riche histoire de l'Empire Manden.",
    otherCourses: "Autres cours",
    otherCoursesDesc: "Programmes éducatifs et formations supplémentaires.",
    connection: "Connexion",
    connectBtn: "Connexion",
    notYetMember: "Pas encore membre",
    joinBtn: "S'inscrire",
    recommendSomeone: "Recommander quelqu'un",
    recommendBtn: "Soumettre",
    openTimelineEntry: "Ouvrir l'entrée chronologique",
    coatOfArms: "Armoiries de l'Empire Manden",
    sources: "Sources",
    phone: "Numéro international",
    pageError: "Échec du chargement du contenu pour cette section.",
    pageNotFound: "Cette section n'a pas encore été configurée.",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;
type Translations = Record<TranslationKey, string>;

interface I18nContextType {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Translations;
  localize: (value: { en?: string; fr?: string } | undefined) => string;
}

const I18nContext = createContext<I18nContextType>({
  lang: "en",
  setLang: () => {},
  t: translations.en,
  localize: () => "",
});

async function translateText(text: string, from: string, to: string): Promise<string> {
  if (!text || text.trim() === "") return "";

  const cacheKey = `${from}:${to}:${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const response = await fetch("https://libretranslate.de/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source: from,
        target: to,
        format: "text",
      }),
    });

    if (!response.ok) {
      return text;
    }

    const data = await response.json();
    const translated = data.translatedText || text;
    translationCache.set(cacheKey, translated);
    return translated;
  } catch {
    return text;
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const [autoTranslations, setAutoTranslations] = useState<Record<string, string>>({});

  function localize(value: { en?: string; fr?: string } | undefined) {
    if (!value) return "";

    if (lang === "en") {
      return (value.en || value.fr || "").trim();
    }

    if (lang === "fr" && value.fr && value.fr.trim() !== "") {
      return value.fr.trim();
    }

    if (lang === "fr" && value.en && value.en.trim() !== "") {
      const enText = value.en.trim();
      const cacheKey = `en:fr:${enText}`;

      if (autoTranslations[cacheKey]) {
        return autoTranslations[cacheKey];
      }

      translateText(enText, "en", "fr").then((translated) => {
        setAutoTranslations((prev) => ({
          ...prev,
          [cacheKey]: translated,
        }));
      });

      return enText;
    }

    return (value.en || value.fr || "").trim();
  }

  return (
    <I18nContext.Provider value={{ lang, setLang, t: translations[lang], localize }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
