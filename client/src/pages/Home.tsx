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
    description: "Fundamentos y visión global para construir una estrategia de enlaces sólida, sostenible y orientada a resultados reales.",
    icon: TrendingUp,
    color: "#B5E853",
    count: 1,
    tags: ["Estrategia", "Autoridad", "Fundamentos", "2026"],
    featured: [
      "Estrategia de link building: guía completa para construir autoridad real en 2026",
    ],
  },
  {
    id: 2,
    slug: "tacticas-y-metodos",
    name: "Tácticas y Métodos",
    description: "Las técnicas más efectivas para conseguir backlinks: guest posts, niche edits, HARO, skyscraper, broken link building y más.",
    icon: Zap,
    color: "#B5E853",
    count: 8,
    tags: ["Guest posts", "HARO", "Skyscraper", "Outreach"],
    featured: [
      "Tácticas de link building en 2026: guía operativa por método, coste y riesgo",
      "Guest posts vs niche edits en 2026: guía comparativa",
      "HARO y fuentes para medios: backlinks de autoridad sin pagar placement",
    ],
  },
  {
    id: 3,
    slug: "riesgos-y-penalizaciones",
    name: "Riesgos y Penalizaciones",
    description: "Qué prácticas pueden penalizarte, cómo detectar una penalización manual o algorítmica y cómo recuperar tu sitio.",
    icon: AlertTriangle,
    color: "#B5E853",
    count: 5,
    tags: ["Penalización", "PBNs", "Disavow", "Recuperación"],
    featured: [
      "Riesgos y penalizaciones en link building: qué evitar y cómo recuperarse",
      "PBNs en 2026: riesgos reales y por qué no usarlas",
      "Backlinks tóxicos y disavow: cuándo actuar y cómo hacerlo",
    ],
  },
  {
    id: 4,
    slug: "auditorias-y-analisis",
    name: "Auditorías y Análisis",
    description: "Cómo auditar tu perfil de backlinks, analizar a la competencia y construir un sistema de seguimiento de enlaces.",
    icon: BarChart2,
    color: "#B5E853",
    count: 3,
    tags: ["Auditoría", "Competencia", "Análisis", "Seguimiento"],
    featured: [
      "Auditoría de backlinks y análisis de competencia: guía paso a paso para 2026",
      "Auditoría completa de backlinks: proceso paso a paso",
      "Cómo analizar los backlinks de tu competencia",
    ],
  },
  {
    id: 5,
    slug: "metricas-y-medicion",
    name: "Métricas y Medición",
    description: "DR, DA, Authority Score, link velocity y cómo medir el impacto real del link building en tu posicionamiento.",
    icon: BarChart2,
    color: "#B5E853",
    count: 4,
    tags: ["DR", "DA", "Link velocity", "Medición"],
    featured: [
      "DR vs DA vs Authority Score: cuál importa realmente",
      "Cómo medir el impacto del link building de forma realista",
      "Link velocity: cuántos enlaces conseguir y a qué ritmo",
    ],
  },
  {
    id: 6,
    slug: "herramientas",
    name: "Herramientas",
    description: "Las mejores herramientas para link building en 2026: Ahrefs, Semrush y comparativas para cada fase del proceso.",
    icon: Wrench,
    color: "#B5E853",
    count: 2,
    tags: ["Ahrefs", "Semrush", "Comparativa", "2026"],
    featured: [
      "Herramientas de link building en 2026: qué usa cada fase del proceso",
      "Ahrefs vs Semrush para link building: comparativa 2026",
    ],
  },
  {
    id: 7,
    slug: "sectores",
    name: "Sectores",
    description: "Guías específicas de link building por industria: e-commerce, SaaS, negocios locales, agencias SEO y más.",
    icon: Tag,
    color: "#B5E853",
    count: 5,
    tags: ["E-commerce", "SaaS", "Local", "Agencias"],
    featured: [
      "Link building por sector: qué funciona en e-commerce, SaaS, negocios locales y startups",
      "Link building para e-commerce: guía estratégica 2026",
      "Link building para SaaS: estrategia por fase de crecimiento",
    ],
  },
  {
    id: 8,
    slug: "reputacion-de-marca",
    name: "Reputación de marca",
    description: "Gestión de menciones, ORM, Knowledge Panel y cómo construir una brand entity que Google y los LLMs reconozcan.",
    icon: Shield,
    color: "#B5E853",
    count: 5,
    tags: ["ORM", "Brand entity", "Menciones", "Knowledge Panel"],
    featured: [
      "Reputación digital para SEO: cómo construir autoridad de marca",
      "ORM y SEO: gestiona tu reputación en buscadores",
      "Knowledge Panel de Google: cómo conseguirlo para tu marca",
    ],
  },
  {
    id: 9,
    slug: "llms-y-busqueda-generativa",
    name: "LLMs y Búsqueda Generativa",
    description: "GEO, optimización para motores de respuesta generativa y cómo los LLMs están cambiando el tráfico orgánico en 2026.",
    icon: Globe,
    color: "#B5E853",
    count: 2,
    tags: ["GEO", "LLMs", "IA", "SGE"],
    featured: [
      "GEO: optimización para motores de respuesta generativa en 2026",
      "LLMs y tráfico orgánico: qué está cambiando en 2026",
    ],
  },
  {
    id: 10,
    slug: "planificacion-y-presupuesto",
    name: "Planificación y Presupuesto",
    description: "Cómo priorizar con presupuesto limitado, negociar placements, evaluar medios y calcular cuántos backlinks necesitas.",
    icon: BookOpen,
    color: "#B5E853",
    count: 4,
    tags: ["Presupuesto", "Negociación", "Placements", "ROI"],
    featured: [
      "Link building con presupuesto limitado: cómo priorizar",
      "Cómo negociar el precio de un placement con un medio",
      "¿Cuántos backlinks necesitas para posicionar?",
    ],
  },
  {
    id: 11,
    slug: "tendencias-seo",
    name: "Tendencias SEO",
    description: "El link building en el contexto del SEO moderno: LLMs, brand mentions, E-E-A-T y GEO para 2026.",
    icon: TrendingUp,
    color: "#B5E853",
    count: 1,
    tags: ["E-E-A-T", "Brand mentions", "GEO", "2026"],
    featured: [
      "Tendencias del link building en 2026: LLMs, brand mentions, E-E-A-T y GEO",
    ],
  },
];

const COUNTRIES = [
  { name: "España", flag: "🇪🇸", slug: "backlinks-para-espana", cluster: "paises" },
  { name: "Argentina", flag: "🇦🇷", slug: "backlinks-para-argentina", cluster: "paises" },
  { name: "México", flag: "🇲🇽", slug: "backlinks-para-mexico", cluster: "paises" },
  { name: "Perú", flag: "🇵🇪", slug: "backlinks-para-peru", cluster: "paises" },
  { name: "Ecuador", flag: "🇪🇨", slug: "backlinks-para-ecuador", cluster: "paises" },
  { name: "Bolivia", flag: "🇧🇴", slug: "backlinks-para-bolivia", cluster: "paises" },
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



// ─── Navbar ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const clusterLinks = [
    { name: "Estrategia de link building", slug: "estrategia-link-building" },
    { name: "Tácticas y Métodos", slug: "tacticas-y-metodos" },
    { name: "Riesgos y Penalizaciones", slug: "riesgos-y-penalizaciones" },
    { name: "Auditorías y Análisis", slug: "auditorias-y-analisis" },
    { name: "Métricas y Medición", slug: "metricas-y-medicion" },
    { name: "Herramientas", slug: "herramientas" },
    { name: "Sectores", slug: "sectores" },
    { name: "Reputación de marca", slug: "reputacion-de-marca" },
    { name: "LLMs y Búsqueda Generativa", slug: "llms-y-busqueda-generativa" },
    { name: "Planificación y Presupuesto", slug: "planificacion-y-presupuesto" },
    { name: "Tendencias SEO", slug: "tendencias-seo" },
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
                style={{ color: "#E8E8E8" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#B5E853"; setDropOpen(true); }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#E8E8E8"; }}
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
                      key={cl.slug}
                      href={`/cluster/${cl.slug}`}
                      className="block px-4 py-2 text-xs transition-colors duration-150"
                      style={{ color: "#D8D8D8" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#B5E853"; (e.currentTarget as HTMLAnchorElement).style.background = "#1A1A1A"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.color = "#D8D8D8"; (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
                      onClick={() => setDropOpen(false)}
                    >
                      {cl.name}
                    </a>
                  ))}
                </div>
              )}
            </div>
            <a href="#paises" className="text-sm transition-colors duration-200" style={{ color: "#E8E8E8" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
              onMouseLeave={e => (e.currentTarget.style.color = "#E8E8E8")}>
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
              <a href="#clusteres" className="text-sm px-2 py-1" style={{ color: "#E8E8E8" }} onClick={() => setMenuOpen(false)}>Clústeres</a>
              <a href="#paises" className="text-sm px-2 py-1" style={{ color: "#E8E8E8" }} onClick={() => setMenuOpen(false)}>Países</a>
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

// Tipo para resultados de búsqueda de artículos
type ArticleResult = {
  slug: string;
  cluster: string;
  h1: string;
  meta_description?: string;
  read_time?: number | string;
};

function HeroSection() {
  const [query, setQuery] = useState("");
  const [articleResults, setArticleResults] = useState<ArticleResult[] | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const currentDate = getCurrentMonthYear();

  // Número real de artículos publicados
  const TOTAL_ARTICLES = ARTICLES.length;
  const TOTAL_COUNTRIES = 8;
  const TOTAL_CLUSTERS = 8;

  // Búsqueda en tiempo real sobre los 48 artículos reales
  const handleQueryChange = (value: string) => {
    setQuery(value);
    setActiveTag(null);
    if (!value.trim()) {
      setArticleResults(null);
      setShowDropdown(false);
      return;
    }
    const q = value.toLowerCase();
    const results = ARTICLES.filter(
      (a: ArticleResult) =>
        (a.h1 || "").toLowerCase().includes(q) ||
        (a.meta_description || "").toLowerCase().includes(q) ||
        (CLUSTER_LABELS[a.cluster] || "").toLowerCase().includes(q)
    ).slice(0, 8);
    setArticleResults(results);
    setShowDropdown(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) { setArticleResults(null); setShowDropdown(false); return; }
    setShowDropdown(false);
    setTimeout(() => {
      document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  // Mapa de etiqueta → slug de clúster real
  const TAG_TO_CLUSTER: Record<string, string> = {
    "Estrategia": "estrategia-link-building",
    "Tácticas": "tacticas-y-metodos",
    "Penalizaciones": "riesgos-y-penalizaciones",
    "Métricas": "metricas-y-medicion",
    "Reputación": "reputacion-de-marca",
    "Herramientas": "herramientas",
    "Sectores": "sectores",
    "LLMs & IA": "llms-y-busqueda-generativa",
    "Presupuesto": "planificacion-y-presupuesto",
  };

  const handleTagClick = (tag: string) => {
    if (activeTag === tag) {
      // Limpiar filtro
      setActiveTag(null);
      setArticleResults(null);
      setQuery("");
      setShowDropdown(false);
      return;
    }
    setActiveTag(tag);
    setQuery("");
    setShowDropdown(false);
    const clusterSlug = TAG_TO_CLUSTER[tag];
    const results = clusterSlug
      ? ARTICLES.filter((a: ArticleResult) => a.cluster === clusterSlug)
      : ARTICLES.filter((a: ArticleResult) =>
          (a.h1 || "").toLowerCase().includes(tag.toLowerCase()) ||
          (CLUSTER_LABELS[a.cluster] || "").toLowerCase().includes(tag.toLowerCase())
        );
    setArticleResults(results);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  const quickSearch = (term: string) => {
    setQuery(term);
    setActiveTag(null);
    const q = term.toLowerCase();
    const results = ARTICLES.filter(
      (a: ArticleResult) =>
        (a.h1 || "").toLowerCase().includes(q) ||
        (a.meta_description || "").toLowerCase().includes(q) ||
        (CLUSTER_LABELS[a.cluster] || "").toLowerCase().includes(q)
    ).slice(0, 8);
    setArticleResults(results);
    setShowDropdown(false);
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
          Antes de comprar linkbuilding,<br />
          <span style={{ color: "#B5E853" }}>entiende cómo funciona de verdad.</span>
        </h1>

        {/* Subtítulo */}
        <p
          className="text-base mb-8 max-w-2xl mx-auto fade-in-up fade-in-up-delay-2"
          style={{ color: "#D0D0D0", lineHeight: "1.8" }}
        >
          Guías, estrategias y análisis sobre{" "}
          <strong style={{ color: "#E8E8E8" }}>link building</strong>,{" "}
          <strong style={{ color: "#E8E8E8" }}>PR digital</strong>,{" "}
          <strong style={{ color: "#E8E8E8" }}>reputación de marca</strong> y{" "}
          <strong style={{ color: "#E8E8E8" }}>autoridad SEO</strong> para profesionales que quieren resultados reales.
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
              onChange={e => handleQueryChange(e.target.value)}
              onFocus={() => { if (articleResults && articleResults.length > 0) setShowDropdown(true); }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
              placeholder="Busca un artículo, técnica o temática..."
              className="search-input w-full pl-11 pr-4 py-3.5 rounded-lg text-sm"
              autoComplete="off"
            />
            {/* Dropdown en tiempo real */}
            {showDropdown && articleResults && articleResults.length > 0 && (
              <div
                className="absolute left-0 right-0 top-full mt-1 rounded-lg overflow-hidden z-50"
                style={{ background: "#141414", border: "1px solid #2A2A2A", boxShadow: "0 20px 50px rgba(0,0,0,0.8)" }}
              >
                {articleResults.map(a => (
                  <a
                    key={a.slug}
                    href={`/${a.cluster}/${a.slug}`}
                    className="flex items-start gap-3 px-4 py-3 transition-colors duration-150"
                    style={{ textDecoration: "none", borderBottom: "1px solid #1E1E1E" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#1A1A1A")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <BookOpen size={12} style={{ color: "#B5E853", flexShrink: 0, marginTop: 2 }} />
                    <div className="min-w-0">
                      <p className="text-xs font-medium leading-snug" style={{ color: "#D8D8D8" }}>
                        {(a.h1 || "").slice(0, 65)}{(a.h1 || "").length > 65 ? "..." : ""}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: "#C0C0C0" }}>
                        {CLUSTER_LABELS[a.cluster] || a.cluster}
                      </p>
                    </div>
                    <span className="ml-auto text-xs flex-shrink-0" style={{ color: "#B5E853" }}>→</span>
                  </a>
                ))}
                <div className="px-4 py-2 text-xs" style={{ color: "#444", background: "#111" }}>
                  {articleResults.length} resultado{articleResults.length !== 1 ? "s" : ""} · Pulsa Enter para ver todos
                </div>
              </div>
            )}
          </div>
          <button type="submit" className="btn-primary px-6 py-3.5 rounded-lg text-sm font-semibold whitespace-nowrap">
            Buscar
          </button>
        </form>

        {activeTag && (
          <div className="flex justify-center mb-10">
            <button
              onClick={() => { setActiveTag(null); setArticleResults(null); setQuery(""); }}
              className="text-xs px-3 py-1.5 rounded-full border transition-all duration-200"
              style={{ borderColor: "#333", color: "#666", background: "transparent" }}
            >
              ✕ Limpiar filtro
            </button>
          </div>
        )}

      </div>

      {/* Resultados de búsqueda — artículos reales */}
      {articleResults !== null && !showDropdown && (
        <div id="search-results" className="max-w-4xl w-full mx-auto mt-14 px-4">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold" style={{ color: "#E8E8E8" }}>
              {articleResults.length > 0
                ? activeTag
                  ? `${articleResults.length} guía${articleResults.length !== 1 ? "s" : ""} sobre ${activeTag}`
                  : `${articleResults.length} resultado${articleResults.length !== 1 ? "s" : ""} para "${query}"`
                : activeTag
                  ? `Sin guías encontradas sobre ${activeTag}`
                  : `Sin resultados para "${query}"`}
            </h2>
            <button onClick={() => { setArticleResults(null); setQuery(""); }} className="text-xs flex items-center gap-1" style={{ color: "#444" }}>
              <X size={11} /> Limpiar
            </button>
          </div>
          {articleResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {articleResults.map(a => (
                <a
                  key={a.slug}
                  href={`/${a.cluster}/${a.slug}`}
                  className="flex items-start gap-3 p-4 rounded-lg transition-all duration-150"
                  style={{ background: "#111111", border: "1px solid #1E1E1E", textDecoration: "none" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(181,232,83,0.25)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1E1E1E"; }}
                >
                  <BookOpen size={14} style={{ color: "#B5E853", flexShrink: 0, marginTop: 2 }} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium leading-snug mb-1" style={{ color: "#D8D8D8" }}>
                      {a.h1 || ""}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: "#C0C0C0" }}>{CLUSTER_LABELS[a.cluster] || a.cluster}</span>
                      {a.read_time && <span className="text-xs flex items-center gap-1" style={{ color: "#444" }}><Clock size={9} />{a.read_time}m</span>}
                    </div>
                  </div>
                  <span className="ml-auto text-xs flex-shrink-0 font-semibold" style={{ color: "#B5E853" }}>Leer →</span>
                </a>
              ))}
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
        <p className="text-xs leading-relaxed mb-3" style={{ color: "#C0C0C0" }}>
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
        {/* Botones de acción */}
        {realCount > 0 && (
          <div className="flex items-center gap-3 flex-wrap">
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
            <a
              href={`/cluster/${cluster.slug}`}
              className="flex items-center gap-1 text-xs font-semibold transition-colors duration-150"
              style={{ color: "#444", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
              onMouseLeave={e => (e.currentTarget.style.color = "#444")}
            >
              <ArrowRight size={11} />
              Ver todas
            </a>
          </div>
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
              <span className="text-xs leading-snug" style={{ color: "#C0C0C0" }}>
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

  const filterGroups = ["Todos", "Estrategia", "Análisis", "Marca", "Avanzado"];

  const filtered = useMemo(() => {
    if (filter === "Todos") return CLUSTERS;
    // Estrategia: Estrategia de LB + Tácticas + Planificación y Presupuesto
    if (filter === "Estrategia") return CLUSTERS.filter(c => [1, 2, 10].includes(c.id));
    // Análisis: Auditorías + Métricas + Herramientas + Riesgos
    if (filter === "Análisis") return CLUSTERS.filter(c => [3, 4, 5, 6].includes(c.id));
    // Marca: Reputación + Sectores
    if (filter === "Marca") return CLUSTERS.filter(c => [7, 8].includes(c.id));
    // Avanzado: LLMs + Tendencias SEO
    if (filter === "Avanzado") return CLUSTERS.filter(c => [9, 11].includes(c.id));
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
              11 clústeres temáticos
            </h2>
            <p className="mt-2 text-sm max-w-xl" style={{ color: "#C8C8C8" }}>
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
          <p className="text-sm max-w-xl mx-auto" style={{ color: "#D0D0D0", lineHeight: "1.75" }}>
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
                  <p className="text-xs leading-relaxed" style={{ color: "#C8C8C8" }}>{g.desc}</p>
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
          <p className="text-sm leading-relaxed mb-0" style={{ color: "#C8C8C8" }}>
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
            <p className="mt-2 text-sm max-w-xl" style={{ color: "#C8C8C8" }}>
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
              <div className="text-xs font-medium" style={{ color: "#D0D0D0" }}>{country.name}</div>
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
            <p className="mt-2 text-sm max-w-xl" style={{ color: "#C8C8C8" }}>
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
                <p className="text-xs leading-relaxed mb-3" style={{ color: "#C0C0C0" }}>
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
        <p className="text-sm mb-8 max-w-xl mx-auto" style={{ color: "#D0D0D0", lineHeight: "1.75" }}>
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
    { name: "Estrategia de link building", slug: "estrategia-link-building" },
    { name: "Tácticas y Métodos", slug: "tacticas-y-metodos" },
    { name: "Riesgos y Penalizaciones", slug: "riesgos-y-penalizaciones" },
    { name: "Auditorías y Análisis", slug: "auditorias-y-analisis" },
    { name: "Métricas y Medición", slug: "metricas-y-medicion" },
    { name: "Herramientas", slug: "herramientas" },
    { name: "Sectores", slug: "sectores" },
    { name: "Reputación de marca", slug: "reputacion-de-marca" },
    { name: "LLMs y Búsqueda Generativa", slug: "llms-y-busqueda-generativa" },
    { name: "Planificación y Presupuesto", slug: "planificacion-y-presupuesto" },
    { name: "Tendencias SEO", slug: "tendencias-seo" },
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
                <li key={item.slug}>
                  <a
                    href={`/cluster/${item.slug}`}
                    className="text-xs transition-colors duration-200"
                    style={{ color: "#E8E8E8" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#E8E8E8")}
                  >
                    {item.name}
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
                    style={{ color: "#E8E8E8" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#E8E8E8")}
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
          <span>© {new Date().getFullYear()} ComprarLinkbuilding — Contenido editorial independiente</span>
          <div className="flex items-center gap-4">
            <a href="/privacidad" className="transition-colors duration-200" style={{ color: "#E8E8E8" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")} onMouseLeave={e => (e.currentTarget.style.color = "#E8E8E8")}>Política de Privacidad</a>
            <a href="/aviso-legal" className="transition-colors duration-200" style={{ color: "#E8E8E8" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")} onMouseLeave={e => (e.currentTarget.style.color = "#E8E8E8")}>Aviso Legal</a>
          </div>
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
