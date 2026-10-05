/** Four-bar equalizer that dances while audio plays. */
const Eq = ({ playing, className = "" }) => (
  <span aria-hidden="true" className={`eq flex h-3.5 items-end gap-[3px] ${playing ? "is-playing" : ""} ${className}`}>
    <span />
    <span />
    <span />
    <span />
  </span>
);

export default Eq;
