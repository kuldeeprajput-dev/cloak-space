"use client";

import { Brand } from "@/components/brand";
import {
  ArrowRightIcon,
  ClockIcon,
  LinkIcon,
  LockIcon,
  ShieldIcon,
  SparkIcon,
  UserIcon,
} from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { useUsername } from "@/hooks/use-username";
import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type LobbyMode = "create" | "join";

const durationOptions = [
  { label: "5 min", value: 60 * 5 },
  { label: "10 min", value: 60 * 10 },
  { label: "30 min", value: 60 * 30 },
  { label: "1 hour", value: 60 * 60 },
];

const microLabelClass =
  "text-[0.68rem] font-bold tracking-[0.13em] text-[var(--text-faint)] uppercase";
const fieldLabelClass =
  "mb-2 block text-[0.74rem] font-[680] text-[var(--text)]";
const fieldHelpClass =
  "mx-0.5 mt-[7px] text-[0.65rem] leading-[1.45] text-[var(--text-faint)]";
const inputShellClass =
  "flex h-12 items-center gap-[11px] rounded-xl border border-[var(--border-strong)] bg-[var(--surface-solid)] px-[13px] transition-[border-color,box-shadow] duration-150 focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_12%,transparent)] [&>svg]:size-[17px] [&>svg]:shrink-0 [&>svg]:text-[var(--text-faint)]";
const inputClass =
  "min-w-0 w-full border-0 bg-transparent text-[0.82rem] text-[var(--text)] outline-0 placeholder:text-[var(--text-faint)]";
const primaryButtonClass =
  "group flex min-h-[52px] w-full items-center justify-between gap-3 rounded-[14px] border-0 bg-[var(--accent)] py-0 pr-[17px] pl-5 font-[720] tracking-[-0.01em] text-[var(--accent-contrast)] shadow-[var(--shadow-accent)] transition-[background-color,transform,box-shadow] duration-150 enabled:hover:-translate-y-px enabled:hover:bg-[var(--accent-hover)] enabled:hover:shadow-[0_14px_32px_color-mix(in_srgb,var(--accent)_30%,transparent)] disabled:opacity-50 disabled:shadow-none [&>svg]:w-[19px] [&>svg]:transition-transform [&>svg]:duration-150 enabled:hover:[&>svg]:translate-x-[3px]";

const Page = () => {
  const { username, updateUsername } = useUsername();
  const router = useRouter();
  const [mode, setMode] = useState<LobbyMode>("create");
  const [roomInput, setRoomInput] = useState("");
  const [joinError, setJoinError] = useState("");
  const [ttl, setTtl] = useState(60 * 10);

  const {
    mutate: createRoom,
    isPending: isCreating,
    error: createError,
  } = useMutation({
    mutationFn: async () => {
      const res = await client.room.create.post({ ttl });
      if (res.status !== 200 || !res.data?.roomId) {
        throw new Error("We couldn't create the room. Please try again.");
      }
      return res.data.roomId;
    },
    onSuccess: (roomId) => router.push(`/room/${roomId}`),
  });

  const extractRoomId = (value: string) => {
    const raw = value.trim();
    if (!raw) return null;

    const roomPathMatch = raw.match(/(?:^|\/)room\/([A-Za-z0-9_-]+)/);
    if (roomPathMatch?.[1]) return roomPathMatch[1];

    try {
      const url = new URL(raw);
      const parts = url.pathname.split("/").filter(Boolean);
      const roomIndex = parts.indexOf("room");
      if (roomIndex >= 0 && parts[roomIndex + 1]) {
        return parts[roomIndex + 1];
      }
    } catch {
      try {
        const url = new URL(`https://${raw}`);
        const parts = url.pathname.split("/").filter(Boolean);
        const roomIndex = parts.indexOf("room");
        if (roomIndex >= 0 && parts[roomIndex + 1]) {
          return parts[roomIndex + 1];
        }
      } catch {
        // Fall through to the raw room ID check.
      }
    }

    return /^[A-Za-z0-9_-]+$/.test(raw) ? raw : null;
  };

  const joinRoom = () => {
    setJoinError("");
    const roomId = extractRoomId(roomInput);
    if (!roomId) {
      setJoinError("Enter a valid room ID or invitation link.");
      return;
    }
    router.push(`/room/${roomId}`);
  };

  const submitLobby = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!username.trim()) return;
    if (mode === "create") createRoom();
    else joinRoom();
  };

  return (
    <main className="relative flex min-h-dvh flex-col overflow-hidden bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-position:center] [background-size:72px_72px] before:pointer-events-none before:absolute before:inset-0 before:z-0 before:bg-[linear-gradient(90deg,var(--page)_0%,color-mix(in_srgb,var(--page)_88%,transparent)_28%,color-mix(in_srgb,var(--page)_86%,transparent)_72%,var(--page)_100%)]">
      <div className="pointer-events-none fixed -top-[220px] -right-40 z-0 size-[520px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_16%,transparent)_0%,transparent_68%)] blur-[2px]" />
      <div className="pointer-events-none fixed -bottom-[260px] -left-[180px] z-0 size-[560px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_11%,transparent)_0%,transparent_70%)] blur-[2px]" />

      <header className="relative z-50 mx-auto flex min-h-[82px] w-[min(1180px,calc(100%_-_48px))] items-center justify-between border-b border-[var(--border)] max-[680px]:min-h-[70px] max-[680px]:w-[min(1180px,calc(100%_-_32px))]">
        <Brand />
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </header>

      <section className="relative z-[1] mx-auto grid w-[min(1180px,calc(100%_-_48px))] flex-1 grid-cols-[minmax(0,1.03fr)_minmax(410px,0.74fr)] items-center gap-[clamp(54px,8vw,112px)] py-[70px] pb-16 max-[960px]:grid-cols-1 max-[960px]:gap-[55px] max-[960px]:py-16 max-[960px]:pb-20 max-[680px]:w-[min(1180px,calc(100%_-_32px))] max-[680px]:gap-11 max-[680px]:py-[46px] max-[680px]:pb-[60px]">
        <div className="max-w-[650px] max-[960px]:max-w-[720px]">
          <div className="mb-[22px] inline-flex items-center gap-2 text-[0.73rem] font-[750] tracking-[0.12em] text-[var(--accent)] uppercase [&>svg]:[stroke-width:2.2]">
            <SparkIcon width={16} height={16} />
            Private by design
          </div>
          <h1 className="m-0 max-w-[660px] text-[clamp(3.4rem,6vw,5.9rem)] leading-[0.96] font-[710] tracking-[-0.066em] max-[960px]:text-[clamp(3.7rem,10vw,6rem)] max-[680px]:text-[clamp(3rem,15vw,4.4rem)] [&>span]:block [&>span]:text-[var(--accent)]">
            Speak freely.
            <span>Leave no trace.</span>
          </h1>
          <p className="mt-7 max-w-[560px] text-[clamp(1rem,1.6vw,1.15rem)] leading-[1.7] text-[var(--text-soft)] max-[680px]:mt-[22px] max-[680px]:text-[0.96rem]">
            Open a private room, invite one person, and talk freely. Everything
            disappears when the timer ends.
          </p>

          <div
            className="mt-7 flex flex-wrap gap-x-[22px] gap-y-[11px] max-[680px]:gap-x-4 max-[680px]:gap-y-2.5 [&>div]:flex [&>div]:items-center [&>div]:gap-2 [&>div]:text-[0.79rem] [&>div]:font-[620] [&>div]:text-[var(--text-soft)] [&_svg]:size-4 [&_svg]:text-[var(--accent)]"
            aria-label="Privacy features"
          >
            <div>
              <ShieldIcon />
              <span>Two people only</span>
            </div>
            <div>
              <ClockIcon />
              <span>Auto-expires</span>
            </div>
            <div>
              <LockIcon />
              <span>No sign-up</span>
            </div>
          </div>

          <div className="mt-[54px] grid grid-cols-3 border-t border-[var(--border)] pt-[25px] max-[680px]:hidden">
            <div className="flex min-w-0 gap-[13px] pr-4">
              <span className="pt-0.5 font-[var(--font-mono)] text-[0.66rem] font-bold text-[var(--accent)]">
                01
              </span>
              <div>
                <strong className="mb-[5px] block text-[0.82rem]">
                  Create
                </strong>
                <p className="m-0 text-[0.7rem] leading-[1.55] text-[var(--text-faint)]">
                  Choose how long the room lives.
                </p>
              </div>
            </div>
            <div className="flex min-w-0 gap-[13px] border-l border-[var(--border)] pr-4 pl-[19px]">
              <span className="pt-0.5 font-[var(--font-mono)] text-[0.66rem] font-bold text-[var(--accent)]">
                02
              </span>
              <div>
                <strong className="mb-[5px] block text-[0.82rem]">
                  Invite
                </strong>
                <p className="m-0 text-[0.7rem] leading-[1.55] text-[var(--text-faint)]">
                  Share the one-time private link.
                </p>
              </div>
            </div>
            <div className="flex min-w-0 gap-[13px] border-l border-[var(--border)] pr-4 pl-[19px]">
              <span className="pt-0.5 font-[var(--font-mono)] text-[0.66rem] font-bold text-[var(--accent)]">
                03
              </span>
              <div>
                <strong className="mb-[5px] block text-[0.82rem]">
                  Disappear
                </strong>
                <p className="m-0 text-[0.7rem] leading-[1.55] text-[var(--text-faint)]">
                  The room and messages are erased.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative before:absolute before:inset-[18px_-18px_-18px_18px] before:-z-10 before:rounded-[26px] before:border before:border-[color-mix(in_srgb,var(--accent)_18%,var(--border))] before:bg-[color-mix(in_srgb,var(--accent-soft)_45%,transparent)] max-[960px]:mx-auto max-[960px]:w-[min(520px,calc(100%_-_18px))] max-[680px]:before:inset-[12px_-12px_-12px_12px]">
          <div className="overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-[29px] shadow-[var(--shadow-md)] backdrop-blur-3xl max-[680px]:rounded-[21px] max-[680px]:p-[22px]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className={microLabelClass}>Start a conversation</span>
                <h2 className="mt-[5px] mb-0 text-[1.4rem] tracking-[-0.035em]">
                  Your private space
                </h2>
              </div>
              <span className="inline-flex items-center gap-[5px] rounded-lg bg-[var(--accent-soft)] px-2 py-1.5 text-[0.64rem] font-[720] text-[var(--accent)] max-[680px]:hidden">
                <LockIcon width={14} height={14} />
                Ephemeral
              </span>
            </div>

            <div
              className="mt-6 grid grid-cols-2 gap-1 rounded-xl bg-[var(--surface-subtle)] p-1"
              role="tablist"
            >
              <button
                type="button"
                role="tab"
                aria-selected={mode === "create"}
                className={`min-h-[39px] rounded-[9px] border-0 text-[0.78rem] font-[670] transition-colors duration-150 hover:text-[var(--text)] ${
                  mode === "create"
                    ? "bg-[var(--surface-solid)] text-[var(--text)] shadow-[var(--shadow-sm)]"
                    : "bg-transparent text-[var(--text-faint)]"
                }`}
                onClick={() => setMode("create")}
              >
                Create a room
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={mode === "join"}
                className={`min-h-[39px] rounded-[9px] border-0 text-[0.78rem] font-[670] transition-colors duration-150 hover:text-[var(--text)] ${
                  mode === "join"
                    ? "bg-[var(--surface-solid)] text-[var(--text)] shadow-[var(--shadow-sm)]"
                    : "bg-transparent text-[var(--text-faint)]"
                }`}
                onClick={() => setMode("join")}
              >
                Join a room
              </button>
            </div>

            <form
              className="mt-6 flex flex-col gap-[21px]"
              onSubmit={submitLobby}
            >
              <div className="min-w-0">
                <label htmlFor="alias" className={fieldLabelClass}>
                  Your alias
                </label>
                <div className={inputShellClass}>
                  <UserIcon />
                  <input
                    className={inputClass}
                    id="alias"
                    type="text"
                    value={username}
                    onChange={(event) => updateUsername(event.target.value)}
                    placeholder="Choose a name"
                    maxLength={40}
                    autoComplete="off"
                  />
                </div>
                <p className={fieldHelpClass}>
                  Only visible to the person in your room.
                </p>
              </div>

              {mode === "create" ? (
                <fieldset className="m-0 min-w-0 border-0 p-0">
                  <legend className={fieldLabelClass}>Room lifetime</legend>
                  <div className="grid grid-cols-4 gap-[7px] max-[680px]:grid-cols-2">
                    {durationOptions.map((option) => (
                      <button
                        type="button"
                        key={option.value}
                        className={`h-[39px] rounded-[10px] border text-[0.7rem] font-[650] transition-colors duration-150 hover:border-[var(--border-strong)] hover:text-[var(--text)] ${
                          ttl === option.value
                            ? "border-[color-mix(in_srgb,var(--accent)_65%,transparent)] bg-[var(--accent-soft)] text-[var(--accent)]"
                            : "border-[var(--border)] bg-[var(--surface-solid)] text-[var(--text-soft)]"
                        }`}
                        onClick={() => setTtl(option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  <p className={fieldHelpClass}>
                    The room closes for everyone when time runs out.
                  </p>
                </fieldset>
              ) : (
                <div className="min-w-0">
                  <label htmlFor="room" className={fieldLabelClass}>
                    Room link or ID
                  </label>
                  <div
                    className={`${inputShellClass} ${
                      joinError ? "border-[var(--danger)]" : ""
                    }`}
                  >
                    <LinkIcon />
                    <input
                      className={inputClass}
                      id="room"
                      type="text"
                      value={roomInput}
                      onChange={(event) => {
                        setRoomInput(event.target.value);
                        if (joinError) setJoinError("");
                      }}
                      placeholder="Paste your invitation"
                      autoComplete="off"
                      aria-invalid={!!joinError}
                      aria-describedby={joinError ? "room-error" : undefined}
                    />
                  </div>
                  {joinError ? (
                    <p
                      id="room-error"
                      className={`${fieldHelpClass} text-[var(--danger)]`}
                    >
                      {joinError}
                    </p>
                  ) : (
                    <p className={fieldHelpClass}>
                      Ask the room creator for their invitation link.
                    </p>
                  )}
                </div>
              )}

              {createError && mode === "create" && (
                <p
                  className="mx-0.5 mt-[-8px] text-[0.68rem] text-[var(--danger)]"
                  role="alert"
                >
                  {createError.message}
                </p>
              )}

              <button
                type="submit"
                className={primaryButtonClass}
                disabled={
                  !username.trim() ||
                  isCreating ||
                  (mode === "join" && !roomInput.trim())
                }
              >
                <span>
                  {mode === "create"
                    ? isCreating
                      ? "Creating room…"
                      : "Create private room"
                    : "Enter private room"}
                </span>
                <ArrowRightIcon />
              </button>
            </form>

            <p className="mt-[19px] mb-[-3px] flex items-center justify-center gap-1.5 text-[0.62rem] text-[var(--text-faint)]">
              <LockIcon width={13} height={13} />
              Rooms accept a maximum of two participants.
            </p>
          </div>
        </div>
      </section>

      <footer className="relative z-[1] mx-auto flex min-h-[58px] w-[min(1180px,calc(100%_-_48px))] items-center justify-between border-t border-[var(--border)] text-[0.66rem] text-[var(--text-faint)] max-[680px]:w-[min(1180px,calc(100%_-_32px))] max-[680px]:[&>span:last-child]:hidden">
        <span>© {new Date().getFullYear()} Cloak</span>
        <span>Your words belong to you.</span>
      </footer>
    </main>
  );
};

export default Page;
