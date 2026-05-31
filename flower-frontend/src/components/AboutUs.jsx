import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@300;400;500;600&display=swap";

const C = {
  dark:   "#0F0A1E",
  teal:   "#0D5C5C",
  tealLt: "#0A4A4A",
  cream:  "#FAF8F5",
  white:  "#FFFFFF",
  border: "#E8E2D9",
  text:   "#1A1A2E",
  muted:  "#6B7280",
  gold:   "#D4A853",
};

const FONT  = "'DM Sans', system-ui, sans-serif";
const SERIF = "'Cormorant Garamond', Georgia, serif";

const Stat = ({ value, label }) => (
  <div style={{ textAlign: "center", padding: "24px 32px" }}>
    <div style={{ fontFamily: SERIF, fontSize: "42px", fontWeight: "700", color: C.teal, lineHeight: 1 }}>{value}</div>
    <div style={{ fontFamily: FONT, fontSize: "13px", color: C.muted, marginTop: "6px", fontWeight: "500" }}>{label}</div>
  </div>
);

const TeamCard = ({ name, role, emoji }) => (
  <div style={{ background: C.white, border: `1px solid ${C.border}`, borderRadius: "16px", padding: "32px 24px", textAlign: "center", transition: "transform 0.25s, box-shadow 0.25s" }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 48px rgba(0,0,0,0.08)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
  >
    <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: `linear-gradient(135deg, ${C.teal}, ${C.dark})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontSize: "28px" }}>
      {emoji}
    </div>
    <div style={{ fontFamily: SERIF, fontSize: "18px", fontWeight: "600", color: C.dark, marginBottom: "4px" }}>{name}</div>
    <div style={{ fontFamily: FONT, fontSize: "12px", color: C.muted, fontWeight: "500", textTransform: "uppercase", letterSpacing: "1px" }}>{role}</div>
  </div>
);

const ValueCard = ({ icon, title, desc }) => (
  <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", padding: "24px", background: C.white, border: `1px solid ${C.border}`, borderRadius: "12px" }}>
    <div style={{ fontSize: "28px", lineHeight: 1, flexShrink: 0 }}>{icon}</div>
    <div>
      <div style={{ fontFamily: SERIF, fontSize: "17px", fontWeight: "600", color: C.dark, marginBottom: "6px" }}>{title}</div>
      <div style={{ fontFamily: FONT, fontSize: "13px", color: C.muted, lineHeight: "1.7" }}>{desc}</div>
    </div>
  </div>
);

const AboutUs = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Google Fonts */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href={FONT_URL} rel="stylesheet" />

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: ${FONT}; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .about-nav-link { color: rgba(255,255,255,0.8) !important; text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: 0.3px; transition: color 0.2s; }
        .about-nav-link:hover { color: #fff !important; }
        .about-nav-link.active { color: #fff !important; font-weight: 600; }
      `}</style>

      <div style={{ fontFamily: FONT, background: C.cream, color: C.text, minHeight: "100vh" }}>

        {/*NAV*/}
        <nav style={{ background: C.teal, padding: "0 6%", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/" style={{ fontFamily: SERIF, fontSize: "20px", fontWeight: "700", color: "#fff", textDecoration: "none", letterSpacing: "-0.3px" }}>
            Eternal Rose
          </Link>

          <div style={{ display: "flex", gap: "28px", alignItems: "center" }}>
            <Link to="/"               className="about-nav-link">Home</Link>
            <Link to="/user/flowers"    className="about-nav-link">Flowers</Link>
            <Link to="/user/bouquets"   className="about-nav-link">Bouquets</Link>
            <Link to="/user/occasions"  className="about-nav-link">Occasions</Link>
            <Link to="/user/reviews"    className="about-nav-link">Reviews</Link>
            <Link to="/about"           className="about-nav-link active">About</Link>
          </div>

          <Link to="/order" style={{ background: "rgba(255,255,255,0.15)", color: "#fff", padding: "8px 18px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", textDecoration: "none", border: "1px solid rgba(255,255,255,0.25)", transition: "background 0.2s" }}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
            onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          >
            🛒 Cart
          </Link>
        </nav>

        {/* HERO*/}
        <section style={{ background: `linear-gradient(135deg, ${C.dark} 0%, ${C.teal} 100%)`, padding: "80px 6%", textAlign: "center", position: "relative", overflow: "hidden" }}>
         
          <div style={{ position: "absolute", top: "-80px", right: "-80px", width: "320px", height: "320px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-60px", left: "-60px", width: "240px", height: "240px", borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

          <span style={{ display: "inline-block", background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", fontSize: "11px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", padding: "5px 16px", borderRadius: "20px", marginBottom: "20px", fontFamily: FONT }}>
            Our story
          </span>
          <h1 style={{ fontFamily: SERIF, fontSize: "clamp(36px, 5vw, 60px)", fontWeight: "700", color: "#fff", lineHeight: "1.15", marginBottom: "20px", animation: "fadeUp 0.6s ease" }}>
            Blooming with passion<br />since 2018
          </h1>
          <p style={{ fontFamily: FONT, fontSize: "16px", color: "rgba(255,255,255,0.65)", lineHeight: "1.8", maxWidth: "560px", margin: "0 auto 36px", animation: "fadeUp 0.6s ease 0.1s both" }}>
            We started Eternal Rose with a single belief: every flower has a story to tell,
            and every customer deserves arrangements that feel truly alive.
          </p>
          <Link to="/user/flowers"
            style={{ display: "inline-block", background: "#fff", color: C.teal, padding: "14px 32px", borderRadius: "8px", fontSize: "14px", fontWeight: "700", textDecoration: "none", fontFamily: FONT, transition: "transform 0.2s, box-shadow 0.2s", animation: "fadeUp 0.6s ease 0.2s both", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.2)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.15)"; }}
          >
            Shop our collection
          </Link>
        </section>

        {/*  STATS BAR  */}
        <section style={{ background: C.white, borderBottom: `1px solid ${C.border}`, borderTop: `1px solid ${C.border}` }}>
          <div style={{ maxWidth: "1000px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", borderLeft: `1px solid ${C.border}` }}>
            {[
              { value: "6+",  label: "Years of experience" },
              { value: "12k+", label: "Happy customers" },
              { value: "200+", label: "Arrangements designed" },
              { value: "98%",  label: "Satisfaction rate" },
            ].map((s, i) => (
              <div key={i} style={{ borderRight: `1px solid ${C.border}` }}>
                <Stat value={s.value} label={s.label} />
              </div>
            ))}
          </div>
        </section>

        {/* WHO WE ARE */}
        <section style={{ padding: "80px 6%", background: C.cream }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", gap: "64px", alignItems: "center", flexWrap: "wrap" }}>

            {/* Image side */}
            <div style={{ flex: "1 1 400px", position: "relative" }}>
              <img
                src="https://images.unsplash.com/photo-1487530811015-780590d4bf1c?q=80&w=800"
                alt="Eternal Rose flower shop interior"
                style={{ width: "100%", borderRadius: "16px", display: "block", boxShadow: "0 24px 64px rgba(0,0,0,0.14)" }}
                onError={e => { e.target.src = "https://images.unsplash.com/photo-1490750967868-88df5691cc51?w=800"; }}
              />
              {/* floating badge */}
              <div style={{ position: "absolute", bottom: "24px", left: "24px", background: C.white, borderRadius: "12px", padding: "14px 20px", boxShadow: "0 8px 32px rgba(0,0,0,0.16)", display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "26px" }}>🌹</span>
                <div>
                  <div style={{ fontFamily: FONT, fontSize: "11px", color: C.muted, fontWeight: "500" }}>Farm-to-door</div>
                  <div style={{ fontFamily: SERIF, fontSize: "15px", fontWeight: "700", color: C.dark }}>48-hour freshness</div>
                </div>
              </div>
            </div>

            {/* Text side */}
            <div style={{ flex: "1 1 380px" }}>
              <p style={{ fontFamily: FONT, fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", color: C.teal, marginBottom: "14px" }}>
                Who we are
              </p>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 3.5vw, 42px)", fontWeight: "700", color: C.dark, lineHeight: "1.2", marginBottom: "20px" }}>
                Crafted with care,<br />delivered with love
              </h2>
              <p style={{ fontFamily: FONT, fontSize: "15px", color: C.muted, lineHeight: "1.8", marginBottom: "16px" }}>
                Welcome to <strong style={{ color: C.dark }}>Eternal Rose</strong> — your premier destination for fresh flowers and one-of-a-kind arrangements.
                We believe every bouquet tells a story, and we're committed to making yours unforgettable.
              </p>
              <p style={{ fontFamily: FONT, fontSize: "15px", color: C.muted, lineHeight: "1.8", marginBottom: "32px" }}>
                With a rich background in floral art, our team works passionately to ensure every detail is perfect —
                turning nature's finest blooms into gifts that last a lifetime in memory.
              </p>

              <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                <Link to="/about"
                  style={{ display: "inline-block", background: C.teal, color: "#fff", padding: "13px 28px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", textDecoration: "none", fontFamily: FONT, transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.tealLt}
                  onMouseLeave={e => e.currentTarget.style.background = C.teal}
                >
                  Learn more
                </Link>
                <Link to="/user/flowers"
                  style={{ display: "inline-block", background: "transparent", color: C.text, padding: "13px 28px", borderRadius: "8px", fontSize: "14px", fontWeight: "500", textDecoration: "none", fontFamily: FONT, border: `1px solid ${C.border}`, transition: "background 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.background = C.white}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  Browse flowers
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* OUR VALUES*/}
        <section style={{ padding: "80px 6%", background: C.white }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "52px" }}>
              <p style={{ fontFamily: FONT, fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", color: C.teal, marginBottom: "12px" }}>What drives us</p>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: "700", color: C.dark }}>Our values</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
              <ValueCard icon="🌱" title="Sustainably sourced" desc="Every stem is sourced from certified sustainable farms, keeping our carbon footprint small and your flowers pristine." />
              <ValueCard icon="🎨" title="Artisan craftsmanship" desc="Our florists treat each arrangement as a work of art — no two bouquets are ever exactly alike." />
              <ValueCard icon="🚚" title="Same-day delivery" desc="Order by noon and your bouquet arrives the same day, hand-delivered with care." />
              <ValueCard icon="💬" title="Customer-first always" desc="Our 7-day freshness guarantee means if you're not delighted, we make it right. No questions asked." />
            </div>
          </div>
        </section>

        {/*TEAM*/}
        <section style={{ padding: "80px 6%", background: C.cream }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: "52px" }}>
              <p style={{ fontFamily: FONT, fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", color: C.teal, marginBottom: "12px" }}>The people behind the petals</p>
              <h2 style={{ fontFamily: SERIF, fontSize: "clamp(26px, 3.5vw, 38px)", fontWeight: "700", color: C.dark }}>Meet our team</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "20px" }}>
              <TeamCard name="Arta Krasniqi"   role="Founder & Head Florist" emoji="🌸" />
              <TeamCard name="Besnik Hoxha"    role="Operations Manager"     emoji="📦" />
              <TeamCard name="Drita Berisha"   role="Senior Floral Designer" emoji="🌺" />
              <TeamCard name="Mergim Gashi"    role="Delivery Coordinator"    emoji="🚚" />
            </div>
          </div>
        </section>

        {/*CTA BANNER*/}
        <section style={{ background: `linear-gradient(135deg, ${C.teal} 0%, ${C.dark} 100%)`, padding: "64px 6%", textAlign: "center" }}>
          <h2 style={{ fontFamily: SERIF, fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "700", color: "#fff", marginBottom: "16px", lineHeight: "1.2" }}>
            Ready to send something beautiful?
          </h2>
          <p style={{ fontFamily: FONT, fontSize: "15px", color: "rgba(255,255,255,0.65)", marginBottom: "32px", maxWidth: "480px", margin: "0 auto 32px" }}>
            Browse our collection and find the perfect arrangement for every moment.
          </p>
          <Link
            to="/user/flowers"
            style={{ display: "inline-block", background: C.gold, color: C.dark, padding: "15px 36px", borderRadius: "8px", fontSize: "14px", fontWeight: "700", textDecoration: "none", fontFamily: FONT, transition: "transform 0.2s, box-shadow 0.2s", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 28px rgba(0,0,0,0.25)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)"; }}
          >
            Shop flowers now →
          </Link>
        </section>

      </div>
    </>
  );
};

export default AboutUs;