import React from "react";
import Icon from "./Icon.jsx";

export const NAVIGATION = [
  { id: "home", label: "Hoje", mobile: "Hoje", icon: "home" },
  { id: "path", label: "Trilha", mobile: "Trilha", icon: "learn" },
  { id: "progress", label: "Meu espaço", mobile: "Meu espaço", icon: "trophy" },
];

export function Brand({ compact = false, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 select-none ${compact ? "lg:hidden" : ""}`}
      aria-label="Kotonoha, início"
    >
      <div className="flex items-center gap-2.5">
        <img
          src="/icon.svg"
          alt=""
          aria-hidden="true"
          className="h-10 w-10 shrink-0 select-none pointer-events-none"
        />
        <span className="type-h2 text-ink-strong tracking-tight">
          Kotonoha
        </span>
      </div>
    </button>
  );
}

export function NavItem({ item, active, mobile = false, count, onClick }) {
  if (mobile) {
    return (
      <button
        onClick={onClick}
        className={`relative flex flex-col items-center justify-center gap-0.5 py-2 px-1 min-h-14 text-xs rounded-xl transition-colors cursor-pointer select-none ${
          active
            ? "text-primary-strong font-black"
            : "text-muted hover:text-ink font-semibold"
        }`}
        data-view={item.id}
        aria-current={active ? "page" : undefined}
      >
        <span className="text-xl relative inline-flex">
          <Icon name={item.icon} />
          {count > 0 && (
            <span className="absolute -top-1.5 -right-2 px-1 min-w-4 h-4 text-[9px] font-black rounded-full bg-blue text-white flex items-center justify-center shadow-xs">
              {count}
            </span>
          )}
        </span>
        <span className="truncate max-w-[64px]">{item.mobile}</span>
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center text-left justify-between px-4 min-h-12 rounded-xl text-sm font-semibold transition-colors cursor-pointer select-none border ${
        active
          ? "bg-accent-soft text-primary-strong border-primary"
          : "text-muted hover:bg-raised hover:text-ink-strong border-transparent"
      }`}
      data-view={item.id}
      aria-current={active ? "page" : undefined}
    >
      <span className="flex items-center gap-3">
        <Icon name={item.icon} />
        <span>{item.label}</span>
      </span>
      {count > 0 && (
        <span className="px-2 py-0.5 rounded-full type-caption bg-blue text-white">
          {count}
        </span>
      )}
    </button>
  );
}

export function PageHeading({
  id,
  title,
  description,
  icon,
  iconBg = "bg-accent-soft",
  iconColor = "text-primary",
  children,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 rounded-2xl bg-paper border border-line">
      <div className="space-y-1 min-w-0">
        <div className="flex items-center gap-2.5">
          {icon && (
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${iconBg} ${iconColor} shadow-xs`}
            >
              <Icon name={icon} className={`w-5 h-5 ${iconColor}`} />
            </span>
          )}
          <h1 id={id} className="type-h2 text-ink-strong">
            {title}
          </h1>
        </div>
        {description && (
          <p className="type-body-sm text-muted">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-2 shrink-0">{children}</div>
      )}
    </div>
  );
}
