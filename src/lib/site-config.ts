import type { TranslationKey } from "@/lib/i18n";

export type CoreNavItem = {
  key: TranslationKey;
  path: string;
};

export type UtilityNavChild = {
  id: string;
  key: TranslationKey;
  path?: string;
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
      { id: "country", key: "byCountry", path: "/global-perspectives/country" },
      { id: "organization", key: "byOrganization", path: "/global-perspectives/organization" },
    ],
  },
  {
    key: "referenceBureau",
    path: "/reference-bureau",
    children: [
      { id: "join", key: "wantToJoin", path: "/reference-bureau/join" },
      { id: "questions", key: "haveQuestions", path: "/reference-bureau/questions" },
      { id: "entrepreneur", key: "iAmEntrepreneur", path: "/reference-bureau/entrepreneur" },
    ],
  },
  {
    key: "niani",
    path: "/niani",
    children: [
      { id: "institutions", key: "institutions", path: "/niani/institutions" },
      { id: "architectural-projects", key: "architecturalProjects", path: "/niani/architectural-projects" },
      { id: "niani-tv", key: "nianiTv", path: "/niani/niani-tv" },
    ],
  },
  {
    key: "academy",
    path: "/academy",
    children: [
      { id: "nko", key: "coursesNko", path: "/academy/nko" },
      { id: "history-courses", key: "historyCourses", path: "/academy/history-courses" },
      { id: "others", key: "otherCourses", path: "/academy/others" },
    ],
  },
  {
    key: "intranet",
    path: "/intranet",
    children: [
      { id: "login", key: "connection", path: "/admin/login" },
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
