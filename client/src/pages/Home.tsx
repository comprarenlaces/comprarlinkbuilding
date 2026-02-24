/**
 * DESIGN: Terminal SEO Noir
 * - Fondo: #0D0D0D (negro profundo)
 * - Accent: #B5E853 (verde amarillento)
 * - Fuente: Open Sans
 * - Tarjetas con borde izquierdo de accent
 * - Modo oscuro forzado en toda la página pública
 */

import { useState, useMemo } from "react";
import { Search, ExternalLink, BookOpen, Layers, Calendar, ChevronRight, Menu, X, Link2, TrendingUp, Shield, Zap, Globe, Star } from "lucide-react";

// ─── Datos ─────────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    id: 1,
    name: "Tecnología",
    cluster: "Tech & Software",
    count: 1240,
    da: "30–90",
    description: "Blogs especializados en software, hardware, startups y tendencias digitales.",
    tags: ["SaaS", "Startups", "Dev"],
  },
  {
    id: 2,
    name: "Marketing Digital",
    cluster: "Marketing & SEO",
    count: 980,
    da: "25–85",
    description: "Medios de marketing, SEO, publicidad online y growth hacking.",
    tags: ["SEO", "PPC", "Social"],
  },
  {
    id: 3,
    name: "Finanzas",
    cluster: "Finance & Crypto",
    count: 760,
    da: "35–88",
    description: "Portales financieros, inversión, criptomonedas y economía personal.",
    tags: ["Crypto", "Inversión", "Banca"],
  },
  {
    id: 4,
    name: "Salud & Bienestar",
    cluster: "Health & Wellness",
    count: 850,
    da: "28–82",
    description: "Blogs de salud, nutrición, fitness y medicina con alta autoridad.",
    tags: ["Fitness", "Nutrición", "Medicina"],
  },
  {
    id: 5,
    name: "Viajes",
    cluster: "Travel & Lifestyle",
    count: 620,
    da: "22–78",
    description: "Revistas de viajes, guías de destinos y blogs de lifestyle.",
    tags: ["Turismo", "Hoteles", "Aventura"],
  },
  {
    id: 6,
    name: "E-commerce",
    cluster: "Retail & Shopping",
    count: 540,
    da: "30–80",
    description: "Plataformas de reseñas, comparadores y blogs de compras online.",
    tags: ["Retail", "Reviews", "Moda"],
  },
  {
    id: 7,
    name: "Inmobiliaria",
    cluster: "Real Estate",
    count: 430,
    da: "28–75",
    description: "Portales inmobiliarios, blogs de inversión en propiedades y arquitectura.",
    tags: ["Propiedades", "Inversión", "Alquiler"],
  },
  {
    id: 8,
    name: "Educación",
    cluster: "Education & eLearning",
    count: 710,
    da: "32–88",
    description: "Plataformas educativas, blogs académicos y recursos de formación online.",
    tags: ["eLearning", "Cursos", "Academia"],
  },
  {
    id: 9,
    name: "Legal",
    cluster: "Law & Compliance",
    count: 320,
    da: "35–85",
    description: "Despachos de abogados, blogs jurídicos y portales de compliance.",
    tags: ["Derecho", "Compliance", "RGPD"],
  },
  {
    id: 10,
    name: "Gastronomía",
    cluster: "Food & Beverage",
    count: 490,
    da: "20–72",
    description: "Blogs culinarios, guías de restaurantes y revistas de gastronomía.",
    tags: ["Recetas", "Restaurantes", "Vino"],
  },
  {
    id: 11,
    name: "Deporte",
    cluster: "Sports & Fitness",
    count: 580,
    da: "25–80",
    description: "Medios deportivos, blogs de entrenamiento y noticias de fútbol y más.",
    tags: ["Fútbol", "Running", "Gym"],
  },
  {
    id: 12,
    name: "Automoción",
    cluster: "Automotive",
    count: 380,
    da: "28–78",
    description: "Revistas de coches, comparadores de vehículos y blogs de motor.",
    tags: ["Coches", "Motos", "EV"],
  },
];

const GUIDES = [
  {
    id: 1,
    title: "¿Qué son los backlinks y por qué son cruciales para el SEO?",
    description: "Guía completa sobre los enlaces entrantes, su importancia en el posicionamiento y cómo Google los evalúa.",
    readTime: "8 min",
    category: "Fundamentos",
    icon: BookOpen,
  },
  {
    id: 2,
    title: "Cómo elegir los mejores backlinks para tu nicho",
    description: "Criterios de selección: DA, DR, tráfico orgánico, relevancia temática y métricas de calidad.",
    readTime: "12 min",
    category: "Estrategia",
    icon: TrendingUp,
  },
  {
    id: 3,
    title: "Backlinks dofollow vs nofollow: diferencias y cuándo usarlos",
    description: "Análisis detallado de los atributos de enlace y su impacto real en la transferencia de autoridad.",
    readTime: "6 min",
    category: "Técnico",
    icon: Link2,
  },
  {
    id: 4,
    title: "Cómo auditar tu perfil de backlinks paso a paso",
    description: "Proceso completo para analizar, limpiar y fortalecer tu perfil de enlaces con herramientas profesionales.",
    readTime: "15 min",
    category: "Auditoría",
    icon: Shield,
  },
  {
    id: 5,
    title: "Estrategias de link building para 2025",
    description: "Las técnicas más efectivas y seguras para construir autoridad: guest posting, digital PR, HARO y más.",
    readTime: "20 min",
    category: "Estrategia",
    icon: Zap,
  },
  {
    id: 6,
    title: "Backlinks internacionales: cómo posicionarte en múltiples países",
    description: "Guía sobre link building multilingüe, hreflang y estrategias para mercados hispanohablantes.",
    readTime: "10 min",
    category: "Internacional",
    icon: Globe,
  },
];

const STATS = [
  { value: "+7.500", label: "Medios disponibles" },
  { value: "12", label: "Categorías principales" },
  { value: "48h", label: "Tiempo medio de publicación" },
  { value: "98%", label: "Tasa de satisfacción" },
];

// ─── Utilidades ─────────────────────────────────────────────────────────────

function getCurrentMonthYear(): string {
  const now = new Date();
  const months = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
  ];
  return `${months[now.getMonth()]} ${now.getFullYear()}`;
}

// ─── Componentes ────────────────────────────────────────────────────────────

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: "#B5E853" }}>
              <Link2 size={14} style={{ color: "#0D0D0D" }} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-base tracking-tight" style={{ color: "#E8E8E8" }}>
              Comprar<span style={{ color: "#B5E853" }}>Backlinks</span>
            </span>
          </div>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#categorias" className="text-sm transition-colors duration-200" style={{ color: "#888" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
              onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
              Categorías
            </a>
            <a href="#guias" className="text-sm transition-colors duration-200" style={{ color: "#888" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
              onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
              Guías
            </a>
            <a href="#como-funciona" className="text-sm transition-colors duration-200" style={{ color: "#888" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
              onMouseLeave={e => (e.currentTarget.style.color = "#888")}>
              Cómo funciona
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

          {/* Mobile menu button */}
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
              <a href="#categorias" className="text-sm px-2 py-1" style={{ color: "#888" }} onClick={() => setMenuOpen(false)}>Categorías</a>
              <a href="#guias" className="text-sm px-2 py-1" style={{ color: "#888" }} onClick={() => setMenuOpen(false)}>Guías</a>
              <a href="#como-funciona" className="text-sm px-2 py-1" style={{ color: "#888" }} onClick={() => setMenuOpen(false)}>Cómo funciona</a>
              <a
                href="https://www.getalink.com"
                rel="nofollow"
                target="_blank"
                className="btn-primary text-sm px-4 py-2 rounded font-semibold flex items-center gap-1.5 w-fit"
              >
                Visitar getalink.com
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function HeroSection() {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState<typeof CATEGORIES | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    const q = query.toLowerCase();
    const results = CATEGORIES.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.cluster.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q)) ||
        c.description.toLowerCase().includes(q)
    );
    setSearchResults(results);
    // Scroll suave a resultados
    setTimeout(() => {
      document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const currentDate = getCurrentMonthYear();

  return (
    <section className="hero-gradient min-h-screen flex flex-col items-center justify-center px-4 pt-16 pb-12">
      <div className="max-w-4xl w-full mx-auto text-center">
        {/* Badge de actualización */}
        <div className="inline-flex items-center gap-2 mb-6 fade-in-up">
          <span className="pulse-dot"></span>
          <span className="badge-accent">Actualizado: {currentDate}</span>
        </div>

        {/* Título */}
        <h1
          className="hero-title font-bold leading-tight mb-4 fade-in-up fade-in-up-delay-1"
          style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#E8E8E8", letterSpacing: "-0.02em" }}
        >
          Compra backlinks de calidad
          <br />
          <span style={{ color: "#B5E853" }}>para escalar en Google</span>
        </h1>

        {/* Subtítulo */}
        <p
          className="text-lg mb-8 max-w-2xl mx-auto fade-in-up fade-in-up-delay-2"
          style={{ color: "#888", lineHeight: "1.7" }}
        >
          Accede a más de <strong style={{ color: "#E8E8E8" }}>7.500 medios verificados</strong> en{" "}
          <strong style={{ color: "#E8E8E8" }}>12 categorías temáticas</strong>. Filtrados por DA, DR,
          tráfico orgánico y relevancia. Sin PBNs, sin spam.
        </p>

        {/* Buscador */}
        <form
          onSubmit={handleSearch}
          className="flex gap-2 max-w-2xl mx-auto mb-4 fade-in-up fade-in-up-delay-3"
        >
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: "#555" }}
            />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Busca por categoría, nicho o temática..."
              className="search-input w-full pl-11 pr-4 py-3.5 rounded-lg text-sm"
            />
          </div>
          <button
            type="submit"
            className="btn-primary px-6 py-3.5 rounded-lg text-sm font-semibold whitespace-nowrap"
          >
            Buscar
          </button>
        </form>

        {/* Sugerencias rápidas */}
        <div className="flex flex-wrap justify-center gap-2 fade-in-up fade-in-up-delay-3">
          {["Tecnología", "Marketing", "Finanzas", "Salud", "Viajes"].map(tag => (
            <button
              key={tag}
              onClick={() => {
                setQuery(tag);
                const q = tag.toLowerCase();
                const results = CATEGORIES.filter(
                  c =>
                    c.name.toLowerCase().includes(q) ||
                    c.cluster.toLowerCase().includes(q) ||
                    c.tags.some(t => t.toLowerCase().includes(q))
                );
                setSearchResults(results);
                setTimeout(() => {
                  document.getElementById("search-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 100);
              }}
              className="text-xs px-3 py-1.5 rounded-full border transition-all duration-200"
              style={{ borderColor: "#2A2A2A", color: "#666", background: "transparent" }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#B5E853";
                (e.currentTarget as HTMLButtonElement).style.color = "#B5E853";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#2A2A2A";
                (e.currentTarget as HTMLButtonElement).style.color = "#666";
              }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Resultados de búsqueda */}
      {searchResults !== null && (
        <div id="search-results" className="max-w-7xl w-full mx-auto mt-12 px-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: "#E8E8E8" }}>
              {searchResults.length > 0
                ? `${searchResults.length} resultado${searchResults.length !== 1 ? "s" : ""} para "${query}"`
                : `Sin resultados para "${query}"`}
            </h2>
            <button
              onClick={() => { setSearchResults(null); setQuery(""); }}
              className="text-xs flex items-center gap-1"
              style={{ color: "#555" }}
            >
              <X size={12} /> Limpiar
            </button>
          </div>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {searchResults.map(cat => (
                <CategoryCard key={cat.id} category={cat} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10" style={{ color: "#555" }}>
              <Search size={32} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">Prueba con otro término o explora las categorías más abajo.</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function StatsSection() {
  return (
    <section style={{ background: "#111111", borderTop: "1px solid #1E1E1E", borderBottom: "1px solid #1E1E1E" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold mb-1" style={{ color: "#B5E853" }}>{stat.value}</div>
              <div className="text-sm" style={{ color: "#666" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({ category }: { category: typeof CATEGORIES[0] }) {
  return (
    <div className="card-accent rounded-lg p-5 cursor-pointer">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-sm mb-0.5" style={{ color: "#E8E8E8" }}>{category.name}</h3>
          <span className="text-xs" style={{ color: "#555" }}>{category.cluster}</span>
        </div>
        <span className="badge-accent">{category.count.toLocaleString()}</span>
      </div>
      <p className="text-xs mb-3 leading-relaxed" style={{ color: "#666" }}>{category.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {category.tags.map(tag => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: "#1E1E1E", color: "#555", border: "1px solid #2A2A2A" }}
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs font-medium" style={{ color: "#B5E853" }}>DA {category.da}</span>
      </div>
    </div>
  );
}

function CategoriesSection() {
  const [filter, setFilter] = useState("Todos");
  const allClusters = ["Todos", ...Array.from(new Set(CATEGORIES.map(c => c.cluster.split(" & ")[0])))];

  const filtered = useMemo(() => {
    if (filter === "Todos") return CATEGORIES;
    return CATEGORIES.filter(c => c.cluster.startsWith(filter));
  }, [filter]);

  const currentDate = getCurrentMonthYear();

  return (
    <section id="categorias" className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: "#0D0D0D" }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="badge-accent mb-3 inline-block">Catálogo</span>
            <h2 className="text-3xl font-bold" style={{ color: "#E8E8E8", letterSpacing: "-0.02em" }}>
              Categorías y clústeres
            </h2>
            <p className="mt-2 text-sm" style={{ color: "#666" }}>
              Explora nuestro inventario de medios clasificados por temática y clúster semántico.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: "#555" }}>
            <Calendar size={13} />
            <span>Actualizado: <strong style={{ color: "#B5E853" }}>{currentDate}</strong></span>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-8">
          {allClusters.map(cluster => (
            <button
              key={cluster}
              onClick={() => setFilter(cluster)}
              className="text-xs px-3 py-1.5 rounded-full border transition-all duration-200 font-medium"
              style={{
                borderColor: filter === cluster ? "#B5E853" : "#2A2A2A",
                color: filter === cluster ? "#0D0D0D" : "#666",
                background: filter === cluster ? "#B5E853" : "transparent",
              }}
            >
              {cluster}
            </button>
          ))}
        </div>

        {/* Grid de categorías */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(cat => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <a
            href="https://www.getalink.com"
            rel="nofollow"
            target="_blank"
            className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-semibold"
          >
            Ver todos los medios disponibles
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Elige tu categoría",
      desc: "Selecciona el nicho temático que mejor se alinea con tu proyecto. Filtra por DA, DR, tráfico y precio.",
    },
    {
      num: "02",
      title: "Selecciona los medios",
      desc: "Añade a tu carrito los medios que desees. Puedes comprar uno o varios a la vez con descuento por volumen.",
    },
    {
      num: "03",
      title: "Envía tu contenido",
      desc: "Proporciona el artículo o déjanos redactarlo. Revisamos que cumpla los estándares editoriales del medio.",
    },
    {
      num: "04",
      title: "Publicación garantizada",
      desc: "Tu enlace se publica en un plazo de 48h. Recibes confirmación con URL y métricas actualizadas.",
    },
  ];

  return (
    <section id="como-funciona" className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: "#0A0A0A" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="badge-accent mb-3 inline-block">Proceso</span>
          <h2 className="text-3xl font-bold mb-3" style={{ color: "#E8E8E8", letterSpacing: "-0.02em" }}>
            Cómo funciona
          </h2>
          <p className="text-sm max-w-xl mx-auto" style={{ color: "#666" }}>
            Un proceso simple, transparente y orientado a resultados reales de posicionamiento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="relative p-6 rounded-lg"
              style={{ background: "#141414", border: "1px solid #1E1E1E" }}
            >
              <div
                className="text-4xl font-black mb-4 leading-none"
                style={{ color: "rgba(181, 232, 83, 0.15)", fontVariantNumeric: "tabular-nums" }}
              >
                {step.num}
              </div>
              <h3 className="font-semibold text-sm mb-2" style={{ color: "#E8E8E8" }}>{step.title}</h3>
              <p className="text-xs leading-relaxed" style={{ color: "#666" }}>{step.desc}</p>
              {i < steps.length - 1 && (
                <ChevronRight
                  size={16}
                  className="absolute -right-3 top-1/2 -translate-y-1/2 hidden lg:block"
                  style={{ color: "#2A2A2A" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GuideCard({ guide }: { guide: typeof GUIDES[0] }) {
  const Icon = guide.icon;
  return (
    <div
      className="p-5 rounded-lg transition-all duration-200 cursor-pointer group"
      style={{ background: "#141414", border: "1px solid #1E1E1E" }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#2A2A2A";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(181, 232, 83, 0.06)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "#1E1E1E";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-9 h-9 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: "rgba(181, 232, 83, 0.1)" }}
        >
          <Icon size={16} style={{ color: "#B5E853" }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span
              className="text-xs px-2 py-0.5 rounded"
              style={{ background: "#1E1E1E", color: "#555", border: "1px solid #2A2A2A" }}
            >
              {guide.category}
            </span>
            <span className="text-xs" style={{ color: "#444" }}>{guide.readTime} lectura</span>
          </div>
          <h3 className="font-semibold text-sm mb-1.5 leading-snug" style={{ color: "#E8E8E8" }}>
            {guide.title}
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: "#666" }}>{guide.description}</p>
          <div
            className="mt-3 flex items-center gap-1 text-xs font-medium transition-colors duration-200"
            style={{ color: "#B5E853" }}
          >
            Leer guía <ChevronRight size={12} />
          </div>
        </div>
      </div>
    </div>
  );
}

function GuidesSection() {
  const currentDate = getCurrentMonthYear();

  return (
    <section id="guias" className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: "#0D0D0D" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="badge-accent mb-3 inline-block">Recursos</span>
            <h2 className="text-3xl font-bold" style={{ color: "#E8E8E8", letterSpacing: "-0.02em" }}>
              Guías de link building
            </h2>
            <p className="mt-2 text-sm" style={{ color: "#666" }}>
              Aprende a construir una estrategia de backlinks sólida con nuestros recursos editoriales.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs" style={{ color: "#555" }}>
            <span className="pulse-dot"></span>
            <span>Actualizado: <strong style={{ color: "#B5E853" }}>{currentDate}</strong></span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GUIDES.map(guide => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <a
            href="https://www.getalink.com"
            rel="nofollow"
            target="_blank"
            className="btn-outline inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-semibold"
          >
            Ver todas las guías
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    {
      text: "Pasé de la página 3 a la primera posición en 4 meses. La calidad de los medios es notablemente superior a otras plataformas que había probado.",
      author: "Carlos M.",
      role: "SEO Manager, Agencia Digital",
      stars: 5,
    },
    {
      text: "El filtrado por DA y relevancia temática me ahorra horas de prospección. Los resultados hablan por sí solos en las métricas de autoridad de dominio.",
      author: "Laura P.",
      role: "Consultora SEO Freelance",
      stars: 5,
    },
    {
      text: "Usamos la plataforma para 12 clientes simultáneamente. El proceso es ágil, los plazos se cumplen y el soporte resuelve cualquier incidencia rápido.",
      author: "Andrés T.",
      role: "Director de SEO, Startup SaaS",
      stars: 5,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8" style={{ background: "#0A0A0A" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="badge-accent mb-3 inline-block">Testimonios</span>
          <h2 className="text-3xl font-bold" style={{ color: "#E8E8E8", letterSpacing: "-0.02em" }}>
            Lo que dicen nuestros clientes
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="p-6 rounded-lg"
              style={{ background: "#141414", border: "1px solid #1E1E1E" }}
            >
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <Star key={j} size={13} fill="#B5E853" style={{ color: "#B5E853" }} />
                ))}
              </div>
              <p className="text-sm leading-relaxed mb-5" style={{ color: "#888" }}>"{t.text}"</p>
              <div>
                <div className="text-sm font-semibold" style={{ color: "#E8E8E8" }}>{t.author}</div>
                <div className="text-xs" style={{ color: "#555" }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section
      className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      style={{
        background: "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(181, 232, 83, 0.06) 0%, transparent 70%), #0D0D0D",
        borderTop: "1px solid #1E1E1E",
      }}
    >
      <div className="max-w-3xl mx-auto text-center">
        <span className="badge-accent mb-4 inline-block">Empieza hoy</span>
        <h2
          className="text-3xl md:text-4xl font-bold mb-4"
          style={{ color: "#E8E8E8", letterSpacing: "-0.02em" }}
        >
          Escala tu autoridad de dominio
          <br />
          <span style={{ color: "#B5E853" }}>con backlinks que funcionan</span>
        </h2>
        <p className="text-sm mb-8 max-w-xl mx-auto" style={{ color: "#666", lineHeight: "1.7" }}>
          Más de 7.500 medios verificados. Sin PBNs, sin spam, sin riesgos. Solo enlaces editoriales
          en medios reales con tráfico orgánico comprobado.
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
      </div>
    </section>
  );
}

function Footer() {
  const currentDate = getCurrentMonthYear();

  return (
    <footer style={{ background: "#080808", borderTop: "1px solid #1A1A1A" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "#B5E853" }}>
                <Link2 size={12} style={{ color: "#0D0D0D" }} strokeWidth={2.5} />
              </div>
              <span className="font-bold text-sm" style={{ color: "#E8E8E8" }}>
                Comprar<span style={{ color: "#B5E853" }}>Backlinks</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs" style={{ color: "#555" }}>
              Directorio de medios verificados para estrategias de link building profesional.
              Potenciado por{" "}
              <a href="https://www.getalink.com" rel="nofollow" target="_blank" style={{ color: "#B5E853" }}>
                getalink.com
              </a>
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: "#444" }}>
              <span className="pulse-dot" style={{ width: "6px", height: "6px" }}></span>
              Última actualización: {currentDate}
            </div>
          </div>

          {/* Categorías */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#555" }}>
              Categorías
            </h4>
            <ul className="space-y-2">
              {["Tecnología", "Marketing", "Finanzas", "Salud", "Viajes", "E-commerce"].map(item => (
                <li key={item}>
                  <a
                    href="#categorias"
                    className="text-xs transition-colors duration-200"
                    style={{ color: "#444" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#444")}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Recursos */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: "#555" }}>
              Recursos
            </h4>
            <ul className="space-y-2">
              {["Guías SEO", "Cómo funciona", "Casos de éxito", "Blog"].map(item => (
                <li key={item}>
                  <a
                    href="#guias"
                    className="text-xs transition-colors duration-200"
                    style={{ color: "#444" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#444")}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className="pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: "1px solid #1A1A1A", color: "#333" }}
        >
          <span>© {new Date().getFullYear()} ComprarBacklinks.com — Todos los derechos reservados</span>
          <a
            href="https://www.getalink.com"
            rel="nofollow"
            target="_blank"
            className="flex items-center gap-1.5 transition-colors duration-200"
            style={{ color: "#444" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
            onMouseLeave={e => (e.currentTarget.style.color = "#444")}
          >
            Powered by getalink.com <ExternalLink size={11} />
          </a>
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
      <StatsSection />
      <CategoriesSection />
      <HowItWorksSection />
      <GuidesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  );
}
