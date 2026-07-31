import { Message as MessageType } from "@/lib/realtime";

interface MessageProps {
  message: MessageType;
  isMe: boolean;
}

export const Message = ({ message, isMe }: MessageProps) => {
  const initial = message.sender.charAt(0).toUpperCase() || "?";

  return (
    <article
      className={`mb-[22px] flex max-w-[min(680px,82%)] items-end gap-[9px] max-[680px]:mb-[18px] max-[680px]:max-w-[90%] ${
        isMe ? "ml-auto justify-end" : ""
      }`}
    >
      {!isMe && (
        <span className="grid size-[30px] shrink-0 place-items-center rounded-[10px] border border-[var(--border)] bg-[var(--surface-raised)] text-[0.67rem] font-[720] text-[var(--text-soft)] max-[680px]:size-[27px] max-[680px]:rounded-[9px]">
          {initial}
        </span>
      )}
      <div className="min-w-0">
        <div
          className={`mx-[3px] mb-1.5 flex items-center gap-2 ${
            isMe ? "justify-end" : ""
          }`}
        >
          <strong className="max-w-[220px] overflow-hidden text-[0.67rem] font-[680] text-ellipsis whitespace-nowrap">
            {isMe ? "You" : message.sender}
          </strong>
          <span
            className="font-[var(--font-mono)] text-[0.57rem] text-[var(--text-faint)]"
            suppressHydrationWarning
          >
            {new Date(message.timeStamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div
          className={`wrap-anywhere whitespace-pre-wrap border px-3.5 py-[11px] text-[0.83rem] leading-[1.55] shadow-[var(--shadow-sm)] max-[680px]:px-3 max-[680px]:py-2.5 max-[680px]:text-[0.79rem] ${
            isMe
              ? "rounded-[17px_6px_17px_17px] border-transparent bg-[var(--accent)] text-[var(--accent-contrast)]"
              : "rounded-[6px_17px_17px_17px] border-[var(--border)] bg-[var(--surface-solid)] text-[var(--text)]"
          }`}
        >
          {message.text}
        </div>
      </div>
    </article>
  );
};
