import type { TranslationKey } from "@/lib/i18n";

export type CoreNavItem = {
  key: TranslationKey;
  path: string;
};

export type UtilityNavChild = {
  id: string;
  key: TranslationKey;
};

export type UtilityNavItem = {
  key: TranslationKey;
  path: string;
  children: UtilityNavChild[];
};

export const coreNavItems: CoreNavItem[] = [
  { key: "introduction", path: "/" },
  { key: "history", path: "/history" },
  { key: "governance", path: "/governance" },
  { key: "economy", path: "/economy" },
  { key: "commerce", path: "/commerce" },
  { key: "culture", path: "/culture" },
  { key: "resources", path: "/resources" },
];

export const utilityNavItems: UtilityNavItem[] = [
  {
    key: "globalPerspectives",
    path: "/global-perspectives",
    children: [
      { id: "country", key: "byCountry" },
      { id: "organization", key: "byOrganization" },
    ],
  },
  {
    key: "referenceBureau",
    path: "/reference-bureau",
    children: [
      { id: "join", key: "wantToJoin" },
      { id: "questions", key: "haveQuestions" },
      { id: "entrepreneur", key: "iAmEntrepreneur" },
    ],
  },
  {
    key: "academy",
    path: "/academy",
    children: [
      { id: "nko", key: "coursesNko" },
      { id: "history-courses", key: "historyCourses" },
      { id: "others", key: "otherCourses" },
    ],
  },
  {
    key: "intranet",
    path: "/intranet",
    children: [
      { id: "login", key: "connection" },
      { id: "membership", key: "notYetMember" },
      { id: "recommendation", key: "recommendSomeone" },
    ],
  },
];

export function buildQuickNavItems(labels: Record<TranslationKey, string>) {
  return [
    ...coreNavItems.map((item) => ({
      id: item.path,
      label: labels[item.key],
      path: item.path,
      parentLabel: "",
    })),
    ...utilityNavItems.flatMap((item) => [
      {
        id: item.path,
        label: labels[item.key],
        path: item.path,
        parentLabel: "",
      },
      ...item.children.map((child) => ({
        id: `${item.path}#${child.id}`,
        label: labels[child.key],
        path: `${item.path}#${child.id}`,
        parentLabel: labels[item.key],
      })),
    ]),
  ];
}
