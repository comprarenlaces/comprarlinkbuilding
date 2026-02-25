/**
 * DESIGN: Terminal SEO Noir — Página de Listado por Clúster
 * Muestra todos los artículos de un clúster en formato grid.
 * Meta tags dinámicos, skeleton de carga, breadcrumb.
 */

import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { Clock, ExternalLink, BookOpen, ChevronRight, Search, Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { getArticlesByCluster, CLUSTER_LABELS, type Article } from "@/lib/articles-data";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

// ─── Descripciones por clúster ───────────────────────────────────────────────

const CLUSTER_DESCRIPTIONS: Record<string, string> = {
  "paises": "Guías especializadas sobre link building en diferentes mercados y países. Estrategias adaptadas a cada ecosistema digital.",
  "estrategia-link-building": "Fundamentos y visión global para construir una estrategia de enlaces sólida, sostenible y orientada a resultados reales en 2026.",
  "tacticas-y-metodos": "Las técnicas más efectivas para conseguir backlinks: guest posts, niche edits, HARO, skyscraper, broken link building y más.",
  "riesgos-y-penalizaciones": "Qué prácticas pueden penalizarte, cómo detectar una penalización manual o algorítmica y cómo recuperar tu sitio.",
  "auditorias-y-analisis": "Cómo auditar tu perfil de backlinks, analizar a la competencia y construir un sistema de seguimiento de enlaces.",
  "metricas-y-medicion": "DR, DA, Authority Score, link velocity y cómo medir el impacto real del link building en tu posicionamiento.",
  "herramientas": "Las mejores herramientas para link building en 2026: Ahrefs, Semrush y comparativas para cada fase del proceso.",
  "sectores": "Guías específicas de link building por industria: e-commerce, SaaS, negocios locales, agencias SEO y más.",
  "reputacion-de-marca": "Gestión de menciones, ORM, Knowledge Panel y cómo construir una brand entity que Google y los LLMs reconozcan.",
  "llms-y-busqueda-generativa": "GEO, optimización para motores de respuesta generativa y cómo los LLMs están cambiando el tráfico orgánico en 2026.",
  "planificacion-y-presupuesto": "Cómo priorizar con presupuesto limitado, negociar placements, evaluar medios y calcular cuántos backlinks necesitas.",
  "tendencias-seo": "El link building en el contexto del SEO moderno: LLMs, brand mentions, E-E-A-T y GEO para 2026.",
  // Legacy
  "tacticas-metodos": "Las técnicas más efectivas para conseguir backlinks de calidad. Técnicas probadas por profesionales del SEO.",
  "reputacion-marca": "Cómo el link building impacta en la reputación digital de tu marca. PR digital, branding y autoridad online.",
  "auditorias-analisis": "Aprende a auditar tu perfil de backlinks, analizar el de tu competencia y tomar decisiones basadas en datos.",
};

const CLUSTER_ICONS: Record<string, string> = {
  "paises": "🌍",
  "estrategia-link-building": "🎯",
  "tacticas-y-metodos": "⚡",
  "riesgos-y-penalizaciones": "⚠️",
  "auditorias-y-analisis": "🔍",
  "metricas-y-medicion": "📊",
  "herramientas": "🛠️",
  "sectores": "🏢",
  "reputacion-de-marca": "🏆",
  "llms-y-busqueda-generativa": "🤖",
  "planificacion-y-presupuesto": "💰",
  "tendencias-seo": "📈",
  // Legacy
  "tacticas-metodos": "⚡",
  "reputacion-marca": "🏆",
  "auditorias-analisis": "🔍",
};

// ─── Navbar ──────────────────────────────────────────────────────────────────

function ClusterNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="navbar fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <a href="/" style={{ textDecoration: "none" }}><Logo size="sm" /></a>
          <div className="hidden md:flex items-center gap-4">
            <a href="/#clusteres" className="text-xs transition-colors duration-200" style={{ color: "#666" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")} onMouseLeave={e => (e.currentTarget.style.color = "#666")}>Clústeres</a>
            <a href="/#paises" className="text-xs transition-colors duration-200" style={{ color: "#666" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")} onMouseLeave={e => (e.currentTarget.style.color = "#666")}>Países</a>
            <a href="https://www.getalink.com" rel="nofollow" target="_blank"
              className="btn-primary text-xs px-3 py-2 rounded font-semibold flex items-center gap-1">
              Visitar getalink.com <ExternalLink size={11} />
            </a>
          </div>
          <button className="md:hidden p-2" style={{ color: "#666" }} onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden pb-3 border-t" style={{ borderColor: "#1A1A1A" }}>
            <div className="flex flex-col gap-2 pt-3">
              <a href="/#clusteres" className="text-xs px-2 py-1" style={{ color: "#666" }}>Clústeres</a>
              <a href="/#paises" className="text-xs px-2 py-1" style={{ color: "#666" }}>Países</a>
              <a href="https://www.getalink.com" rel="nofollow" target="_blank"
                className="btn-primary text-xs px-3 py-2 rounded font-semibold flex items-center gap-1 w-fit">
                Visitar getalink.com <ExternalLink size={11} />
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

function ClusterSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
      <div className="skeleton skeleton-meta mb-6" style={{ width: 200 }} />
      <div className="skeleton skeleton-title mb-2" style={{ width: "60%" }} />
      <div className="skeleton skeleton-text mb-8" style={{ width: "80%" }} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="rounded-xl p-5" style={{ background: "#111111", border: "1px solid #1E1E1E" }}>
            <div className="skeleton skeleton-image mb-4" style={{ height: 160 }} />
            <div className="skeleton skeleton-badge mb-3" />
            <div className="skeleton skeleton-text mb-2" style={{ width: "90%" }} />
            <div className="skeleton skeleton-text mb-4" style={{ width: "70%" }} />
            <div className="skeleton skeleton-meta" style={{ width: 80 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Tarjeta de artículo ─────────────────────────────────────────────────────

function ArticleCard({ article }: { article: Article }) {
  const readTime = typeof article.read_time === 'number' ? article.read_time : parseInt(String(article.read_time)) || 8;
  return (
    <a
      href={`/${article.cluster}/${article.slug}`}
      className="block rounded-xl overflow-hidden transition-all duration-200 group"
      style={{ background: "#111111", border: "1px solid #1E1E1E", textDecoration: "none" }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(181,232,83,0.25)";
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-3px)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.5)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1E1E1E";
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
      }}
    >
      {/* Imagen */}
      {article.featuredImage && (
        <div className="overflow-hidden" style={{ height: 160 }}>
          <img
            src={article.featuredImage}
            alt={article.h1 || article.meta_title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-5">
        {/* Título */}
        <h2 className="font-semibold leading-snug mb-2 transition-colors duration-200"
          style={{ fontSize: "0.95rem", color: "#E0E0E0", lineHeight: 1.4 }}>
          {article.h1 || article.meta_title}
        </h2>
        {/* Descripción */}
        {article.meta_description && (
          <p className="text-xs leading-relaxed mb-4 line-clamp-2" style={{ color: "#666" }}>
            {article.meta_description}
          </p>
        )}
        {/* Meta */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "#444" }}>
            <Clock size={10} />
            <span>{readTime} min</span>
          </div>
          <span className="text-xs font-semibold" style={{ color: "#B5E853" }}>
            Leer guía →
          </span>
        </div>
      </div>
    </a>
  );
}

// ─── Página principal ────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 9;

export default function ClusterPage() {
  const params = useParams<{ cluster: string }>();
  const clusterSlug = params.cluster || "";
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const articles = getArticlesByCluster(clusterSlug);
  const clusterLabel = CLUSTER_LABELS[clusterSlug] || clusterSlug;
  const clusterDesc = CLUSTER_DESCRIPTIONS[clusterSlug] || `Guías y recursos sobre ${clusterLabel}.`;
  const clusterIcon = CLUSTER_ICONS[clusterSlug] || "📚";

  // Meta tags dinámicos
  useDocumentMeta({
    title: `${clusterLabel} | Comprar Linkbuilding`,
    description: clusterDesc,
    ogType: "website",
    canonical: `https://comprarlinkbuilding.com/cluster/${clusterSlug}/`,
  });

  // Skeleton
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(t);
  }, [clusterSlug]);

  // Scroll al top
  useEffect(() => { window.scrollTo(0, 0); }, [clusterSlug]);

  const filtered = articles.filter(a =>
    search === "" ||
    (a.h1 || a.meta_title).toLowerCase().includes(search.toLowerCase()) ||
    (a.meta_description || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset page when search changes
  useEffect(() => { setCurrentPage(1); }, [search]);

  if (!loading && articles.length === 0) {
    return (
      <div style={{ background: "#0D0D0D", minHeight: "100vh", fontFamily: "'Open Sans', sans-serif" }}>
        <ClusterNavbar />
        <div className="max-w-3xl mx-auto px-4 pt-32 pb-20 text-center">
          <p className="text-6xl mb-6" style={{ color: "#B5E853" }}>404</p>
          <h1 className="text-2xl font-bold mb-4" style={{ color: "#E8E8E8" }}>Clúster no encontrado</h1>
          <a href="/" className="btn-primary px-6 py-3 rounded-lg text-sm font-semibold inline-flex items-center gap-2">
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh", fontFamily: "'Open Sans', sans-serif" }}>
      <ClusterNavbar />

      {loading ? (
        <ClusterSkeleton />
      ) : (
        <>
          {/* Hero del clúster */}
          <div className="hero-gradient pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              {/* Breadcrumb */}
              <nav className="flex items-center gap-1.5 mb-6">
                <a href="/" className="text-xs transition-colors duration-200" style={{ color: "#444" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")} onMouseLeave={e => (e.currentTarget.style.color = "#444")}>Inicio</a>
                <ChevronRight size={10} style={{ color: "#2A2A2A" }} />
                <a href="/#clusteres" className="text-xs transition-colors duration-200" style={{ color: "#444" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")} onMouseLeave={e => (e.currentTarget.style.color = "#444")}>Clústeres</a>
                <ChevronRight size={10} style={{ color: "#2A2A2A" }} />
                <span className="text-xs" style={{ color: "#666" }}>{clusterLabel}</span>
              </nav>

              <div className="flex items-start gap-4 mb-4">
                <span className="text-4xl">{clusterIcon}</span>
                <div>
                  <span className="badge-accent mb-3 inline-block">Clúster temático</span>
                  <h1 className="font-bold leading-tight" style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#F0F0F0", letterSpacing: "-0.025em" }}>
                    {clusterLabel}
                  </h1>
                </div>
              </div>

              <p className="max-w-2xl mb-8" style={{ fontSize: 15, color: "#888", lineHeight: 1.7 }}>
                {clusterDesc}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-sm" style={{ color: "#555" }}>
                  <BookOpen size={14} style={{ color: "#B5E853" }} />
                  <span><strong style={{ color: "#B5E853" }}>{articles.length}</strong> guías publicadas</span>
                </div>
              </div>

              {/* Buscador */}
              <div className="relative max-w-lg">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#444" }} />
                <input
                  type="text"
                  placeholder={`Buscar en ${clusterLabel}...`}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="search-input w-full pl-9 pr-4 py-2.5 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Grid de artículos */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg mb-2" style={{ color: "#555" }}>No se encontraron resultados</p>
                <button onClick={() => setSearch("")} className="text-sm" style={{ color: "#B5E853" }}>
                  Limpiar búsqueda
                </button>
              </div>
            ) : (
              <>
                <p className="text-xs mb-6" style={{ color: "#444" }}>
                  {filtered.length === articles.length
                    ? `${articles.length} guías en este clúster`
                    : `${filtered.length} de ${articles.length} guías`}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                  {paginated.map(article => (
                    <ArticleCard key={article.slug} article={article} />
                  ))}
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4">
                    <button
                      onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={currentPage === 1}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                      style={{
                        background: currentPage === 1 ? "#111" : "#141414",
                        border: "1px solid #1E1E1E",
                        color: currentPage === 1 ? "#333" : "#888",
                        cursor: currentPage === 1 ? "not-allowed" : "pointer",
                      }}
                    >
                      ← Anterior
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-200"
                          style={{
                            background: page === currentPage ? "#B5E853" : "#141414",
                            border: `1px solid ${page === currentPage ? "#B5E853" : "#1E1E1E"}`,
                            color: page === currentPage ? "#0D0D0D" : "#666",
                            fontWeight: page === currentPage ? 700 : 400,
                          }}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200"
                      style={{
                        background: currentPage === totalPages ? "#111" : "#141414",
                        border: "1px solid #1E1E1E",
                        color: currentPage === totalPages ? "#333" : "#888",
                        cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                      }}
                    >
                      Siguiente →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* CTA */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <div className="p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{ background: "linear-gradient(135deg, #141414 0%, #111 100%)", border: "1px solid #1E1E1E", borderLeft: "4px solid #B5E853" }}>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: "#E8E8E8" }}>¿Buscas medios para ejecutar tu estrategia?</p>
                <p className="text-xs" style={{ color: "#666" }}>Más de 20.000 medios verificados con métricas transparentes en Getalink.</p>
              </div>
              <a href="https://www.getalink.com" rel="nofollow" target="_blank"
                className="btn-primary flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold">
                Visitar getalink.com <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Footer */}
          <footer style={{ background: "#080808", borderTop: "1px solid #141414" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
              <a href="/" style={{ textDecoration: "none" }}><Logo size="sm" /></a>
              <p className="text-xs" style={{ color: "#2A2A2A" }}>© {new Date().getFullYear()} ComprarBacklinks — Contenido editorial independiente</p>
              <a href="https://www.getalink.com" rel="nofollow" target="_blank"
                className="text-xs flex items-center gap-1 transition-colors duration-200" style={{ color: "#333" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")} onMouseLeave={e => (e.currentTarget.style.color = "#333")}>
                getalink.com <ExternalLink size={10} />
              </a>
            </div>
          </footer>
        </>
      )}
    </div>
  );
}
