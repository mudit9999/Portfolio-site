import { SECTION_INDEX } from "@/lib/data";

type Props = {
  section: keyof typeof SECTION_INDEX;
  label: string;
  /** heading text before the italic accent word */
  title: string;
  accent: string;
  id?: string;
  className?: string;
};

/** Mono index tag + display heading ending in one Instrument Serif italic word. */
export default function SectionHead({ section, label, title, accent, id, className = "" }: Props) {
  return (
    <div className={className}>
      <p className="tag rv">
        <b>{SECTION_INDEX[section]}</b> — {label}
      </p>
      <h2 id={id} className="h-display mt-5">
        <span className="rv-mask">
          <span>
            {title} <span className="accent">{accent}</span>
          </span>
        </span>
      </h2>
    </div>
  );
}
