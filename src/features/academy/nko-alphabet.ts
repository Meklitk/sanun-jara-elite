export type NkoLetter = {
  char: string;
  romanization: string;
};

/** Standard N'Ko syllabary — 27 letters (Unicode U+07CA–U+07EA). */
export const NKO_ALPHABET: NkoLetter[] = [
  { char: "ߊ", romanization: "a" },
  { char: "ߋ", romanization: "e" },
  { char: "ߌ", romanization: "i" },
  { char: "ߍ", romanization: "ɛ" },
  { char: "ߎ", romanization: "u" },
  { char: "ߏ", romanization: "o" },
  { char: "ߐ", romanization: "ɔ" },
  { char: "ߑ", romanization: "ŋ" },
  { char: "ߒ", romanization: "b" },
  { char: "ߓ", romanization: "p" },
  { char: "ߔ", romanization: "gb" },
  { char: "ߕ", romanization: "t" },
  { char: "ߖ", romanization: "d" },
  { char: "ߗ", romanization: "nb" },
  { char: "ߘ", romanization: "n" },
  { char: "ߙ", romanization: "r" },
  { char: "ߚ", romanization: "s" },
  { char: "ߛ", romanization: "sh" },
  { char: "ߜ", romanization: "j" },
  { char: "ߝ", romanization: "h" },
  { char: "ߞ", romanization: "k" },
  { char: "ߟ", romanization: "l" },
  { char: "ߠ", romanization: "ny" },
  { char: "ߡ", romanization: "na" },
  { char: "ߢ", romanization: "w" },
  { char: "ߣ", romanization: "y" },
  { char: "ߤ", romanization: "n̄" },
];

/**
 * Alternate filenames that should play for a standard letter.
 * (Some recordings used neighbouring Unicode N'Ko codepoints.)
 */
const AUDIO_FILENAME_ALIASES: Record<string, string[]> = {
  ߊ: ["ߊ"],
  ߋ: ["ߋ"],
  ߌ: ["ߌ"],
  ߍ: ["ߍ"],
  ߎ: ["ߎ"],
  ߏ: ["ߏ"],
  ߐ: ["ߐ"],
  ߑ: ["ߑ"],
  ߒ: ["ߒ"],
  ߓ: ["ߓ"],
  ߔ: ["ߔ"],
  ߕ: ["ߕ"],
  ߖ: ["ߖ"],
  ߗ: ["ߗ"],
  ߘ: ["ߘ"],
  ߙ: ["ߙ"],
  ߚ: ["ߚ", "ߙߙ"],
  ߛ: ["ߛ"],
  ߜ: ["ߜ"],
  ߝ: ["ߝ"],
  ߞ: ["ߞ"],
  ߟ: ["ߟ"],
  ߠ: ["ߠ", "ߥ"],
  ߡ: ["ߡ"],
  ߢ: ["ߢ"],
  ߣ: ["ߣ"],
  ߤ: ["ߤ", "ߦ"],
};

const AUDIO_EXTENSIONS = [".ogg", ".mp3", ".wav", ".m4a"];

export function getNkoAudioSources(letter: NkoLetter): string[] {
  const names = AUDIO_FILENAME_ALIASES[letter.char] ?? [letter.char];
  const paths = names.flatMap((name) =>
    AUDIO_EXTENSIONS.flatMap((ext) => [
      `/audio/nko/${name}${ext}`,
      `/audio/nko/${encodeURIComponent(name)}${ext}`,
    ]),
  );

  return [...new Set(paths)];
}

export function countExpectedRecordings() {
  return NKO_ALPHABET.length;
}
