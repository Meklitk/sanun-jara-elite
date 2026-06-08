import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Coins, Mail, Phone, ShieldCheck, User, Briefcase, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { http } from "@/api/http";

const QUESTIONS_FR = [
  "Parlez-nous de vous.",
  "Soutenez-vous notre structure monarchique, notre vision et notre mission ?",
  "Êtes-vous une patriote Mandenka, prête à œuvrer pour l’unité entre tous les peuples du Manden, quelle que soit leur appartenance ethnique ou religieuse ?",
  "Êtes-vous déjà membre de Sanun Jara ? Avez-vous lu notre règlement intérieur ?",
  "Vous engagez-vous à respecter le règlement intérieur ?",
  "Avez-vous déjà été affiliée à d’autres organisations du Manden ?",
  "Avez-vous déjà relevé un défi majeur dans votre vie ?",
  "Qu’est-ce qui vous plaît chez Sanun Jara ?",
  "À quoi ressemble votre emploi du temps ?",
  "Êtes-vous au courant que Sanun Jara tient une assemblée générale chaque dimanche ?",
  "Si vous cessez de voter ou de participer aux assemblées générales, acceptez-vous d’être exclue par le comité de discipline ?",
  "Savez-vous que chaque membre doit voter pour les nouvelles recrues ?",
  "Êtes-vous prête à travailler sous la direction d’une femme ?",
  "Êtes-vous prête à évoluer dans une structure bénévole ?",
  "Êtes-vous prête à intégrer le gouvernement de Sanun Jara ?",
  "Croyez-vous être à la hauteur pour faire partie de la chefferie de Sanun Jara (titre de Wana) ?",
  "Êtes-vous d’accord pour que le temps révèle votre véritable engagement et personnalité au sein de Sanun Jara ?"
];

export function MembershipForm() {
  const [step, setStep] = useState(0); // 0 = info, 1..17 = questions, 18 = success
  const [info, setInfo] = useState({ name: "", email: "", phone: "", profession: "" });
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const totalQuestions = QUESTIONS_FR.length;

  async function handleSubmit() {
    setIsSubmitting(true);
    setError(null);
    try {
      await http("/api/submissions", {
        method: "POST",
        body: JSON.stringify({
          type: "membership",
          name: info.name,
          email: info.email,
          phone: info.phone,
          profession: info.profession,
          answers,
        }),
      });
      setStep(totalQuestions + 1); // Success step
    } catch (err: any) {
      console.error(err);
      setError("Une erreur est survenue lors de l'envoi de votre candidature. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function nextStep() {
    if (step === 0) {
      if (!info.name || !info.email) {
        setError("Le nom et l'adresse email sont obligatoires.");
        return;
      }
      setError(null);
    } else {
      const currentAns = answers[step];
      if (!currentAns || !currentAns.trim()) {
        setError("Veuillez répondre à la question avant de continuer.");
        return;
      }
      setError(null);
    }
    setStep((prev) => prev + 1);
  }

  function prevStep() {
    setError(null);
    setStep((prev) => Math.max(0, prev - 1));
  }

  if (step === totalQuestions + 1) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-[2rem] border border-gold/20 bg-black/40 p-8 sm:p-12 text-center space-y-6 max-w-2xl mx-auto shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold/10 border border-gold/30 text-gold shadow-lg shadow-gold/10">
          <ShieldCheck className="h-10 w-10 animate-pulse" />
        </div>
        <h3 className="text-3xl font-display font-bold gold-gradient-text">Candidature Envoyée !</h3>
        <p className="text-foreground/80 leading-8">
          Mande Diata et le conseil du Bureau de Références de <strong>Sanun Jara</strong> vous remercient pour votre intérêt et engagement.
          Vos réponses ont été enregistrées avec succès et transmises à l'administration. Un membre du Wana vous contactera sous peu.
        </p>
        <div className="pt-4">
          <Button
            onClick={() => {
              setStep(0);
              setInfo({ name: "", email: "", phone: "", profession: "" });
              setAnswers({});
            }}
            className="gold-gradient-bg text-black font-semibold rounded-xl px-8 py-3 hover:shadow-lg hover:shadow-gold/20"
          >
            Déposer une autre candidature
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Bar */}
      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden border border-gold/10">
        <div
          className="bg-gold h-full transition-all duration-300"
          style={{ width: `${(step / (totalQuestions + 1)) * 100}%` }}
        />
      </div>

      <div className="flex justify-between items-center text-xs text-gold/60 font-semibold uppercase tracking-wider">
        <span>Candidature d'Adhésion</span>
        <span>{step === 0 ? "Informations" : `Question ${step} sur ${totalQuestions}`}</span>
      </div>

      <motion.div
        layout
        className="rounded-[1.75rem] border border-gold/15 bg-black/28 p-6 sm:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.22)]"
      >
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm font-medium">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 0 ? (
            <motion.div
              key="info"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                <h3 className="text-2xl font-semibold text-foreground">Rejoindre Sanun Jara</h3>
                <p className="text-sm text-foreground/60 leading-6">
                  Veuillez d'abord remplir vos coordonnées de base. Vous accéderez ensuite au questionnaire d'évaluation de 17 questions.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground/80 font-medium">Nom complet *</Label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gold/60" />
                    <Input
                      id="name"
                      value={info.name}
                      onChange={(e) => setInfo({ ...info, name: e.target.value })}
                      placeholder="Keita Diata"
                      className="pl-11 border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground/80 font-medium">Adresse Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gold/60" />
                    <Input
                      id="email"
                      type="email"
                      value={info.email}
                      onChange={(e) => setInfo({ ...info, email: e.target.value })}
                      placeholder="nom@exemple.com"
                      className="pl-11 border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-foreground/80 font-medium">Téléphone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gold/60" />
                    <Input
                      id="phone"
                      value={info.phone}
                      onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                      placeholder="+223 00 00 00 00"
                      className="pl-11 border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profession" className="text-foreground/80 font-medium">Profession / Occupation</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gold/60" />
                    <Input
                      id="profession"
                      value={info.profession}
                      onChange={(e) => setInfo({ ...info, profession: e.target.value })}
                      placeholder="Administrateur / Entrepreneur"
                      className="pl-11 border-gold/20 bg-black/20 focus:border-gold/50 focus:ring-gold/20 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`q-${step}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="space-y-3">
                <span className="text-[11px] uppercase tracking-[0.2em] text-gold/80 font-bold">Question {step}</span>
                <h4 className="text-xl sm:text-2xl font-semibold text-foreground leading-8">
                  {QUESTIONS_FR[step - 1]}
                </h4>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`ans-${step}`} className="sr-only">Votre réponse</Label>
                <Textarea
                  id={`ans-${step}`}
                  rows={4}
                  value={answers[step] || ""}
                  onChange={(e) => setAnswers({ ...answers, [step]: e.target.value })}
                  placeholder="Écrivez votre réponse ici en toute sincérité..."
                  className="border-gold/20 bg-black/25 focus:border-gold/50 focus:ring-gold/20 rounded-xl text-base p-4 min-h-[120px] resize-y"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center pt-8 mt-8 border-t border-gold/10">
          {step > 0 ? (
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              className="border-gold/20 hover:bg-gold/10 hover:text-gold rounded-xl px-4 sm:px-6"
            >
              <ChevronLeft className="mr-1.5 h-4 w-4" />
              Précédent
            </Button>
          ) : (
            <div />
          )}

          {step < totalQuestions ? (
            <Button
              type="button"
              onClick={nextStep}
              className="gold-gradient-bg text-black font-semibold rounded-xl px-4 sm:px-6 hover:shadow-lg hover:shadow-gold/10"
            >
              Suivant
              <ChevronRight className="ml-1.5 h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="gold-gradient-bg text-black font-semibold rounded-xl px-6 sm:px-8 hover:shadow-lg hover:shadow-gold/20 flex items-center gap-2"
            >
              {isSubmitting ? "Envoi en cours..." : "Soumettre ma candidature"}
              <Send className="h-4 w-4" />
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export function QuestionsForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Veuillez remplir tous les champs obligatoires.");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await http("/api/submissions", {
        method: "POST",
        body: JSON.stringify({
          type: "question",
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      });
      setSuccess(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err: any) {
      console.error(err);
      setError("Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-[2rem] border border-primary/20 bg-black/40 p-8 sm:p-12 text-center space-y-6 max-w-xl mx-auto shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
      >
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 border border-primary/30 text-primary shadow-lg shadow-primary/10">
          <Check className="h-10 w-10 animate-bounce" />
        </div>
        <h3 className="text-3xl font-display font-bold text-primary">Message Envoyé !</h3>
        <p className="text-foreground/80 leading-7">
          Merci pour vos questions et commentaires. Vos remarques ont bien été transmises à l'adresse <strong>info@sanunjara.com</strong>.
          L'équipe de Sanun Jara vous répondra dès que possible.
        </p>
        <div className="pt-4">
          <Button
            onClick={() => setSuccess(false)}
            className="bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-xl px-8 py-3"
          >
            Poser une autre question
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <motion.form
        onSubmit={handleSubmit}
        className="rounded-[1.75rem] border border-primary/20 bg-black/28 p-6 sm:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.22)] space-y-6"
      >
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold text-foreground">Poser une question</h3>
          <p className="text-sm text-foreground/60 leading-6">
            Vous avez des questions sur Sanun Jara, notre vision ou nos projets ? Remplissez ce formulaire et nous vous répondrons directement par email.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/10 text-destructive text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="q-name" className="text-foreground/80 font-medium">Nom complet *</Label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-primary/60" />
              <Input
                id="q-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Votre nom"
                className="pl-11 border-primary/20 bg-black/20 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="q-email" className="text-foreground/80 font-medium">Adresse Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-primary/60" />
                <Input
                  id="q-email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="nom@exemple.com"
                  className="pl-11 border-primary/20 bg-black/20 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="q-phone" className="text-foreground/80 font-medium">Téléphone (Optionnel)</Label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-primary/60" />
                <Input
                  id="q-phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Numéro"
                  className="pl-11 border-primary/20 bg-black/20 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="q-message" className="text-foreground/80 font-medium">Message ou Question *</Label>
            <Textarea
              id="q-message"
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Écrivez vos questions en détail ici..."
              className="border-primary/20 bg-black/25 focus:border-primary/50 focus:ring-primary/20 rounded-xl text-base p-4 min-h-[140px] resize-y"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl py-3 shadow-lg shadow-primary/10 flex items-center justify-center gap-2 text-base transition-all"
        >
          {isSubmitting ? "Envoi en cours..." : "Envoyer mes questions"}
          <Send className="h-4.5 w-4.5" />
        </Button>
      </motion.form>
    </div>
  );
}

export function CotiserSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div className="rounded-[2rem] border border-gold/15 bg-black/28 p-6 sm:p-10 shadow-[0_24px_80px_rgba(0,0,0,0.22)] space-y-6">
        <div className="flex flex-wrap items-center gap-4 border-b border-gold/10 pb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl gold-gradient-bg shadow-lg shadow-gold/20">
            <Coins className="h-7 w-7 text-black animate-spin-slow" />
          </div>
          <div>
            <h3 className="text-2xl font-display font-bold gold-gradient-text">Cotiser (Contributions & Dons)</h3>
            <p className="text-sm text-foreground/60">Soutenez activement la reconstruction de l'Empire du Manden.</p>
          </div>
        </div>

        <div className="space-y-4 text-foreground/80 leading-8">
          <p>
            Chaque membre et patriote Mandenka est invité à contribuer financièrement aux projets de développement de l'empire, aux initiatives de préservation culturelle et à la mise en œuvre de nos institutions.
          </p>
          
          <div className="rounded-xl border border-gold/10 bg-gold/5 p-4 sm:p-6 space-y-4">
            <h4 className="font-display font-bold text-gold flex items-center gap-2 text-lg">
              <Sparkles className="h-5 w-5" />
              Pourquoi Cotiser ?
            </h4>
            <ul className="list-disc list-inside space-y-2 text-sm text-foreground/75 leading-7 pl-1">
              <li>Financement de la <strong>Niani Academy</strong> et des cours d'alphabet <strong>N'Ko</strong>.</li>
              <li>Soutien aux veuves, orphelins et aux institutions des femmes.</li>
              <li>Réalisation des maquettes architecturales et des projets d'infrastructure de Niani.</li>
              <li>Gestion et hébergement de nos plateformes numériques d'UNESCO et du Manden.</li>
            </ul>
          </div>

          <div className="border border-gold/12 bg-black/20 p-5 rounded-xl space-y-4">
            <h4 className="font-semibold text-foreground text-lg">Comment faire vos cotisations ?</h4>
            <p className="text-sm leading-6 text-foreground/70">
              Pour des raisons de sécurité et d'authenticité institutionnelle, les coordonnées de paiement (comptes bancaires, Wave, Mobile Money, PayPal) sont coordonnées directement par le <strong>Bureau de Références</strong> sous la supervision de l'administration du <strong>Mansa Diata</strong>.
            </p>
            <p className="text-sm font-semibold text-gold">
              Pour initier un dépôt de cotisation ou un don, veuillez écrire directement à :
            </p>
            <div className="flex items-center gap-3 bg-black/40 px-4 py-3 rounded-xl border border-gold/15 w-fit">
              <Mail className="h-5 w-5 text-gold" />
              <a href="mailto:info@sanunjara.com" className="text-foreground hover:underline font-mono text-sm sm:text-base">
                info@sanunjara.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
