export const dynamic = "force-dynamic";

import Image from "next/image";
import { Mail, Phone, Instagram, Linkedin, ArrowRight, Download } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProjectCard from "@/components/ProjectCard";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getData() {
  const [projectsRes, bioRes, contactRes, resumeRes] = await Promise.allSettled([
    fetch(`${API}/projects`, { cache: "no-store" }),
    fetch(`${API}/bio`, { cache: "no-store" }),
    fetch(`${API}/contact`, { cache: "no-store" }),
    fetch(`${API}/resume`, { cache: "no-store" }),
  ]);

  const projects = projectsRes.status === "fulfilled" && projectsRes.value.ok
    ? await projectsRes.value.json().catch(() => [])
    : [];
  const bio = bioRes.status === "fulfilled" && bioRes.value.ok
    ? await bioRes.value.json().catch(() => null)
    : null;
  const contact = contactRes.status === "fulfilled" && contactRes.value.ok
    ? await contactRes.value.json().catch(() => null)
    : null;
  const resumeData = resumeRes.status === "fulfilled" && resumeRes.value.ok
    ? await resumeRes.value.json().catch(() => null)
    : null;
  const resumeUrl: string | null = resumeData?.file?.asset?.url ?? null;

  return { projects: Array.isArray(projects) ? projects : [], bio, contact, resumeUrl };
}

export default async function HomePage() {
  const { projects, bio, contact, resumeUrl } = await getData();

  const bioContent: string | undefined = bio?.[0]?.content || bio?.content;
  const email: string | undefined = contact?.[0]?.email || contact?.email;
  const phone: string | undefined = contact?.[0]?.phone || contact?.phone;
  const instagram: string | undefined = contact?.[0]?.instagram || contact?.instagram;
  const linkedin: string | undefined = contact?.[0]?.linkedin || contact?.linkedin;

  return (
    <div className="bg-ink min-h-screen">
      <Navbar />
      <main className="pt-14">
        {/* Hero */}
        <section className="relative bg-ink overflow-hidden">
          {/* decorative giant letter */}
          <span className="pointer-events-none select-none absolute -top-16 -left-6 text-[14rem] sm:text-[250px] font-extrabold text-white/[0.03] leading-none">
            ERUSS
          </span>

          {/* decorative dot grid */}
          <div
            className="pointer-events-none absolute top-24 right-10 w-40 h-40 opacity-20 hidden sm:block"
            style={{
              backgroundImage:
                "radial-gradient(circle, #FF751F 1.5px, transparent 1.5px)",
              backgroundSize: "18px 18px",
            }}
          />

          <div className="relative max-w-6xl mx-auto px-6 lg:px-12 pt-28 pb-20 lg:pb-28 grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: copy */}
            <div className="relative z-10">
              <p className="text-flame text-sm font-semibold uppercase tracking-[0.3em] mb-5">
                Hi there,
              </p>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.05] mb-6">
                I&apos;m <span className="text-flame">Safique</span>
              </h1>
              {bioContent && (
                <p className="text-white/60 text-lg leading-relaxed max-w-md mb-10 line-clamp-4">
                  {bioContent}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="#projects"
                  className="bg-flame text-ink px-6 py-3 rounded-full text-sm font-semibold hover:bg-flame-dark transition-colors inline-flex items-center gap-2"
                >
                  View my work <ArrowRight size={15} />
                </a>
                <a
                  href="/#contact"
                  className="border border-white/15 text-white px-6 py-3 rounded-full text-sm font-medium hover:border-flame hover:text-flame transition-colors"
                >
                  Get in touch
                </a>
              </div>
            </div>

            {/* Right: portrait */}
            <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
              {/* orange blob */}
              <div className="absolute -inset-4 sm:-inset-6 rounded-[2.5rem] bg-flame rotate-3 z-0" />
              {/* mark decoration */}
              <div className="absolute -top-12 -right-8 sm:-right-12 w-32 h-32 sm:w-44 sm:h-44 rotate-6 z-[1]">
                <Image src="/eruss-mark.png" alt="" fill className="object-contain" />
              </div>
              {/* portrait */}
              <div className="relative z-10 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl aspect-[2/3]">
                <Image
                  src="/IMG_6936.jpg"
                  alt="Portrait"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              {/* tagline badge */}
              <div className="absolute -bottom-6 -left-4 sm:-left-8 z-20 bg-ink-light border border-white/10 rounded-2xl px-5 py-4 shadow-xl">
                <p className="text-flame text-[10px] font-semibold uppercase tracking-[0.25em] mb-1">
                  Est.
                </p>
                <p className="text-white font-bold text-sm tracking-wide">
                  US &amp; THEM
                </p>
              </div>
            </div>
          </div>

          {/* contact strip */}
          {contact && (
            <div className="relative border-t border-white/10">
              <div className="max-w-6xl mx-auto px-6 lg:px-12 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {email && (
                  <a
                    href={`mailto:${email}`}
                    className="flex items-center gap-3 text-white/70 hover:text-flame transition-colors group"
                  >
                    <Mail size={18} className="text-flame" />
                    <div>
                      <p className="text-xs text-white/40 mb-0.5">Email</p>
                      <p className="text-sm font-medium">{email}</p>
                    </div>
                  </a>
                )}
                {phone && (
                  <a
                    href={`tel:${phone}`}
                    className="flex items-center gap-3 text-white/70 hover:text-flame transition-colors group"
                  >
                    <Phone size={18} className="text-flame" />
                    <div>
                      <p className="text-xs text-white/40 mb-0.5">Phone</p>
                      <p className="text-sm font-medium">{phone}</p>
                    </div>
                  </a>
                )}
                {(instagram || linkedin) && (
                  <div className="flex items-center gap-3">
                    <p className="text-xs text-white/40">Connect</p>
                    {instagram && (
                      <a
                        href={instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center rounded-full border border-white/15 text-white/70 hover:text-flame hover:border-flame transition-colors"
                      >
                        <Instagram size={16} />
                      </a>
                    )}
                    {linkedin && (
                      <a
                        href={linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 flex items-center justify-center rounded-full border border-white/15 text-white/70 hover:text-flame hover:border-flame transition-colors"
                      >
                        <Linkedin size={16} />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* vertical social rail */}
        {(instagram || linkedin || email) && (
          <div className="hidden lg:flex fixed left-6 bottom-10 z-40 flex-col items-center gap-5">
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-flame transition-colors"
              >
                <Instagram size={18} />
              </a>
            )}
            {linkedin && (
              <a
                href={linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/40 hover:text-flame transition-colors"
              >
                <Linkedin size={18} />
              </a>
            )}
            {email && (
              <a
                href={`mailto:${email}`}
                className="text-white/40 hover:text-flame transition-colors"
              >
                <Mail size={18} />
              </a>
            )}
            <span className="w-px h-16 bg-white/10" />
          </div>
        )}

        {/* Projects */}
        <section id="projects" className="max-w-5xl mx-auto px-6 pt-24 pb-24">
          <p className="text-flame text-sm font-semibold uppercase tracking-[0.3em] mb-3">
            Work
          </p>
          <h2 className="text-2xl font-semibold text-white mb-8">Projects</h2>

          {projects.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project: { _id: string; title: string; description: string; tech_stack?: string; link: string; thumbnail?: { asset?: { url?: string } } }) => (
                <ProjectCard key={project._id} project={project} />
              ))}
            </div>
          ) : (
            <p className="text-white/50 text-sm">No projects yet.</p>
          )}
        </section>

        {/* Bio */}
        {bioContent && (
          <section className="bg-ink-light border-y border-white/10">
            <div className="max-w-5xl mx-auto px-6 py-24">
              <p className="text-flame text-sm font-semibold uppercase tracking-[0.3em] mb-3">
                About me
              </p>
              <h2 className="text-2xl font-semibold text-white mb-6">The story so far</h2>
              <div className="max-w-2xl">
                <p className="text-white/60 text-base leading-relaxed whitespace-pre-wrap">
                  {bioContent}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* CV */}
        <section className="max-w-5xl mx-auto px-6 py-24 border-b border-white/10">
          <p className="text-flame text-sm font-semibold uppercase tracking-[0.3em] mb-3">
            Experience
          </p>
          <h2 className="text-2xl font-semibold text-white mb-3">Resume / CV</h2>
          <p className="text-white/60 text-sm mb-6">
            Download my resume to learn more about my experience and background.
          </p>
          {resumeUrl ? (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-white/15 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:border-flame hover:text-flame transition-colors"
            >
              <Download size={15} />
              Download CV
            </a>
          ) : null}
        </section>

        {/* Contact */}
        <section id="contact" className="max-w-5xl mx-auto px-6 py-24">
          <p className="text-flame text-sm font-semibold uppercase tracking-[0.3em] mb-3">
            Get in touch
          </p>
          <h2 className="text-2xl font-semibold text-white mb-8">Contact</h2>
          {contact ? (
            <div className="flex flex-wrap gap-4">
              {email ? (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 border border-white/10 bg-ink-light rounded-2xl px-5 py-4 hover:border-flame hover:text-flame group transition-colors"
                >
                  <Mail size={20} className="text-flame" />
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Email</p>
                    <p className="text-sm text-white font-medium group-hover:text-flame transition-colors">
                      {email}
                    </p>
                  </div>
                </a>
              ) : null}
              {phone ? (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 border border-white/10 bg-ink-light rounded-2xl px-5 py-4 hover:border-flame hover:text-flame group transition-colors"
                >
                  <Phone size={20} className="text-flame" />
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Phone</p>
                    <p className="text-sm text-white font-medium group-hover:text-flame transition-colors">
                      {phone}
                    </p>
                  </div>
                </a>
              ) : null}
              {instagram ? (
                <a
                  href={instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 border border-white/10 bg-ink-light rounded-2xl px-5 py-4 hover:border-flame hover:text-flame group transition-colors"
                >
                  <Instagram size={20} className="text-flame" />
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Instagram</p>
                    <p className="text-sm text-white font-medium group-hover:text-flame transition-colors">
                      View profile
                    </p>
                  </div>
                </a>
              ) : null}
              {linkedin ? (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 border border-white/10 bg-ink-light rounded-2xl px-5 py-4 hover:border-flame hover:text-flame group transition-colors"
                >
                  <Linkedin size={20} className="text-flame" />
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">LinkedIn</p>
                    <p className="text-sm text-white font-medium group-hover:text-flame transition-colors">
                      View profile
                    </p>
                  </div>
                </a>
              ) : null}
            </div>
          ) : (
            <p className="text-white/50 text-sm">Contact information not available.</p>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
