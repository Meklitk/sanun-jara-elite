import { motion } from "framer-motion";

import ImageLightbox from "@/components/ImageLightbox";
import GoldDivider from "@/components/introduction/GoldDivider";

type IntroGalleryProps = {
  title: string;
  images: string[];
  altPrefix: string;
};

export default function IntroGallery({ title, images, altPrefix }: IntroGalleryProps) {
  if (images.length === 0) return null;

  return (
    <section>
      <div className="mb-8 text-center">
        <h2 className="font-display text-[clamp(1.75rem,3vw,2.75rem)] font-bold gold-gradient-text">
          {title}
        </h2>
        <GoldDivider className="mx-auto mt-5 max-w-md" />
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 sm:gap-5">
        {images.map((src, index) => (
          <motion.div
            key={`${src}-${index}`}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (index % 6) * 0.05, duration: 0.4 }}
            className="mb-4 break-inside-avoid sm:mb-5"
          >
            <div className="group overflow-hidden rounded-[24px] border border-gold/15 bg-black/30 shadow-[0_20px_60px_rgba(0,0,0,0.35)] transition duration-300 hover:border-gold/35 hover:shadow-[0_24px_70px_rgba(212,175,55,0.08)]">
              <ImageLightbox
                src={src}
                alt={`${altPrefix} ${index + 1}`}
                className="w-full object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
