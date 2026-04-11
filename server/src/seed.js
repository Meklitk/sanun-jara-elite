import bcrypt from "bcryptjs";
import { Admin } from "./models/Admin.js";
import { Page } from "./models/Page.js";

const DEFAULT_PAGES = [
  {
    key: "introduction",
    title: { en: "Manden Empire", fr: "Empire Manden" },
    content: {
      en: `Manden means 'union'. It is the amalgamation of all of the people of the land, irrespective of their nationality, ethnicity, religious or political background.\n\nSanun Jara is the administration that facilitates the reincarnation of 'Manden Mansaya.' Sanun Jara signifies 'golden lion.'\n\nManden respects the Kouroukan Fouga, which is the world's first constitution that universally declares the rights of man.`,
      fr: `Manden signifie « union ». C'est l'amalgame de tous les peuples de la terre, indépendamment de leur nationalité, origine ethnique, religion ou appartenance politique.\n\nSanun Jara est l'administration qui facilite la réincarnation du « Manden Mansaya ». Sanun Jara signifie « lion doré ».\n\nManden respecte le Kouroukan Fouga, qui est la première constitution au monde déclarant universellement les droits de l'homme.`
    },
    images: [],
    links: []
  },
  {
    key: "history",
    title: { en: "History of Manden", fr: "Histoire du Manden" },
    content: { en: "", fr: "" },
    images: [],
    links: [],
    timeline: [
      { year: "3000 B.C.", title: { en: "Arrival of Mandenkas", fr: "Arrivée des Mandenkas" }, description: { en: "The ancient Mandenka people arrived in West Africa, establishing the foundation of what would become the great Manden Empire.", fr: "L'ancien peuple Mandenka est arrivé en Afrique de l'Ouest, établissant les bases de ce qui allait devenir le grand Empire Manden." }, url: "/history/timeline/arrival-of-mandenkas" },
      { year: "980 A.D.", title: { en: "First University in the world", fr: "Première université au monde" }, description: { en: "", fr: "" }, url: "/history/timeline/first-university-in-the-world" },
      { year: "1236 A.D.", title: { en: "World's first constitution of human rights, abolished slavery", fr: "Première constitution mondiale des droits de l'homme, abolition de l'esclavage" }, description: { en: "", fr: "" }, url: "/history/timeline/world-s-first-constitution-of-human-rights-abolished-slavery" },
      { year: "1312 A.D.", title: { en: "Discovery of America", fr: "Découverte de l'Amérique" }, description: { en: "", fr: "" }, url: "/history/timeline/discovery-of-america" },
      { year: "1324 A.D.", title: { en: "The richest man in history", fr: "L'homme le plus riche de l'histoire" }, description: { en: "", fr: "" }, url: "/history/timeline/the-richest-man-in-history" },
      { year: "1351 A.D.", title: { en: "Named most honest people on earth", fr: "Peuple le plus honnête de la terre" }, description: { en: "", fr: "" }, url: "/history/timeline/named-most-honest-people-on-earth" },
      { year: "1455 A.D.", title: { en: "Manden wins war against Portugal", fr: "Manden remporte la guerre contre le Portugal" }, description: { en: "", fr: "" }, url: "/history/timeline/manden-wins-war-against-portugal" },
      { year: "2020 A.D.", title: { en: "Return of the Empire", fr: "Retour de l'Empire" }, description: { en: "", fr: "" }, url: "/history/timeline/return-of-the-empire" },
      { year: "2023 A.D.", title: { en: "Creation of Manden Calendar", fr: "Création du calendrier Manden" }, description: { en: "", fr: "" }, url: "/history/timeline/creation-of-manden-calendar" }
    ]
  },
  {
    key: "governance",
    title: { en: "Governance", fr: "Gouvernance" },
    content: {
      en: "Manden Empire governance combines ancestral legitimacy, institutional order, and community accountability.\n\nThe structure below presents the chiefdom, the principal offices, the constitutional framework, and the governing bodies that support public stewardship.",
      fr: "La gouvernance de l'Empire Manden combine légitimité ancestrale, ordre institutionnel et responsabilité communautaire.\n\nLa structure ci-dessous présente la chefferie, les principales charges, le cadre constitutionnel et les organes directeurs qui soutiennent l'intérêt public."
    },
    images: ["/images/manden-flag-lion.svg", "/images/coat-of-arms-manden.png"],
    links: [
      { label: { en: "wikipedia.org/manden_empire", fr: "wikipedia.org/manden_empire" }, url: "https://en.wikipedia.org/wiki/Mali_Empire" },
      { label: { en: "wikipedia.org/sanun_jara (in creation)", fr: "wikipedia.org/sanun_jara (en création)" }, url: "" },
      { label: { en: "Le Djeliba", fr: "Le Djeliba" }, url: "" }
    ],
    governance: {
      chiefdom: { en: "Manden Mansaya", fr: "Manden Mansaya" },
      chiefdomUrl: "/governance/biographies/manden-mansaya",
      mandenMansa: { en: "Mari Djata Keita V", fr: "Mari Djata Keita V" },
      mandenMansaUrl: "/governance/biographies/mari-djata-keita-v",
      mandenDjeliba: { en: "Mabougnata Dibla Ibrahim Diabate", fr: "Mabougnata Dibla Ibrahim Diabate" },
      mandenDjelibaUrl: "/governance/biographies/mabougnata-dibla-ibrahim-diabate",
      mandenMory: { en: "Mabougnata Alpha Omar Kaba", fr: "Mabougnata Alpha Omar Kaba" },
      mandenMoryUrl: "/governance/biographies/mabougnata-alpha-omar-kaba",
      governmentName: { en: "Manden Empire", fr: "Empire Manden" },
      governmentNameUrl: "/governance/biographies/manden-empire",
      constitution: { en: "Kouroukan Fouga, adopted in 1236", fr: "Kouroukan Fouga, adoptée en 1236" },
      constitutionUrl: "/governance/biographies/kouroukan-fouga",
      governmentType: { en: "Monarchy", fr: "Monarchie" },
      corruptionIndex: "05",
      corruptionSummary: {
        en: "Note that every country ranks on a scale from 1 to 195, where 1 is the least corrupt. Sanun Jara is one of the least corrupt governments in the world.",
        fr: "Notez que chaque pays est classé sur une échelle de 1 à 195, où 1 est le moins corrompu. Sanun Jara est l'un des gouvernements les moins corrompus au monde."
      },
      riskIndex: "A",
      riskSummary: {
        en: "Manden Empire is a stable government, with the majority of risks attenuated. Ancestral institutions are ingrained since four millennia.",
        fr: "L'Empire Manden est un gouvernement stable, avec la majorité des risques atténués. Les institutions ancestrales sont enracinées depuis quatre millénaires."
      },
      taxInformation: { en: "Decided per region", fr: "Décidé par région" },
      branches: [
        {
          name: { en: "Reflection Committee", fr: "Comité de Réflexion" },
          powers: { en: "Filters ideas based on alignment with Manden principles.", fr: "Filtre les idées en fonction de leur alignement avec les principes du Manden." },
          selection: { en: "Meritocratic", fr: "Méritocratique" },
          url: "/governance/biographies/reflection-committee"
        },
        {
          name: { en: "General Assembly", fr: "Assemblée Générale" },
          powers: { en: "Obtains consensus from within the Manden community.", fr: "Obtient un consensus au sein de la communauté Manden." },
          selection: { en: "Meritocratic", fr: "Méritocratique" },
          url: "/governance/biographies/general-assembly"
        },
        {
          name: { en: "Legislative Committee", fr: "Comité Législatif" },
          powers: { en: "Handles the promulgation of governing protocols.", fr: "Gère la promulgation des protocoles de gouvernance." },
          selection: { en: "Meritocratic", fr: "Méritocratique" },
          url: "/governance/biographies/legislative-committee"
        }
      ],
      phone: "1 (800) 636-5913"
    }
  },
  {
    key: "global-perspectives",
    title: { en: "Global Perspectives", fr: "Perspectives Globales" },
    content: {
      en: "Browse the Manden network by country or by organization.\n\nCountry entries can be added over time and are displayed alphabetically on the public page.",
      fr: "Parcourez le réseau Manden par pays ou par organisation.\n\nLes entrées par pays peuvent être ajoutées au fil du temps et sont affichées par ordre alphabétique sur la page publique."
    },
    images: [],
    links: [],
    directory: {
      countries: [],
      organizations: []
    }
  },
  {
    key: "reference-bureau",
    title: { en: "Reference Bureau", fr: "Bureau de Référence" },
    content: {
      en: "The Reference Bureau helps visitors join the network, ask questions, or register entrepreneurial interest.\n\nThese channels can begin as placeholders and become more detailed over time as new forms, contacts, and workflows are added.",
      fr: "Le Bureau de Référence aide les visiteurs à rejoindre le réseau, à poser des questions ou à exprimer leur intérêt entrepreneurial.\n\nCes canaux peuvent commencer comme des espaces réservés et devenir plus détaillés au fil du temps à mesure que de nouveaux formulaires, contacts et flux de travail sont ajoutés."
    },
    images: [],
    links: [],
    utilityCards: [
      {
        id: "join",
        title: { en: "I Want to Join", fr: "Je veux rejoindre" },
        description: { en: "Learn about membership and how to become part of the Manden community.", fr: "Découvrez l'adhésion et comment faire partie de la communauté Manden." },
        url: ""
      },
      {
        id: "questions",
        title: { en: "I Have Questions", fr: "J'ai des questions" },
        description: { en: "Get answers about the Manden Empire, its governance, and its mission.", fr: "Obtenez des réponses sur l'Empire Manden, sa gouvernance et sa mission." },
        url: ""
      },
      {
        id: "entrepreneur",
        title: { en: "I Am an Entrepreneur", fr: "Je suis entrepreneur" },
        description: { en: "Discover opportunities for entrepreneurs within the Manden network.", fr: "Découvrez les opportunités pour les entrepreneurs au sein du réseau Manden." },
        url: ""
      }
    ]
  },
  {
    key: "academy",
    title: { en: "Academy", fr: "Académie" },
    content: {
      en: "The Academy can present courses in the alphabet of West Africa, history, and other learning programs.\n\nYou can publish these gradually and update the course links over time from the admin dashboard.",
      fr: "L'Académie peut présenter des cours sur l'alphabet de l'Afrique de l'Ouest, l'histoire et d'autres programmes d'apprentissage.\n\nVous pouvez publier ces éléments progressivement et mettre à jour les liens des cours au fil du temps depuis le tableau de bord d'administration."
    },
    images: [],
    links: [],
    utilityCards: [
      {
        id: "nko",
        title: { en: "Courses in N'ko", fr: "Cours en N'ko" },
        description: { en: "Learn the N'ko script and language courses.", fr: "Apprenez l'écriture N'ko et les cours de langue." },
        url: ""
      },
      {
        id: "history-courses",
        title: { en: "History Courses", fr: "Cours d'histoire" },
        description: { en: "Study the rich history of the Manden Empire.", fr: "Étudiez la riche histoire de l'Empire Manden." },
        url: ""
      },
      {
        id: "others",
        title: { en: "Other Courses", fr: "Autres cours" },
        description: { en: "Additional educational programs and training.", fr: "Programmes éducatifs et formations supplémentaires." },
        url: ""
      }
    ]
  },
  {
    key: "economy",
    title: { en: "Economy of Manden", fr: "Économie du Manden" },
    content: {
      en: "The Manden Empire maintains a robust economic system built on ancestral principles of fairness, transparency, and community welfare. Our economy supports members through efficient transfer services, verified recommendation letters, and a structured dues system that funds communal development.\n\nAll financial transactions are conducted with the utmost integrity, reflecting the Manden values of honesty and accountability that have been recognized globally since 1351 A.D.",
      fr: "L'Empire Manden maintient un système économique robuste fondé sur les principes ancestraux d'équité, de transparence et de bien-être communautaire. Notre économie soutient les membres par des services de transfert efficaces, des lettres de recommandation vérifiées et un système de cotisations structuré qui finance le développement communautaire.\n\nToutes les transactions financières sont menées avec la plus grande intégrité, reflétant les valeurs Manden d'honnêteté et de responsabilité reconnues mondialement depuis 1351 A.D."
    },
    images: [],
    links: []
  },
  {
    key: "commerce",
    title: { en: "Commerce", fr: "Commerce" },
    content: {
      en: "Promotion of merchandise from different merchants and entrepreneurs, with their contact information.",
      fr: "Promotion des marchandises de différents commerçants et entrepreneurs, avec leurs informations de contact."
    },
    images: [],
    links: []
  },
  {
    key: "culture",
    title: { en: "Culture", fr: "Culture" },
    content: {
      en: "Videos and interventions of Djelis, Donsos, and journalists of Manden.",
      fr: "Vidéos et interventions des Djelis, Donsos et journalistes du Manden."
    },
    images: [],
    links: [],
    media: []
  },
  {
    key: "resources",
    title: { en: "Resources", fr: "Ressources" },
    content: { en: "", fr: "" },
    images: [],
    links: [],
    media: []
  }
];

export async function seedAdminIfNeeded({ username, password }) {
  const existing = await Admin.findOne({ username });
  if (existing) return existing;
  const passwordHash = await bcrypt.hash(password, 12);
  return Admin.create({ username, passwordHash });
}

export async function seedPagesIfNeeded() {
  const count = await Page.countDocuments();
  if (count > 0) return;
  await Page.insertMany(DEFAULT_PAGES);
}

/** Insert any missing default pages by `key` (safe if DB already had partial data). */
export async function ensureDefaultPages() {
  for (const doc of DEFAULT_PAGES) {
    const exists = await Page.findOne({ key: doc.key }).lean();
    if (!exists) {
      await Page.create(doc);
    }
  }
}
