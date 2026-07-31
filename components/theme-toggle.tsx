"use client";

import { CheckIcon, MoonIcon, PaletteIcon, SunIcon } from "@/components/icons";
import { useEffect, useRef, useState } from "react";

type Theme = "light" | "dark";
type Palette = "ember" | "ocean" | "forest" | "rose" | "golden" | "mono";

const palettes: { id: Palette; label: string; swatch: string }[] = [
  { id: "ember", label: "Ember", swatch: "bg-[#e85b27]" },
  { id: "ocean", label: "Ocean", swatch: "bg-[#3185b8]" },
  { id: "forest", label: "Forest", swatch: "bg-[#4d8964]" },
  { id: "rose", label: "Rose", swatch: "bg-[#c65b73]" },
  { id: "golden", label: "Golden", swatch: "bg-[#c68625]" },
  { id: "mono", label: "Mono", swatch: "bg-[#777872]" },
];

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [currentPalette, setCurrentPalette] = useState<Palette | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const theme =
      (document.documentElement.getAttribute("data-theme") as Theme) ||
      (localStorage.getItem("cloak-theme") as Theme) ||
      "dark";
    const palette =
      (document.documentElement.getAttribute("data-palette") as Palette) ||
      (localStorage.getItem("cloak-palette") as Palette) ||
      "ember";

    setCurrentTheme(theme);
    setCurrentPalette(palette);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const selectTheme = (theme: Theme) => {
    setCurrentTheme(theme);
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem("cloak-theme", theme);
  };

  const selectPalette = (palette: Palette) => {
    setCurrentPalette(palette);
    document.documentElement.setAttribute("data-palette", palette);
    localStorage.setItem("cloak-palette", palette);
    setIsOpen(false);
  };

  const isLight = mounted && currentTheme === "light";
  const isDark = mounted && currentTheme === "dark";

  return (
    <div
      className="flex shrink-0 items-center gap-[9px]"
      role="group"
      aria-label="Appearance"
    >
      <div ref={dropdownRef} className="relative z-[60]">
        <button
          type="button"
          className="flex h-[38px] cursor-pointer select-none items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--surface-solid)] px-3 text-[0.7rem] font-medium text-[var(--text-soft)] transition-colors duration-150 hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)] hover:text-[var(--text)] max-[680px]:w-9 max-[680px]:justify-center max-[680px]:px-0 [&>svg]:size-[15px]"
          aria-label="Choose color palette"
          aria-expanded={isOpen}
          aria-haspopup="true"
          title="Choose color palette"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <PaletteIcon />
          <span className="max-[680px]:hidden">Themes</span>
          <i className="size-2 rounded-full bg-[var(--accent)] max-[680px]:hidden" />
        </button>
        {isOpen && (
          <div className="absolute top-[calc(100%+8px)] left-0 z-[100] w-[226px] animate-[palette-in_140ms_ease-out] rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] p-3 max-[680px]:fixed max-[680px]:top-[63px] max-[680px]:left-1/2 max-[680px]:w-[min(226px,calc(100vw-24px))] max-[680px]:-translate-x-1/2 max-[680px]:animate-none">
            <div className="flex items-baseline justify-between gap-2.5 px-0.5 pt-px pb-2.5">
              <span className="text-[0.72rem] font-semibold">Color theme</span>
              <small className="text-[0.56rem] text-[var(--text-faint)]">
                Choose an accent
              </small>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {palettes.map((palette) => {
                const isSelected = mounted && currentPalette === palette.id;
                return (
                  <button
                    type="button"
                    key={palette.id}
                    className={`flex h-9 items-center gap-2 rounded-md border px-2.5 text-left text-[0.65rem] font-medium transition-colors duration-150 hover:border-[var(--border-strong)] hover:text-[var(--text)] ${
                      isSelected
                        ? "border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[var(--accent-soft)] text-[var(--text)]"
                        : "border-transparent bg-[var(--surface-raised)] text-[var(--text-soft)]"
                    }`}
                    onClick={() => selectPalette(palette.id)}
                  >
                    <i
                      className={`size-3 shrink-0 rounded-full border border-white/60 ${palette.swatch}`}
                    />
                    <span>{palette.label}</span>
                    {isSelected && (
                      <CheckIcon className="ml-auto size-3 text-[var(--accent)]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center gap-0.5 rounded-lg border border-[var(--border)] bg-[var(--surface-solid)] p-1">
        <button
          type="button"
          className={`flex h-[30px] items-center gap-1.5 rounded-md border-0 px-2.5 text-[0.7rem] font-medium transition-colors duration-150 hover:text-[var(--text)] [&>svg]:size-3.5 max-[380px]:w-[30px] max-[380px]:justify-center max-[380px]:px-0 max-[380px]:[&>span]:hidden ${
            isLight
              ? "bg-[var(--surface-raised)] text-[var(--text)]"
              : "bg-transparent text-[var(--text-faint)]"
          }`}
          onClick={() => selectTheme("light")}
          aria-label="Use light theme"
          aria-pressed={isLight}
        >
          <SunIcon />
          <span>Light</span>
        </button>
        <button
          type="button"
          className={`flex h-[30px] items-center gap-1.5 rounded-md border-0 px-2.5 text-[0.7rem] font-medium transition-colors duration-150 hover:text-[var(--text)] [&>svg]:size-3.5 max-[380px]:w-[30px] max-[380px]:justify-center max-[380px]:px-0 max-[380px]:[&>span]:hidden ${
            isDark
              ? "bg-[var(--surface-raised)] text-[var(--text)]"
              : "bg-transparent text-[var(--text-faint)]"
          }`}
          onClick={() => selectTheme("dark")}
          aria-label="Use dark theme"
          aria-pressed={isDark}
        >
          <MoonIcon />
          <span>Dark</span>
        </button>
      </div>
    </div>
  );
};
