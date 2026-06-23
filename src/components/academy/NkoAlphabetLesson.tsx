import { useEffect, useRef, useState, type MutableRefObject } from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";

import { countExpectedRecordings, getNkoAudioSources, getNkoSpeakText, NKO_ALPHABET } from "@/features/academy/nko-alphabet";
import SectionEmojiHeader from "@/components/SectionEmojiHeader";
import {
  PageErrorState,
  PageLoadingState,
  PageNotFoundState,
  useCmsPage,
} from "@/features/pages/page-content";
import { useCardImages } from "@/lib/card-images-context";
import { SECTION_EMOJIS } from "@/lib/section-emojis";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function speakRomanization(text: string, lang: "en" | "fr") {
  if (!("speechSynthesis" in window)) return false;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang === "fr" ? "fr-FR" : "en-US";
  utterance.rate = 0.85;
  window.speechSynthesis.speak(utterance);
  return true;
}

function playAudioSource(src: string, audioRef: MutableRefObject<HTMLAudioElement | null>): Promise<boolean> {
  return new Promise((resolve) => {
    const audio = new Audio();
    audioRef.current = audio;
    let settled = false;

    const finish = (result: boolean) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    audio.addEventListener(
      "canplay",
      () => {
        audio.play().then(() => finish(true)).catch(() => finish(false));
      },
      { once: true },
    );
    audio.addEventListener("error", () => finish(false), { once: true });
    audio.src = src;
    audio.load();

    window.setTimeout(() => finish(false), 8000);
  });
}

export default function NkoAlphabetLesson() {
  const { lang } = useI18n();
  const { resolve } = useCardImages();
  const { page, isLoading, error } = useCmsPage("academy");
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const adminAudio = page?.nkoAlphabetAudio ?? [];
  const [recordedLetters, setRecordedLetters] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;

    async function probeRecordings() {
      const found = new Set<string>();

      await Promise.all(
        NKO_ALPHABET.map(async (letter, index) => {
          if (adminAudio[index]?.trim()) {
            found.add(letter.char);
            return;
          }

          for (const src of getNkoAudioSources(letter)) {
            try {
              const res = await fetch(src, { method: "HEAD" });
              const type = res.headers.get("content-type") ?? "";
              if (res.ok && type.startsWith("audio/")) {
                found.add(letter.char);
                break;
              }
            } catch {
              // ignore unreachable files
            }
          }
        }),
      );

      if (!cancelled) setRecordedLetters(found);
    }

    void probeRecordings();
    return () => {
      cancelled = true;
    };
  }, [adminAudio]);

  if (isLoading) return <PageLoadingState />;
  if (error) return <PageErrorState />;
  if (!page) return <PageNotFoundState />;

  async function playLetter(index: number) {
    const letter = NKO_ALPHABET[index];
    setActiveIndex(index);

    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    const sources = [
      adminAudio[index]?.trim(),
      ...getNkoAudioSources(letter),
    ].filter(Boolean) as string[];

    for (const src of sources) {
      const played = await playAudioSource(src, audioRef);
      if (played) {
        setUsingFallback(false);
        return;
      }
    }

    setUsingFallback(true);
    speakRomanization(getNkoSpeakText(letter), lang);
  }

  function hasRecording(index: number) {
    return recordedLetters.has(NKO_ALPHABET[index].char);
  }

  return (
    <div className="space-y-8">
      <SectionEmojiHeader
        imageUrl={resolve("academyNko")}
        emoji={SECTION_EMOJIS.nko}
        imageAlt={lang === "fr" ? "Apprentissage de l'alphabet N'Ko" : "Learning the N'Ko alphabet"}
        eyebrow={lang === "fr" ? "Leçon 1" : "Lesson 1"}
        title={lang === "fr" ? "Alphabet N'Ko" : "N'Ko Alphabet"}
        description={
          lang === "fr"
            ? `Cliquez sur chaque lettre pour entendre sa prononciation. ${recordedLetters.size}/${countExpectedRecordings()} enregistrements disponibles.`
            : `Click each letter to hear its pronunciation. ${recordedLetters.size}/${countExpectedRecordings()} recordings available.`
        }
      />
      {usingFallback ? (
        <p className="-mt-4 text-sm text-gold/70">
          {lang === "fr"
            ? "Aucun enregistrement pour cette lettre — prononciation temporaire utilisée."
            : "No recording for this letter yet — using temporary pronunciation."}
        </p>
      ) : null}

      <section className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-9">
        {NKO_ALPHABET.map((letter, index) => (
          <motion.button
            key={letter.char}
            type="button"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.02 }}
            onClick={() => playLetter(index)}
            className={cn(
              "group flex flex-col items-center justify-center rounded-2xl border border-gold/15 bg-black/30 p-4 shadow-[0_12px_40px_rgba(0,0,0,0.2)] transition hover:border-gold/35 hover:bg-gold/10",
              activeIndex === index && "border-gold/50 bg-gold/15 ring-2 ring-gold/30",
              hasRecording(index) && "border-green-500/30 bg-green-500/5",
            )}
            title={hasRecording(index) ? "Recording available" : letter.romanization}
          >
            <span className="font-display text-4xl text-gold sm:text-5xl">{letter.char}</span>
            <span className="mt-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {letter.romanization}
            </span>
            <Volume2
              className={cn(
                "mt-2 h-3.5 w-3.5 transition",
                hasRecording(index) ? "text-green-400 opacity-100" : "text-gold/50 opacity-0 group-hover:opacity-100",
              )}
            />
          </motion.button>
        ))}
      </section>
    </div>
  );
}
