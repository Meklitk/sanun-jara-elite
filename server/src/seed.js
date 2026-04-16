import bcrypt from "bcryptjs";
import { Admin } from "./models/Admin.js";
import { Page } from "./models/Page.js";

const DEFAULT_PAGES = [
  {
    key: "introduction",
    title: { en: "Manden Empire" },
    content: {
      en: `Manden means 'union'. It is the amalgamation of all of the people of the land, irrespective of their nationality, ethnicity, religious or political background.\n\nSanun Jara is the administration that facilitates the reincarnation of 'Manden Mansaya.' Sanun Jara signifies 'golden lion.'\n\nManden respects the Kouroukan Fouga, which is the world's first constitution that universally declares the rights of man.`
    },
    images: [],
    links: []
  },
  {
    key: "history",
    title: { en: "History of Manden" },
    content: { en: "" },
    images: [],
    links: [],
    timeline: [
      { year: "3000 B.C.", title: { en: "Arrival of Mandenkas" }, description: { en: "The ancient Mandenka people arrived in West Africa, establishing the foundation of what would become the great Manden Empire." }, url: "/history/timeline/arrival-of-mandenkas" },
      { year: "980 A.D.", title: { en: "First University in the world" }, description: { en: "" }, url: "/history/timeline/first-university-in-the-world" },
      { year: "1236 A.D.", title: { en: "World's first constitution of human rights, abolished slavery" }, description: { en: "" }, url: "/history/timeline/world-s-first-constitution-of-human-rights-abolished-slavery" },
      { year: "1312 A.D.", title: { en: "Discovery of America" }, description: { en: "" }, url: "/history/timeline/discovery-of-america" },
      { year: "1324 A.D.", title: { en: "The richest man in history" }, description: { en: "" }, url: "/history/timeline/the-richest-man-in-history" },
      { year: "1351 A.D.", title: { en: "Named most honest people on earth" }, description: { en: "" }, url: "/history/timeline/named-most-honest-people-on-earth" },
      { year: "1455 A.D.", title: { en: "Manden wins war against Portugal" }, description: { en: "" }, url: "/history/timeline/manden-wins-war-against-portugal" },
      { year: "2020 A.D.", title: { en: "Return of the Empire" }, description: { en: "" }, url: "/history/timeline/return-of-the-empire" },
      { year: "2023 A.D.", title: { en: "Creation of Manden Calendar" }, description: { en: "" }, url: "/history/timeline/creation-of-manden-calendar" }
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
        en: "Note that every country ranks on a scale from 1 to 195, where 1 is the least corrupt. Sanun Jara is one of the least corrupt governments in the world."
      },
      riskIndex: "A",
      riskSummary: {
        en: "Manden Empire is a stable government, with the majority of risks attenuated. Ancestral institutions are ingrained since four millennia."
      },
      taxInformation: { en: "Decided per region" },
      branches: [
        {
          name: { en: "Reflection Committee" },
          powers: { en: "Filters ideas based on alignment with Manden principles." },
          selection: { en: "Meritocratic" },
          url: "/governance/biographies/reflection-committee"
        },
        {
          name: { en: "General Assembly" },
          powers: { en: "Obtains consensus from within the Manden community." },
          selection: { en: "Meritocratic" },
          url: "/governance/biographies/general-assembly"
        },
        {
          name: { en: "Legislative Committee" },
          powers: { en: "Handles the promulgation of governing protocols." },
          selection: { en: "Meritocratic" },
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
      en: "Browse the Manden network by country or by organization.\n\nCountry entries can be added over time and are displayed alphabetically on the public page."
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
    title: { en: "Reference Bureau" },
    content: {
      en: "The Reference Bureau helps visitors join the network, ask questions, or register entrepreneurial interest.\n\nThese channels can begin as placeholders and become more detailed over time as new forms, contacts, and workflows are added."
    },
    images: [],
    links: [],
    utilityCards: [
      {
        id: "join",
        title: { en: "I Want to Join" },
        description: { en: "Learn about membership and how to become part of the Manden community." },
        url: ""
      },
      {
        id: "questions",
        title: { en: "I Have Questions" },
        description: { en: "Get answers about the Manden Empire, its governance, and its mission." },
        url: ""
      },
      {
        id: "entrepreneur",
        title: { en: "I Am an Entrepreneur" },
        description: { en: "Discover opportunities for entrepreneurs within the Manden network." },
        url: ""
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
    institutions: [],
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
        title: { en: "Courses in N'ko" },
        description: { en: "Learn the N'ko script and language courses." },
        url: ""
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
  { key: "resources", title: { en: "Resources" }, content: { en: "" }, images: [], links: [], media: [] }
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
}

