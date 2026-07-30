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
  const [currentTheme, setCurrentTheme] = useState<Theme | null>(null);
  const [currentPalette, setCurrentPalette] = useState<Palette | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
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
    });

    return () => cancelAnimationFrame(frame);
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

  return (
    <div
      className="flex shrink-0 items-center gap-[9px]"
      role="group"
      aria-label="Appearance"
    >
      <details
        ref={dropdownRef}
        className="relative z-[60]"
        open={isOpen}
      >
        <summary
          className="flex h-[42px] cursor-pointer list-none select-none items-center gap-[7px] rounded-xl border border-[var(--border)] bg-[var(--surface)] px-2.5 text-[0.66rem] font-[680] text-[var(--text-soft)] shadow-[var(--shadow-sm)] backdrop-blur-xl transition-colors duration-150 hover:border-[var(--border-strong)] hover:bg-[var(--surface-raised)] hover:text-[var(--text)] max-[680px]:w-11 max-[680px]:justify-center max-[680px]:px-0 [&::-webkit-details-marker]:hidden [&>svg]:size-[15px]"
          aria-label="Choose color palette"
          title="Choose color palette"
          onClick={(e) => {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }}
        >
          <PaletteIcon />
          <span className="max-[680px]:hidden">Colors</span>
          <i className="size-2 rounded-full border border-[color-mix(in_srgb,var(--accent)_65%,var(--border))] bg-[var(--accent)] shadow-[0_0_0_3px_var(--accent-soft)]" />
        </summary>
        <div className="absolute top-[calc(100%+9px)] left-0 z-[100] w-[226px] animate-[palette-in_140ms_ease-out] rounded-[15px] border border-[var(--border)] bg-[var(--surface-solid)] p-[13px] shadow-[var(--shadow-md)] max-[680px]:fixed max-[680px]:top-[63px] max-[680px]:left-1/2 max-[680px]:w-[min(226px,calc(100vw-24px))] max-[680px]:-translate-x-1/2 max-[680px]:animate-none">
          <div className="flex items-baseline justify-between gap-2.5 px-0.5 pt-px pb-[11px]">
            <span className="text-[0.72rem] font-[720]">Color theme</span>
            <small className="text-[0.56rem] text-[var(--text-faint)]">
              Choose an accent
            </small>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {palettes.map((palette) => {
              const isSelected = currentPalette === palette.id;
              return (
                <button
                  type="button"
                  key={palette.id}
                  className={`flex h-[37px] items-center gap-2 rounded-[9px] border px-[9px] text-left text-[0.62rem] font-[650] transition-colors duration-150 hover:border-[var(--border-strong)] hover:text-[var(--text)] ${
                    isSelected
                      ? "border-[color-mix(in_srgb,var(--accent)_35%,var(--border))] bg-[var(--accent-soft)] text-[var(--text)]"
                      : "border-transparent bg-[var(--surface-raised)] text-[var(--text-soft)]"
                  }`}
                  onClick={() => selectPalette(palette.id)}
                >
                  <i
                    className={`size-3 shrink-0 rounded-full border-2 border-white/65 shadow-[0_0_0_1px_var(--border)] ${palette.swatch}`}
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
      </details>

      <div className="flex items-center gap-[3px] rounded-xl border border-[var(--border)] bg-[var(--surface)] p-[3px] shadow-[var(--shadow-sm)] backdrop-blur-xl">
        <button
          type="button"
          className={`flex h-[34px] items-center gap-1.5 rounded-[9px] border-0 px-[9px] text-[0.66rem] font-[680] transition-colors duration-150 hover:text-[var(--text)] [&>svg]:size-3.5 max-[380px]:w-[34px] max-[380px]:justify-center max-[380px]:px-0 max-[380px]:[&>span]:hidden ${
            currentTheme === "light"
              ? "bg-[var(--surface-solid)] text-[var(--text)] shadow-[0_1px_4px_rgba(30,25,18,0.1)]"
              : "bg-transparent text-[var(--text-faint)]"
          }`}
          onClick={() => selectTheme("light")}
          aria-label="Use light theme"
          aria-pressed={currentTheme === "light"}
        >
          <SunIcon />
          <span>Light</span>
        </button>
        <button
          type="button"
          className={`flex h-[34px] items-center gap-1.5 rounded-[9px] border-0 px-[9px] text-[0.66rem] font-[680] transition-colors duration-150 hover:text-[var(--text)] [&>svg]:size-3.5 max-[380px]:w-[34px] max-[380px]:justify-center max-[380px]:px-0 max-[380px]:[&>span]:hidden ${
            currentTheme === "dark"
              ? "bg-[#36352f] text-[#fff8ef]"
              : "bg-transparent text-[var(--text-faint)]"
          }`}
          onClick={() => selectTheme("dark")}
          aria-label="Use dark theme"
          aria-pressed={currentTheme === "dark"}
        >
          <MoonIcon />
          <span>Dark</span>
        </button>
      </div>
    </div>
  );
};
