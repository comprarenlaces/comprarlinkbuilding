/**
 * DESIGN: Terminal SEO Noir
 * - Fondo: #0D0D0D (negro profundo)
 * - Accent: #B5E853 (verde amarillento)
 * - Fuente: Open Sans
 * - Web informativa sobre link building, PR, reputación y branding
 * - Clústeres reales de comprarlinkbuilding.com
 * - Sin sección de testimonios
 */

import { useState, useMemo } from "react";
import { ARTICLES, getArticlesByCluster, CLUSTER_LABELS } from "@/lib/articles-data";
import {
  Search, ExternalLink, BookOpen, Layers, Calendar, Clock,
  ChevronRight, Menu, X, TrendingUp, Shield,
  Zap, Globe, AlertTriangle, BarChart2, Wrench, Tag,
  MapPin, ArrowRight
} from "lucide-react";
import { Logo } from "@/components/Logo";

// ─── Fecha dinámica ──────────────────────────────────────────────────────────

function getCurrentMonthYear(): string {
  const now = new Date();
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  return `${months[now.getMonth()]} ${now.getFullYear()}`;
}

// ─── Datos de clústeres ──────────────────────────────────────────────────────

const CLUSTERS = [
  {
    id: 1,
    slug: "estrategia-link-building",
    name: "Estrategia de link building",
    description: "Cómo construir una estrategia de enlaces sólida: tier 2, skyscraper, footprints, anchor text y medición de resultados.",
    icon: TrendingUp,
    color: "#B5E853",
    count: 24,
    tags: ["Tier 2", "Skyscraper", "Anchor text", "Medición"],
    featured: [
      "Tier 2 link building: estructura, usos y riesgos",
      "Skyscraper technique: cómo ejecutarla en 2026",
      "Footprints en link building: qué son y cómo detectarlos",
    ],
  },
  {
    id: 2,
    slug: "tacticas-metodos",
    name: "Tácticas y Métodos",
    description: "Las técnicas más efectivas para conseguir backlinks: guest posting, HARO, digital PR, link reclamation y más.",
    icon: Zap,
    color: "#B5E853",
    count: 18,
    tags: ["Guest posting", "HARO", "Digital PR", "Outreach"],
    featured: [
      "HARO y fuentes para medios: backlinks sin pagar placement",
      "Guest posting en 2026: qué funciona y qué no",
      "Link reclamation: recupera los enlaces que ya mereces",
    ],
  },
  {
    id: 3,
    slug: "reputacion-marca",
    name: "Reputación de marca",
    description: "Gestión de menciones, branded content, PR digital y cómo construir una presencia online que Google y los usuarios respeten.",
    icon: Shield,
    color: "#B5E853",
    count: 15,
    tags: ["Branded content", "PR digital", "Menciones", "EEAT"],
    featured: [
      "Cómo gestionar menciones negativas sobre tu marca",
      "Branded content y link building: la combinación perfecta",
      "EEAT: cómo los backlinks refuerzan tu autoridad temática",
    ],
  },
  {
    id: 4,
    slug: "auditorias-analisis",
    name: "Auditorías y análisis",
    description: "Cómo auditar tu perfil de backlinks, detectar enlaces tóxicos, analizar a la competencia y construir un sistema de seguimiento.",
    icon: BarChart2,
    color: "#B5E853",
    count: 12,
    tags: ["Auditoría", "Tóxicos", "Competencia", "Seguimiento"],
    featured: [
      "Auditoría de backlinks paso a paso: guía completa",
      "Cómo analizar el perfil de enlaces de tu competencia",
      "Disavow: cuándo y cómo desautorizar enlaces",
    ],
  },
  {
    id: 5,
    slug: "herramientas",
    name: "Herramientas",
    description: "Las mejores herramientas para link building: Ahrefs, Semrush, Majestic, Moz y alternativas gratuitas con análisis comparativo.",
    icon: Wrench,
    color: "#B5E853",
    count: 10,
    tags: ["Ahrefs", "Semrush", "Majestic", "Moz"],
    featured: [
      "Ahrefs vs Semrush para link building: comparativa 2026",
      "Herramientas gratuitas para analizar backlinks",
      "Cómo usar Majestic para auditar tu perfil de enlaces",
    ],
  },
  {
    id: 6,
    slug: "tendencias-seo",
    name: "Tendencias SEO",
    description: "El link building en el contexto del SEO moderno: IA, SGE, búsqueda sin cookies y cómo adaptarse a los cambios del algoritmo.",
    icon: Globe,
    color: "#B5E853",
    count: 9,
    tags: ["IA", "SGE", "Algoritmo", "2026"],
    featured: [
      "Link building en la era de la IA y el SGE de Google",
      "Medir el SEO sin cookies de terceros en 2026",
      "Cómo afectan las actualizaciones de Google al link building",
    ],
  },
  {
    id: 7,
    slug: "riesgos-penalizaciones",
    name: "Riesgos y Penalizaciones",
    description: "Qué prácticas pueden penalizarte, cómo detectar si tienes una penalización manual o algorítmica y cómo recuperarte.",
    icon: AlertTriangle,
    color: "#B5E853",
    count: 11,
    tags: ["Penalización", "PBNs", "Spam", "Recuperación"],
    featured: [
      "Penalizaciones de Google por links: tipos y recuperación",
      "PBNs en 2026: riesgos reales y alternativas seguras",
      "Cómo detectar si tienes una penalización manual",
    ],
  },
  {
    id: 8,
    slug: "sectores",
    name: "Sectores",
    description: "Guías específicas de link building por industria: ecommerce, salud, legal, finanzas, turismo, SaaS y más.",
    icon: Tag,
    color: "#B5E853",
    count: 16,
    tags: ["Ecommerce", "Salud", "Finanzas", "SaaS"],
    featured: [
      "Link building para ecommerce: estrategia y tácticas",
      "Backlinks para el sector salud: YMYL y EEAT",
      "Link building para SaaS: cómo construir autoridad en B2B",
    ],
  },
];

const COUNTRIES = [
  { name: "España", flag: "🇪🇸", slug: "backlinks-para-espana", cluster: "paises" },
  { name: "Argentina", flag: "🇦🇷", slug: "backlinks-para-argentina", cluster: "paises" },
  { name: "México", flag: "🇲🇽", slug: "backlinks-para-mexico", cluster: "paises" },
  { name: "Perú", flag: "🇵🇪", slug: "backlinks-para-peru", cluster: "paises" },
  { name: "Ecuador", flag: "🇪🇨", slug: "backlinks-para-ecuador", cluster: "paises" },
  { name: "Bolivia", flag: "🇧🇴", slug: "backlinks-para-bolivia", cluster: "estrategia-link-building" },
  { name: "Paraguay", flag: "🇵🇾", slug: "backlinks-para-paraguay", cluster: "paises" },
  { name: "Dinamarca", flag: "🇩🇰", slug: "backlinks-para-dinamarca", cluster: "paises" },
];

const GUIDE_TYPES = [
  {
    icon: BookOpen,
    title: "Guías fundamentales",
    desc: "Qué es el link building, cómo funciona el algoritmo de Google y por qué los backlinks siguen siendo el factor de posicionamiento más importante.",
  },
  {
    icon: TrendingUp,
    title: "Estrategia y planificación",
    desc: "Cómo diseñar una campaña de link building desde cero: objetivos, presupuesto, selección de medios y ritmo de adquisición de enlaces.",
  },
  {
    icon: Shield,
    title: "PR digital y reputación",
    desc: "La intersección entre relaciones públicas y SEO. Cómo las menciones en medios construyen autoridad, confianza y visibilidad de marca.",
  },
  {
    icon: BarChart2,
    title: "Branding y branded content",
    desc: "Cómo el contenido de marca bien distribuido genera backlinks naturales, refuerza el reconocimiento y mejora el posicionamiento a largo plazo.",
  },
];

const STATS = [
  { value: "8", label: "Clústeres temáticos" },
  { value: "+120", label: "Guías publicadas" },
  { value: "8", label: "Países cubiertos" },
  { value: getCurrentMonthYear(), label: "Última actualización" },
];

// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const clusterLinks = [
    "Estrategia de link building",
    "Tácticas y Métodos",
    "Reputación de marca",
    "Auditorías y análisis",
    "Herramientas",
    "Tendencias SEO",
    "Riesgos y Penalizaciones",
    "Sectores",
  ];

  return (
    <nav className="navbar fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" style={{ textDecoration: "none" }}>
            <Logo size="md" />
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-5">
            {/* Dropdown clústeres */}
            <div className="relative">
              <button
                className="text-sm flex items-center gap-1 transition-colors duration-200"
                style={{ color: "#888" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#B5E853"; setDropOpen(true); }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#888"; }}
                onClick={() => setDropOpen(!dropOpen)}
              >
                Clústeres <ChevronRight size={12} className="rotate-90" />
              </button>
              {dropOpen && (
                <div
                  className="absolute top-8 left-0 rounded-lg py-2 min-w-[220px] z-50"
                  style={{ background: "#141414", border: "1px solid #2A2A2A", boxShadow: "0 16px 40px rgba(0,0,0,0.6)" }}
                  onMouseEnter={() => setDropOpen(true)}
                  onMouseLeave={() => setDropOpen(false)}
                >
                  {clusterLinks.map(cl => (
                    <a
                      key={cl}
                      href="#clusteres"
                      className="block px-4 py-2 text-xs transition-colors duration-150"
                      style={{ color: "#888" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#B5E853"; (e.currentTarget as HTMLAnchorElement).style.background = "#1A1A1A"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#888"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                      onClick={() => setDropOpen(false)}
                    >
                      {cl}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <a href="#paises" className="text-sm transition-colors duration-200" style={{ color: "#888" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
              onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
              Países
            </a>
            <a
              href="https://www.getalink.com"
              rel="nofollow"
              target="_blank"
              className="btn-primary text-sm px-4 py-2 rounded font-semibold flex items-center gap-1.5"
            >
              Visitar getalink.com
              <ExternalLink size={13} />
            </a>
          </div>

          {/* Mobile */}
          <button
            className="md:hidden p-2 rounded"
            style={{ color: "#888" }}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t" style={{ borderColor: "#1E1E1E" }}>
            <div className="flex flex-col gap-3 pt-4">
              <a href="#clusteres" className="text-sm px-2 py-1" style={{ color: "#888" }} onClick={() => setMenuOpen(false)}>Clústeres</a>
              <a href="#paises" className="text-sm px-2 py-1" style={{ color: "#888" }} onClick={() => setMenuOpen(false)}>Países</a>
              <a
                href="https://www.getalink.com"
                rel="nofollow"
                target="_blank"
                className="btn-primary text-sm px-4 py-2 rounded font-semibold flex items-center gap-1.5 w-fit"
              >
                Visitar getalink.com <ExternalLink size={13} />
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function HeroSection() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof CLUSTERS | null>(null);
  const currentDate = getCurrentMonthYear();

  // Número real de artículos publicados
  const TOTAL_ARTICLES = 48;
  const TOTAL_COUNTRIES = 8;
  const TOTAL_CLUSTERS = 8;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) { setSearchResults(null); return; }
    const q = query.toLowerCase();
    const results = CLUSTERS.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q)) ||
        c.featured.some(f => f.toLowerCase().includes(q))
    );
    setSearchResults(results);
    setTimeout(() => {
      document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const quickSearch = (term: string) => {
    setQuery(term);
    const q = term.toLowerCase();
    const results = CLUSTERS.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
    );
    setSearchResults(results);
    setTimeout(() => {
      document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <section className="hero-gradient min-h-screen flex flex-col items-center justify-center px-4 pt-16 pb-16">
      {/* Nodos flotantes decorativos — efecto red de backlinks */}
      <span className="hero-node hero-node-1" />
      <span className="hero-node hero-node-2" />
      <span className="hero-node hero-node-3" />
      <span className="hero-node hero-node-4" />
      <span className="hero-node hero-node-5" />
      <span className="hero-node hero-node-6" />

      {/* SVG de líneas de conexión entre nodos */}
      <svg className="hero-connections" viewBox="0 0 100 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="12" y1="22" x2="85" y2="35" stroke="#B5E853" strokeWidth="0.15" />
        <line x1="85" y1="35" x2="70" y2="65" stroke="#B5E853" strokeWidth="0.12" />
        <line x1="70" y1="65" x2="30" y2="70" stroke="#B5E853" strokeWidth="0.1" />
        <line x1="30" y1="70" x2="8" y2="55" stroke="#B5E853" strokeWidth="0.1" />
        <line x1="8" y1="55" x2="12" y2="22" stroke="#B5E853" strokeWidth="0.08" />
        <line x1="12" y1="22" x2="30" y2="70" stroke="#B5E853" strokeWidth="0.06" />
        <line x1="85" y1="35" x2="90" y2="75" stroke="#B5E853" strokeWidth="0.08" />
        <line x1="90" y1="75" x2="55" y2="80" stroke="#B5E853" strokeWidth="0.07" />
        <line x1="55" y1="80" x2="30" y2="70" stroke="#B5E853" strokeWidth="0.07" />
        <line x1="18" y1="30" x2="90" y2="75" stroke="#B5E853" strokeWidth="0.05" />
      </svg>

      <div className="max-w-4xl w-full mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-6 fade-in-up">
          <span className="pulse-dot"></span>
          <span className="badge-accent">Actualizado: {currentDate}</span>
        </div>

        {/* Título */}
        <h1
          className="font-bold leading-tight mb-5 fade-in-up fade-in-up-delay-1"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#E8E8E8", letterSpacing: "-0.025em" }}
        >
          El link building no es solo SEO.
          <br />
          <span style={{ color: "#B5E853" }}>Es reputación digital.</span>
        </h1>

        {/* Subtítulo */}
        <p
          className="text-base mb-8 max-w-2xl mx-auto fade-in-up fade-in-up-delay-2"
          style={{ color: "#666", lineHeight: "1.8" }}
        >
          Guías, estrategias y recursos sobre{" "}
          <strong style={{ color: "#B0B0B0" }}>link building</strong>,{" "}
          <strong style={{ color: "#B0B0B0" }}>PR digital</strong>,{" "}
          <strong style={{ color: "#B0B0B0" }}>reputación de marca</strong> y{" "}
          <strong style={{ color: "#B0B0B0" }}>branding</strong> para profesionales del SEO.
        </p>

        {/* Buscador */}
        <form
          onSubmit={handleSearch}
          className="flex gap-2 max-w-2xl mx-auto mb-3 fade-in-up fade-in-up-delay-3"
        >
          <div className="relative flex-1">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#444" }} />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Busca un clúster, técnica o temática..."
              className="search-input w-full pl-11 pr-4 py-3.5 rounded-lg text-sm"
            />
          </div>
          <button type="submit" className="btn-primary px-6 py-3.5 rounded-lg text-sm font-semibold whitespace-nowrap">
            Buscar
          </button>
        </form>

        {/* Sugerencias rápidas */}
        <div className="flex flex-wrap justify-center gap-2 mb-10 fade-in-up fade-in-up-delay-3">
          {["Estrategia", "PR digital", "Reputación", "Herramientas", "Penalizaciones"].map(tag => (
            <button
              key={tag}
              onClick={() => quickSearch(tag)}
              className="text-xs px-3 py-1.5 rounded-full border transition-all duration-200"
              style={{ borderColor: "#252525", color: "#555", background: "transparent" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#B5E853";
                (e.currentTarget as HTMLButtonElement).style.color = "#B5E853";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#252525";
                (e.currentTarget as HTMLButtonElement).style.color = "#555";
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* ── Stats inline — 40px bajo el buscador ── */}
        <div
          className="fade-in-up"
          style={{
            marginTop: "40px",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1px",
            maxWidth: "640px",
            margin: "40px auto 0",
            background: "#1E1E1E",
            borderRadius: "10px",
            overflow: "hidden",
            border: "1px solid #1E1E1E",
          }}
        >
          {[
            { value: TOTAL_CLUSTERS.toString(), label: "Clústeres temáticos" },
            { value: TOTAL_ARTICLES.toString(), label: "Guías publicadas" },
            { value: TOTAL_COUNTRIES.toString(), label: "Países cubiertos" },
            { value: currentDate, label: "Última actualización" },
          ].map((s, i) => (
            <div
              key={i}
              className="text-center py-4 px-3"
              style={{ background: "#111111" }}
            >
              <div
                className="font-bold mb-0.5"
                style={{
                  color: "#B5E853",
                  fontSize: i === 3 ? "0.75rem" : "1.25rem",
                  letterSpacing: i === 3 ? "0" : "-0.02em",
                  lineHeight: 1.2,
                }}
              >
                {s.value}
              </div>
              <div className="text-xs" style={{ color: "#444" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Resultados de búsqueda */}
      {searchResults !== null && (
        <div id="search-results" className="max-w-7xl w-full mx-auto mt-14 px-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold" style={{ color: "#E8E8E8" }}>
              {searchResults.length > 0
                ? `${searchResults.length} clúster${searchResults.length !== 1 ? "es" : ""} para "${query}"`
                : `Sin resultados para "${query}"`}
            </h2>
            <button onClick={() => { setSearchResults(null); setQuery(""); }} className="text-xs flex items-center gap-1" style={{ color: "#444" }}>
              <X size={11} /> Limpiar
            </button>
          </div>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {searchResults.map(c => <ClusterCard key={c.id} cluster={c} />)}
            </div>
          ) : (
            <div className="text-center py-10" style={{ color: "#444" }}>
              <Search size={28} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm">Prueba con otro término o explora los clústeres más abajo.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

// ─── Stats ───────────────────────────────────────────────────────────────────

function StatsBar() {
  return (
    <div style={{ background: "#111111", borderTop: "1px solid #1A1A1A", borderBottom: "1px solid #1A1A1A" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold mb-0.5" style={{ color: "#B5E853" }}>{s.value}</div>
              <div className="text-xs" style={{ color: "#555" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Cluster Card ────────────────────────────────────────────────────────────

function ClusterCard({ cluster }: { cluster: typeof CLUSTERS[0] }) {
  const Icon = cluster.icon;
  const [expanded, setExpanded] = useState(false);
  const articles = getArticlesByCluster(cluster.slug);
  const realCount = articles.length;

  return (
    <div
      className="rounded-lg transition-all duration-200 flex flex-col overflow-hidden"
      style={{
        background: "#141414",
        border: "1px solid #1E1E1E",
        borderLeft: "3px solid #B5E853",
      }}
    >
      {/* Header del clúster */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(181,232,83,0.1)" }}
          >
            <Icon size={16} style={{ color: "#B5E853" }} />
          </div>
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded"
            style={{ background: "rgba(181,232,83,0.08)", color: "#B5E853", border: "1px solid rgba(181,232,83,0.15)" }}
          >
            {realCount > 0 ? realCount : cluster.count} guías
          </span>
        </div>
        <h3 className="font-bold text-sm mb-2 leading-snug" style={{ color: "#E8E8E8" }}>
          {cluster.name}
        </h3>
        <p className="text-xs leading-relaxed mb-3" style={{ color: "#555" }}>
          {cluster.description}
        </p>
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {cluster.tags.map(tag => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded"
              style={{ background: "#1A1A1A", color: "#444", border: "1px solid #242424" }}>
              {tag}
            </span>
          ))}
        </div>
        {/* Botón expandir */}
        {realCount > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 text-xs font-semibold transition-colors duration-150"
            style={{ color: expanded ? "#B5E853" : "#555", background: "none", border: "none", padding: 0, cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
            onMouseLeave={e => (e.currentTarget.style.color = expanded ? "#B5E853" : "#555")}
          >
            <ChevronRight
              size={12}
              style={{ transform: expanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
            />
            {expanded ? "Ocultar guías" : `Ver las ${realCount} guías`}
          </button>
        )}
      </div>

      {/* Lista de todos los artículos — acordeón */}
      {expanded && realCount > 0 && (
        <div
          style={{
            borderTop: "1px solid #1E1E1E",
            background: "#0F0F0F",
            maxHeight: "320px",
            overflowY: "auto",
          }}
        >
          {articles.map((a, i) => (
            <a
              key={a.slug}
              href={`/${a.cluster}/${a.slug}`}
              className="flex items-center gap-2 px-5 py-2.5 transition-colors duration-150"
              style={{
                textDecoration: "none",
                borderBottom: i < articles.length - 1 ? "1px solid #181818" : "none",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "#161616")}
              onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
            >
              <span style={{ color: "#B5E853", fontSize: "0.6rem", flexShrink: 0 }}>&#9658;</span>
              <span className="text-xs leading-snug" style={{ color: "#888" }}>
                {(a.h1 || a.meta_title).replace(/^[^\w\s\u00C0-\u024F]+\s*/, '').slice(0, 70)}
              </span>
              {a.read_time && (
                <span className="ml-auto text-xs flex-shrink-0" style={{ color: "#333" }}>
                  {a.read_time}m
                </span>
              )}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sección de Clústeres ────────────────────────────────────────────────────

function ClustersSection() {
  const [filter, setFilter] = useState("Todos");
  const currentDate = getCurrentMonthYear();

  const filterGroups = ["Todos", "Estrategia", "Técnico", "Reputación"];

  const filtered = useMemo(() => {
    if (filter === "Todos") return CLUSTERS;
    if (filter === "Estrategia") return CLUSTERS.filter(c => [1, 2, 6].includes(c.id));
    if (filter === "Técnico") return CLUSTERS.filter(c => [4, 5, 7].includes(c.id));
    if (filter === "Reputación") return CLUSTERS.filter(c => [3, 8].includes(c.id));
    return CLUSTERS;
  }, [filter]);

  return (
    <section id="clusteres" className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: "#0D0D0D" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="badge-accent mb-3 inline-block">
              <Layers size={10} className="inline mr-1" />
              Clústeres de contenido
            </span>
            <h2
              className="text-3xl font-bold"
              style={{ color: "#E8E8E8", letterSpacing: "-0.025em" }}
            >
              8 clústeres temáticos
            </h2>
            <p className="mt-2 text-sm max-w-xl" style={{ color: "#666" }}>
              Todo el conocimiento sobre link building, PR y reputación digital organizado en clústeres semánticos.
              Cada clúster agrupa guías, análisis y recursos especializados.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs flex-shrink-0" style={{ color: "#444" }}>
            <Calendar size={12} />
            <span>Actualizado: <strong style={{ color: "#B5E853" }}>{currentDate}</strong></span>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filterGroups.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="text-xs px-4 py-1.5 rounded-full border font-medium transition-all duration-200"
              style={{
                borderColor: filter === f ? "#B5E853" : "#222",
                color: filter === f ? "#0D0D0D" : "#555",
                background: filter === f ? "#B5E853" : "transparent",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map(c => <ClusterCard key={c.id} cluster={c} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Sección de Guías ────────────────────────────────────────────────────────

function GuidesSection() {
  return (
    <section id="guias" className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: "#0A0A0A" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="badge-accent mb-3 inline-block">
            <BookOpen size={10} className="inline mr-1" />
            Recursos editoriales
          </span>
          <h2 className="text-3xl font-bold mb-3" style={{ color: "#E8E8E8", letterSpacing: "-0.025em" }}>
            Qué encontrarás en esta web
          </h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "#666", lineHeight: "1.75" }}>
            Contenido editorial independiente sobre link building, PR digital, reputación y branding.
            Sin afiliados ocultos, sin contenido patrocinado. Solo conocimiento técnico aplicable.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {GUIDE_TYPES.map((g, i) => {
            const Icon = g.icon;
            return (
              <div
                key={i}
                className="p-6 rounded-lg flex gap-4"
                style={{ background: "#141414", border: "1px solid #1E1E1E" }}
              >
                <div
                  className="w-10 h-10 rounded flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(181,232,83,0.08)", border: "1px solid rgba(181,232,83,0.12)" }}
                >
                  <Icon size={18} style={{ color: "#B5E853" }} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm mb-1.5" style={{ color: "#E8E8E8" }}>{g.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "#666" }}>{g.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bloque editorial */}
        <div
          className="mt-12 p-8 rounded-xl max-w-4xl mx-auto"
          style={{
            background: "linear-gradient(135deg, #141414 0%, #111111 100%)",
            border: "1px solid #1E1E1E",
            borderLeft: "4px solid #B5E853",
          }}
        >
          <p className="text-sm leading-relaxed mb-0" style={{ color: "#888" }}>
            <strong style={{ color: "#B5E853" }}>"</strong>
            {" "}El link building no se improvisa. Se diseña, se mide y se optimiza. Cada enlace es una señal de confianza,
            y cada señal de confianza es una oportunidad de posicionamiento. Esta web existe para que tomes mejores decisiones
            sobre tu estrategia de SEO offpage.{" "}
            <strong style={{ color: "#B5E853" }}>"</strong>
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Sección de Países ───────────────────────────────────────────────────────

function CountriesSection() {
  return (
    <section id="paises" className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: "#0D0D0D" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="badge-accent mb-3 inline-block">
              <MapPin size={10} className="inline mr-1" />
              Cobertura geográfica
            </span>
            <h2 className="text-3xl font-bold" style={{ color: "#E8E8E8", letterSpacing: "-0.025em" }}>
              Link building por país
            </h2>
            <p className="mt-2 text-sm max-w-xl" style={{ color: "#666" }}>
              Guías específicas para construir autoridad en cada mercado hispanohablante y europeo,
              con medios locales y estrategias adaptadas a cada ecosistema digital.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {COUNTRIES.map(country => (
            <a
              key={country.slug}
              href={`/${country.cluster}/${country.slug}`}
              className="rounded-lg p-4 text-center cursor-pointer transition-all duration-200 block"
              style={{ background: "#141414", border: "1px solid #1E1E1E", textDecoration: "none" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2A2A2A";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 6px 20px rgba(181,232,83,0.06)";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1E1E1E";
                (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
              }}
            >
              <div className="text-2xl mb-2">{country.flag}</div>
              <div className="text-xs font-medium" style={{ color: "#888" }}>{country.name}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Sección de últimas guías ───────────────────────────────────────────────

function LatestGuidesSection() {
  const latest = ARTICLES.slice(0, 9);
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: "#0A0A0A" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="badge-accent mb-3 inline-block">
              <BookOpen size={10} className="inline mr-1" />
              Guías recientes
            </span>
            <h2 className="text-3xl font-bold" style={{ color: "#E8E8E8", letterSpacing: "-0.025em" }}>
              Últimas guías publicadas
            </h2>
            <p className="mt-2 text-sm max-w-xl" style={{ color: "#666" }}>
              Contenido editorial actualizado sobre link building, PR digital y reputación de marca.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {latest.map(article => (
            <a key={article.slug} href={`/${article.cluster}/${article.slug}`}
              className="block p-5 rounded-lg transition-all duration-200"
              style={{ background: "#141414", border: "1px solid #1E1E1E", textDecoration: "none" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2A2A2A"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 10px 30px rgba(181,232,83,0.06)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1E1E1E"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none"; }}
            >
              <span className="badge-accent mb-3 inline-block" style={{ fontSize: "0.6rem" }}>
                {CLUSTER_LABELS[article.cluster] || article.cluster}
              </span>
              <h3 className="font-semibold text-sm leading-snug mb-2" style={{ color: "#E8E8E8" }}>
                {(article.h1 || article.meta_title).replace(/^[^\w\s]+\s/, '').slice(0, 70)}
              </h3>
              {article.meta_description && (
                <p className="text-xs leading-relaxed mb-3" style={{ color: "#555" }}>
                  {article.meta_description.slice(0, 100)}…
                </p>
              )}
              <div className="flex items-center gap-3 text-xs" style={{ color: "#444" }}>
                <span className="flex items-center gap-1"><Clock size={10} />{article.read_time || 8} min</span>
                <span className="flex items-center gap-1"><Calendar size={10} />{article.date || "Feb 2026"}</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Sección "Qué es el link building" ──────────────────────────────────────

function WhatIsSection() {
  const points = [
    { title: "Autoridad de dominio", desc: "Cada enlace entrante transfiere señales de confianza que incrementan el DA/DR de tu sitio." },
    { title: "Visibilidad orgánica", desc: "Más autoridad significa mejor posicionamiento para las palabras clave que te interesan." },
    { title: "Tráfico referido", desc: "Los backlinks en medios relevantes generan visitas cualificadas con alta intención de compra." },
    { title: "Reputación digital", desc: "Ser citado por medios de referencia construye credibilidad de marca más allá del SEO." },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: "#0A0A0A" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Texto */}
          <div>
            <span className="badge-accent mb-4 inline-block">Fundamentos</span>
            <h2 className="text-3xl font-bold mb-5" style={{ color: "#E8E8E8", letterSpacing: "-0.025em" }}>
              ¿Qué es el link building<br />y por qué importa?
            </h2>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "#777" }}>
              El link building es la práctica de conseguir <strong style={{ color: "#C8C8C8" }}>enlaces SEO</strong> desde
              otros sitios web hacia el tuyo. Google los interpreta como votos de confianza: cuantos más votos de calidad
              reciba tu sitio, más autoridad gana y más fácil resulta posicionar tus páginas.
            </p>
            <p className="text-sm leading-relaxed mb-6" style={{ color: "#777" }}>
              El algoritmo de Google ha cambiado muchas veces, pero hay algo que nunca ha perdido peso:{" "}
              <strong style={{ color: "#C8C8C8" }}>los backlinks de calidad</strong>. No se trata de cantidad,
              sino de quién te enlaza, cómo y en qué contexto.
            </p>
            <a
              href="#clusteres"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors duration-200"
              style={{ color: "#B5E853" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#A8D832")}
              onMouseLeave={e => (e.currentTarget.style.color = "#B5E853")}
            >
              Explorar los clústeres <ArrowRight size={14} />
            </a>
          </div>

          {/* Grid de puntos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {points.map((p, i) => (
              <div
                key={i}
                className="p-5 rounded-lg"
                style={{ background: "#141414", border: "1px solid #1E1E1E", borderLeft: "3px solid #B5E853" }}
              >
                <h4 className="font-semibold text-sm mb-1.5" style={{ color: "#E8E8E8" }}>{p.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: "#666" }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────────────────────────────────────────────────

function CTASection() {
  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8"
      style={{
        background: "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(181,232,83,0.05) 0%, transparent 70%), #0D0D0D",
        borderTop: "1px solid #1A1A1A",
      }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <span className="badge-accent mb-4 inline-block">Plataforma recomendada</span>
        <h2
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: "#E8E8E8", letterSpacing: "-0.025em" }}
        >
          ¿Listo para construir
          <br />
          <span style={{ color: "#B5E853" }}>autoridad con estrategia?</span>
        </h2>
        <p className="text-sm mb-8 max-w-xl mx-auto" style={{ color: "#666", lineHeight: "1.75" }}>
          Si buscas ejecutar tu estrategia de link building con medios reales, tráfico verificado
          y soporte humano, <strong style={{ color: "#C8C8C8" }}>Getalink</strong> es la plataforma
          más completa del mercado hispanohablante.
        </p>
        <a
          href="https://www.getalink.com"
          rel="nofollow"
          target="_blank"
          className="btn-primary inline-flex items-center gap-2 px-10 py-4 rounded-lg text-base font-bold"
        >
          Acceder a getalink.com
          <ExternalLink size={16} />
        </a>
        <p className="mt-4 text-xs" style={{ color: "#333" }}>
          Más de 20.000 medios verificados · España, LATAM y Europa
        </p>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────

function Footer() {
  const currentDate = getCurrentMonthYear();

  const clusterLinks = [
    "Estrategia de link building",
    "Tácticas y Métodos",
    "Reputación de marca",
    "Auditorías y análisis",
    "Herramientas",
    "Tendencias SEO",
    "Riesgos y Penalizaciones",
    "Sectores",
  ];

  const countryLinks = ["España", "Argentina", "México", "Perú", "Ecuador", "Bolivia"];

  return (
    <footer style={{ background: "#080808", borderTop: "1px solid #141414" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-4">
            <a href="/" style={{ textDecoration: "none" }}>
              <Logo size="sm" />
            </a>
            <p className="text-xs leading-relaxed max-w-xs mb-4" style={{ color: "#444" }}>
              Web informativa sobre link building, PR digital, reputación de marca y branding para profesionales del SEO.
            </p>
            <div className="flex items-center gap-2 text-xs" style={{ color: "#333" }}>
              <span className="pulse-dot" style={{ width: "6px", height: "6px" }}></span>
              Actualizado: {currentDate}
            </div>
          </div>

          {/* Clústeres */}
          <div className="md:col-span-4">
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#444" }}>
              Clústeres
            </h4>
            <ul className="grid grid-cols-2 gap-y-2">
              {clusterLinks.map(item => (
                <li key={item}>
                  <a
                    href="#clusteres"
                    className="text-xs transition-colors duration-200"
                    style={{ color: "#3A3A3A" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#3A3A3A")}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Países */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#444" }}>
              Países
            </h4>
            <ul className="space-y-2">
              {countryLinks.map(item => (
                <li key={item}>
                  <a
                    href="#paises"
                    className="text-xs transition-colors duration-200"
                    style={{ color: "#3A3A3A" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#3A3A3A")}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Plataforma */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#444" }}>
              Plataforma
            </h4>
            <a
              href="https://www.getalink.com"
              rel="nofollow"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded transition-all duration-200"
              style={{ background: "rgba(181,232,83,0.08)", color: "#B5E853", border: "1px solid rgba(181,232,83,0.15)" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(181,232,83,0.15)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "rgba(181,232,83,0.08)"; }}
            >
              getalink.com <ExternalLink size={10} />
            </a>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: "1px solid #141414", color: "#2A2A2A" }}
        >
          <span>© {new Date().getFullYear()} ComprarBacklinks — Contenido editorial independiente</span>

        </div>
      </div>
    </footer>
  );
}

// ─── Página principal ────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div className="min-h-screen" style={{ background: "#0D0D0D", fontFamily: "'Open Sans', sans-serif" }}>
      <Navbar />
      <HeroSection />
      <WhatIsSection />
      <ClustersSection />
      <LatestGuidesSection />
      <GuidesSection />
      <CountriesSection />
      <CTASection />
      <Footer />
    </div>
  );
}
