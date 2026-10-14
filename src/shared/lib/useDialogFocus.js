import { useEffect, useRef } from "react";
export function useDialogFocus(onClose) {
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement;
    const dialog = [...document.querySelectorAll('[role="dialog"]')].at(-1);
    if (!dialog) return;
    const focusable = () =>
      [
        ...dialog.querySelectorAll(
          'button:not([disabled]), a[href], input, select, textarea, [tabindex="0"]',
        ),
      ].filter((el) => el.getClientRects().length);
    focusable()[0]?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopImmediatePropagation();
        close.current();
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      if (event.shiftKey && document.activeElement === items[0]) {
        event.preventDefault();
        items.at(-1).focus();
      } else if (!event.shiftKey && document.activeElement === items.at(-1)) {
        event.preventDefault();
        items[0].focus();
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey, true);
      if (previous?.isConnected) previous.focus();
    };
  }, []);
}
