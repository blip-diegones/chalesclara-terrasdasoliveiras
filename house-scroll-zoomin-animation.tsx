import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Custom minimal architectural house silhouette SVG mask
const HOUSE_PATH = "M500 70 L870 420 L870 730 C870 740 860 750 850 750 L150 750 C140 750 130 740 130 730 L130 420 Z";

const HOUSE_MASK_SVG_URI = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 800"><path d="${HOUSE_PATH}" fill="black"/></svg>`;

interface HouseScrollZoominAnimationProps {
  videoSrc?: string;
  posterSrc?: string;
  title?: string;
  subtitle?: string;
  outroTitle?: string;
  outroSubtitle?: string;
}

export const HouseScrollZoominAnimation: React.FC<HouseScrollZoominAnimationProps> = ({
  videoSrc = "https://assets.mixkit.co/videos/preview/mixkit-aerial-view-of-fog-covered-mountains-and-trees-41470-large.mp4",
  posterSrc = "./assets/images/hero-aerial-mountains.png",
  title = "Uma vista na montanha.",
  subtitle = "Aninhado no alto da montanha em Pouso Alto - MG. Onde o horizonte encontra o silêncio e o romance.",
  outroTitle = "CHALÉ OLIVAS ECO",
  outroSubtitle = "Desfrute do nascer e pôr do sol enquanto se perde na tranquilidade deste paraíso natural."
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const maskContainerRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLVideoElement | HTMLImageElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trigger = triggerRef.current;
    const maskContainer = maskContainerRef.current;
    const media = mediaRef.current;
    const watermark = watermarkRef.current;
    const heroContent = heroContentRef.current;

    if (!trigger || !maskContainer || !media) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: "top top",
          end: "+=250%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        }
      });

      // Initial state
      gsap.set(maskContainer, {
        "--maskW": "180px",
        "--maskH": "144px",
      } as gsap.TweenVars);

      tl.to(maskContainer, {
        "--maskW": "300vw",
        "--maskH": "240vw",
        ease: "power2.inOut",
      }, 0)
      .to(media, {
        scale: 1.15,
        ease: "power1.out",
      }, 0)
      .to(heroContent, {
        opacity: 0,
        y: -40,
        ease: "power1.in",
      }, 0)
      .to(watermark, {
        opacity: 0.03,
        scale: 1.1,
        ease: "none",
      }, 0);

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full bg-black text-white selection:bg-white selection:text-black">
      {/* Pinned Scroll Section */}
      <section ref={triggerRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        
        {/* Background Watermark */}
        <div 
          ref={watermarkRef}
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-10 font-bold uppercase tracking-widest text-[16vw] text-neutral-800 whitespace-nowrap"
        >
          OLIVAS ECO
        </div>

        {/* Four Corner Crosshair Markers */}
        <div className="absolute top-8 left-8 z-20 pointer-events-none text-neutral-500 font-mono text-xs tracking-widest flex items-center gap-2">
          <span>+</span> <span>LAT 22°11'S / LON 44°58'W</span>
        </div>
        <div className="absolute top-8 right-8 z-20 pointer-events-none text-neutral-500 font-mono text-xs tracking-widest flex items-center gap-2">
          <span>ALT 1.340M</span> <span>+</span>
        </div>
        <div className="absolute bottom-8 left-8 z-20 pointer-events-none text-neutral-500 font-mono text-xs tracking-widest flex items-center gap-2">
          <span>+</span> <span>POUSO ALTO • MG</span>
        </div>
        <div className="absolute bottom-8 right-8 z-20 pointer-events-none text-neutral-500 font-mono text-xs tracking-widest flex items-center gap-2">
          <span>SERRA DA MANTIQUEIRA</span> <span>+</span>
        </div>

        {/* Hero Intro Typography */}
        <div 
          ref={heroContentRef} 
          className="absolute top-16 md:top-24 z-20 flex flex-col items-center text-center px-4 max-w-3xl pointer-events-none transition-transform"
        >
          <span className="text-xs uppercase tracking-[0.35em] text-neutral-400 mb-3 font-mono">
            Santuário de Altura & Serenidade
          </span>
          <h1 className="text-3xl md:text-6xl font-light tracking-tight text-white mb-4 uppercase">
            {title}
          </h1>
          <p className="text-sm md:text-base text-neutral-400 max-w-xl font-light leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Central House Mask Animation Container */}
        <div 
          ref={maskContainerRef}
          className="relative z-10 w-full h-full flex items-center justify-center overflow-hidden"
          style={{
            WebkitMaskImage: `url("${HOUSE_MASK_SVG_URI}")`,
            maskImage: `url("${HOUSE_MASK_SVG_URI}")`,
            WebkitMaskPosition: '50% 50%',
            maskPosition: '50% 50%',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: 'var(--maskW, 180px) auto',
            maskSize: 'var(--maskW, 180px) auto',
          }}
        >
          {videoSrc ? (
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              src={videoSrc}
              poster={posterSrc}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover will-change-transform scale-100"
            />
          ) : (
            <img
              ref={mediaRef as React.RefObject<HTMLImageElement>}
              src={posterSrc}
              alt="Chalé Olivas Eco"
              className="w-full h-full object-cover will-change-transform scale-100"
            />
          )}
        </div>

        {/* Subtle Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center pointer-events-none gap-2 opacity-70">
          <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-400">Scroll para explorar</span>
          <div className="w-4 h-7 border border-neutral-600 rounded-full flex justify-center p-1">
            <div className="w-1 h-1.5 bg-white rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Outro Section */}
      <section className="relative min-h-[60vh] w-full bg-black flex flex-col items-center justify-center text-center px-6 py-24 border-t border-neutral-900">
        <span className="text-xs uppercase font-mono tracking-[0.4em] text-neutral-500 mb-4">
          Conexão Profunda com a Natureza
        </span>
        <h2 className="text-3xl md:text-5xl font-light text-white uppercase tracking-tight mb-6 max-w-2xl">
          {outroTitle}
        </h2>
        <p className="text-sm md:text-lg text-neutral-400 max-w-xl font-light leading-relaxed mb-10">
          {outroSubtitle}
        </p>
        <div className="flex gap-4">
          <a
            href="#reserva"
            className="px-8 py-3.5 bg-white text-black text-xs font-mono uppercase tracking-widest hover:bg-neutral-200 transition-colors rounded-sm"
          >
            Reservar Experiência
          </a>
        </div>
      </section>
    </div>
  );
};

export default HouseScrollZoominAnimation;
