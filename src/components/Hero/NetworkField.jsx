import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "../../lib/motion";

/**
 * Drifting node graph (think CMDB relationships): nearby nodes link up and
 * lime "packets" travel along the links. Nodes ease away from the pointer.
 * Sits behind the portrait, so the body naturally hides what passes behind it.
 */
const NetworkField = ({ className = "" }) => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");
    const reduced = prefersReducedMotion();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let nodes = [];
    let packets = [];
    const pointer = { x: -9999, y: -9999 };

    const rand = (a, b) => a + Math.random() * (b - a);

    const seed = () => {
      const count = Math.round(Math.min(70, Math.max(30, (w * h) / 5200)));
      nodes = Array.from({ length: count }, () => ({
        x: rand(0, w),
        y: rand(0, h),
        vx: rand(-0.18, 0.18),
        vy: rand(-0.22, -0.04),
        r: rand(1.2, 2.6),
        lime: Math.random() < 0.14,
      }));
      packets = Array.from({ length: 7 }, () => ({ from: 0, to: 0, t: 1, speed: rand(0.008, 0.016) }));
    };

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = r.width;
      h = r.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
      if (reduced) draw();
    };

    const linkDist = () => Math.max(70, w * 0.2);

    const neighbour = (i) => {
      const a = nodes[i];
      const d = linkDist();
      const near = [];
      nodes.forEach((b, j) => {
        if (j !== i && Math.hypot(a.x - b.x, a.y - b.y) < d) near.push(j);
      });
      return near.length ? near[(Math.random() * near.length) | 0] : -1;
    };

    function step() {
      for (const n of nodes) {
        // ease away from the pointer
        const dx = n.x - pointer.x;
        const dy = n.y - pointer.y;
        const dd = Math.hypot(dx, dy);
        if (dd < 110 && dd > 0.1) {
          n.x += (dx / dd) * (110 - dd) * 0.02;
          n.y += (dy / dd) * (110 - dd) * 0.02;
        }
        n.x += n.vx;
        n.y += n.vy;
        if (n.y < -20) {
          n.y = h + 20;
          n.x = rand(0, w);
        }
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
      }
      for (const p of packets) {
        p.t += p.speed;
        if (p.t >= 1) {
          const from = p.t > 1.5 || !nodes[p.to] ? (Math.random() * nodes.length) | 0 : p.to;
          const to = neighbour(from);
          if (to >= 0) {
            p.from = from;
            p.to = to;
            p.t = 0;
          }
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const d = linkDist();
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < d) {
            ctx.strokeStyle = `rgba(167,139,250,${(1 - dist / d) * 0.55})`;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = n.lime ? "rgba(196,245,66,0.95)" : "rgba(226,220,255,0.9)";
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const p of packets) {
        const a = nodes[p.from];
        const b = nodes[p.to];
        if (!a || !b || p.t >= 1) continue;
        const x = a.x + (b.x - a.x) * p.t;
        const y = a.y + (b.y - a.y) * p.t;
        const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
        g.addColorStop(0, "rgba(196,245,66,0.95)");
        g.addColorStop(1, "rgba(196,245,66,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, 9, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    let raf = 0;
    let running = false;
    let visible = true;
    const shouldRun = () => !reduced && visible && !document.hidden;
    const loop = () => {
      step();
      draw();
      if (shouldRun()) raf = requestAnimationFrame(loop);
      else running = false;
    };
    const kick = () => {
      if (running || !shouldRun()) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      kick();
    });
    io.observe(canvas);
    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
    };
    const onLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", kick);
    kick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", kick);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={`block h-full w-full ${className}`} />;
};

export default NetworkField;
