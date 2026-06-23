export type NkoLetter = {
  char: string;
  /** Label shown under the glyph on the lesson page. */
  romanization: string;
  /** Optional TTS phrase when no recording is available. */
  speakAs?: string;
  /** N'Ko filenames (without extension) to try for playback, in order. */
  audioFrom?: string[];
};

/**
 * Manden N'Ko lesson — 27 letters (Unicode U+07CA–U+07EA).
 * Romanization and audio playback follow the reference recordings shared by Mansa.
 */
export const NKO_ALPHABET: NkoLetter[] = [
  { char: "ߊ", romanization: "a" },
  { char: "ߋ", romanization: "e" },
  { char: "ߌ", romanization: "i" },
  { char: "ߍ", romanization: "ɛ", speakAs: "eh" },
  { char: "ߎ", romanization: "u" },
  { char: "ߏ", romanization: "o" },
  { char: "ߐ", romanization: "ɔ", speakAs: "aw" },
  { char: "ߑ", romanization: "ŋ", speakAs: "ng" },
  { char: "ߒ", romanization: "mh", speakAs: "mh" },
  { char: "ߓ", romanization: "ba", speakAs: "ba" },
  { char: "ߔ", romanization: "pa", speakAs: "pa" },
  { char: "ߕ", romanization: "ta", speakAs: "ta" },
  { char: "ߖ", romanization: "ja", speakAs: "ja" },
  { char: "ߗ", romanization: "cha", speakAs: "cha" },
  { char: "ߘ", romanization: "da", speakAs: "da" },
  { char: "ߙ", romanization: "ra", speakAs: "ra" },
  { char: "ߚ", romanization: "rara", speakAs: "rara" },
  { char: "ߛ", romanization: "sa", speakAs: "sa" },
  { char: "ߜ", romanization: "gwa", speakAs: "gwa" },
  { char: "ߝ", romanization: "fa", speakAs: "fa" },
  { char: "ߞ", romanization: "ka", speakAs: "ka" },
  { char: "ߟ", romanization: "la", speakAs: "la" },
  { char: "ߠ", romanization: "wa", speakAs: "wa" },
  { char: "ߡ", romanization: "ma", speakAs: "ma" },
  { char: "ߢ", romanization: "gna", speakAs: "gna" },
  { char: "ߣ", romanization: "na", speakAs: "na" },
  { char: "ߤ", romanization: "ya", speakAs: "ya" },
];

const AUDIO_EXTENSIONS = [".ogg", ".mp3", ".wav", ".m4a"];

export function getNkoAudioSources(letter: NkoLetter): string[] {
  const names = letter.audioFrom ?? [letter.char];
  const paths = names.flatMap((name) =>
    AUDIO_EXTENSIONS.flatMap((ext) => [
      `/audio/nko/${name}${ext}`,
      `/audio/nko/${encodeURIComponent(name)}${ext}`,
    ]),
  );

  return [...new Set(paths)];
}

export function getNkoSpeakText(letter: NkoLetter): string {
  return letter.speakAs ?? letter.romanization;
}

export function countExpectedRecordings() {
  return NKO_ALPHABET.length;
}
