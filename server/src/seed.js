import bcrypt from "bcryptjs";
import { Admin } from "./models/Admin.js";
import { Page } from "./models/Page.js";

const DEFAULT_PAGES = [
  {
    key: "introduction",
    title: { en: "Manden Empire" },
    content: {
      en: `## Sanun Jara\n\nSanun Jara is the administration that facilitates the reincarnation of Manden Mansaya. Sanun Jara signifies "golden lion."\n\n## Manden\n\nManden means "union." It is the amalgamation of all of the people of the land, irrespective of nationality, ethnicity, religious or political background.\n\n## Vision\n\nA unified Manden where monarchic governance, cultural memory, and modern education serve every people of the empire — preserved for UNESCO-aligned intangible heritage documentation and future generations.\n\n## Mission\n\nSanun Jara facilitates the reincarnation of Manden Mansaya: governing with transparency, welcoming membership through the Reference Bureau, teaching N'Ko and history through the Academy, documenting leaders and traditions, and connecting the global Manden diaspora.\n\n## Fundamental Values\n\nManden respects the Kouroukan Fouga, the world's first constitution that universally declares the rights of man.\n\n## Culture\n\nManden culture lives through the jelis (oral historians), Donso hunters, Carri traditions, N'Ko writing, music, architecture, and the Sunday general assembly. Sanun Jara documents and broadcasts these living traditions through Niani TV, the Academy, and UNESCO-aligned archives.`,
      fr: `## Sanun Jara\n\nSanun Jara est l'administration qui facilite la réincarnation du Manden Mansaya. Sanun Jara signifie « lion d'or ».\n\n## Manden\n\nManden signifie « union ». C'est l'amalgamation de tous les peuples du pays, quelle que soit leur nationalité, leur ethnie, leur appartenance religieuse ou politique.\n\n## Vision\n\nUn Manden uni où la gouvernance monarchique, la mémoire culturelle et l'éducation moderne servent tous les peuples de l'empire — préservés pour la documentation UNESCO du patrimoine immatériel et pour les générations futures.\n\n## Mission\n\nSanun Jara facilite la réincarnation du Manden Mansaya : gouverner avec transparence, accueillir les adhésions via le Bureau de références, enseigner le N'Ko et l'histoire par l'Académie, documenter les dirigeants et les traditions, et relier la diaspora mondiale du Manden.\n\n## Valeurs fondamentales\n\nManden respecte la Kouroukan Fouga, la première constitution au monde qui déclare universellement les droits de l'homme.\n\n## Culture\n\nLa culture du Manden vit à travers les djélis (historiens oraux), les chasseurs Donso, les traditions Carri, l'écriture N'Ko, la musique, l'architecture et l'assemblée générale du dimanche. Sanun Jara documente et diffuse ces traditions vivantes via Niani TV, l'Académie et les archives alignées sur l'UNESCO.`
    },
    images: [],
    links: []
  },
  {
    key: "history",
    title: { en: "History of Manden", fr: "Histoire de Manden" },
    content: { en: "", fr: "" },
    images: [],
    links: [],
    timeline: [
      { year: "3000 B.C.", title: { en: "Arrival of Mandenkas", fr: "Arrivée des Mandenkás" }, description: { en: "The ancient Mandenka people arrived in West Africa, establishing the foundation of what would become the great Manden Empire.", fr: "Les anciens peuples Mandenka sont arrivés en Afrique de l'Ouest, établissant les fondations de ce qui deviendrait le grand Empire Manden." }, url: "/history/timeline/arrival-of-mandenkas" },
      { year: "980 A.D.", title: { en: "First University in the world", fr: "Première Université au monde" }, description: { en: "", fr: "" }, url: "/history/timeline/first-university-in-the-world" },
      { year: "1236 A.D.", title: { en: "World's first constitution of human rights, abolished slavery", fr: "Première constitution des droits humains, abolition de l'esclavage" }, description: { en: "", fr: "" }, url: "/history/timeline/world-s-first-constitution-of-human-rights-abolished-slavery" },
      { year: "1312 A.D.", title: { en: "Discovery of America", fr: "Découverte de l'Amérique" }, description: { en: "", fr: "" }, url: "/history/timeline/discovery-of-america" },
      { year: "1324 A.D.", title: { en: "The richest man in history", fr: "L'homme le plus riche de l'histoire" }, description: { en: "", fr: "" }, url: "/history/timeline/the-richest-man-in-history" },
      { year: "1351 A.D.", title: { en: "Named most honest people on earth", fr: "Nommés peuple le plus honnête de la terre" }, description: { en: "", fr: "" }, url: "/history/timeline/named-most-honest-people-on-earth" },
      { year: "1455 A.D.", title: { en: "Manden wins war against Portugal", fr: "Manden gagne la guerre contre le Portugal" }, description: { en: "", fr: "" }, url: "/history/timeline/manden-wins-war-against-portugal" },
      { year: "2020 A.D.", title: { en: "Return of the Empire", fr: "Retour de l'Empire" }, description: { en: "", fr: "" }, url: "/history/timeline/return-of-the-empire" },
      { year: "2023 A.D.", title: { en: "Creation of Manden Calendar", fr: "Création du Calendrier Manden" }, description: { en: "", fr: "" }, url: "/history/timeline/creation-of-manden-calendar" }
    ]
  },
  {
    key: "governance",
    title: { en: "Governance" },
    content: {
      en: "Manden Empire governance combines ancestral legitimacy, institutional order, and community accountability.\n\nThe structure below presents the chiefdom, the principal offices, the constitutional framework, and the governing bodies that support public stewardship."
    },
    images: ["/images/manden-flag-lion.svg", "/images/coat-of-arms-manden.png"],
    links: [
      { label: { en: "wikipedia.org/manden_empire" }, url: "https://en.wikipedia.org/wiki/Mali_Empire" },
      { label: { en: "wikipedia.org/sanun_jara (in creation)" }, url: "" },
      { label: { en: "Le Djeliba" }, url: "" }
    ],
    governance: {
      chiefdom: { en: "Manden Mansaya" },
      chiefdomUrl: "/governance/biographies/manden-mansaya",
      mandenMansa: { en: "Mari Djata Keita V" },
      mandenMansaUrl: "/governance/biographies/mari-djata-keita-v",
      mandenDjeliba: { en: "Mabougnata Dibla Ibrahim Diabate" },
      mandenDjelibaUrl: "/governance/biographies/mabougnata-djeliba-ibrahim-diabate",
      mandenMory: { en: "Mabougnata Alpha Omar Kaba" },
      mandenMoryUrl: "/governance/biographies/mabougnata-alpha-omar-kaba",
      governmentName: { en: "Manden Empire" },
      governmentNameUrl: "/governance/biographies/manden-empire",
      constitution: { en: "Kouroukan Fouga, adopted in 1236" },
      constitutionUrl: "/governance/biographies/kouroukan-fouga",
      governmentType: { en: "Monarchy" },
      corruptionIndex: "01",
      corruptionSummary: {
        en: "Note that every country ranks on a scale from 1 to 195, where 1 is the least corrupt. Sanun Jara is one of the least corrupt governments in the world.",
        fr: "Chaque pays est classé sur une échelle de 1 à 195, où 1 est le moins corrompu. Sanun Jara est l'un des gouvernements les moins corrompus au monde."
      },
      riskIndex: "A",
      riskSummary: {
        en: "Manden Empire is a stable government, with the majority of risks attenuated. Ancestral institutions are ingrained since four millennia.",
        fr: "L'Empire Manden est un gouvernement stable, avec la majorité des risques atténués. Les institutions ancestrales sont enracinées depuis quatre millénaires."
      },
      taxInformation: { en: "Decided per region", fr: "Décidé par région" },
      branches: [
        {
          name: { en: "Reflection Committee", fr: "Comité de réflexion" },
          powers: {
            en: "Filters ideas based on alignment with Manden principles.",
            fr: "Filtre les idées selon leur alignement avec les principes du Manden."
          },
          selection: { en: "Meritocratic", fr: "Méritocratique" },
          url: "/governance/biographies/reflection-committee"
        },
        {
          name: { en: "General Assembly", fr: "Assemblée générale" },
          powers: {
            en: "Obtains consensus from within the Manden community.",
            fr: "Obtient le consensus au sein de la communauté du Manden."
          },
          selection: { en: "Meritocratic", fr: "Méritocratique" },
          url: "/governance/biographies/general-assembly"
        },
        {
          name: { en: "Legislative Committee", fr: "Comité législatif" },
          powers: {
            en: "Handles the promulgation of governing protocols.",
            fr: "Gère la promulgation des protocoles de gouvernance."
          },
          selection: { en: "Meritocratic", fr: "Méritocratique" },
          url: "/governance/biographies/legislative-committee"
        }
      ],
      phone: "1 (800) 636-5913"
    }
  },
  {
    key: "global-perspectives",
    title: { en: "Global Perspectives" },
    content: {
      en: "Browse the Manden network by federation, organization, or affiliation.\n\nEntries can be added over time and are displayed alphabetically on the public page."
    },
    images: [],
    links: [],
    directory: {
      countries: [
        {
          name: { en: "Niani", fr: "Niani" },
          description: {
            en: "The heart of the Manden Empire — institutions, architecture, and Niani TV.",
            fr: "Le cœur de l'Empire Manden — institutions, architecture et Niani TV."
          },
          url: "/niani"
        },
        {
          name: { en: "Hamana", fr: "Hamana" },
          description: {
            en: "Explore Hamana, a historic Manden heartland in Guinea — oral traditions, local institutions, and living heritage.",
            fr: "Découvrez Hamana, un foyer historique du Manden en Guinée — traditions orales, institutions locales et patrimoine vivant."
          },
          url: ""
        },
        {
          name: { en: "Tombouctou", fr: "Tombouctou" },
          description: {
            en: "Discover Tombouctou, the city of 333 saints and a pillar of Manden heritage.",
            fr: "Découvrez Tombouctou, la ville des 333 saints et un pilier du patrimoine du Manden."
          },
          url: "/tombouctou"
        }
      ],
      organizations: [],
      affiliations: []
    }
  },
  {
    key: "reference-bureau",
    title: { en: "Reference Bureau", fr: "Bureau de Référence" },
    content: {
      en: "You can join the Manden community, ask questions about our mission and governance, or connect as an entrepreneur. Choose one of the options below to get started.",
      fr: "Vous pouvez rejoindre la communauté du Manden, poser vos questions sur notre mission et notre gouvernance, ou vous connecter en tant qu'entrepreneur. Choisissez une des options ci-dessous pour commencer."
    },
    images: [],
    links: [],
    utilityCards: [
      {
        id: "join",
        title: { en: "I Want to Join", fr: "Je veux joindre" },
        description: { en: "Learn about membership and how to become part of the Manden community.", fr: "Découvrez l'adhésion et comment rejoindre la communauté du Manden." },
        url: "/reference-bureau/join"
      },
      {
        id: "questions",
        title: { en: "I Have Questions", fr: "J'ai des questions" },
        description: { en: "Get answers about the Manden Empire, its governance, and its mission.", fr: "Obtenez des réponses sur l'Empire du Manden, sa gouvernance et sa mission." },
        url: "/reference-bureau/questions"
      },
      {
        id: "entrepreneur",
        title: { en: "I Am an Entrepreneur", fr: "Je suis entrepreneur" },
        description: {
          en: "Discover opportunities for entrepreneurs within the Manden network.",
          fr: "Découvrez les opportunités pour les entrepreneurs au sein du réseau Manden."
        },
        url: "/bureau/entrepreneur"
      }
    ]
  },
  {
    key: "niani",
    title: { en: "Niani" },
    content: {
      en: "Niani - The heart of the Manden Empire. Explore institutions, architectural projects, and our media channel.\n\nContent for each section can be added and managed from the admin dashboard."
    },
    images: [],
    links: [],
    institutions: [
      {
        id: "women",
        name: { en: "Women's Institution", fr: "Institution des Femmes" },
        description: {
          en: "The women's institution supports leadership, education, and community service within Sanun Jara and the Manden Empire.",
          fr: "L'institution des femmes soutient le leadership, l'éducation et le service communautaire au sein de Sanun Jara et de l'Empire du Manden."
        },
        images: [],
        videos: []
      }
    ],
    architecturalProjects: [],
    utilityCards: [
      {
        id: "institutions",
        title: { en: "Institutions" },
        description: { en: "Different institutions and their pictures and videos." },
        url: "/niani/institutions"
      },
      {
        id: "architectural-projects",
        title: { en: "Architectural Projects" },
        description: { en: "List of architectural structures and their conceptual images." },
        url: "/niani/architectural-projects"
      },
      {
        id: "niani-tv",
        title: { en: "Niani TV" },
        description: { en: "Videos and link to the Niani YouTube channel." },
        url: "/niani/niani-tv"
      }
    ]
  },
  {
    key: "academy",
    title: { en: "Academy" },
    content: {
      en: "The Academy can present courses in the alphabet of West Africa, history, and other learning programs.\n\nYou can publish these gradually and update the course links over time from the admin dashboard."
    },
    images: [],
    links: [],
    utilityCards: [
      {
        id: "nko",
        title: { en: "Courses in N'ko", fr: "Cours en N'ko" },
        description: { en: "Learn the N'ko script and language courses.", fr: "Apprenez l'écriture et la langue N'ko." },
        url: "/academy/nko"
      },
      {
        id: "history-courses",
        title: { en: "History Courses" },
        description: { en: "Study the rich history of the Manden Empire." },
        url: ""
      },
      {
        id: "others",
        title: { en: "Other Courses" },
        description: { en: "Additional educational programs and training." },
        url: ""
      }
    ]
  },
  {
    key: "economy",
    title: { en: "Economy of Manden" },
    content: { en: "The Manden Empire maintains a robust economic system built on ancestral principles of fairness, transparency, and community welfare. Our economy supports members through efficient transfer services, verified recommendation letters, and a structured dues system that funds communal development.\n\nAll financial transactions are conducted with the utmost integrity, reflecting the Manden values of honesty and accountability that have been recognized globally since 1351 A.D." },
    images: [],
    links: []
  },
  { key: "commerce", title: { en: "Commerce" }, content: { en: "Promotion of merchandise from different merchants and entrepreneurs, with their contact information." }, images: [], links: [] },
  { key: "culture", title: { en: "Culture" }, content: { en: "Videos and interventions of Djelis, Donsos, and journalists of Manden." }, images: [], links: [], media: [] },
  {
    key: "resources",
    title: { en: "Resources", fr: "Ressources" },
    content: {
      en: "This section preserves and presents Manden intangible heritage for UNESCO-aligned documentation: royalty, elders, Donso hunters, Carri traditions, institutions, and N'Ko writing.\n\nUpload backup documents, research materials, and archival PDFs here. Regular database backups should be maintained through your hosting provider.",
      fr: "Cette section préserve et présente le patrimoine immatériel du Manden dans une perspective UNESCO : royauté, anciens, chasseurs Donso, traditions Carri, institutions et écriture N'Ko.\n\nTéléversez ici les documents de sauvegarde, les recherches et les archives PDF. Des sauvegardes régulières de la base de données doivent être maintenues via votre hébergeur."
    },
    images: [],
    links: [
      {
        label: { en: "UNESCO — Intangible Cultural Heritage", fr: "UNESCO — Patrimoine culturel immatériel" },
        url: "https://ich.unesco.org/"
      }
    ],
    media: []
  },
  {
    key: "tombouctou",
    title: { en: "Tombouctou", fr: "Tombouctou" },
    content: {
      en: "Tombouctou — the city of 333 saints — stands among the great learning centers of West Africa and a pillar of Manden heritage.\n\nFor centuries, scholars at Sankoré and other mosques preserved Islamic, scientific, and Manden knowledge. The city flourished as a crossroads of trade and education under the Mali Empire, including the historic pilgrimage of Mansa Musa.\n\nSanun Jara honors Tombouctou as part of the living memory of Manden — its manuscripts, saints, and university tradition. Additional texts and images can be refined from the admin dashboard.",
      fr: "Tombouctou — la ville des 333 saints — compte parmi les grands centres de savoir d'Afrique de l'Ouest et constitue un pilier du patrimoine du Manden.\n\nPendant des siècles, les savants de Sankoré et d'autres mosquées ont préservé les connaissances islamiques, scientifiques et du Manden. La ville s'est épanouie comme carrefour du commerce et de l'éducation sous l'Empire du Mali, notamment lors du pèlerinage historique de Mansa Musa.\n\nSanun Jara honore Tombouctou comme partie de la mémoire vivante du Manden — ses manuscrits, ses saints et sa tradition universitaire. Des textes et images supplémentaires peuvent être affinés depuis le tableau de bord administrateur."
    },
    images: [],
    links: []
  }
];

export async function seedAdminIfNeeded({ username, password }) {
  const existing = await Admin.findOne({ username });
  if (existing) {
    console.log(`✅ Admin user "${username}" already exists`);
    return existing;
  }
  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await Admin.create({ username, passwordHash });
  console.log(`✅ Created admin user: ${username}`);
  return admin;
}

export async function seedPagesIfNeeded() {
  const count = await Page.countDocuments();
  console.log(`📄 Pages in DB: ${count}`);
  if (count > 0) {
    console.log(`✅ Pages already exist, skipping seed`);
    return;
  }
  console.log(`🌱 Seeding ${DEFAULT_PAGES.length} pages...`);
  await Page.insertMany(DEFAULT_PAGES);
  console.log(`✅ Seeded ${DEFAULT_PAGES.length} pages`);
}

/** Insert any missing default pages by `key` (safe if DB already had partial data). */
export async function ensureDefaultPages() {
  let added = 0;
  let updated = 0;
  for (const doc of DEFAULT_PAGES) {
    const exists = await Page.findOne({ key: doc.key }).lean();
    if (!exists) {
      await Page.create(doc);
      added++;
    } else {
      // Update existing page with any missing fields
      const updateData = {};
      for (const key of Object.keys(doc)) {
        if (!(key in exists)) {
          updateData[key] = doc[key];
        }
      }
      if (Object.keys(updateData).length > 0) {
        await Page.updateOne({ key: doc.key }, { $set: updateData });
        updated++;
      }
    }
  }
  if (added > 0) console.log(`✅ Added ${added} missing pages`);
  if (updated > 0) console.log(`✅ Updated ${updated} pages with missing fields`);
  await migrateReferenceBureauCards();
  await migrateReferenceBureauContent();
  await migrateStarterContent();
}

const REFERENCE_BUREAU_PLACEHOLDER_MARKERS = [
  "begin as placeholders",
  "become more detailed over time",
  "register entrepreneurial interest",
  "contribute through Cotiser",
  "forwarded to info@sanunjara.com",
  "peuvent commencer comme des espaces réservés",
  "deviennent plus détaillés au fil du temps",
];

async function migrateReferenceBureauContent() {
  const refDefault = DEFAULT_PAGES.find((page) => page.key === "reference-bureau");
  if (!refDefault) return;

  const refPage = await Page.findOne({ key: "reference-bureau" });
  if (!refPage) return;

  const en = refPage.content?.en ?? "";
  const fr = refPage.content?.fr ?? "";
  const shouldUpdate =
    contentHasPlaceholder(en, REFERENCE_BUREAU_PLACEHOLDER_MARKERS) ||
    contentHasPlaceholder(fr, REFERENCE_BUREAU_PLACEHOLDER_MARKERS);

  if (!shouldUpdate) return;

  await Page.updateOne({ key: "reference-bureau" }, { $set: { content: refDefault.content } });
  console.log("✅ Updated Reference Bureau intro copy");
}

const INTRO_PLACEHOLDER_MARKERS = [
  "Content to be supplied by the client",
  "Contenu à fournir par le client",
];

const TOMB_PLACEHOLDER_MARKERS = [
  "Content and images can be added from the admin dashboard",
  "Le contenu et les images peuvent être ajoutés depuis le tableau de bord administrateur",
];

function contentHasPlaceholder(value, markers) {
  return typeof value === "string" && markers.some((marker) => value.includes(marker));
}

/** Replace starter placeholders when the client has not yet edited those pages. */
async function migrateStarterContent() {
  const introDefault = DEFAULT_PAGES.find((page) => page.key === "introduction");
  const tombDefault = DEFAULT_PAGES.find((page) => page.key === "tombouctou");
  if (!introDefault || !tombDefault) return;

  const intro = await Page.findOne({ key: "introduction" });
  if (
    intro &&
    (contentHasPlaceholder(intro.content?.en, INTRO_PLACEHOLDER_MARKERS) ||
      contentHasPlaceholder(intro.content?.fr, INTRO_PLACEHOLDER_MARKERS))
  ) {
    await Page.updateOne(
      { key: "introduction" },
      { $set: { content: introDefault.content } },
    );
    console.log("✅ Updated introduction starter content (Vision, Mission, Culture)");
  }

  const tomb = await Page.findOne({ key: "tombouctou" });
  if (
    tomb &&
    (contentHasPlaceholder(tomb.content?.en, TOMB_PLACEHOLDER_MARKERS) ||
      contentHasPlaceholder(tomb.content?.fr, TOMB_PLACEHOLDER_MARKERS))
  ) {
    await Page.updateOne(
      { key: "tombouctou" },
      { $set: { content: tombDefault.content } },
    );
    console.log("✅ Updated Tombouctou starter content");
  }
}

async function migrateReferenceBureauCards() {
  const refPage = await Page.findOne({ key: "reference-bureau" });
  if (!refPage?.utilityCards?.length) return;

  let changed = false;
  const cards = refPage.utilityCards.map((card) => {
    const raw = card.toObject?.() ?? card;
    if (raw.id !== "cotiser" && raw.id !== "entrepreneur") return raw;
    if (raw.id === "entrepreneur") return raw;

    changed = true;
    return {
      ...raw,
      id: "entrepreneur",
      title: {
        en: "I Am an Entrepreneur",
        fr: "Je suis entrepreneur",
        ...(raw.title ?? {}),
      },
      description: {
        en: "Discover opportunities for entrepreneurs within the Manden network.",
        fr: "Découvrez les opportunités pour les entrepreneurs au sein du réseau Manden.",
        ...(raw.description ?? {}),
      },
      url: raw.url?.trim() ? raw.url : "/bureau/entrepreneur",
    };
  });

  if (changed) {
    await Page.updateOne({ key: "reference-bureau" }, { $set: { utilityCards: cards } });
    console.log("✅ Migrated reference-bureau cotiser card to entrepreneur");
  }
}

