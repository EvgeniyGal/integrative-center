"use client";

import { tickerItems } from "@/lib/site";
import { cn } from "@/lib/utils";

const segment = tickerItems.join("  •  ");

type TickerProps = {
  visible: boolean;
};

export function Ticker({ visible }: TickerProps) {
  return (
    <div
      className={cn(
        "overflow-hidden border-t transition-all duration-500 ease-out",
        visible
          ? "max-h-10 border-ink/8 opacity-100"
          : "max-h-0 border-transparent opacity-0",
      )}
      aria-hidden={!visible}
    >
      <div className="relative flex h-9 items-center overflow-hidden bg-brand text-white">
        <div
          className={cn(
            "flex w-max whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.22em]",
            visible && "animate-ticker",
          )}
        >
          <span className="px-8">{segment}</span>
          <span className="px-8" aria-hidden>
            {segment}
          </span>
          <span className="px-8" aria-hidden>
            {segment}
          </span>
          <span className="px-8" aria-hidden>
            {segment}
          </span>
        </div>
      </div>
    </div>
  );
}
