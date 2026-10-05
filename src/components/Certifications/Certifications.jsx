import React from "react";
import { FaCertificate, FaExternalLinkAlt } from "react-icons/fa";
import { certifications } from "../../constants";

const Certifications = () => {
  return (
    <section
      id="certifications"
      className="py-24 pb-12 px-[12vw] md:px-[7vw] lg:px-[20vw] font-sans relative"
    >
      {/* Section Title */}
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white">CERTIFICATIONS</h2>
        <div className="w-32 h-1 bg-purple-500 mx-auto mt-4"></div>
        <p className="text-gray-400 mt-4 text-lg font-semibold">
          Industry certifications that back my ServiceNow work
        </p>
      </div>

      {/* The badge card spans both rows; the micro-certifications stack beside it */}
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className={`border border-white bg-gray-900 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center text-center shadow-[0_0_20px_1px_rgba(130,69,236,0.3)] transition-transform duration-300 hover:-translate-y-2 ${
              cert.img ? "md:row-span-2" : ""
            }`}
          >
            {cert.img ? (
              <img
                src={cert.img}
                alt={`${cert.title} badge`}
                className="w-32 h-32 sm:w-40 sm:h-40 object-contain mb-4"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-[#251f38] flex items-center justify-center mb-4">
                <FaCertificate className="text-2xl text-purple-500" />
              </div>
            )}
            <h3 className="text-lg sm:text-xl font-semibold text-white">
              {cert.title}
            </h3>
            <p className="text-gray-400 mt-2 text-sm">
              {cert.issuer} · {cert.date}
            </p>
            {cert.link && (
              <a
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-800 text-white px-5 py-2 rounded-xl text-sm font-semibold"
              >
                Verify on Credly <FaExternalLinkAlt className="text-xs" />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Certifications;
