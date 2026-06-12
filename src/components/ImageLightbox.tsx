import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type ImageLightboxProps = {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
};

export default function ImageLightbox({ src, alt, className, onError }: ImageLightboxProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-gold/50 rounded-lg"
        aria-label={`Enlarge ${alt}`}
      >
        <img src={src} alt={alt} className={className} onError={onError} />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-5xl border-gold/20 bg-black/95 p-2 sm:p-4">
          <img src={src} alt={alt} className="max-h-[85vh] w-full rounded-lg object-contain" />
        </DialogContent>
      </Dialog>
    </>
  );
}
