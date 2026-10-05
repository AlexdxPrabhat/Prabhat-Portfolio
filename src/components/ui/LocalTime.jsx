import { useEffect, useState } from "react";
import { profile } from "../../constants";

const fmt = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: profile.timeZone,
});

/** Live clock in Bengaluru (IST). */
const LocalTime = () => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(id);
  }, []);

  return (
    <time dateTime={now.toISOString()} className="tabular-nums">
      {fmt.format(now)} IST
    </time>
  );
};

export default LocalTime;
