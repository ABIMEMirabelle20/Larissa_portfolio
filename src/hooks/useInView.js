import { useEffect, useRef } from 'react';

/**
 * Pose la classe "is-in" sur l'élément la première fois qu'il entre dans
 * l'écran. Sert uniquement à tracer les surlignages citron (.mark) : le
 * contenu, lui, est visible dès le départ (rien n'est caché en attendant).
 */
export default function useInView(threshold = 0.35) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-in');
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-in');
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
