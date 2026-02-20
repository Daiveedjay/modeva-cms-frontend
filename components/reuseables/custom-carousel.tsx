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
    <div className="relative overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {children.map((child, idx) => (
          <div key={idx} className="w-full flex-shrink-0">
            {child}
          </div>
        ))}
      </div>

      {/* Prev / Next Buttons */}
      <div className="absolute inset-0 flex items-center justify-between p-4">
        <button
          onClick={prev}
          className="p-2 rounded-full hover:cursor-pointer bg-secondary/50 hover:bg-secondary"
        >
          <ArrowLeft size={18} />
        </button>
        <button
          onClick={next}
          className="p-2 rounded-full hover:cursor-pointer bg-secondary/50 hover:bg-secondary"
        >
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Dot Indicators */}
      <div className="absolute  bottom-4 left-0 right-0 flex justify-center gap-2">
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
