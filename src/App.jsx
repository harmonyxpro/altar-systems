import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const tokens = {
  black:      "#0a0a09",
  charcoal:   "#141412",
  stoneDark:  "#1e1d1a",
  stoneMid:   "#2e2c28",
  stone:      "#3d3a34",
  warmGray:   "#6b6860",
  mist:       "#9a9690",
  parchment:  "#c8c3bc",
  cream:      "#e8e4dd",
  gold:       "#b89a6a",
  goldLight:  "#d4b98a",
  goldPale:   "#f0e8d8",
  white:      "#faf8f5",
};

// ─── GOOGLE FONTS INJECTION ───────────────────────────────────────────────────
const FontLoader = () => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);

    const style = document.createElement("style");
    style.textContent = `
      *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
      html { scroll-behavior: smooth; }
      body { background: ${tokens.black}; color: ${tokens.cream}; font-family: 'Jost', sans-serif; font-weight: 300; line-height: 1.7; overflow-x: hidden; }
      @keyframes scrollPulse { 0%,100%{opacity:.3;transform:scaleY(1)} 50%{opacity:1;transform:scaleY(1.3)} }
      @keyframes fadeUp { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
      .fade-up { opacity: 0; transform: translateY(28px); transition: opacity 0.8s cubic-bezier(.25,.46,.45,.94), transform 0.8s cubic-bezier(.25,.46,.45,.94); }
      .fade-up.visible { opacity: 1; transform: translateY(0); }
      .fade-up.d1 { transition-delay: 0.15s; }
      .fade-up.d2 { transition-delay: 0.3s; }
      .fade-up.d3 { transition-delay: 0.45s; }
      .fade-up.d4 { transition-delay: 0.6s; }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(link); document.head.removeChild(style); };
  }, []);
  return null;
};

// ─── FADE-UP HOOK ─────────────────────────────────────────────────────────────
const useFadeUp = () => {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) el.classList.add("visible"); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
};

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const SectionLabel = ({ children, center = false, delay = "" }) => {
  const ref = useFadeUp();
  return (
    <div
      ref={ref}
      className={`fade-up ${delay}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        marginBottom: "1.5rem",
        justifyContent: center ? "center" : "flex-start",
      }}
    >
      <span style={{ display: "block", width: "2rem", height: "1px", background: tokens.gold }} />
      <span style={{ fontSize: "0.68rem", letterSpacing: "0.22em", textTransform: "uppercase", color: tokens.gold, fontWeight: 400 }}>
        {children}
      </span>
    </div>
  );
};

const BtnPrimary = ({ href = "#", children, style = {} }) => (
  <a
    href={href}
    style={{
      display: "inline-block",
      fontSize: "0.78rem",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      fontWeight: 400,
      fontFamily: "'Jost', sans-serif",
      color: tokens.black,
      background: tokens.gold,
      padding: "1rem 2.2rem",
      textDecoration: "none",
      transition: "background 0.3s",
      ...style,
    }}
    onMouseEnter={e => (e.currentTarget.style.background = tokens.goldLight)}
    onMouseLeave={e => (e.currentTarget.style.background = tokens.gold)}
  >
    {children}
  </a>
);

const BtnGhost = ({ href = "#", children }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <a
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: hovered ? "0.8rem" : "0.5rem",
        fontSize: "0.78rem",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        fontWeight: 400,
        color: hovered ? tokens.goldLight : tokens.cream,
        textDecoration: "none",
        transition: "color 0.3s, gap 0.3s",
      }}
    >
      {children} →
    </a>
  );
};

// ─── NAV ──────────────────────────────────────────────────────────────────────
const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = ["Solutions", "Process", "Projects", "Company", "Support"];

  return (
    <nav
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1.5rem 4rem",
        background: scrolled
          ? "rgba(10,10,9,0.97)"
          : "linear-gradient(to bottom, rgba(10,10,9,0.95) 0%, rgba(10,10,9,0) 100%)",
        borderBottom: scrolled ? `1px solid rgba(184,154,106,0.15)` : "none",
        transition: "background 0.4s, border-bottom 0.4s",
      }}
    >
      <a href="#" style={{ textDecoration: "none" }}>
        <img src="/logo.png" alt="Altar Systems" style={{ height: "2.2rem", display: "block" }} />
      </a>

      {/* Desktop links */}
      <ul style={{ display: "flex", gap: "2.5rem", listStyle: "none", "@media(max-width:1024px)": { display: "none" } }}>
        {links.map(l => (
          <NavLink key={l} href={`#${l.toLowerCase()}`}>{l}</NavLink>
        ))}
      </ul>

      <a
        href="#contact"
        style={{
          fontSize: "0.75rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: tokens.gold,
          border: `1px solid rgba(184,154,106,0.5)`,
          padding: "0.6rem 1.4rem",
          textDecoration: "none",
          transition: "all 0.3s",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "rgba(184,154,106,0.1)"; e.currentTarget.style.borderColor = tokens.gold; }}
        onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "rgba(184,154,106,0.5)"; }}
      >
        Schedule a Consultation
      </a>
    </nav>
  );
};

const NavLink = ({ href, children }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <li>
      <a
        href={href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ fontSize: "0.78rem", letterSpacing: "0.14em", textTransform: "uppercase", color: hovered ? tokens.goldLight : tokens.mist, textDecoration: "none", transition: "color 0.3s" }}
      >
        {children}
      </a>
    </li>
  );
};

// ─── HERO ─────────────────────────────────────────────────────────────────────
const Hero = () => (
  <section style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "flex-end", padding: "0 4rem 8rem", overflow: "hidden" }}>
    {/* Background layers */}
    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at 70% 40%, rgba(40,34,20,0.6) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(184,154,106,0.08) 0%, transparent 50%), linear-gradient(160deg, #0a0a09 0%, #1a1710 40%, #0e0c09 100%)` }} />
    <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(184,154,106,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(184,154,106,0.04) 1px, transparent 1px)`, backgroundSize: "80px 80px", maskImage: "radial-gradient(ellipse at 50% 60%, black 30%, transparent 75%)" }} />
    <div style={{ position: "absolute", left: "4rem", top: 0, bottom: 0, width: 1, background: `linear-gradient(to bottom, transparent 10%, rgba(184,154,106,0.2) 30%, rgba(184,154,106,0.2) 70%, transparent 90%)` }} />

    {/* Content */}
    <div style={{ position: "relative", maxWidth: 820 }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <span style={{ display: "block", width: "2.5rem", height: 1, background: tokens.gold }} />
        <span style={{ fontSize: "0.72rem", letterSpacing: "0.22em", textTransform: "uppercase", color: tokens.gold, fontWeight: 400 }}>Church AV Integration</span>
      </div>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(3.2rem, 7vw, 6.5rem)", fontWeight: 300, lineHeight: 1.05, color: tokens.white, marginBottom: "2rem", letterSpacing: "-0.01em" }}>
        Built for<br />
        <em style={{ fontStyle: "italic", color: tokens.goldLight }}>Sacred Spaces.</em>
      </h1>
      <p style={{ maxWidth: 540, fontSize: "1.05rem", color: tokens.mist, lineHeight: 1.8, marginBottom: "3rem", fontWeight: 300 }}>
        Altar Systems designs and integrates professional audio, video, lighting, broadcast, and network systems for churches and sacred environments — built to carry the message with clarity, reliability, and excellence.
      </p>
      <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
        <BtnPrimary href="#contact">Schedule a Consultation</BtnPrimary>
        <BtnGhost href="#services">Explore Solutions</BtnGhost>
      </div>
    </div>

    {/* Scroll indicator */}
    <div style={{ position: "absolute", bottom: "3rem", right: "4rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.75rem", opacity: 0.4 }}>
      <span style={{ fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", writingMode: "vertical-rl", color: tokens.mist }}>Scroll</span>
      <span style={{ display: "block", width: 1, height: "3rem", background: tokens.mist, animation: "scrollPulse 2s ease-in-out infinite" }} />
    </div>
  </section>
);

// ─── MISSION ──────────────────────────────────────────────────────────────────
const values = [
  { title: "Excellence with Intention", body: "Every system designed to serve the room, the message, and the people in it." },
  { title: "Ministry Before Machinery", body: "Technology is a means. The moment it serves is what matters." },
  { title: "Architectural Integrity", body: "Systems that disappear into the environment they support." },
  { title: "Long-Term Partnership", body: "We're here after commissioning. Your team's confidence is our commitment." },
];

const Mission = () => {
  const h2Ref = useFadeUp();
  const valRef = useFadeUp();
  const quoteRef = useFadeUp();
  const textRef = useFadeUp();

  return (
    <section id="company" style={{ padding: "10rem 0", background: tokens.charcoal }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 4rem" }}>
        <SectionLabel>Our Philosophy</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
          <div>
            <h2 ref={h2Ref} className="fade-up d1" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem, 4vw, 3.8rem)", fontWeight: 300, lineHeight: 1.15, color: tokens.white, marginBottom: "3rem" }}>
              Technology should <em style={{ fontStyle: "italic", color: tokens.goldLight }}>carry</em> the message. Not compete with it.
            </h2>
            <div ref={valRef} className="fade-up d2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {values.map(v => (
                <div key={v.title} style={{ padding: "1.5rem", border: `1px solid rgba(184,154,106,0.12)`, borderLeft: `2px solid ${tokens.gold}` }}>
                  <h4 style={{ fontSize: "0.78rem", letterSpacing: "0.12em", textTransform: "uppercase", color: tokens.gold, marginBottom: "0.4rem", fontWeight: 400 }}>{v.title}</h4>
                  <p style={{ fontSize: "0.9rem", color: tokens.warmGray, lineHeight: 1.6 }}>{v.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div ref={quoteRef} className="fade-up d1" style={{ position: "relative", padding: "3rem", border: `1px solid rgba(184,154,106,0.15)`, background: "rgba(184,154,106,0.03)", marginBottom: "2.5rem" }}>
              <span style={{ position: "absolute", top: "-1rem", left: "2.5rem", fontFamily: "'Cormorant Garamond', serif", fontSize: "8rem", color: tokens.gold, opacity: 0.15, lineHeight: 1 }}>"</span>
              <blockquote style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.7rem", fontWeight: 300, fontStyle: "italic", color: tokens.cream, lineHeight: 1.5, position: "relative", zIndex: 1 }}>
                The best system in a worship space is the one the congregation never notices — because it simply works, clearly and faithfully, every time.
              </blockquote>
              <cite style={{ display: "block", marginTop: "1.5rem", fontFamily: "'Jost', sans-serif", fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: tokens.gold, fontStyle: "normal" }}>— Altar Systems Design Philosophy</cite>
            </div>
            <div ref={textRef} className="fade-up d2">
              {["We exist at the intersection of ministry and engineering. Every project begins with a question: what does this room, this congregation, this mission need in order to be fully heard and fully seen?",
                "The answer is never just equipment. It's an integrated environment where architecture, message, people, and technology work together — invisibly, reliably, and with intention."].map((p, i) => (
                <p key={i} style={{ fontSize: "1rem", color: tokens.warmGray, lineHeight: 1.9, marginBottom: i === 0 ? "1.5rem" : 0 }}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── SERVICES ─────────────────────────────────────────────────────────────────
const services = [
  { num: "01", title: "Worship Audio Systems", body: "Intelligibility, balance, and coverage designed around your room's acoustics — not imposed onto them.", items: ["Loudspeaker system design & integration", "Digital mixing infrastructure", "Wireless microphone systems", "Acoustic-aware coverage modeling", "Clear speech intelligibility"] },
  { num: "02", title: "Video & Display Integration", body: "Projection, LED, and display infrastructure that serves the room without dominating it.", items: ["Projection systems & screen layouts", "LED wall design & integration", "Confidence monitors", "Distributed display systems", "Signal routing infrastructure"] },
  { num: "03", title: "Livestream & Broadcast", body: "Scalable broadcast environments your volunteer team can operate with confidence every week.", items: ["Camera systems & placement", "Switching & routing workflows", "Streaming encoder integration", "Volunteer-friendly broadcast setups", "Multi-platform streaming support"] },
  { num: "04", title: "Lighting Systems", body: "Platform and architectural lighting designed to serve the moment — not to perform alongside it.", items: ["Platform lighting design", "Architectural & ambient lighting", "Fixture selection & layout", "Control system integration", "Scene programming & training"] },
  { num: "05", title: "Networking & Infrastructure", body: "Scalable AV-over-IP and structured cabling that your systems can grow with for years to come.", items: ["Structured cabling design", "AV-over-IP network architecture", "Audio, video & control networks", "Scalable infrastructure planning", "Secure and segmented topology"] },
  { num: "06", title: "Training & Support", body: "We're not done when installation is complete. Your team's confidence matters as much as your equipment.", items: ["System commissioning", "Staff & volunteer training", "Custom documentation & guides", "Ongoing maintenance plans", "Remote & on-site support"] },
];

const ServiceCard = ({ service, delay }) => {
  const [hovered, setHovered] = useState(false);
  const ref = useFadeUp();
  return (
    <div
      ref={ref}
      className={`fade-up ${delay}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? tokens.stoneDark : tokens.black, padding: "3rem", position: "relative", overflow: "hidden", transition: "background 0.4s", cursor: "default" }}
    >
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 2, background: tokens.gold, transform: hovered ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform 0.4s cubic-bezier(.25,.46,.45,.94)" }} />
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.8rem", color: "rgba(184,154,106,0.3)", letterSpacing: "0.1em", marginBottom: "2.5rem" }}>{service.num}</div>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", fontWeight: 400, color: tokens.white, marginBottom: "1rem", lineHeight: 1.2 }}>{service.title}</h3>
      <p style={{ fontSize: "0.9rem", color: tokens.warmGray, lineHeight: 1.8, marginBottom: "2rem" }}>{service.body}</p>
      <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
        {service.items.map(item => (
          <li key={item} style={{ fontSize: "0.78rem", color: tokens.stone, letterSpacing: "0.04em", paddingLeft: "1rem", position: "relative" }}>
            <span style={{ position: "absolute", left: 0, color: tokens.gold, fontSize: "0.6rem", top: "0.3em" }}>—</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

const Services = () => {
  const headerRef = useFadeUp();
  const subRef = useFadeUp();
  return (
    <section id="solutions" style={{ padding: "10rem 0", background: tokens.black }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 4rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "5rem", flexWrap: "wrap", gap: "2rem" }}>
          <div>
            <SectionLabel>Integrated Solutions</SectionLabel>
            <h2 ref={headerRef} className="fade-up d1" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 300, color: tokens.white, maxWidth: 480, lineHeight: 1.2 }}>
              Every system, purpose-built for worship.
            </h2>
          </div>
          <p ref={subRef} className="fade-up d2" style={{ maxWidth: 320, fontSize: "0.92rem", color: tokens.warmGray, lineHeight: 1.8, textAlign: "right" }}>
            Six disciplines. One integrated approach. Designed from the ground up for the unique demands of sacred environments.
          </p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1, background: "rgba(184,154,106,0.08)" }}>
          {services.map((s, i) => (
            <ServiceCard key={s.num} service={s} delay={i % 3 === 1 ? "d1" : i % 3 === 2 ? "d2" : ""} />
          ))}
        </div>
      </div>
    </section>
  );
};

// ─── FOR CHURCHES ─────────────────────────────────────────────────────────────
const audiences = [
  { role: "Pastors & Executive Leadership", title: "Systems that support your vision, not distract from it.", body: "You carry the weight of the room. Your technology should be invisible — working faithfully so the message lands clearly, every service, without incident." },
  { role: "Worship Pastors", title: "Audio designed around your room, your team, your music.", body: "Balanced coverage, accurate monitoring, and a mix environment that gives your worship team confidence rather than complications." },
  { role: "Production Directors", title: "Integrated systems built for real-world operation.", body: "Reliable infrastructure, intuitive workflows, and a broadcast environment you can run consistently — whether it's a team of one or a full crew." },
  { role: "Volunteer Teams", title: "Confidence, not complexity.", body: "Every system is designed so your volunteers feel capable and prepared. Clear documentation, intuitive controls, and training that actually transfers to Sunday morning." },
  { role: "Architects & Builders", title: "AV integrated from the first drawing, not the last week.", body: "Early design collaboration protects architectural integrity, reduces change orders, and delivers systems that belong in the space rather than being added to it." },
];

const ForChurches = () => {
  const stickyRef = useFadeUp();
  return (
    <section style={{ padding: "10rem 0", background: tokens.stoneDark }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "5fr 7fr", gap: "8rem", alignItems: "start" }}>
          <div ref={stickyRef} className="fade-up" style={{ position: "sticky", top: "8rem" }}>
            <SectionLabel>Designed for Your Team</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem, 3.5vw, 3.2rem)", fontWeight: 300, color: tokens.white, lineHeight: 1.2, marginBottom: "2rem" }}>
              We speak the language of <em style={{ fontStyle: "italic", color: tokens.goldLight }}>ministry</em> — not just machinery.
            </h2>
            <p style={{ fontSize: "1rem", color: tokens.warmGray, lineHeight: 1.9, marginBottom: "2.5rem" }}>
              Every church is unique. Every team is different. We begin every engagement by understanding who's in the room — and who needs to lead from it.
            </p>
            <BtnPrimary href="#contact">Begin a Conversation</BtnPrimary>
          </div>
          <div>
            {audiences.map((a, i) => {
              const ref = useFadeUp();
              return (
                <div key={a.role} ref={ref} className={`fade-up d${Math.min(i + 1, 4)}`} style={{ padding: "2.5rem 0", borderBottom: `1px solid rgba(184,154,106,0.1)`, borderTop: i === 0 ? `1px solid rgba(184,154,106,0.1)` : "none", display: "grid", gridTemplateColumns: "1fr 2fr", gap: "3rem", alignItems: "start" }}>
                  <span style={{ fontSize: "0.72rem", letterSpacing: "0.14em", textTransform: "uppercase", color: tokens.gold, fontWeight: 400, paddingTop: "0.25rem" }}>{a.role}</span>
                  <div>
                    <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.3rem", fontWeight: 400, color: tokens.white, marginBottom: "0.75rem", lineHeight: 1.3 }}>{a.title}</h4>
                    <p style={{ fontSize: "0.9rem", color: tokens.warmGray, lineHeight: 1.8 }}>{a.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── VOLUNTEER ────────────────────────────────────────────────────────────────
const volPoints = [
  "Systems designed with operational simplicity as a primary design constraint — not an afterthought.",
  "Custom documentation tailored to your team, your room, and your weekly service flow.",
  "Hands-on training that prepares volunteers for real Sunday scenarios, not just theory.",
  "Ongoing support so your team has someone to call when things don't go as planned.",
];
const volBars = [
  { label: "Audio — Worship Mix", w: "90%" },
  { label: "Video — Projection/LED", w: "70%" },
  { label: "Broadcast — Livestream", w: "85%" },
  { label: "Lighting — Platform", w: "95%" },
];

const Volunteer = () => {
  const leftRef = useFadeUp();
  const rightRef = useFadeUp();
  return (
    <section style={{ padding: "8rem 0", background: tokens.stoneDark }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 4rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
          <div ref={leftRef} className="fade-up">
            <SectionLabel>Volunteer-Friendly Design</SectionLabel>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 300, color: tokens.white, lineHeight: 1.2, marginBottom: "1.5rem" }}>
              Volunteers should feel <em style={{ fontStyle: "italic", color: tokens.goldLight }}>capable</em> — not overwhelmed.
            </h2>
            <p style={{ fontSize: "1rem", color: tokens.warmGray, lineHeight: 1.9, marginBottom: "2.5rem" }}>
              Complexity is not a feature. Every system we design is engineered for the real human who will operate it — often a volunteer, often under pressure, always serving faithfully.
            </p>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 0 }}>
              {volPoints.map((p, i) => (
                <li key={i} style={{ padding: "1.25rem 0", borderBottom: `1px solid rgba(184,154,106,0.08)`, display: "flex", gap: "1.5rem", alignItems: "flex-start" }}>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "0.9rem", color: tokens.gold, opacity: 0.5, minWidth: "1.5rem", paddingTop: "0.1rem" }}>0{i + 1}</span>
                  <span style={{ fontSize: "0.92rem", color: tokens.mist, lineHeight: 1.7 }}>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div ref={rightRef} className="fade-up d2" style={{ background: tokens.stoneMid, padding: "3rem", border: `1px solid rgba(184,154,106,0.1)`, position: "relative" }}>
            <span style={{ position: "absolute", top: "1.5rem", right: "1.5rem", fontSize: "0.65rem", letterSpacing: "0.14em", textTransform: "uppercase", color: tokens.gold, opacity: 0.5 }}>System Design Approach</span>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginTop: "1.5rem" }}>
              {volBars.map(b => (
                <div key={b.label}>
                  <div style={{ fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", color: tokens.warmGray, marginBottom: "0.25rem" }}>{b.label}</div>
                  <div style={{ height: "2.5rem", border: `1px solid rgba(184,154,106,0.15)`, display: "flex", alignItems: "center", padding: "0 1rem", fontSize: "0.8rem", color: tokens.mist, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: b.w, background: "rgba(184,154,106,0.08)" }} />
                    <span style={{ position: "relative", zIndex: 1 }}>{b.label.split(" — ")[0]}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: "2.5rem", paddingTop: "2rem", borderTop: `1px solid rgba(184,154,106,0.1)` }}>
              <p style={{ fontSize: "0.8rem", color: tokens.warmGray, lineHeight: 1.7, fontStyle: "italic" }}>
                "The goal is a system your volunteer runs confidently on week one — and still runs confidently on week one hundred."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── PROCESS ──────────────────────────────────────────────────────────────────
const steps = [
  { n: "01", title: "Site Evaluation", body: "We visit your space, listen to your needs, and assess your room's acoustic and architectural character before any design begins." },
  { n: "02", title: "System Design", body: "Detailed system drawings, equipment specifications, and coverage modeling tailored to your specific environment and use case." },
  { n: "03", title: "Project Planning", body: "Coordinated timelines, procurement, contractor alignment, and early design integration for new builds and renovations." },
  { n: "04", title: "Installation", body: "Professional installation with precision, care for architectural finish, and attention to the details that matter in sacred spaces." },
  { n: "05", title: "Commissioning", body: "Full system tuning, calibration, signal flow verification, and performance validation before your team ever touches a fader." },
  { n: "06", title: "Training & Support", body: "Role-based training for your staff and volunteers, custom documentation, and ongoing support for the life of the system." },
];

const ProcessStep = ({ step, delay }) => {
  const [hovered, setHovered] = useState(false);
  const ref = useFadeUp();
  return (
    <div ref={ref} className={`fade-up ${delay}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ padding: "0 1.5rem", paddingTop: "1rem", textAlign: "center", position: "relative" }}>
      <div style={{ width: "3.5rem", height: "3.5rem", borderRadius: "50%", border: `1px solid rgba(184,154,106,0.3)`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", fontFamily: "'Cormorant Garamond', serif", fontSize: "1.1rem", fontWeight: 400, color: hovered ? tokens.black : tokens.gold, background: hovered ? tokens.gold : tokens.black, borderColor: hovered ? tokens.gold : "rgba(184,154,106,0.3)", position: "relative", zIndex: 1, transition: "all 0.3s" }}>
        {step.n}
      </div>
      <h4 style={{ fontSize: "0.8rem", letterSpacing: "0.1em", textTransform: "uppercase", color: tokens.cream, fontWeight: 400, marginBottom: "0.75rem" }}>{step.title}</h4>
      <p style={{ fontSize: "0.82rem", color: tokens.warmGray, lineHeight: 1.7 }}>{step.body}</p>
    </div>
  );
};

const Process = () => {
  const headRef = useFadeUp();
  return (
    <section id="process" style={{ padding: "10rem 0", background: tokens.black }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 4rem" }}>
        <div style={{ textAlign: "center", marginBottom: "6rem" }}>
          <SectionLabel center>How We Work</SectionLabel>
          <h2 ref={headRef} className="fade-up d1" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem, 4vw, 3.8rem)", fontWeight: 300, color: tokens.white, lineHeight: 1.15, marginBottom: "1.5rem" }}>
            A process built on <em style={{ fontStyle: "italic", color: tokens.goldLight }}>clarity</em>,<br />from first call to final training.
          </h2>
          <p style={{ maxWidth: 500, margin: "0 auto", fontSize: "1rem", color: tokens.warmGray, lineHeight: 1.8 }}>
            Every project follows a deliberate sequence — designed to protect your investment, your timeline, and your team.
          </p>
        </div>
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", top: "3.5rem", left: "8%", right: "8%", height: 1, background: `linear-gradient(to right, transparent, rgba(184,154,106,0.3) 15%, rgba(184,154,106,0.3) 85%, transparent)` }} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 0, position: "relative" }}>
            {steps.map((s, i) => (
              <ProcessStep key={s.n} step={s} delay={i % 2 === 1 ? "d1" : ""} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ─── PROJECTS ─────────────────────────────────────────────────────────────────
const ProjectCard = ({ tag, title, location, bg, sm = false, delay = "" }) => {
  const [hovered, setHovered] = useState(false);
  const ref = useFadeUp();
  return (
    <div ref={ref} className={`fade-up ${delay}`} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ position: "relative", overflow: "hidden", cursor: "pointer" }}>
      <div style={{ width: "100%", aspectRatio: sm ? "4/3" : "16/10", background: bg, filter: hovered ? "grayscale(0%) brightness(0.85)" : "grayscale(30%) brightness(0.7)", transition: "filter 0.5s, transform 0.6s", transform: hovered ? "scale(1.03)" : "scale(1)", display: "flex", alignItems: "flex-end", padding: sm ? "2rem" : "2.5rem" }}>
        <div style={{ background: "linear-gradient(to top, rgba(10,10,9,0.95) 0%, rgba(10,10,9,0) 100%)", position: "absolute", inset: 0 }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <span style={{ display: "block", fontSize: "0.68rem", letterSpacing: "0.16em", textTransform: "uppercase", color: tokens.gold, marginBottom: "0.5rem" }}>{tag}</span>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: sm ? "1.15rem" : "1.5rem", fontWeight: 400, color: tokens.white, marginBottom: "0.25rem" }}>{title}</h3>
          <span style={{ fontSize: "0.82rem", color: tokens.mist }}>{location}</span>
        </div>
      </div>
    </div>
  );
};

const Projects = () => (
  <section id="projects" style={{ padding: "10rem 0", background: tokens.charcoal }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 4rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "4rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <SectionLabel>Selected Projects</SectionLabel>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 3.5vw, 3rem)", fontWeight: 300, color: tokens.white }}>
            Systems built for<br />rooms that matter.
          </h2>
        </div>
        <ViewAllLink />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "7fr 5fr", gap: "1.5rem" }}>
        <ProjectCard tag="Audio · Video · Broadcast · Lighting" title="Harvest Community Church" location="1,800-seat sanctuary renovation — Nashville, TN" bg="linear-gradient(135deg, #1a1810 0%, #2e2a22 50%, #1a1810 100%)" />
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <ProjectCard sm tag="Livestream · Broadcast" title="Cornerstone Fellowship" location="Full broadcast studio — Austin, TX" bg="linear-gradient(135deg, #201e18 0%, #302c24 100%)" delay="d1" />
          <ProjectCard sm tag="Audio · Networking · New Build" title="Covenant Church" location="New sanctuary build — Atlanta, GA" bg="linear-gradient(135deg, #181816 0%, #28261e 100%)" delay="d2" />
        </div>
      </div>
    </div>
  </section>
);

const ViewAllLink = () => {
  const [hovered, setHovered] = useState(false);
  return (
    <a href="#" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ fontSize: "0.78rem", letterSpacing: "0.14em", textTransform: "uppercase", color: tokens.gold, textDecoration: "none", display: "flex", alignItems: "center", gap: hovered ? "0.8rem" : "0.5rem", transition: "gap 0.3s" }}>
      View All Projects →
    </a>
  );
};

// ─── DIFFERENTIATORS ──────────────────────────────────────────────────────────
const diffs = [
  { n: "01", title: "Systems That Are Felt, Not Seen", body: "The measure of excellent AV in a worship environment is how little people think about it. Our design process begins with invisibility — solutions that serve the architecture rather than compete with it. Cabling is concealed. Speaker arrays are modeled to the room. Control surfaces are placed where they're needed, not where they're convenient.", accent: false },
  { n: "02", title: "Specialized in the Unique Demands of Sacred Environments", body: "Churches are not arenas, boardrooms, or event spaces. They are rooms with architectural significance, acoustic complexity, volunteer operators, and high-stakes weekly moments. We've built our entire practice around that reality — and it shows in every system we deliver.", accent: true },
  { n: "03", title: "Early Design Integration for New Builds and Renovations", body: "The most expensive AV decisions are made before a contractor ever arrives. We collaborate with your architect and builder during the design phase — protecting conduit paths, speaker positions, lighting grid heights, and room acoustics before walls are closed and details are locked.", accent: false },
  { n: "04", title: "Excellence That Honors the Room and the Message", body: "We believe that poorly designed systems dishonor the people who gather in the space. Every decision we make — from loudspeaker placement to the labeling on a stage box — reflects a commitment to excellence that goes well beyond technical specification and into genuine care for what happens in that room every week.", accent: true },
];

const Differentiators = () => (
  <section style={{ padding: "10rem 0", background: tokens.black }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 4rem" }}>
      <SectionLabel>Why Altar Systems</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(184,154,106,0.08)", marginTop: "3rem" }}>
        {diffs.map((d, i) => {
          const ref = useFadeUp();
          return (
            <div key={d.n} ref={ref} className={`fade-up ${i % 2 === 1 ? "d1" : ""}`} style={{ background: d.accent ? tokens.stoneDark : tokens.black, padding: "4rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "3.5rem", fontWeight: 300, color: "rgba(184,154,106,0.2)", lineHeight: 1 }}>{d.n}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.6rem", fontWeight: 400, color: tokens.white, lineHeight: 1.25 }}>{d.title}</h3>
              <p style={{ fontSize: "0.95rem", color: tokens.warmGray, lineHeight: 1.85 }}>{d.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

// ─── FINAL CTA ────────────────────────────────────────────────────────────────
const FinalCTA = () => {
  const ref = useFadeUp();
  return (
    <section id="contact" style={{ padding: "12rem 0", background: tokens.charcoal, textAlign: "center", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(rgba(184,154,106,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(184,154,106,0.04) 1px, transparent 1px)`, backgroundSize: "60px 60px", maskImage: "radial-gradient(ellipse at 50% 50%, black 40%, transparent 80%)" }} />
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 4rem", position: "relative" }}>
        <SectionLabel center>Start Here</SectionLabel>
        <h2 ref={ref} className="fade-up d1" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.5rem, 5vw, 5rem)", fontWeight: 300, color: tokens.white, lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.01em" }}>
          Let's build a system<br />that <em style={{ fontStyle: "italic", color: tokens.goldLight }}>serves the room.</em>
        </h2>
        <p style={{ maxWidth: 480, margin: "0 auto 3.5rem", fontSize: "1rem", color: tokens.warmGray, lineHeight: 1.8 }}>
          Whether you're planning a new sanctuary, renovating an existing space, or upgrading your broadcast ministry — the conversation begins the same way: we listen first.
        </p>
        <div style={{ display: "flex", gap: "1.5rem", justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
          <BtnPrimary href="mailto:hello@altarsystems.com">Start a Conversation</BtnPrimary>
          <BtnGhost href="#solutions">Explore Solutions</BtnGhost>
        </div>
      </div>
    </section>
  );
};

// ─── FOOTER ───────────────────────────────────────────────────────────────────
const footerLinks = {
  Solutions: ["Worship Audio", "Video & Display", "Livestream & Broadcast", "Lighting Systems", "Networking", "Training & Support"],
  Company: ["About", "Process", "Projects", "New Builds", "Renovations"],
  Contact: ["Schedule a Consultation", "hello@altarsystems.com", "Support"],
};

const Footer = () => (
  <footer style={{ background: tokens.black, borderTop: `1px solid rgba(184,154,106,0.1)`, padding: "5rem 0 3rem" }}>
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 4rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "4rem", marginBottom: "4rem" }}>
        <div>
          <a href="#" style={{ display: "block", textDecoration: "none", marginBottom: "1.5rem" }}>
            <img src="/logo.png" alt="Altar Systems" style={{ height: "1.8rem", display: "block" }} />
          </a>
          <p style={{ fontSize: "0.88rem", color: tokens.warmGray, lineHeight: 1.8, maxWidth: 280 }}>
            Professional audio, video, lighting, broadcast, and network integration for churches and sacred environments. Built with reverence. Designed with precision.
          </p>
        </div>
        {Object.entries(footerLinks).map(([col, links]) => (
          <div key={col}>
            <h5 style={{ fontSize: "0.68rem", letterSpacing: "0.18em", textTransform: "uppercase", color: tokens.gold, fontWeight: 400, marginBottom: "1.5rem" }}>{col}</h5>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {links.map(link => (
                <FooterLink key={link}>{link}</FooterLink>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "2rem", borderTop: `1px solid rgba(184,154,106,0.08)` }}>
        <p style={{ fontSize: "0.78rem", color: tokens.stone }}>© 2025 Altar Systems. All rights reserved.</p>
        <p style={{ fontSize: "0.78rem", color: tokens.stone }}>Built for sacred spaces.</p>
      </div>
    </div>
  </footer>
);

const FooterLink = ({ children }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <li>
      <a href="#" onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ fontSize: "0.88rem", color: hovered ? tokens.goldLight : tokens.warmGray, textDecoration: "none", transition: "color 0.3s" }}>
        {children}
      </a>
    </li>
  );
};

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function AltarSystems() {
  return (
    <>
      <FontLoader />
      <Nav />
      <main>
        <Hero />
        <Mission />
        <Services />
        <ForChurches />
        <Volunteer />
        <Process />
        <Projects />
        <Differentiators />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
