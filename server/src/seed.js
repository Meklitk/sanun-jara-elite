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
      { year: "3000 B.C.", title: { en: "Arrival of Mandenkas" }, description: { en: "" } },
      { year: "980 A.D.", title: { en: "First University in the world" }, description: { en: "" } },
      { year: "1236 A.D.", title: { en: "World's first constitution of human rights, abolished slavery" }, description: { en: "" } },
      { year: "1312 A.D.", title: { en: "Discovery of America" }, description: { en: "" } },
      { year: "1324 A.D.", title: { en: "The richest man in history" }, description: { en: "" } },
      { year: "1351 A.D.", title: { en: "Named most honest people on earth" }, description: { en: "" } },
      { year: "1455 A.D.", title: { en: "Manden wins war against Portugal" }, description: { en: "" } },
      { year: "2020 A.D.", title: { en: "Return of the Empire" }, description: { en: "" } },
      { year: "2023 A.D.", title: { en: "Creation of Manden Calendar" }, description: { en: "" } }
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
      mandenMansa: { en: "Mari Djata Keita V" },
      mandenDjeliba: { en: "Mabougnata Dibla Ibrahim Diabate" },
      mandenMory: { en: "Mabougnata Alpha Omar Kaba" },
      governmentName: { en: "Manden Empire" },
      constitution: { en: "Kouroukan Fouga, adopted in 1236" },
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
          selection: { en: "Meritocratic" }
        },
        {
          name: { en: "General Assembly" },
          powers: { en: "Obtains consensus from within the Manden community." },
          selection: { en: "Meritocratic" }
        },
        {
          name: { en: "Legislative Committee" },
          powers: { en: "Handles the promulgation of governing protocols." },
          selection: { en: "Meritocratic" }
        }
      ],
      phone: "1 (800) 636-5913"
    }
  },
  {
    key: "economy",
    title: { en: "Economy" },
    content: { en: "Economic information, data analytics, service: means of transferring money, system of letters of recommendation, dues system." },
    images: [],
    links: [
      { label: { en: "Donate" }, url: "https://example.com/donate" }
    ]
  },
  { key: "commerce", title: { en: "Commerce" }, content: { en: "Promotion of merchandise from different merchants and entrepreneurs, with their contact information." }, images: [], links: [] },
  { key: "culture", title: { en: "Culture" }, content: { en: "Videos and interventions of Djelis, Donsos, and journalists of Manden." }, images: [], links: [], media: [] },
  { key: "resources", title: { en: "Resources" }, content: { en: "" }, images: [], links: [], media: [] }
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

