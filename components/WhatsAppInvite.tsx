"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

export const WHATSAPP_GROUP_URL = "https://chat.whatsapp.com/JhFjC9NZwra17JZo6fYY3L?mode=gi_t";
export const WHATSAPP_GROUP_NAME = "CEL 2026-2027 Announcement Whatsapp Group";

const inviteEvent = "cel:whatsapp-invite";
const inviteSeenKey = "cel_whatsapp_invite_seen";

function WhatsAppMark() {
  return (
    <svg aria-hidden="true" viewBox="0 0 32 32">
      <path d="M16 3.2A12.4 12.4 0 0 0 5.3 21.8L3.7 28.6l6.9-1.6A12.4 12.4 0 1 0 16 3.2Z" />
      <path className="whatsapp-phone" d="M11.8 9.6c-.3-.7-.7-.7-1-.7h-.8c-.3 0-.7.1-1.1.6-.4.5-1.5 1.5-1.5 3.6s1.5 4.2 1.7 4.5c.2.3 3 4.6 7.3 6.4 3.6 1.5 4.3 1.2 5.1 1.1.8-.1 2.5-1 2.9-2 .4-1 .4-1.8.3-2-.1-.2-.4-.3-.9-.6l-3-1.4c-.4-.2-.8-.3-1.1.3-.3.5-1.1 1.4-1.4 1.7-.3.3-.5.4-1 .1-.5-.2-2-.7-3.7-2.3-1.4-1.2-2.3-2.7-2.6-3.2-.3-.5 0-.7.2-1l.7-.8c.2-.3.3-.5.5-.8.2-.3.1-.6 0-.8l-1.4-3.1Z" />
    </svg>
  );
}

export function WhatsAppInvite() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const joinLinkRef = useRef<HTMLAnchorElement>(null);

  const showInvite = useCallback(() => {
    try {
      window.sessionStorage.setItem(inviteSeenKey, "1");
    } catch {
      // The invite still works when storage is unavailable.
    }
    setOpen(true);
  }, []);

  useEffect(() => {
    const handleInvite = () => showInvite();
    window.addEventListener(inviteEvent, handleInvite);

    const shouldAutoOpen = pathname === "/" || pathname === "/leaderboard";
    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem(inviteSeenKey) === "1";
    } catch {
      alreadySeen = false;
    }

    const timeout = shouldAutoOpen && !alreadySeen
      ? window.setTimeout(showInvite, 1400)
      : null;

    return () => {
      window.removeEventListener(inviteEvent, handleInvite);
      if (timeout !== null) window.clearTimeout(timeout);
    };
  }, [pathname, showInvite]);

  useEffect(() => {
    if (!open) return;
    const priorOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = window.requestAnimationFrame(() => joinLinkRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = priorOverflow;
    };
  }, [open]);

  return (
    <>
      <button className="whatsapp-fab no-print" onClick={showInvite} type="button" aria-label="Open CEL WhatsApp group invite">
        <WhatsAppMark />
        <span>JOIN WHATSAPP</span>
      </button>

      {open ? (
        <div className="whatsapp-overlay no-print" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setOpen(false);
        }}>
          <section className="whatsapp-dialog" role="dialog" aria-modal="true" aria-labelledby="whatsapp-invite-title">
            <button className="whatsapp-close" onClick={() => setOpen(false)} type="button" aria-label="Close WhatsApp invite">×</button>
            <div className="whatsapp-dialog-mark"><WhatsAppMark /></div>
            <div className="eyebrow">STAY IN THE LOOP</div>
            <h2 id="whatsapp-invite-title">JOIN THE CEL ANNOUNCEMENT GROUP.</h2>
            <p>Get event updates, puzzle announcements and upcoming CEL opportunities directly on WhatsApp.</p>
            <strong>{WHATSAPP_GROUP_NAME}</strong>
            <div className="actions">
              <a
                className="button whatsapp-join"
                href={WHATSAPP_GROUP_URL}
                ref={joinLinkRef}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
              >
                OPEN IN WHATSAPP →
              </a>
              <button className="button secondary" onClick={() => setOpen(false)} type="button">MAYBE LATER</button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

export function announceWhatsAppInvite() {
  window.dispatchEvent(new Event(inviteEvent));
}
