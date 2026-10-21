/* eslint-disable @next/next/no-img-element -- static SVGs, no optimisation needed */

/** Official brand marks in /public/logos (devicon "original" / simple-icons). `tint` drives the soft glow. */
export const BRAND: Record<string, { src: string; tint: string }> = {
  langchain: { src: "/logos/langchain.svg", tint: "#7FC8FF" },
  langgraph: { src: "/logos/langgraph.svg", tint: "#7FC8FF" },
  python: { src: "/logos/python.svg", tint: "#3776AB" },
  javascript: { src: "/logos/javascript.svg", tint: "#F7DF1E" },
  react: { src: "/logos/react.svg", tint: "#61DAFB" },
  fastapi: { src: "/logos/fastapi.svg", tint: "#009688" },
  nodejs: { src: "/logos/nodejs.svg", tint: "#5FA04E" },
  nestjs: { src: "/logos/nestjs.svg", tint: "#E0234E" },
  microsoftsqlserver: { src: "/logos/microsoftsqlserver.svg", tint: "#CC2927" },
  postgresql: { src: "/logos/postgresql.svg", tint: "#4169E1" },
  azure: { src: "/logos/azure.svg", tint: "#0078D4" },
  git: { src: "/logos/git.svg", tint: "#F05032" },
};

/** Thin line icons (24×24, stroked) for concepts that have no brand mark. */
export const CONCEPT: Record<string, React.ReactNode> = {
  multiagent: (
    <>
      <circle cx="12" cy="5" r="2.5" />
      <circle cx="5" cy="18" r="2.5" />
      <circle cx="19" cy="18" r="2.5" />
      <path d="M10.8 7.2 6.2 15.8M13.2 7.2l4.6 8.6M7.5 18h9" />
    </>
  ),
  rag: (
    <>
      <ellipse cx="10" cy="5.5" rx="6" ry="2.5" />
      <path d="M4 5.5v9c0 1.4 2.7 2.5 6 2.5M16 5.5V10M4 10c0 1.4 2.7 2.5 6 2.5" />
      <circle cx="17" cy="16" r="3" />
      <path d="m19.2 18.2 2.3 2.3" />
    </>
  ),
  guardrails: (
    <>
      <path d="M12 3 5 6v5.5c0 4.3 3 8 7 9.5 4-1.5 7-5.2 7-9.5V6l-7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  rbac: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M3 20c0-3.3 2.7-6 6-6 1.2 0 2.3.3 3.2.9" />
      <rect x="14" y="14" width="7" height="6" rx="1.2" />
      <path d="M15.5 14v-1.5a2 2 0 0 1 4 0V14" />
    </>
  ),
  rest: (
    <>
      <path d="M8 4c-2 0-3 1-3 3v2c0 1.5-1 3-2 3 1 0 2 1.5 2 3v2c0 2 1 3 3 3M16 4c2 0 3 1 3 3v2c0 1.5 1 3 2 3-1 0-2 1.5-2 3v2c0 2-1 3-3 3" />
      <path d="M9.5 10h5l-2-2M14.5 14h-5l2 2" />
    </>
  ),
  powerbi: (
    <>
      <rect x="4" y="12" width="3.5" height="8" rx="1" />
      <rect x="10.25" y="7" width="3.5" height="13" rx="1" />
      <rect x="16.5" y="3" width="3.5" height="17" rx="1" />
    </>
  ),
  trophy: (
    <>
      <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z" />
      <path d="M7 6H4v1.5A3.5 3.5 0 0 0 7.5 11M17 6h3v1.5a3.5 3.5 0 0 1-3.5 3.5M12 14v3M8 21h8M9 21c0-2 1.3-4 3-4s3 2 3 4" />
    </>
  ),
  rank: (
    <>
      <path d="M3 20h18M5 20v-6h4v6M10 20V9h4v11M15 20v-8h4v8" />
      <path d="m12 3 .9 1.8 2 .3-1.45 1.4.35 2-1.8-.95-1.8.95.35-2L9.1 5.1l2-.3L12 3Z" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 2.9-6.5 6.5-6.5s6.5 2.9 6.5 6.5" />
      <path d="M15.5 4.7a3.5 3.5 0 0 1 0 6.6M18 13.8c2.1.9 3.5 3.2 3.5 6.2" />
    </>
  ),
  trend: (
    <>
      <path d="M3 17 9 11l4 4 8-8" />
      <path d="M15 7h6v6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 10h17M8 3v4M16 3v4M8 14h2M14 14h2M8 17h2" />
    </>
  ),
};

export const isBrand = (key: string) => key in BRAND;

/** Glow colour for a logo key (gray for concept icons). */
export const tintOf = (key: string) => BRAND[key]?.tint ?? "#a9a6a0";

type Props = { name: string; size?: number; className?: string; label?: string };

export default function TechLogo({ name, size = 24, className = "", label }: Props) {
  const brand = BRAND[name];
  if (brand) {
    return (
      <img
        src={brand.src}
        width={size}
        height={size}
        alt={label ?? ""}
        loading="lazy"
        decoding="async"
        className={className}
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={size > 60 ? 0.9 : 1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {CONCEPT[name]}
    </svg>
  );
}
