import React from "react";
import Icon from "./Icon.jsx";

/** Junta classes ignorando valores falsos. */
export const cx = (...parts) => parts.filter(Boolean).join(" ");

const BLUE_BUTTON_CLASSES = "bg-blue border-b-4 border-blue-dark text-white hover:bg-blue/90 active:border-b-2 active:translate-y-[2px] type-button";

const BUTTON_VARIANTS = {
  primary:
    "bg-primary border-b-4 border-primary-dark text-white hover:bg-primary-strong active:border-b-2 active:translate-y-[2px] type-button",
  secondary:
    "bg-paper border border-line text-ink-strong hover:bg-raised hover:border-edge type-button",
  outline:
    "bg-transparent text-ink-strong border border-line hover:bg-raised type-button",
  ghost:
    "bg-transparent text-muted border-transparent hover:bg-raised hover:text-ink-strong active:translate-y-px type-button",
  danger:
    "bg-danger border-b-4 border-danger-dark text-white hover:bg-danger/90 active:border-b-2 active:translate-y-[2px] type-button",
  flame:
    "bg-flame border-b-4 border-flame-dark text-white hover:bg-flame/90 active:border-b-2 active:translate-y-[2px] type-button",
  // Review and blue intentionally share the same design tokenized treatment.
  review: BLUE_BUTTON_CLASSES,
  blue: BLUE_BUTTON_CLASSES,
  purple:
    "bg-purple border-b-4 border-purple-dark text-white hover:bg-purple/90 active:border-b-2 active:translate-y-[2px] type-button",
  gold:
    "bg-gold border-b-4 border-gold-dark text-ink-strong hover:bg-gold/90 active:border-b-2 active:translate-y-[2px] type-button",
};

const BUTTON_SIZES = {
  sm: "min-h-11 px-3.5 text-xs gap-1.5 rounded-xl",
  md: "min-h-12 px-5 text-sm gap-2 rounded-2xl",
  lg: "min-h-14 px-7 text-base gap-2.5 rounded-2xl font-black",
};

/** Botão 3D estilo Duolingo com clique mecânico e estados acessíveis. */
export function Button({
  variant = "secondary",
  size = "md",
  className,
  type = "button",
  children,
  ...rest
}) {
  return (
    <button
      type={type}
      className={cx(
        "inline-flex cursor-pointer items-center justify-center transition-all duration-75 disabled:cursor-not-allowed disabled:opacity-50 select-none",
        BUTTON_VARIANTS[variant] || BUTTON_VARIANTS.secondary,
        BUTTON_SIZES[size] || BUTTON_SIZES.md,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}


/** Pastel is a surface cue, not a competing status or primary action. */
const NAV_TILE_TONES={
  sage:"bg-accent-soft/55",
  sky:"bg-blue-soft/65",
  peach:"bg-amber-soft/50",
  lilac:"bg-purple-soft/45",
  neutral:"bg-paper",
};
/** Compact navigation card: an entire, keyboard-accessible touch target. */
export function NavigationTile({title,description,icon,symbol,meta,onClick,disabled=false,active,tone="neutral"}) {
  return <button type="button" onClick={onClick} disabled={disabled} aria-label={title} aria-current={active===true?"page":undefined}
    className={cx("group flex min-h-28 w-full flex-col items-start gap-2 rounded-2xl border border-line p-4 text-left transition-colors hover:border-edge focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-55 disabled:cursor-not-allowed",
      active ? "bg-accent-soft" : NAV_TILE_TONES[tone]||NAV_TILE_TONES.neutral)}>
    <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-xl bg-paper/70 text-ink-strong">
      {symbol ? <span className="font-jp text-xl font-bold" lang="ja">{symbol}</span> : <Icon name={icon||"learn"} />}
    </span>
    <strong className="text-sm font-black text-ink-strong">{title}</strong>
    {description&&<span className="text-xs leading-relaxed text-muted">{description}</span>}
    {meta&&<span className="mt-auto text-xs font-bold text-primary-strong">{meta}</span>}
  </button>;
}

/** Superfície padrão de conteúdo com borda 2px nítida estilo Duolingo. */
export function Card({ as: Tag = "section", className, children, ...rest }) {
  return (
    <Tag
      className={cx(
        "rounded-2xl border border-line bg-paper p-5 sm:p-6 transition-all",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

/**
 * Remoção de tags/badges do app: renderiza texto limpo e legível
 * sem o formato de etiqueta ou pílula flutuante.
 */
export function Badge({ children, className, tone = "neutral" }) {
  if (!children) return null;
  const colors = {
    primary: "text-primary",
    success: "text-primary",
    warn: "text-flame",
    review: "text-blue",
    danger: "text-danger",
    purple: "text-purple-ink",
    neutral: "text-muted",
  };
  return (
    <span
      className={cx(
        "type-caption",
        colors[tone] || colors.neutral,
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Grupo de opções exclusivas (nível, minutos, filtros). */
export function Segmented({
  label,
  options,
  value,
  onChange,
  className,
  tone = "light",
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cx("flex flex-wrap gap-2", className)}
    >
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(opt.value)}
            className={cx(
              "min-h-11 cursor-pointer rounded-2xl border-2 border-b-4 px-4 text-sm font-black uppercase transition-all select-none active:border-b-2 active:translate-y-[2px]",
              active
                ? "border-primary bg-accent-soft text-primary-strong border-b-primary-dark"
                : "border-line bg-paper text-muted border-b-edge hover:bg-raised hover:border-edge",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

/** Barra de progresso com cápsula e brilho clássico do Duolingo. */
export function ProgressBar({ value, label, className }) {
  const known = value !== null && value !== undefined;
  const pct = known ? Math.max(0, Math.min(100, value)) : 0;
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={known ? Math.round(pct) : undefined}
      aria-valuetext={known ? `${Math.round(pct)}%` : "0%"}
      className={cx("h-4 overflow-hidden rounded-full bg-line p-0.5 relative", className)}
    >
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out relative overflow-hidden"
        style={{ width: `${pct}%` }}
      >
        <div className="absolute top-0.5 inset-x-2 h-1 bg-white/40 rounded-full pointer-events-none" />
      </div>
    </div>
  );
}

/** Número em destaque com rótulo e explicação do cálculo. */
export function Stat({ label, value, note, className }) {
  return (
    <div
      className={cx("rounded-lg border border-line bg-paper p-4", className)}
    >
      <p className="text-xs font-semibold text-muted uppercase tracking-wider">
        {label}
      </p>
      <p className="mt-1 text-2xl font-bold text-ink">{value}</p>
      {note ? <p className="mt-1 text-xs text-muted">{note}</p> : null}
    </div>
  );
}

/** Estado vazio: diz o que falta e o que fazer. */
export function EmptyState({ title, children, action, icon }) {
  return (
    <div className="rounded-xl border border-dashed border-edge bg-paper/60 p-8 text-center">
      {icon ? (
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-primary">
          {icon}
        </div>
      ) : null}
      <p className="text-base font-bold text-ink">{title}</p>
      {children ? (
        <p className="mt-1.5 text-sm text-muted max-w-md mx-auto">{children}</p>
      ) : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

/** Cabeçalho de seção padronizado. */
export function SectionHeader({ title, description, children, className }) {
  return (
    <div
      className={cx(
        "flex flex-wrap items-end justify-between gap-3 pb-3",
        className,
      )}
    >
      <div>
        <h2 className="text-xl font-bold tracking-tight text-ink">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-muted">{description}</p>
        )}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

/** Card de tópico padronizado para exploração (Hiragana, Katakana, etc.). */
export function TopicCard({ symbol, title, detail, onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "group flex w-full cursor-pointer items-center justify-between rounded-xl border border-line bg-surface p-4 text-left transition-all duration-200 hover:border-edge active:translate-y-px",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <span
          lang="ja"
          aria-hidden="true"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-paper text-2xl font-bold text-primary-strong group-hover:bg-accent-soft transition-colors"
        >
          {symbol}
        </span>
        <div>
          <strong className="block text-base font-bold text-ink group-hover:text-primary transition-colors">
            {title}
          </strong>
          <small className="block text-xs text-muted">{detail}</small>
        </div>
      </div>
      <span className="flex h-8 w-8 items-center justify-center rounded-full text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all">
        →
      </span>
    </button>
  );
}

export function StatusText({ tone = "neutral", children }) {
  const styles = {
    neutral: "text-muted",
    active: "text-primary font-bold",
    success: "text-success font-semibold",
    flame: "text-flame-ink font-bold",
    review: "text-review-ink font-bold",
    warn: "text-amber-ink font-semibold",
  };
  return (
    <span
      className={`inline-flex items-center gap-2 text-sm ${styles[tone] || styles.neutral}`}
    >
      <Icon
        name={
          tone === "success"
            ? "check"
            : tone === "flame"
              ? "flame"
              : tone === "review"
                ? "review"
                : tone === "active"
                  ? "arrow"
                  : "learn"
        }
      />
      {children}
    </span>
  );
}

export function Disclosure({
  title,
  description,
  status,
  icon,
  tone = "neutral",
  children,
}) {
  return (
    <details className="group w-full min-w-0 rounded-2xl border-2 border-b-4 border-line bg-paper p-5 transition-all hover:border-edge">
      <summary className="flex items-center justify-between gap-4 cursor-pointer select-none list-none [&::-webkit-details-marker]:hidden">
        <div className="flex items-center gap-3.5 min-w-0 flex-1">
          {icon && (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-raised border-2 border-line text-ink-strong group-hover:scale-105 transition-transform">
              <Icon name={icon} className="w-5 h-5 text-primary" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <strong className="type-h3 block text-ink-strong group-hover:text-primary transition-colors">
              {title}
            </strong>
            {description && (
              <span className="type-body-sm block text-muted mt-0.5">
                {description}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {status && <StatusText tone={tone}>{status}</StatusText>}
          <span className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-b-4 border-line bg-raised type-button text-muted group-open:rotate-45 group-open:text-ink-strong group-open:border-primary-dark group-open:bg-accent-soft transition-transform">
            +
          </span>
        </div>
      </summary>
      <div className="pt-4 mt-4 border-t-2 border-line w-full min-w-0">
        {children}
      </div>
    </details>
  );
}

export {Brand, NavItem, PageHeading, NAVIGATION} from './layout.jsx';
export {default as Icon} from './Icon.jsx';

export {default as AudioRateControl} from './AudioRateControl.jsx';
