export const MEMBERSHIP_QUESTIONS = {
  en: [
    "Tell us about yourself.",
    "Do you support our monarchical structure, our vision, and our mission?",
    "Are you a Mandenka patriot, ready to work for unity among all peoples of Manden, regardless of ethnic or religious affiliation?",
    "Are you already a member of Sanun Jara? Have you read our bylaws?",
    "Do you commit to respecting the bylaws?",
    "Have you previously been affiliated with other organizations in Manden?",
    "Have you ever overcome a major challenge in your life?",
    "What do you appreciate about Sanun Jara?",
    "What does your schedule look like?",
    "Are you aware that Sanun Jara holds a general assembly every Sunday?",
    "If you stop voting or participating in general assemblies, do you accept exclusion by the discipline committee?",
    "Do you know that every member must vote on new recruits?",
    "Are you ready to work under the direction of a woman?",
    "Are you ready to serve in a volunteer structure?",
    "Are you ready to join the government of Sanun Jara?",
    "Do you believe you are qualified to be part of the leadership of Sanun Jara (Wana title)?",
    "Do you agree that time will reveal your true commitment and character within Sanun Jara?",
  ],
  fr: [
    "Parlez-nous de vous.",
    "Soutenez-vous notre structure monarchique, notre vision et notre mission ?",
    "Êtes-vous une patriote Mandenka, prête à œuvrer pour l'unité entre tous les peuples du Manden, quelle que soit leur appartenance ethnique ou religieuse ?",
    "Êtes-vous déjà membre de Sanun Jara ? Avez-vous lu notre règlement intérieur ?",
    "Vous engagez-vous à respecter le règlement intérieur ?",
    "Avez-vous déjà été affiliée à d'autres organisations du Manden ?",
    "Avez-vous déjà relevé un défi majeur dans votre vie ?",
    "Qu'est-ce qui vous plaît chez Sanun Jara ?",
    "À quoi ressemble votre emploi du temps ?",
    "Êtes-vous au courant que Sanun Jara tient une assemblée générale chaque dimanche ?",
    "Si vous cessez de voter ou de participer aux assemblées générales, acceptez-vous d'être exclue par le comité de discipline ?",
    "Savez-vous que chaque membre doit voter pour les nouvelles recrues ?",
    "Êtes-vous prête à travailler sous la direction d'une femme ?",
    "Êtes-vous prête à évoluer dans une structure bénévole ?",
    "Êtes-vous prête à intégrer le gouvernement de Sanun Jara ?",
    "Croyez-vous être à la hauteur pour faire partie de la chefferie de Sanun Jara (titre de Wana) ?",
    "Êtes-vous d'accord pour que le temps révèle votre véritable engagement et personnalité au sein de Sanun Jara ?",
  ],
} as const;

export function membershipQuestions(lang: "en" | "fr") {
  return MEMBERSHIP_QUESTIONS[lang];
}
