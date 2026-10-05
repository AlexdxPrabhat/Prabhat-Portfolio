import { useEffect, useRef } from "react";
import { audioLevel } from "../../lib/audioLevel";
import { prefersReducedMotion } from "../../lib/motion";

const VERT = `
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`;

// Domain-warped fbm "liquid light". Kept dark on the left/bottom where the
// hero copy sits; brightens with the voice intro's loudness (uAudio).
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uMouse;
uniform float uAudio;
uniform float uFade;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

void main() {
  float s = min(uRes.x, uRes.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uRes) / s;
  vec2 m = (uMouse - 0.5) * uRes / s;
  float t = uTime * 0.05;

  // Gentle pull toward the pointer
  vec2 toMouse = m - p;
  p += toMouse * 0.08 * exp(-dot(toMouse, toMouse) * 2.5);

  float warp = 1.0 + uAudio * 1.1;
  vec2 q = vec2(fbm(p * 1.3 + vec2(0.0, t)), fbm(p * 1.3 + vec2(5.2, -t)));
  vec2 r = vec2(fbm(p * 1.5 + warp * q + vec2(1.7, 9.2) + t * 1.4),
                fbm(p * 1.5 + warp * q + vec2(8.3, 2.8) - t * 1.2));
  float f = fbm(p * 1.1 + warp * r);

  vec3 ink    = vec3(0.027, 0.027, 0.04);
  vec3 indigo = vec3(0.10, 0.07, 0.30);
  vec3 violet = vec3(0.55, 0.36, 0.96);
  vec3 lime   = vec3(0.77, 0.96, 0.26);

  vec3 col = mix(ink, indigo, smoothstep(0.2, 0.8, f));
  col = mix(col, violet, smoothstep(0.45, 0.95, f * f * 1.6 + r.x * 0.35));
  // Thin bright filaments where the warped layers fold over each other
  float fil = pow(1.0 - abs(f - r.y) * 2.2, 6.0);
  col += mix(violet, vec3(0.85, 0.8, 1.0), 0.4) * clamp(fil, 0.0, 1.0) * 0.35;
  col += lime * pow(smoothstep(0.5, 1.0, r.y * q.x * 1.9), 3.0) * (0.35 + uAudio * 0.5);

  // Pointer glow
  float d = length(p - m);
  col += violet * 0.25 * exp(-d * d * 4.0);

  // Light falls from the top-right; keep the copy area calm
  vec2 uv = gl_FragCoord.xy / uRes;
  float light = smoothstep(-0.15, 1.05, uv.x * 0.75 + uv.y * 0.55);
  col *= mix(0.2, 1.15, light);
  col *= 0.9 + uAudio * 0.3;

  gl_FragColor = vec4(col * uFade, 1.0);
}
`;

function compile(gl, type, src) {
  const sh = gl.createShader(type);
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(sh));
    return null;
  }
  return sh;
}

const ShaderBackground = ({ className = "" }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return undefined;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return undefined;
    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const u = (n) => gl.getUniformLocation(prog, n);
    const uRes = u("uRes");
    const uTime = u("uTime");
    const uMouse = u("uMouse");
    const uAudio = u("uAudio");
    const uFade = u("uFade");

    const reduced = prefersReducedMotion();
    const mouse = { x: 0.7, y: 0.6, tx: 0.7, ty: 0.6 };
    const startTime = performance.now();
    let visible = true;
    let running = false;
    let raf = 0;
    let level = 0;
    let fade = reduced ? 1 : 0;

    function draw(now) {
      const t = reduced ? 12 : (now - startTime) / 1000;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      level += (audioLevel.value - level) * 0.15;
      fade = Math.min(1, fade + 0.012);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t + 40);
      gl.uniform2f(uMouse, mouse.x, mouse.y);
      gl.uniform1f(uAudio, level);
      gl.uniform1f(uFade, fade);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    // The field is soft, so render below native resolution and let CSS upscale.
    const small = window.matchMedia("(max-width: 767px)").matches;
    const scale = Math.min(window.devicePixelRatio || 1, 2) * (small ? 0.4 : 0.5);
    const resize = () => {
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      // Reduced motion never loops, so repaint the still frame here.
      if (reduced) draw(startTime);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const onMove = (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.tx = (e.clientX - r.left) / r.width;
      mouse.ty = 1 - (e.clientY - r.top) / r.height;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    // Animate only while on screen and the tab is visible.
    const shouldRun = () => !reduced && visible && !document.hidden;
    function loop(now) {
      draw(now);
      if (shouldRun()) raf = requestAnimationFrame(loop);
      else running = false;
    }
    const kick = () => {
      if (running || !shouldRun()) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      kick();
    });
    io.observe(canvas);
    document.addEventListener("visibilitychange", kick);
    kick();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", kick);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`block h-full w-full ${className}`} />;
};

export default ShaderBackground;
