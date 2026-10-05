import { useRef } from "react";
import { gsap, useGSAP, isFinePointer, prefersReducedMotion } from "../../lib/motion";

/**
 * Pulls toward the pointer while hovered, then springs back.
 * Renders an <a> when `href` is given, otherwise a <button>.
 */
const MagneticButton = ({ href, strength = 0.35, className = "", children, ...rest }) => {
  const ref = useRef(null);
  const inner = useRef(null);

  const { contextSafe } = useGSAP({ scope: ref });

  const onMove = contextSafe((e) => {
    if (!isFinePointer() || prefersReducedMotion()) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    gsap.to(ref.current, { x, y, duration: 0.6, ease: "power3.out" });
    gsap.to(inner.current, { x: x * 0.35, y: y * 0.35, duration: 0.6, ease: "power3.out" });
  });

  const onLeave = contextSafe(() => {
    gsap.to([ref.current, inner.current], { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.35)" });
  });

  const Tag = href ? "a" : "button";
  const linkProps = href
    ? { href, ...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {}) }
    : { type: "button" };

  return (
    <Tag
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative inline-flex items-center justify-center will-change-transform ${className}`}
      {...linkProps}
      {...rest}
    >
      <span ref={inner} className="relative inline-flex items-center gap-2">
        {children}
      </span>
    </Tag>
  );
};

export default MagneticButton;
