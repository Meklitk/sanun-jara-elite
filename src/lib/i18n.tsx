import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from "react";

const translationCache = new Map<string, string>();

type Lang = "en" | "fr";

const translations = {
  en: {
    introduction: "Introduction",
    introHeroEyebrow: "Sanun Jara Reborn",
    introSectionsLead: "The golden lion of Manden",
    introSectionsSubtitle: "Unity, heritage, and purpose — six pillars that guide our empire.",
    introTimelineTitle: "Heritage timeline",
    introGalleryTitle: "Visual archive",
    introViewFullHistory: "Explore full history",
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
    niani: "Niani",
    institutions: "Institutions",
    institutionsDesc: "Different institutions and their pictures and videos.",
    architecturalProjects: "Architectural Projects",
    architecturalProjectsDesc: "List of architectural structures and their conceptual images.",
    nianiTv: "Niani TV",
    nianiTvDesc: "Videos and link to the Niani YouTube channel.",
    nianiCartoons: "Cartoons",
    nianiCartoonsDesc:
      "Animated stories in Mandenka, Amharic, and other African languages — Manden history and culture for all ages.",
    nianiCartoonsEmpty:
      "Cartoon episodes will appear here once added from Admin → Niani → Niani TV Cartoons.",
    watchYoutubeChannel: "Watch on YouTube",
    nianiVideos: "Videos",
    nianiConceptImages: "Concept Images",
    nianiWorkProgress: "Work in Progress",
    noInstitutionsYet: "No institutions yet.",
    noProjectsYet: "No architectural projects yet.",
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
    culturalArchive: "Cultural Archive",
    djelisVideos: "Djelis",
    djelisVideosDesc:
      "Traditional griots preserving oral history and cultural heritage.",
    donsosInterventions: "Donsos",
    donsosInterventionsDesc:
      "Hunter brotherhood interventions and cultural ceremonies.",
    journalistsOfManden: "Journalists",
    journalistsOfMandenDesc: "News and reportage from journalists across the Manden region.",
    mediaGalleryComingSoon: "Cultural media gallery coming soon...",
    gallery: "Gallery",
    videosAndMedia: "Videos & Media",
    images: "images",
    videos: "videos",
    image: "image",
    item: "item",
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
    haveQuestionsFormDesc:
      "Do you have questions about Sanun Jara, our vision, or our projects? Fill out this form and we will reply by email.",
    wantToJoinFormDesc:
      "Complete this form to submit your application to the Sanun Jara network.",
    formYourMessage: "Your message",
    formFullName: "Full name",
    formEmail: "Email address",
    formPhone: "Phone",
    formPhoneOptional: "Phone (optional)",
    formProfession: "Profession / occupation",
    formMessageOrQuestion: "Message or question",
    formPlaceholderName: "Your name",
    formPlaceholderEmail: "name@example.com",
    formPlaceholderPhone: "Phone number",
    formPlaceholderProfession: "Administrator / Entrepreneur",
    formPlaceholderAnswer: "Write your answer here sincerely...",
    formPlaceholderQuestionDetail: "Write your questions in detail here...",
    formSendQuestions: "Send my questions",
    formSending: "Sending...",
    formAskAnotherQuestion: "Ask another question",
    formMessageSent: "Message sent!",
    formMessageSentDesc:
      "Thank you for your questions and comments. Your message has been sent to info@sanunjara.com. The Sanun Jara team will reply as soon as possible.",
    formFillRequired: "Please fill in all required fields.",
    formSubmitError: "An error occurred while sending. Please try again.",
    formMembershipApplication: "Membership application",
    formStepInfo: "Information",
    formJoinIntro:
      "Please fill in your basic contact details first. You will then complete a 17-question evaluation.",
    formQuestionLabel: "Question",
    formQuestionOf: "of",
    formYourAnswer: "Your answer",
    formPrevious: "Previous",
    formNext: "Next",
    formSubmitApplication: "Submit my application",
    formApplicationSent: "Application sent!",
    formApplicationSentDesc:
      "Mande Diata and the Reference Bureau council of Sanun Jara thank you for your interest. Your answers have been recorded and forwarded to the administration. A Wana member will contact you shortly.",
    formSubmitAnother: "Submit another application",
    formNameEmailRequired: "Name and email are required.",
    formAnswerRequired: "Please answer the question before continuing.",
    formSubmitErrorMembership: "An error occurred while submitting your application. Please try again.",
    entrepreneurContactPrompt:
      "To join the network or propose a commercial partnership, write to",
    cotiserPageTitle: "Cotiser (Contributions & Donations)",
    cotiserPageDesc: "Actively support the rebuilding of the Manden Empire.",
    cotiserBody1:
      "Every member and Mandenka patriot is invited to contribute financially to the empire's development projects, cultural preservation initiatives, and the implementation of our institutions.",
    cotiserWhyTitle: "Why contribute?",
    cotiserWhy1: "Funding the Niani Academy and N'Ko alphabet courses.",
    cotiserWhy2: "Support for widows, orphans, and women's institutions.",
    cotiserWhy3: "Realization of architectural models and Niani infrastructure projects.",
    cotiserWhy4: "Management and hosting of our UNESCO and Manden digital platforms.",
    cotiserHowTitle: "How to make contributions?",
    cotiserHowDesc:
      "For security and institutional authenticity, payment details (bank accounts, Wave, Mobile Money, PayPal) are coordinated directly by the Reference Bureau under the supervision of the Mansa Diata administration.",
    cotiserHowPrompt: "To initiate a contribution or donation, please write directly to:",
    iAmEntrepreneur: "I Am an Entrepreneur",
    iAmEntrepreneurDesc:
      "Discover opportunities for entrepreneurs within the Manden network.",
    cotiser: "Cotiser",
    cotiserDesc: "Support the Manden Empire with your contribution.",
    tombouctou: "Tombouctou",
    tombouctouDesc: "Discover Tombouctou, the city of 333 saints and a pillar of Manden heritage.",
    tombouctouEmpty: "Additional Tombouctou content will appear here once added from the admin dashboard.",
    followUs: "Follow us",
    facebook: "Facebook",
    byCountry: "Federation",
    byCountryDesc: "Medieval map of the Manden federation. Click the map to enlarge it.",
    federationEntriesTitle: "Federation members",
    federationEntriesDesc: "Additional federation information added from the admin dashboard.",
    byOrganization: "Organization",
    byOrganizationDesc: "Organization section illustration.",
    byAffiliation: "Affiliation",
    byAffiliationDesc: "Affiliation section illustration.",
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
    timelineGallery: "Gallery",
    timelineImage: "image",
    timelineImages: "images",
    timelineNote: "Note",
    coatOfArms: "Coat of arms of Manden Empire",
    flagOfManden: "Flag of Manden",
    flagOfMandenDesc: "The official flag of the Manden Empire",
    sources: "Sources",
    phone: "International Number",
    pageError: "Failed to load content for this section.",
    pageNotFound: "This section has not been configured yet.",
    relatedLinks: "Related Links",
    additionalContent: "Additional Content",
  },
  fr: {
    introduction: "Introduction",
    introHeroEyebrow: "Sanun Jara Réincarne",
    introSectionsLead: "Le lion d'or du Manden",
    introSectionsSubtitle: "Unité, patrimoine et mission — six piliers qui guident notre empire.",
    introTimelineTitle: "Chronologie du patrimoine",
    introGalleryTitle: "Archives visuelles",
    introViewFullHistory: "Explorer toute l'histoire",
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
    niani: "Niani",
    institutions: "Institutions",
    institutionsDesc: "Différentes institutions et leurs photos et vidéos.",
    architecturalProjects: "Projets Architecturaux",
    architecturalProjectsDesc: "Liste des structures architecturales et leurs images conceptuelles.",
    nianiTv: "Niani TV",
    nianiTvDesc: "Vidéos et lien vers la chaîne YouTube Niani.",
    nianiCartoons: "Dessins animés",
    nianiCartoonsDesc:
      "Histoires animées en Mandenka, Amharic et autres langues africaines — l'histoire et la culture du Manden pour tous.",
    nianiCartoonsEmpty:
      "Les épisodes cartoon apparaîtront ici après ajout dans Admin → Niani → Niani TV Cartoons.",
    watchYoutubeChannel: "Voir sur YouTube",
    nianiVideos: "Vidéos",
    nianiConceptImages: "Images conceptuelles",
    nianiWorkProgress: "Travaux réalisés",
    noInstitutionsYet: "Aucune institution pour le moment.",
    noProjectsYet: "Aucun projet architectural pour le moment.",
    academy: "Académie",
    intranet: "Intranet",
    search: "Recherche",
    quickSearchPlaceholder: "Recherche rapide des pages et sections",
    noResults: "Aucune destination correspondante.",
    openLink: "Ouvrir le lien",
    linkUnavailable: "Lien bientôt disponible",
    learnMore: "En savoir plus",
    reincarnate: "Réincarne",
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
    culturalArchive: "Archive Culturelle",
    djelisVideos: "Djelis",
    djelisVideosDesc:
      "Griots traditionnels préservant l'histoire orale et le patrimoine culturel.",
    donsosInterventions: "Donsos",
    donsosInterventionsDesc:
      "Interventions de la confrérie des chasseurs et cérémonies culturelles.",
    journalistsOfManden: "Journalistes",
    journalistsOfMandenDesc: "Nouvelles et reportages des journalistes de la région du Manden.",
    mediaGalleryComingSoon: "Galerie de médias culturels à venir...",
    gallery: "Galerie",
    videosAndMedia: "Vidéos et Médias",
    images: "images",
    videos: "vidéos",
    image: "image",
    item: "élément",
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
    haveQuestionsFormDesc:
      "Vous avez des questions sur Sanun Jara, notre vision ou nos projets ? Remplissez ce formulaire et nous vous répondrons directement par email.",
    wantToJoinFormDesc:
      "Complétez ce formulaire pour soumettre votre candidature au réseau Sanun Jara.",
    formYourMessage: "Votre message",
    formFullName: "Nom complet",
    formEmail: "Adresse email",
    formPhone: "Téléphone",
    formPhoneOptional: "Téléphone (optionnel)",
    formProfession: "Profession / occupation",
    formMessageOrQuestion: "Message ou question",
    formPlaceholderName: "Votre nom",
    formPlaceholderEmail: "nom@exemple.com",
    formPlaceholderPhone: "Numéro",
    formPlaceholderProfession: "Administrateur / Entrepreneur",
    formPlaceholderAnswer: "Écrivez votre réponse ici en toute sincérité...",
    formPlaceholderQuestionDetail: "Écrivez vos questions en détail ici...",
    formSendQuestions: "Envoyer mes questions",
    formSending: "Envoi en cours...",
    formAskAnotherQuestion: "Poser une autre question",
    formMessageSent: "Message envoyé !",
    formMessageSentDesc:
      "Merci pour vos questions et commentaires. Vos remarques ont bien été transmises à info@sanunjara.com. L'équipe de Sanun Jara vous répondra dès que possible.",
    formFillRequired: "Veuillez remplir tous les champs obligatoires.",
    formSubmitError: "Une erreur est survenue lors de l'envoi. Veuillez réessayer.",
    formMembershipApplication: "Candidature d'adhésion",
    formStepInfo: "Informations",
    formJoinIntro:
      "Veuillez d'abord remplir vos coordonnées de base. Vous accéderez ensuite au questionnaire d'évaluation de 17 questions.",
    formQuestionLabel: "Question",
    formQuestionOf: "sur",
    formYourAnswer: "Votre réponse",
    formPrevious: "Précédent",
    formNext: "Suivant",
    formSubmitApplication: "Soumettre ma candidature",
    formApplicationSent: "Candidature envoyée !",
    formApplicationSentDesc:
      "Mande Diata et le conseil du Bureau de Références de Sanun Jara vous remercient pour votre intérêt et engagement. Vos réponses ont été enregistrées avec succès et transmises à l'administration. Un membre du Wana vous contactera sous peu.",
    formSubmitAnother: "Déposer une autre candidature",
    formNameEmailRequired: "Le nom et l'adresse email sont obligatoires.",
    formAnswerRequired: "Veuillez répondre à la question avant de continuer.",
    formSubmitErrorMembership:
      "Une erreur est survenue lors de l'envoi de votre candidature. Veuillez réessayer.",
    entrepreneurContactPrompt:
      "Pour rejoindre le réseau ou proposer un partenariat commercial, écrivez à",
    cotiserPageTitle: "Cotiser (Contributions & Dons)",
    cotiserPageDesc: "Soutenez activement la reconstruction de l'Empire du Manden.",
    cotiserBody1:
      "Chaque membre et patriote Mandenka est invité à contribuer financièrement aux projets de développement de l'empire, aux initiatives de préservation culturelle et à la mise en œuvre de nos institutions.",
    cotiserWhyTitle: "Pourquoi cotiser ?",
    cotiserWhy1: "Financement de la Niani Academy et des cours d'alphabet N'Ko.",
    cotiserWhy2: "Soutien aux veuves, orphelins et aux institutions des femmes.",
    cotiserWhy3: "Réalisation des maquettes architecturales et des projets d'infrastructure de Niani.",
    cotiserWhy4: "Gestion et hébergement de nos plateformes numériques d'UNESCO et du Manden.",
    cotiserHowTitle: "Comment faire vos cotisations ?",
    cotiserHowDesc:
      "Pour des raisons de sécurité et d'authenticité institutionnelle, les coordonnées de paiement (comptes bancaires, Wave, Mobile Money, PayPal) sont coordonnées directement par le Bureau de Références sous la supervision de l'administration du Mansa Diata.",
    cotiserHowPrompt: "Pour initier un dépôt de cotisation ou un don, veuillez écrire directement à :",
    iAmEntrepreneur: "Je suis entrepreneur",
    iAmEntrepreneurDesc:
      "Découvrez les opportunités pour les entrepreneurs au sein du réseau Manden.",
    cotiser: "Cotiser",
    cotiserDesc: "Soutenez l'Empire Manden avec votre contribution.",
    tombouctou: "Tombouctou",
    tombouctouDesc: "Découvrez Tombouctou, la ville des 333 saints et un pilier du patrimoine du Manden.",
    tombouctouEmpty: "Du contenu supplémentaire sur Tombouctou apparaît ici après ajout depuis le tableau de bord administrateur.",
    followUs: "Suivez-nous",
    facebook: "Facebook",
    byCountry: "Fédération",
    byCountryDesc: "Carte médiévale de la fédération du Manden. Cliquez sur la carte pour l'agrandir.",
    federationEntriesTitle: "Membres de la Fédération",
    federationEntriesDesc: "Informations supplémentaires ajoutées depuis le tableau de bord administrateur.",
    byOrganization: "Organisation",
    byOrganizationDesc: "Illustration de la section Organisation.",
    byAffiliation: "Affiliation",
    byAffiliationDesc: "Illustration de la section Affiliation.",
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
    timelineGallery: "Galerie",
    timelineImage: "image",
    timelineImages: "images",
    timelineNote: "Note",
    coatOfArms: "Armoiries de l'Empire Manden",
    flagOfManden: "Drapeau du Manden",
    flagOfMandenDesc: "Le drapeau officiel de l'Empire Manden",
    sources: "Sources",
    phone: "Numéro international",
    pageError: "Échec du chargement du contenu pour cette section.",
    pageNotFound: "Cette section n'a pas encore été configurée.",
    relatedLinks: "Liens connexes",
    additionalContent: "Contenu additionnel",
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
  const [lang, setLang] = useState<Lang>("fr");
  const [autoTranslations, setAutoTranslations] = useState<Record<string, string>>({});

  const localize = useCallback((value: { en?: string; fr?: string } | undefined) => {
    if (!value) return "";

    if (lang === "en") {
      // English mode: prefer en, fallback to fr
      const text = (value.en || value.fr || "").trim();
      return text;
    }

    if (lang === "fr") {
      // French mode: prefer fr, fallback to en
      const text = (value.fr || value.en || "").trim();
      return text;
    }

    return (value.fr || value.en || "").trim();
  }, [lang]);

  const contextValue = useMemo(() => ({
    lang,
    setLang,
    t: translations[lang],
    localize,
  }), [lang, localize]);

  return (
    <I18nContext.Provider value={contextValue}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
