import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

interface CarouselProps {
  children: React.ReactNode[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
}

export function CustomCarousel({
  children,
  autoPlay = false,
  autoPlayInterval = 3000,
}: CarouselProps) {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? children.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === children.length - 1 ? 0 : c + 1));

  useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval]);

  return (
    // w-full h-full so the carousel fills whatever sized container wraps it
    <div className="relative overflow-hidden w-full h-full">
      {/* The sliding track also needs h-full so rows don't collapse */}
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}>
        {children.map((child, idx) => (
          // Each slide must be full width AND full height for `fill` images
          <div key={idx} className="w-full h-full shrink-0">
            {child}
          </div>
        ))}
      </div>

      {/* Prev / Next Buttons */}
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button
          onClick={prev}
          className="p-2 rounded-full hover:cursor-pointer bg-secondary/50 hover:bg-secondary">
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={next}
          className="p-2 rounded-full hover:cursor-pointer bg-secondary/50 hover:bg-secondary">
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
        {children.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 hover:cursor-pointer rounded-full transition-all duration-300 ${
              idx === current
                ? "bg-secondary scale-110 outline-2 outline-offset-2 outline-white"
                : "bg-white bg-opacity-50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
