import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { BookOpen, History, GraduationCap } from "lucide-react";

export default function AcademyPage() {
  const { t } = useI18n();

  const courses = [
    { icon: BookOpen, title: t.coursesNko, desc: t.coursesNkoDesc },
    { icon: History, title: t.historyCourses, desc: t.historyCoursesDesc },
    { icon: GraduationCap, title: t.otherCourses, desc: t.otherCoursesDesc },
  ];

  return (
    <div className="max-w-5xl mx-auto px-8 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl font-display font-bold gold-gradient-text mb-4">
          {t.academy}
        </h1>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6">
        {courses.map((course, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15 }}
            className="glass-panel gold-border-glow rounded-xl p-8 text-center hover:bg-muted/30 transition-all duration-500 group"
          >
            <div className="w-14 h-14 rounded-full crimson-gradient-bg flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
              <course.icon className="w-7 h-7 text-foreground" />
            </div>
            <h3 className="font-display text-lg text-gold mb-3">{course.title}</h3>
            <p className="text-sm text-foreground/70 font-body leading-relaxed">{course.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
