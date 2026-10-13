import React from "react";

/**
 * Ícones Oficiais do Kotonoha (Padrão Duolingo / Sólidos Preenchidos).
 * Todos padronizados em viewBox 0 0 24 24 com preenchimento sólido 'currentColor'
 * ou gradiente temático, eliminando emojis irregulares.
 */
export default function Icon({ name, className = "w-5 h-5" }) {
  switch (name) {
    case "lock":
      return <svg className={`ui-icon shrink-0 ${className}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg>;

    case "flame":
      // Fogo sólido / Ofensiva Duolingo
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12.2 2c.6 3.2-1.3 5.4-2.8 7.2-1.5 1.8-2.4 3.7-2.4 5.8 0 4 3.1 7 7 7s7-3.1 7-7c0-3.3-1.8-6.1-3.5-8.4-.5-.7-.4-1.6.2-2.1.5-.4 1.2-.4 1.7.1 2.3 2.7 4.6 6.3 4.6 10.4 0 5.5-4.5 10-10 10S4 20.5 4 15c0-3.4 1.6-6.4 3.6-9.1 1.2-1.6 2.7-3.1 4.6-3.9z" />
          <path
            d="M12.5 13c-.3 1.2-1 2.2-2 2.9-.6.4-.8 1.2-.4 1.8.3.5 1 .7 1.6.4 1.7-1 2.8-2.7 3.2-4.6.2-.9-.7-1.6-1.5-1.2-.5.2-.8.5-.9.7z"
            fill="#ffffff"
            opacity="0.6"
          />
        </svg>
      );

    case "gem":
    case "crystal":
      // Cristal / Gema Duolingo
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M6 3h12l5 6-11 12L1 9l5-6zm2 2-3.3 4h4.6L8 5zm3 0v4h2V5h-2zm3 0 1.3 4h4.4L14 5zm-3 6v8.5l6.5-8.5H11zm-2 0H4.5L11 19.5V11z" />
        </svg>
      );

    case "jpFlag":
      // Bandeira do Japão circular / estilizada
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" fill="#f7f7f7" stroke="#e5e5e5" strokeWidth="2" />
          <circle cx="12" cy="12" r="5" fill="#ff4b4b" />
        </svg>
      );

    case "puzzle":
      // Peça de quebra-cabeça sólida (Contraste Sintático)
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20.5 11H19V7c0-1.1-.9-2-2-2h-4V3.5C13 2.1 11.9 1 10.5 1S8 2.1 8 3.5V5H4c-1.1 0-2 .9-2 2v4h1.5C4.9 11 6 12.1 6 13.5S4.9 16 3.5 16H2v4c0 1.1.9 2 2 2h4v-1.5c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5V22h4c1.1 0 2-.9 2-2v-4h1.5c1.4 0 2.5-1.1 2.5-2.5s-1.1-2.5-2.5-2.5z" />
        </svg>
      );

    case "phone":
    case "line":
      // Celular / Smartphone sólido (Modo LINE)
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14zm-5 1c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z" />
        </svg>
      );

    case "mic":
      // Microfone sólido (Pitch Accent)
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5zm6 6c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-4.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      );

    case "brain":
      // Cérebro / Memória de erros sólida
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 3a4.5 4.5 0 0 0-4.3 3.2 4 4 0 0 0-3.2 3.9c0 1.1.4 2.1 1.2 2.9a4 4 0 0 0 .3 5.4 4 4 0 0 0 5.5.4 4.5 4.5 0 0 0 .5-.4V3zm0 0a4.5 4.5 0 0 1 4.3 3.2 4 4 0 0 1 3.2 3.9c0 1.1-.4 2.1-1.2 2.9a4 4 0 0 1-.3 5.4 4 4 0 0 1-5.5.4 4.5 4.5 0 0 1-.5-.4V3z" />
        </svg>
      );

    case "refresh":
    case "srs":
      // Setas circulares de repetição (SRS)
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
        </svg>
      );

    case "plane":
      // Avião sólido (Meta Viagem)
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
        </svg>
      );

    case "briefcase":
      // Maleta sólida (Meta Negócios)
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z" />
        </svg>
      );

    case "torii":
    case "culture":
      // Torii / Portal Japonês sólido
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M2 5c5-.7 15-.7 20 0v2H2V5zm3 3h14v2H5V8zm2 3h2v10H7V11zm8 0h2v10h-2V11z" />
        </svg>
      );

    case "academic":
    case "graduate":
      // Capelo / Graduação sólida
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 8.82L4.2 9 12 4.77 19.8 9 12 11.82zM5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82z" />
        </svg>
      );

    case "sound":
      // Alto-falante sólido com ondas
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
      );

    case "bolt":
      // Raio sólido
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M11 21h-1l1-7H7.5c-.88 0-1.33-.8-.92-1.47L13 3h1l-1 7h3.5c.88 0 1.33.8.92 1.47L11 21z" />
        </svg>
      );

    case "trophy":
      // Troféu sólido
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1c1.8-.39 3.23-1.82 3.61-3.96C19.08 11.63 21 9.55 21 7V5c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z" />
        </svg>
      );

    case "check":
      // Checkmark sólido
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      );

    case "close":
      // X sólido
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      );

    case "arrow":
      // Seta direcional sólida
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      );

    case "chevron":
      // Chevron
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      );

    case "home":
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      );

    case "learn":
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z" />
        </svg>
      );

    case "review":
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46A7.93 7.93 0 0 0 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74A7.93 7.93 0 0 0 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
        </svg>
      );

    case "jlpt":
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
        </svg>
      );

    case "settings":
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" />
        </svg>
      );

    case "chat":
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z" />
        </svg>
      );

    case "download":
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
        </svg>
      );

    default:
      return (
        <svg
          className={`ui-icon shrink-0 ${className}`}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
        </svg>
      );
  }
}
