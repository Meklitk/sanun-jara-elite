import bcrypt from "bcryptjs";
import { Admin } from "./models/Admin.js";
import { Page } from "./models/Page.js";

const DEFAULT_PAGES = [
  {
    key: "introduction",
    title: { fr: "Empire Manden" },
    content: {
      fr: `Manden signifie « union ». C'est l'amalgame de tous les peuples de la terre, indépendamment de leur nationalité, origine ethnique, religion ou appartenance politique.\n\nSanun Jara est l'administration qui facilite la réincarnation du « Manden Mansaya ». Sanun Jara signifie « lion doré ».\n\nManden respecte le Kouroukan Fouga, qui est la première constitution au monde déclarant universellement les droits de l'homme.`
    },
    images: [],
    links: []
  },
  {
    key: "history",
    title: { fr: "Histoire du Manden" },
    content: { fr: "" },
    images: [],
    links: [],
    timeline: [
      { year: "3000 B.C.", title: { fr: "Arrivée des Mandenkas" }, description: { fr: "L'ancien peuple Mandenka est arrivé en Afrique de l'Ouest, établissant les bases de ce qui allait devenir le grand Empire Manden." }, url: "/history/timeline/arrival-of-mandenkas" },
      { year: "980 A.D.", title: { fr: "Première université au monde" }, description: { fr: "" }, url: "/history/timeline/first-university-in-the-world" },
      { year: "1236 A.D.", title: { fr: "Première constitution mondiale des droits de l'homme, abolition de l'esclavage" }, description: { fr: "" }, url: "/history/timeline/world-s-first-constitution-of-human-rights-abolished-slavery" },
      { year: "1312 A.D.", title: { fr: "Découverte de l'Amérique" }, description: { fr: "" }, url: "/history/timeline/discovery-of-america" },
      { year: "1324 A.D.", title: { fr: "L'homme le plus riche de l'histoire" }, description: { fr: "" }, url: "/history/timeline/the-richest-man-in-history" },
      { year: "1351 A.D.", title: { fr: "Peuple le plus honnête de la terre" }, description: { fr: "" }, url: "/history/timeline/named-most-honest-people-on-earth" },
      { year: "1455 A.D.", title: { fr: "Manden remporte la guerre contre le Portugal" }, description: { fr: "" }, url: "/history/timeline/manden-wins-war-against-portugal" },
      { year: "2020 A.D.", title: { fr: "Retour de l'Empire" }, description: { fr: "" }, url: "/history/timeline/return-of-the-empire" },
      { year: "2023 A.D.", title: { fr: "Création du calendrier Manden" }, description: { fr: "" }, url: "/history/timeline/creation-of-manden-calendar" }
    ]
  },
  {
    key: "governance",
    title: { fr: "Gouvernance" },
    content: {
      fr: "La gouvernance de l'Empire Manden combine légitimité ancestrale, ordre institutionnel et responsabilité communautaire.\n\nLa structure ci-dessous présente la chefferie, les principales charges, le cadre constitutionnel et les organes directeurs qui soutiennent l'intérêt public."
    },
    images: ["/images/manden-flag-lion.svg", "/images/coat-of-arms-manden.png"],
    links: [
      { label: { fr: "wikipedia.org/manden_empire" }, url: "https://en.wikipedia.org/wiki/Mali_Empire" },
      { label: { fr: "wikipedia.org/sanun_jara (en création)" }, url: "" },
      { label: { fr: "Le Djeliba" }, url: "" }
    ],
    governance: {
      chiefdom: { fr: "Manden Mansaya" },
      chiefdomUrl: "/governance/biographies/manden-mansaya",
      mandenMansa: { fr: "Mari Djata Keita V" },
      mandenMansaUrl: "/governance/biographies/mari-djata-keita-v",
      mandenDjeliba: { fr: "Mabougnata Dibla Ibrahim Diabate" },
      mandenDjelibaUrl: "/governance/biographies/mabougnata-dibla-ibrahim-diabate",
      mandenMory: { fr: "Mabougnata Alpha Omar Kaba" },
      mandenMoryUrl: "/governance/biographies/mabougnata-alpha-omar-kaba",
      governmentName: { fr: "Empire Manden" },
      governmentNameUrl: "/governance/biographies/manden-empire",
      constitution: { fr: "Kouroukan Fouga, adoptée en 1236" },
      constitutionUrl: "/governance/biographies/kouroukan-fouga",
      governmentType: { fr: "Monarchie" },
      corruptionIndex: "05",
      corruptionSummary: {
        fr: "Notez que chaque pays est classé sur une échelle de 1 à 195, où 1 est le moins corrompu. Sanun Jara est l'un des gouvernements les moins corrompus au monde."
      },
      riskIndex: "A",
      riskSummary: {
        fr: "L'Empire Manden est un gouvernement stable, avec la majorité des risques atténués. Les institutions ancestrales sont enracinées depuis quatre millénaires."
      },
      taxInformation: { fr: "Décidé par région" },
      branches: [
        {
          name: { fr: "Comité de Réflexion" },
          powers: { fr: "Filtre les idées en fonction de leur alignement avec les principes du Manden." },
          selection: { fr: "Méritocratique" },
          url: "/governance/biographies/reflection-committee"
        },
        {
          name: { fr: "Assemblée Générale" },
          powers: { fr: "Obtient un consensus au sein de la communauté Manden." },
          selection: { fr: "Méritocratique" },
          url: "/governance/biographies/general-assembly"
        },
        {
          name: { fr: "Comité Législatif" },
          powers: { fr: "Gère la promulgation des protocoles de gouvernance." },
          selection: { fr: "Méritocratique" },
          url: "/governance/biographies/legislative-committee"
        }
      ],
      phone: "1 (800) 636-5913"
    }
  },
  {
    key: "global-perspectives",
    title: { fr: "Perspectives Globales" },
    content: {
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
    title: { fr: "Bureau de Référence" },
    content: {
      fr: "Le Bureau de Référence aide les visiteurs à rejoindre le réseau, à poser des questions ou à exprimer leur intérêt entrepreneurial.\n\nCes canaux peuvent commencer comme des espaces réservés et devenir plus détaillés au fil du temps à mesure que de nouveaux formulaires, contacts et flux de travail sont ajoutés."
    },
    images: [],
    links: [],
    utilityCards: [
      {
        id: "join",
        title: { fr: "Je veux rejoindre" },
        description: { fr: "Découvrez l'adhésion et comment faire partie de la communauté Manden." },
        url: ""
      },
      {
        id: "questions",
        title: { fr: "J'ai des questions" },
        description: { fr: "Obtenez des réponses sur l'Empire Manden, sa gouvernance et sa mission." },
        url: ""
      },
      {
        id: "entrepreneur",
        title: { fr: "Je suis entrepreneur" },
        description: { fr: "Découvrez les opportunités pour les entrepreneurs au sein du réseau Manden." },
        url: ""
      }
    ]
  },
  {
    key: "academy",
    title: { fr: "Académie" },
    content: {
      fr: "L'Académie peut présenter des cours sur l'alphabet de l'Afrique de l'Ouest, l'histoire et d'autres programmes d'apprentissage.\n\nVous pouvez publier ces éléments progressivement et mettre à jour les liens des cours au fil du temps depuis le tableau de bord d'administration."
    },
    images: [],
    links: [],
    utilityCards: [
      {
        id: "nko",
        title: { fr: "Cours en N'ko" },
        description: { fr: "Apprenez l'écriture N'ko et les cours de langue." },
        url: ""
      },
      {
        id: "history-courses",
        title: { fr: "Cours d'histoire" },
        description: { fr: "Étudiez la riche histoire de l'Empire Manden." },
        url: ""
      },
      {
        id: "others",
        title: { fr: "Autres cours" },
        description: { fr: "Programmes éducatifs et formations supplémentaires." },
        url: ""
      }
    ]
  },
  {
    key: "economy",
    title: { fr: "Économie du Manden" },
    content: { fr: "L'Empire Manden maintient un système économique robuste fondé sur les principes ancestraux d'équité, de transparence et de bien-être communautaire. Notre économie soutient les membres par des services de transfert efficaces, des lettres de recommandation vérifiées et un système de cotisations structuré qui finance le développement communautaire.\n\nToutes les transactions financières sont menées avec la plus grande intégrité, reflétant les valeurs Manden d'honnêteté et de responsabilité reconnues mondialement depuis 1351 A.D." },
    images: [],
    links: []
  },
  { key: "commerce", title: { fr: "Commerce" }, content: { fr: "Promotion des marchandises de différents commerçants et entrepreneurs, avec leurs informations de contact." }, images: [], links: [] },
  { key: "culture", title: { fr: "Culture" }, content: { fr: "Vidéos et interventions des Djelis, Donsos et journalistes du Manden." }, images: [], links: [], media: [] },
  { key: "resources", title: { fr: "Ressources" }, content: { fr: "" }, images: [], links: [], media: [] }
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

