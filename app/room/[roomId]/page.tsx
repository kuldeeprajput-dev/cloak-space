"use client";

import { Brand } from "@/components/brand";
import {
  AlertIcon,
  ArrowRightIcon,
  CheckIcon,
  ChevronLeftIcon,
  ClockIcon,
  CopyIcon,
  LinkIcon,
  LockIcon,
  SendIcon,
  ShieldIcon,
  TrashIcon,
  UsersIcon,
} from "@/components/icons";
import { Message as MessageComponent } from "@/components/message";
import { ThemeToggle } from "@/components/theme-toggle";
import { useUsername } from "@/hooks/use-username";
import { client } from "@/lib/client";
import type { Message } from "@/lib/realtime";
import { useRealtime } from "@/lib/realtime-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type PresenceData = {
  roomId: string;
  participants: number;
  maxParticipants: number;
};

const microLabelClass =
  "text-[0.68rem] font-bold tracking-[0.13em] text-[var(--text-faint)] uppercase";
const statusDotClass =
  "inline-block size-[7px] shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_0_4px_var(--accent-soft)]";
const contentPaddingClass =
  "px-[clamp(22px,4vw,54px)] max-[960px]:px-[max(24px,calc((100vw_-_760px)/2))]";
const primaryButtonClass =
  "flex min-h-[52px] w-full items-center justify-between gap-3 rounded-[14px] border-0 bg-[var(--accent)] py-0 pr-[17px] pl-5 font-[720] tracking-[-0.01em] text-[var(--accent-contrast)] shadow-[var(--shadow-accent)] transition-[background-color,transform,box-shadow] duration-150 enabled:hover:-translate-y-px enabled:hover:bg-[var(--accent-hover)] enabled:hover:shadow-[0_14px_32px_color-mix(in_srgb,var(--accent)_30%,transparent)] disabled:opacity-50 disabled:shadow-none [&>svg]:w-[19px] [&>svg]:transition-transform [&>svg]:duration-150 enabled:hover:[&>svg]:translate-x-[3px]";

const Page = () => {
  const param = useParams();
  const roomId = param.roomId as string;
  const router = useRouter();
  const queryClient = useQueryClient();
  const [copied, setCopied] = useState(false);
  const [input, setInput] = useState("");
  const [now, setNow] = useState(() => Date.now());
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { username } = useUsername();
  const [isDestroyed, setIsDestroyed] = useState(false);
  const [presence, setPresence] = useState<PresenceData | null>(null);

  const {
    data: joinData,
    error: joinError,
    isLoading: isJoining,
  } = useQuery({
    queryKey: ["join", roomId],
    queryFn: async () => {
      const res = await client.room.join.get({ query: { roomId } });
      if (res.error) {
        throw new Error(res.error.value.summary ?? "Failed to join room");
      }
      return { ...res.data, joinedAt: Date.now() };
    },
    enabled: !!roomId,
    retry: false,
  });

  const { data: history } = useQuery({
    queryKey: ["messages", roomId],
    queryFn: async () => {
      const res = await client.message.history.get({ query: { roomId } });
      const data = res.data ?? [];
      return data.map((item) =>
        typeof item === "string"
          ? (JSON.parse(item) as Message)
          : (item as Message),
      );
    },
    enabled: !!joinData,
  });

  useRealtime({
    channels: [roomId],
    events: ["chat.message", "chat.presence", "chat.destroy"],
    onData: ({ event, data }) => {
      if (event === "chat.message") {
        const message = data as Message;
        queryClient.setQueryData(
          ["messages", roomId],
          (old: Message[] = []) => {
            if (old.some((item) => item.id === message.id)) return old;
            return [...old, message];
          },
        );
      } else if (event === "chat.presence") {
        const nextPresence = data as PresenceData;
        if (nextPresence.roomId === roomId) setPresence(nextPresence);
      } else if (event === "chat.destroy") {
        setIsDestroyed(true);
      }
    },
  });

  useEffect(() => {
    if (!joinData?.ttl) return;
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [joinData?.ttl]);

  const timeRemaining =
    joinData?.ttl && joinData.joinedAt
      ? Math.max(0, joinData.ttl - Math.floor((now - joinData.joinedAt) / 1000))
      : null;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const {
    mutate: sendMessage,
    isPending: isSending,
    error: sendError,
  } = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      const res = await client.message.post(
        { sender: username, text },
        { query: { roomId } },
      );
      if (res.error) throw new Error("Message could not be sent.");
      return res.data as Message;
    },
    onSuccess: (message) => {
      queryClient.setQueryData(["messages", roomId], (old: Message[] = []) => {
        if (old.some((item) => item.id === message.id)) return old;
        return [...old, message];
      });
    },
  });

  const { mutate: destroyRoom, isPending: isDestroying } = useMutation({
    mutationFn: async () => {
      await client.room.delete(undefined, { query: { roomId } });
    },
    onSuccess: () => setIsDestroyed(true),
  });

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const submitMessage = () => {
    const text = input.trim();
    if (!text || isSending) return;
    sendMessage({ text });
    setInput("");
    inputRef.current?.focus();
  };

  if (joinError) {
    const errorMessage =
      joinError instanceof Error
        ? joinError.message
        : "Failed to join this room.";
    const isRoomFull = errorMessage.toLowerCase().includes("full");

    return (
      <RoomState
        icon={isRoomFull ? <UsersIcon /> : <LinkIcon />}
        eyebrow={isRoomFull ? "Room capacity reached" : "Invitation unavailable"}
        title={isRoomFull ? "This room is full." : "This room is no longer here."}
        description={
          isRoomFull
            ? "Cloak rooms are intentionally limited to two people. Ask the creator to start a new room."
            : "The invitation may be incorrect, or the conversation has already expired and disappeared."
        }
        action="Return home"
        onAction={() => router.push("/")}
      />
    );
  }

  if (isDestroyed || timeRemaining === 0) {
    return (
      <RoomState
        icon={<TrashIcon />}
        eyebrow="Privacy complete"
        title="The room has disappeared."
        description="The timer ended or someone closed the room. This conversation can no longer be accessed."
        action="Start a new conversation"
        onAction={() => router.push("/")}
        destroyed
      />
    );
  }

  const participants =
    presence?.participants ?? joinData?.participants ?? (isJoining ? 0 : 1);
  const maxParticipants =
    presence?.maxParticipants ?? joinData?.maxParticipants ?? 2;
  const isUrgent = timeRemaining !== null && timeRemaining < 60;

  return (
    <main className="h-dvh overflow-hidden bg-[var(--page)]">
      <header className="relative z-50 flex h-[72px] items-center justify-between gap-5 border-b border-[var(--border)] bg-[var(--surface)] px-6 shadow-[var(--shadow-sm)] backdrop-blur-[20px] max-[680px]:h-[62px] max-[680px]:px-[15px]">
        <div className="flex min-w-0 items-center gap-3">
          <Brand compact />
          <span className="mx-1 h-[30px] w-px bg-[var(--border)] max-[680px]:hidden" />
          <div className="flex min-w-0 items-center gap-2.5 max-[680px]:hidden">
            <span className={statusDotClass} />
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[0.59rem] font-[630] tracking-[0.06em] text-[var(--text-faint)] uppercase">
                Private room
              </span>
              <strong className="max-w-[210px] overflow-hidden font-[var(--font-mono)] text-[0.7rem] font-semibold text-ellipsis whitespace-nowrap">
                {roomId}
              </strong>
            </div>
          </div>
        </div>

        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`mr-1 flex items-center gap-[9px] max-[680px]:hidden ${
              isUrgent ? "text-[var(--danger)]" : ""
            }`}
          >
            <ClockIcon
              className={`w-[18px] ${
                isUrgent
                  ? "text-[var(--danger)]"
                  : "text-[var(--warning)]"
              }`}
            />
            <div className="flex min-w-0 flex-col gap-0.5">
              <span className="text-[0.59rem] font-[630] tracking-[0.06em] text-[var(--text-faint)] uppercase">
                Disappears in
              </span>
              <strong className="font-[var(--font-mono)] text-[0.77rem] tracking-[0.02em]">
                {timeRemaining !== null
                  ? formatTime(timeRemaining)
                  : "Connecting…"}
              </strong>
            </div>
          </div>
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-[42px] items-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--danger)_28%,var(--border))] bg-[var(--danger-soft)] px-[13px] text-[0.7rem] font-bold text-[var(--danger)] transition-[background-color,transform] duration-150 enabled:hover:-translate-y-px enabled:hover:bg-[color-mix(in_srgb,var(--danger)_17%,transparent)] disabled:opacity-50 max-[680px]:w-[42px] max-[680px]:justify-center max-[680px]:px-0 [&>svg]:w-4 max-[680px]:[&>span]:hidden"
            onClick={() => destroyRoom()}
            disabled={isDestroying || !joinData}
            title="Destroy room now"
          >
            <TrashIcon />
            <span>{isDestroying ? "Closing…" : "End room"}</span>
          </button>
        </div>
      </header>

      <div className="hidden h-[43px] items-center justify-between border-b border-[var(--border)] bg-[var(--surface-raised)] px-[15px] font-[var(--font-mono)] text-[0.59rem] text-[var(--text-faint)] max-[680px]:flex">
        <div className="flex items-center gap-[7px]">
          <span className={statusDotClass} />
          <span>{participants} connected</span>
        </div>
        <span>{timeRemaining !== null ? formatTime(timeRemaining) : "--:--"}</span>
        <button
          type="button"
          className="flex items-center gap-[7px] border-0 bg-transparent font-[var(--font-sans)] font-[680] text-[var(--accent)] [&>svg]:w-3.5"
          onClick={copyLink}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
          {copied ? "Copied" : "Invite"}
        </button>
      </div>

      <div className="grid h-[calc(100dvh_-_72px)] grid-cols-[minmax(0,1fr)_284px] max-[960px]:grid-cols-1 max-[680px]:h-[calc(100dvh_-_105px)]">
        <section className="grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)_auto] bg-[radial-gradient(circle_at_50%_-20%,color-mix(in_srgb,var(--accent)_7%,transparent),transparent_40%),var(--page)]">
          <div
            className={`flex min-h-[88px] items-center justify-between gap-5 border-b border-[var(--border)] py-[18px] max-[680px]:min-h-[65px] max-[680px]:px-4 max-[680px]:py-3 ${contentPaddingClass}`}
          >
            <div>
              <span className={`${microLabelClass} max-[680px]:hidden`}>
                Temporary conversation
              </span>
              <h1 className="mt-0.5 mb-0 text-[0.92rem] font-[450] tracking-[-0.015em] max-[680px]:m-0 max-[680px]:text-base">
                Just between us
              </h1>
            </div>
            <div className="flex items-center gap-[9px] text-[0.7rem] font-[620] text-[var(--text-soft)] max-[680px]:hidden">
              <span className={statusDotClass} />
              {isJoining ? "Connecting" : "Secure connection"}
            </div>
          </div>

          <div
            ref={scrollRef}
            className={`min-h-0 overflow-y-auto overscroll-contain py-[34px] [scrollbar-color:var(--border-strong)_transparent] [scrollbar-width:thin] max-[680px]:px-[15px] max-[680px]:py-[23px] ${contentPaddingClass}`}
          >
            {history?.map((message) => (
              <MessageComponent
                key={message.id}
                message={message}
                isMe={message.sender === username}
              />
            ))}

            {(!history || history.length === 0) && (
              <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center max-[680px]:min-h-60">
                <div className="mb-4 grid size-12 place-items-center rounded-2xl border border-[color-mix(in_srgb,var(--accent)_22%,var(--border))] bg-[var(--accent-soft)] text-[var(--accent)]">
                  <LockIcon />
                </div>
                <h2 className="m-0 text-base tracking-[-0.02em]">
                  This room is ready.
                </h2>
                <p className="mt-2 mb-[17px] max-w-[340px] text-[0.72rem] leading-[1.6] text-[var(--text-faint)] max-[680px]:max-w-[270px]">
                  Send the first message or invite someone using your private
                  link.
                </p>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-[10px] border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-[0.68rem] font-[670] text-[var(--text-soft)] transition-colors hover:border-[var(--border-strong)] hover:text-[var(--text)] [&>svg]:w-[15px]"
                  onClick={copyLink}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                  {copied ? "Invitation copied" : "Copy invitation link"}
                </button>
              </div>
            )}
          </div>

          <div
            className={`border-t border-[var(--border)] bg-[color-mix(in_srgb,var(--surface-solid)_82%,transparent)] pt-4 pb-[15px] backdrop-blur-[18px] max-[680px]:px-2.5 max-[680px]:pt-2.5 max-[680px]:pb-[max(9px,env(safe-area-inset-bottom))] ${contentPaddingClass}`}
          >
            {sendError && (
              <p
                className="mx-[3px] mt-0 mb-[9px] flex items-center gap-1.5 text-[0.67rem] text-[var(--danger)] [&>svg]:w-3.5"
                role="alert"
              >
                <AlertIcon />
                {sendError.message}
              </p>
            )}
            <div className="flex items-end gap-2.5 rounded-2xl border border-[var(--border-strong)] bg-[var(--surface-solid)] p-2 pl-[15px] shadow-[var(--shadow-sm)] transition-[border-color,box-shadow] duration-150 focus-within:border-[var(--accent)] focus-within:shadow-[0_0_0_3px_color-mix(in_srgb,var(--accent)_10%,transparent)] max-[680px]:rounded-[14px] max-[680px]:pl-3">
              <textarea
                className="min-h-[38px] max-h-[110px] w-full resize-none border-0 bg-transparent py-[9px] pt-[9px] pb-[7px] text-[0.82rem] leading-[1.4] text-[var(--text)] outline-0 placeholder:text-[var(--text-faint)]"
                ref={inputRef}
                autoFocus
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    submitMessage();
                  }
                }}
                rows={1}
                maxLength={1000}
                placeholder="Write a message…"
                aria-label="Message"
              />
              <button
                type="button"
                className="grid size-10 shrink-0 place-items-center rounded-xl border-0 bg-[var(--accent)] text-[var(--accent-contrast)] transition-[background-color,transform] duration-150 enabled:hover:-translate-y-px enabled:hover:bg-[var(--accent-hover)] disabled:opacity-[0.38] [&>svg]:w-[18px]"
                onClick={submitMessage}
                disabled={!input.trim() || isSending || !joinData}
                aria-label="Send message"
              >
                <SendIcon />
              </button>
            </div>
            <div className="mx-1 mt-[7px] flex items-center justify-between text-[0.57rem] text-[var(--text-faint)] max-[680px]:hidden">
              <span>Enter to send · Shift + Enter for a new line</span>
              <span>{input.length}/1000</span>
            </div>
          </div>
        </section>

        <aside className="flex min-h-0 flex-col overflow-y-auto border-l border-[var(--border)] bg-[var(--surface-raised)] max-[960px]:hidden">
          <section className="border-b border-[var(--border)] px-[21px] py-6">
            <span className={microLabelClass}>Room details</span>
            <div className="mt-3.5 flex items-center justify-between gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--surface-solid)] pt-[11px] pr-[9px] pb-[11px] pl-3">
              <div className="min-w-0">
                <span className="mb-[3px] block text-[0.56rem] text-[var(--text-faint)]">
                  Room ID
                </span>
                <strong className="block overflow-hidden font-[var(--font-mono)] text-[0.64rem] font-semibold text-ellipsis whitespace-nowrap">
                  {roomId}
                </strong>
              </div>
              <button
                type="button"
                className="grid size-[31px] shrink-0 place-items-center rounded-[9px] border-0 bg-[var(--accent-soft)] text-[var(--accent)] [&>svg]:w-[15px]"
                onClick={copyLink}
                aria-label="Copy invitation link"
                title="Copy invitation link"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
          </section>

          <section className="border-b border-[var(--border)] px-[21px] py-6">
            <div className="mb-[17px] flex items-center justify-between">
              <span className={microLabelClass}>Participants</span>
              <span className="font-[var(--font-mono)] text-[0.6rem] text-[var(--text-faint)]">
                {participants}/{maxParticipants}
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="grid size-[34px] shrink-0 place-items-center rounded-[11px] bg-[var(--accent-soft)] text-[0.7rem] font-[750] text-[var(--accent)]">
                {username.charAt(0).toUpperCase() || "A"}
              </span>
              <div className="min-w-0">
                <strong className="mb-[3px] block overflow-hidden text-[0.69rem] font-[670] text-ellipsis whitespace-nowrap">
                  {username || "Anonymous"}
                </strong>
                <span className="flex items-center gap-1.5 text-[0.58rem] text-[var(--text-faint)]">
                  <span className="size-[5px] shrink-0 rounded-full bg-[var(--accent)]" />{" "}
                  You
                </span>
              </div>
            </div>
            {participants < maxParticipants ? (
              <div className="mt-3.5 flex items-center gap-2.5 opacity-[0.68]">
                <span className="grid size-[34px] shrink-0 place-items-center rounded-[11px] border border-dashed border-[var(--border-strong)] bg-transparent text-[0.7rem] font-[750] text-[var(--text-faint)]">
                  +
                </span>
                <div className="min-w-0">
                  <strong className="mb-[3px] block overflow-hidden text-[0.69rem] font-[670] text-ellipsis whitespace-nowrap">
                    Waiting for someone
                  </strong>
                  <span className="flex items-center gap-1.5 text-[0.58rem] text-[var(--text-faint)]">
                    Share the room link to invite
                  </span>
                </div>
              </div>
            ) : (
              <div className="mt-3.5 flex items-center gap-2.5">
                <span className="grid size-[34px] shrink-0 place-items-center rounded-[11px] bg-[var(--accent-soft)] text-[0.7rem] font-[750] text-[var(--accent)]">
                  G
                </span>
                <div className="min-w-0">
                  <strong className="mb-[3px] block overflow-hidden text-[0.69rem] font-[670] text-ellipsis whitespace-nowrap">
                    Guest
                  </strong>
                  <span className="flex items-center gap-1.5 text-[0.58rem] text-[var(--text-faint)]">
                    <span className="size-[5px] shrink-0 rounded-full bg-[var(--accent)]" />{" "}
                    Connected
                  </span>
                </div>
              </div>
            )}
          </section>

          <section className="flex gap-[11px] px-[21px] py-6">
            <div className="grid size-[33px] shrink-0 place-items-center rounded-[10px] bg-[var(--accent-soft)] text-[var(--accent)] [&>svg]:w-[17px]">
              <ShieldIcon />
            </div>
            <div>
              <strong className="mt-0.5 mb-1.5 block text-[0.69rem]">
                Privacy is active
              </strong>
              <p className="m-0 text-[0.61rem] leading-[1.55] text-[var(--text-faint)]">
                Messages disappear permanently when this room closes. There is
                no account history.
              </p>
            </div>
          </section>

          <div className="flex-1" />

          <button
            type="button"
            className="m-4 flex items-center gap-2 border-0 bg-transparent p-2 text-[0.66rem] font-[650] text-[var(--text-faint)] transition-colors hover:text-[var(--text)] [&>svg]:w-4"
            onClick={() => router.push("/")}
          >
            <ChevronLeftIcon />
            Leave room
          </button>
        </aside>
      </div>
    </main>
  );
};

const RoomState = ({
  icon,
  eyebrow,
  title,
  description,
  action,
  onAction,
  destroyed = false,
}: {
  icon: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
  action: string;
  onAction: () => void;
  destroyed?: boolean;
}) => (
  <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px),var(--page)] bg-[length:72px_72px] px-6 pt-[100px] pb-10 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_center,color-mix(in_srgb,var(--page)_62%,transparent)_0,var(--page)_68%)]">
    <div className="pointer-events-none fixed -top-[220px] -right-40 z-0 size-[520px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent)_16%,transparent)_0%,transparent_68%)] blur-[2px]" />
    <header className="absolute top-0 left-1/2 z-2 flex h-[82px] w-[min(1080px,calc(100%_-_48px))] -translate-x-1/2 items-center justify-between border-b border-[var(--border)] max-[680px]:h-[70px] max-[680px]:w-[calc(100%_-_32px)]">
      <Brand />
      <ThemeToggle />
    </header>
    <section className="relative z-[1] w-[min(440px,100%)] rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-[38px] text-center shadow-[var(--shadow-md)] backdrop-blur-[20px] max-[680px]:px-[23px] max-[680px]:py-[31px]">
      <div
        className={`mx-auto mb-[22px] grid size-[58px] place-items-center rounded-[19px] border ${
          destroyed
            ? "border-[color-mix(in_srgb,var(--danger)_25%,var(--border))] bg-[var(--danger-soft)] text-[var(--danger)]"
            : "border-[color-mix(in_srgb,var(--accent)_25%,var(--border))] bg-[var(--accent-soft)] text-[var(--accent)]"
        }`}
      >
        {icon}
      </div>
      <span className={microLabelClass}>{eyebrow}</span>
      <h1 className="mt-2 mb-3 text-[1.65rem] tracking-[-0.045em]">
        {title}
      </h1>
      <p className="mt-0 mb-[25px] text-[0.8rem] leading-[1.65] text-[var(--text-soft)]">
        {description}
      </p>
      <button
        type="button"
        className={primaryButtonClass}
        onClick={onAction}
      >
        <span>{action}</span>
        <ArrowRightIcon />
      </button>
    </section>
  </main>
);

export default Page;
