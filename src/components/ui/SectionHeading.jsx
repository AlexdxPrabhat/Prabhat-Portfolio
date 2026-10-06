import { useRef } from "react";
import { useGSAP, revealText, revealUp } from "../../lib/motion";

/** "(04) Selected work" eyebrow + a large masked-reveal title. */
const SectionHeading = ({ index, label, title, aside, className = "" }) => {
  const root = useRef(null);

  useGSAP(
    () => {
      revealUp(".sh-eyebrow, .sh-aside", { trigger: root.current });
      revealText(root.current.querySelector(".sh-title"), { trigger: root.current });
    },
    { scope: root }
  );

  return (
    <header ref={root} className={`mb-10 md:mb-20 ${className}`}>
      <p className="sh-eyebrow eyebrow invisible">
        <span className="tabular-nums">({String(index).padStart(2, "0")})</span> {label}
      </p>
      <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <h2 className="sh-title display invisible max-w-5xl text-[clamp(2.75rem,8vw,7.5rem)]">{title}</h2>
        {aside && <div className="sh-aside invisible max-w-sm text-muted md:text-right">{aside}</div>}
      </div>
    </header>
  );
};

export default SectionHeading;
