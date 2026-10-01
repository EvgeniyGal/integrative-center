"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

const SCRIPT_ATTR = "data-instagram-embed";

function loadInstagramEmbedScript() {
  if (typeof window === "undefined") return;

  if (window.instgrm?.Embeds) {
    window.instgrm.Embeds.process();
    return;
  }

  const existing = document.querySelector<HTMLScriptElement>(
    `script[${SCRIPT_ATTR}]`,
  );
  if (existing) {
    existing.addEventListener(
      "load",
      () => {
        window.instgrm?.Embeds.process();
      },
      { once: true },
    );
    return;
  }

  const script = document.createElement("script");
  script.src = "https://www.instagram.com/embed.js";
  script.async = true;
  script.setAttribute(SCRIPT_ATTR, "true");
  script.onload = () => {
    window.instgrm?.Embeds.process();
  };
  document.body.appendChild(script);
}

export function InstagramEmbed({ url }: { url: string }) {
  const permalink = url.trim();

  useEffect(() => {
    if (!permalink) return;
    loadInstagramEmbedScript();
  }, [permalink]);

  if (!permalink) return null;

  return (
    <div className="w-full max-w-lg">
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={permalink}
        data-instgrm-version="14"
      >
        <a
          href={permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex text-sm font-medium text-brand underline-offset-4 hover:underline"
        >
          Watch on Instagram
        </a>
      </blockquote>
    </div>
  );
}
