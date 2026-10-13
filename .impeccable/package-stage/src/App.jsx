import React, { useState, useEffect, useCallback, useRef } from "react";
import Shell from "./Shell.jsx";
import { KEY, initialState, normalizeState, selectReview } from "./state.js";

export default function App() {
  const [state, setState] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? normalizeState(JSON.parse(raw)) : initialState();
    } catch {
      return initialState();
    }
  });
  const [view, setView] = useState("home");
  const previousView = useRef(view);
  useEffect(() => {
    if (previousView.current === view) return;
    previousView.current = view;
    const heading = document.querySelector(`#view-${view} h1`);
    heading?.setAttribute("tabindex", "-1");
    heading?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [view]);
  const [queue, setQueue] = useState([]);
  const [message, setMessage] = useState("");
  const [installPrompt, setInstallPrompt] = useState(null);
  const toast = useCallback((text) => setMessage(text), []);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      toast("Não foi possível salvar. Exporte um backup do seu progresso.");
    }
  }, [state, toast]);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(timer);
  }, [message]);
  useEffect(() => {
    const listener = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener("beforeinstallprompt", listener);
    return () => window.removeEventListener("beforeinstallprompt", listener);
  }, []);
  const update = (fn) =>
    setState((previous) => {
      const next = structuredClone(previous);
      fn(next);
      return next;
    });
  const go = (next) => {
    if (next === "review") setQueue(selectReview(state));
    setView(next);
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const study = (type) => {
    setQueue(selectReview(state, type));
    setView("review");
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  const navigate = (e) => {
    const button = e.target.closest("[data-view]");
    if (button) {
      e.preventDefault();
      go(button.dataset.view);
    }
  };
  const speak = (text) => {
    if (!("speechSynthesis" in window)) {
      toast("A voz do navegador não está disponível neste aparelho.");
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ja-JP";
    utterance.rate = 0.82;
    window.speechSynthesis.speak(utterance);
  };
  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  };
  const shared = { state, update, toast, go, speak, queue, setState };
  return (
    <Shell
      {...{
        state,
        view,
        study,
        update,
        toast,
        navigate,
        shared,
        message,
        install,
        installPrompt,
      }}
    />
  );
}
