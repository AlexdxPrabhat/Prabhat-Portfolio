import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ScrollTrigger, startSmoothScroll, lockScroll } from "./lib/motion";
import Loader from "./components/Loader";
import Cursor from "./components/Cursor";
import ScrollProgress from "./components/ScrollProgress";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About/About";
import Experience from "./components/Experience/Experience";
import Certifications from "./components/Certifications/Certifications";
import Work from "./components/Work/Work";
import Skills from "./components/Skills/Skills";
import Education from "./components/Education/Education";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";

const App = () => {
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    startSmoothScroll();
    lockScroll(true);
    // Triggers are created while the loader is up; web fonts and late images
    // reflow the page afterwards, so re-measure once things settle.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => window.removeEventListener("load", refresh);
  }, []);

  const reveal = () => {
    setReady(true);
    lockScroll(false);
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  return (
    <>
      <a
        href="#main"
        className="fixed left-4 top-4 z-[110] -translate-y-24 rounded-full bg-lime px-4 py-2 text-sm font-semibold text-ink focus:translate-y-0"
      >
        Skip to content
      </a>
      {loading && <Loader onReveal={reveal} onDone={() => setLoading(false)} />}
      <Cursor />
      <ScrollProgress />
      <Navbar ready={ready} />

      <main id="main">
        <Hero ready={ready} />
        <Marquee />
        <About />
        <Experience />
        <Certifications />
        <Work />
        <Skills />
        <Education />
        <Contact />
      </main>
      <Footer />

      <div className="grain" aria-hidden="true" />
      <ToastContainer position="bottom-right" theme="dark" autoClose={3500} />
    </>
  );
};

export default App;
