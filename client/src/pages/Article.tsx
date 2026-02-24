/**
 * DESIGN: Terminal SEO Noir — Página de Artículo/Entrada
 * Funcionalidades UX:
 * - Barra de progreso de lectura (top)
 * - Tabla de contenidos sticky con anclas y resaltado activo
 * - Control de tamaño de fuente (3 niveles)
 * - Scroll-to-top flotante
 * - Tiempo de lectura estimado
 * - Breadcrumb
 * - Metadatos del artículo (autor, fecha, clúster)
 * - Artículos relacionados al final
 * - Diseño editorial de alto nivel
 */

import { useState, useEffect, useRef, useCallback } from "react";
import {
  ChevronRight, ExternalLink, Clock, Calendar, User,
  ArrowUp, Tag, BookOpen, AlignLeft, Minus, Plus,
  Share2, Copy, Check, ChevronDown, ChevronUp, Menu, X
} from "lucide-react";
import { Logo } from "@/components/Logo";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface TocItem {
  id: string;
  text: string;
  level: number;
}

// ─── Contenido de ejemplo ────────────────────────────────────────────────────

const ARTICLE = {
  title: "Tier 2 link building: estructura, usos y riesgos",
  description: "Cómo funciona la estructura tiered, cuándo tiene sentido aplicarla, qué tipo de backlinks usar en cada capa y qué riesgos evitar para que no se convierta en un problema para el money site.",
  cluster: "Estrategia de link building",
  clusterSlug: "estrategia-link-building",
  author: "Juan Glez",
  date: "24 de febrero de 2026",
  readTime: 12,
  tags: ["Tier 2", "Link building", "SEO offpage", "Estrategia"],
};

const TOC_ITEMS: TocItem[] = [
  { id: "que-es-tier-2", text: "¿Qué es el tier 2 link building?", level: 2 },
  { id: "como-funciona-estructura", text: "Cómo funciona la estructura tiered", level: 2 },
  { id: "capa-tier-1", text: "Capa tier 1: los enlaces directos", level: 3 },
  { id: "capa-tier-2", text: "Capa tier 2: los refuerzos", level: 3 },
  { id: "cuando-tiene-sentido", text: "Cuándo tiene sentido aplicarlo", level: 2 },
  { id: "tipos-backlinks-tier-2", text: "Tipos de backlinks para tier 2", level: 2 },
  { id: "riesgos-principales", text: "Riesgos principales y cómo evitarlos", level: 2 },
  { id: "footprints-y-patrones", text: "Footprints y patrones detectables", level: 3 },
  { id: "velocidad-adquisicion", text: "Velocidad de adquisición", level: 3 },
  { id: "herramientas-recomendadas", text: "Herramientas recomendadas", level: 2 },
  { id: "conclusion", text: "Conclusión", level: 2 },
];

const RELATED = [
  {
    title: "Skyscraper technique: cómo ejecutarla correctamente en 2026",
    cluster: "Estrategia de link building",
    readTime: 9,
    slug: "skyscraper-technique",
  },
  {
    title: "Footprints en link building: qué son y cómo detectarlos",
    cluster: "Estrategia de link building",
    readTime: 7,
    slug: "footprints-link-building",
  },
  {
    title: "Anchor text sobreoptimizado: cómo detectarlo y corregirlo",
    cluster: "Estrategia de link building",
    readTime: 8,
    slug: "anchor-text-sobreoptimizado",
  },
];

// ─── Barra de progreso ───────────────────────────────────────────────────────

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[100] h-[3px]"
      style={{ background: "#1A1A1A" }}
    >
      <div
        className="h-full transition-all duration-100"
        style={{
          width: `${progress}%`,
          background: "linear-gradient(90deg, #B5E853 0%, #8CC63F 100%)",
          boxShadow: "0 0 8px rgba(181,232,83,0.5)",
        }}
      />
    </div>
  );
}

// ─── Scroll to top ───────────────────────────────────────────────────────────

function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center rounded-full transition-all duration-300"
      style={{
        width: 44,
        height: 44,
        background: visible ? "#B5E853" : "transparent",
        color: "#0D0D0D",
        border: visible ? "none" : "1px solid #2A2A2A",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(12px)",
        boxShadow: visible ? "0 4px 20px rgba(181,232,83,0.3)" : "none",
      }}
      aria-label="Volver al inicio"
    >
      <ArrowUp size={18} />
    </button>
  );
}

// ─── Tabla de contenidos ─────────────────────────────────────────────────────

function TableOfContents({
  items,
  activeId,
  collapsed,
  onToggle,
}: {
  items: TocItem[];
  activeId: string;
  collapsed: boolean;
  onToggle: () => void;
}) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "#111111", border: "1px solid #1E1E1E" }}
    >
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 transition-colors duration-150"
        style={{ background: "transparent" }}
        onMouseEnter={e => (e.currentTarget.style.background = "#161616")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        <div className="flex items-center gap-2">
          <AlignLeft size={14} style={{ color: "#B5E853" }} />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#888" }}>
            Índice de contenidos
          </span>
        </div>
        {collapsed ? (
          <ChevronDown size={14} style={{ color: "#444" }} />
        ) : (
          <ChevronUp size={14} style={{ color: "#444" }} />
        )}
      </button>

      {/* Items */}
      {!collapsed && (
        <div className="px-3 pb-4">
          <div className="w-full h-px mb-3" style={{ background: "#1E1E1E" }} />
          {items.map((item, i) => {
            const isActive = activeId === item.id;
            const indent = item.level === 3 ? "pl-4" : "";
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`w-full text-left flex items-start gap-2 py-1.5 px-2 rounded transition-all duration-150 ${indent}`}
                style={{
                  background: isActive ? "rgba(181,232,83,0.08)" : "transparent",
                }}
                onMouseEnter={e => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "#161616";
                }}
                onMouseLeave={e => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                <span
                  className="flex-shrink-0 mt-1.5 rounded-full"
                  style={{
                    width: item.level === 2 ? 5 : 3,
                    height: item.level === 2 ? 5 : 3,
                    background: isActive ? "#B5E853" : "#333",
                    transition: "background 0.2s",
                  }}
                />
                <span
                  className="text-xs leading-snug"
                  style={{
                    color: isActive ? "#B5E853" : item.level === 3 ? "#555" : "#777",
                    fontWeight: isActive ? 600 : item.level === 2 ? 500 : 400,
                    transition: "color 0.2s",
                  }}
                >
                  {item.text}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Control de fuente ───────────────────────────────────────────────────────

function FontSizeControl({
  size,
  onChange,
}: {
  size: number;
  onChange: (s: number) => void;
}) {
  const sizes = [14, 16, 18];
  const labels = ["A−", "A", "A+"];

  return (
    <div
      className="flex items-center gap-1 rounded-lg p-1"
      style={{ background: "#141414", border: "1px solid #1E1E1E" }}
    >
      {sizes.map((s, i) => (
        <button
          key={s}
          onClick={() => onChange(s)}
          className="px-2.5 py-1.5 rounded text-xs font-semibold transition-all duration-150"
          style={{
            background: size === s ? "#B5E853" : "transparent",
            color: size === s ? "#0D0D0D" : "#555",
            fontSize: 10 + i * 1.5,
          }}
          title={`Tamaño ${labels[i]}`}
        >
          A
        </button>
      ))}
    </div>
  );
}

// ─── Botón de compartir ──────────────────────────────────────────────────────

function ShareButton() {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all duration-200"
      style={{
        background: copied ? "rgba(181,232,83,0.1)" : "#141414",
        border: `1px solid ${copied ? "rgba(181,232,83,0.3)" : "#1E1E1E"}`,
        color: copied ? "#B5E853" : "#555",
      }}
      title="Copiar enlace"
    >
      {copied ? <Check size={12} /> : <Copy size={12} />}
      {copied ? "¡Copiado!" : "Copiar enlace"}
    </button>
  );
}

// ─── Navbar del artículo ─────────────────────────────────────────────────────

function ArticleNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar fixed top-[3px] left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <a href="/" style={{ textDecoration: "none" }}>
            <Logo size="sm" />
          </a>
          <div className="hidden md:flex items-center gap-4">
            <a href="/#clusteres" className="text-xs transition-colors duration-200" style={{ color: "#666" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
              onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
              Clústeres
            </a>
            <a href="/#guias" className="text-xs transition-colors duration-200" style={{ color: "#666" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
              onMouseLeave={e => (e.currentTarget.style.color = "#666")}>
              Guías
            </a>
            <a
              href="https://www.getalink.com"
              rel="nofollow"
              target="_blank"
              className="btn-primary text-xs px-3 py-2 rounded font-semibold flex items-center gap-1"
            >
              getalink.com <ExternalLink size={11} />
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
              <a href="/#guias" className="text-xs px-2 py-1" style={{ color: "#666" }}>Guías</a>
              <a href="https://www.getalink.com" rel="nofollow" target="_blank"
                className="btn-primary text-xs px-3 py-2 rounded font-semibold flex items-center gap-1 w-fit">
                getalink.com <ExternalLink size={11} />
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// ─── Contenido del artículo ──────────────────────────────────────────────────

function ArticleContent({ fontSize }: { fontSize: number }) {
  return (
    <div className="article-body" style={{ fontSize, lineHeight: 1.8 }}>

      <p>El link building en capas —o <strong>tier 2 link building</strong>— es una de las estrategias más avanzadas del SEO offpage. La idea es sencilla en teoría pero delicada en la práctica: en lugar de apuntar todos los enlaces directamente a tu sitio web (<em>money site</em>), construyes una estructura en capas donde los enlaces de la segunda capa refuerzan los de la primera.</p>

      <p>Cuando se ejecuta bien, puede amplificar significativamente el impacto de tus backlinks de calidad. Cuando se ejecuta mal, puede convertirse en una señal de manipulación que Google detecta y penaliza.</p>

      <h2 id="que-es-tier-2">¿Qué es el tier 2 link building?</h2>

      <p>El tier 2 link building es una técnica de construcción de enlaces en la que se crean backlinks que apuntan a los propios backlinks del money site, en lugar de apuntar directamente a él. El objetivo es aumentar la autoridad y el "link juice" que fluye hacia las páginas que ya enlazan a tu sitio.</p>

      <div className="callout-info">
        <strong>Definición clave:</strong> Un enlace tier 1 apunta directamente a tu money site. Un enlace tier 2 apunta a la página que contiene ese enlace tier 1, reforzando su autoridad y, por tanto, el valor que transmite a tu sitio.
      </div>

      <p>La lógica detrás de esta estrategia es que un backlink en una página con alta autoridad propia transmite más valor. Si consigues que esa página reciba más enlaces, su autoridad aumenta y, con ella, el valor del enlace que apunta a tu sitio.</p>

      <h2 id="como-funciona-estructura">Cómo funciona la estructura tiered</h2>

      <p>La estructura clásica de tier 2 link building se divide en dos capas principales, aunque en teoría puede extenderse a más niveles (tier 3, tier 4...). En la práctica, ir más allá de dos capas raramente aporta valor adicional y aumenta exponencialmente el riesgo.</p>

      <h3 id="capa-tier-1">Capa tier 1: los enlaces directos</h3>

      <p>Los enlaces tier 1 son los que apuntan directamente a tu money site. Aquí la calidad es innegociable. Deberían ser:</p>

      <ul>
        <li>Backlinks editoriales en medios con tráfico real y autoridad verificada</li>
        <li>Guest posts en blogs relevantes de tu nicho</li>
        <li>Menciones en portales de referencia del sector</li>
        <li>Citaciones en directorios de alta calidad</li>
      </ul>

      <p>Estos son los enlaces que Google va a examinar con más detalle. No puedes permitirte comprometer su calidad.</p>

      <h3 id="capa-tier-2">Capa tier 2: los refuerzos</h3>

      <p>Los enlaces tier 2 apuntan a las páginas que contienen tus backlinks tier 1. Aquí los estándares de calidad son más flexibles, pero no inexistentes. El objetivo es aumentar la autoridad de esas páginas para que transmitan más valor hacia tu sitio.</p>

      <p>Para la capa tier 2 se suelen utilizar recursos como artículos en plataformas de contenido, perfiles en foros especializados, o publicaciones en blogs de nicho con menor autoridad pero temáticamente relevantes.</p>

      <div className="callout-warning">
        <strong>Atención:</strong> Usar spam masivo, PBNs o redes de enlaces artificiales en la capa tier 2 puede contaminar toda la estructura y generar señales negativas que afecten al money site, aunque los enlaces no apunten directamente a él.
      </div>

      <h2 id="cuando-tiene-sentido">Cuándo tiene sentido aplicarlo</h2>

      <p>El tier 2 link building no es una estrategia universal. Tiene sentido en contextos específicos:</p>

      <ul>
        <li><strong>Cuando tienes backlinks tier 1 de alta calidad</strong> que quieres potenciar sin arriesgar el money site.</li>
        <li><strong>En nichos competitivos</strong> donde la diferencia entre posicionar en top 3 o top 10 es la autoridad acumulada.</li>
        <li><strong>Para acelerar la indexación</strong> de páginas que enlazan a tu sitio pero que aún no han sido rastreadas por Google.</li>
        <li><strong>En estrategias de SEO agresivas</strong> para proyectos con tolerancia al riesgo, como afiliados o proyectos de nicho.</li>
      </ul>

      <p>En cambio, para proyectos de marca, negocios locales o sitios con alta exposición pública, la relación riesgo/beneficio raramente justifica la complejidad añadida.</p>

      <h2 id="tipos-backlinks-tier-2">Tipos de backlinks para tier 2</h2>

      <p>La elección del tipo de enlace para la capa tier 2 depende del nivel de riesgo que estés dispuesto a asumir y del tipo de proyecto. Estas son las opciones más habituales, ordenadas de menor a mayor riesgo:</p>

      <table>
        <thead>
          <tr>
            <th>Tipo de enlace</th>
            <th>Riesgo</th>
            <th>Efectividad</th>
            <th>Escala</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Guest posts en blogs de nicho</td>
            <td style={{ color: "#B5E853" }}>Bajo</td>
            <td>Alta</td>
            <td>Media</td>
          </tr>
          <tr>
            <td>Artículos en plataformas de contenido</td>
            <td style={{ color: "#B5E853" }}>Bajo-Medio</td>
            <td>Media</td>
            <td>Alta</td>
          </tr>
          <tr>
            <td>Perfiles en foros especializados</td>
            <td style={{ color: "#E8A838" }}>Medio</td>
            <td>Baja-Media</td>
            <td>Alta</td>
          </tr>
          <tr>
            <td>Web 2.0 y blogs gratuitos</td>
            <td style={{ color: "#E8A838" }}>Medio</td>
            <td>Baja</td>
            <td>Muy alta</td>
          </tr>
          <tr>
            <td>PBNs y redes privadas</td>
            <td style={{ color: "#E85353" }}>Alto</td>
            <td>Variable</td>
            <td>Alta</td>
          </tr>
        </tbody>
      </table>

      <h2 id="riesgos-principales">Riesgos principales y cómo evitarlos</h2>

      <p>El tier 2 link building amplifica tanto los efectos positivos como los negativos. Si la estructura está bien construida, el impacto puede ser notable. Si está mal ejecutada, puede generar señales de manipulación que afecten al money site de forma indirecta.</p>

      <h3 id="footprints-y-patrones">Footprints y patrones detectables</h3>

      <p>Un footprint es cualquier patrón repetible que permite a Google identificar que un conjunto de páginas o dominios forman parte de una red artificial. En el contexto del tier 2, los footprints más comunes son:</p>

      <ul>
        <li>Usar siempre el mismo anchor text en todos los enlaces tier 2</li>
        <li>Crear todos los enlaces tier 2 en el mismo tipo de plataforma</li>
        <li>Publicar todos los enlaces en un período de tiempo muy corto</li>
        <li>Usar las mismas IPs, cuentas o plantillas de contenido</li>
      </ul>

      <p>La diversificación es la clave para evitar footprints detectables. Varía los tipos de plataformas, los anchor texts, los intervalos de publicación y el contenido que rodea a los enlaces.</p>

      <h3 id="velocidad-adquisicion">Velocidad de adquisición</h3>

      <p>Uno de los errores más comunes es construir demasiados enlaces tier 2 en muy poco tiempo. Aunque estos enlaces no apuntan directamente al money site, un crecimiento antinatural en las páginas que lo enlazan puede generar señales de alerta.</p>

      <div className="callout-tip">
        <strong>Buena práctica:</strong> Construye los enlaces tier 2 de forma gradual, respetando un ritmo de crecimiento natural. Una regla general es no superar el 3-5x de enlaces por mes respecto al ritmo habitual de adquisición de esa página.
      </div>

      <h2 id="herramientas-recomendadas">Herramientas recomendadas</h2>

      <p>Para gestionar una estrategia de tier 2 link building de forma eficiente, necesitas herramientas que te permitan rastrear la estructura de enlaces, monitorizar la autoridad de las páginas intermedias y detectar posibles footprints.</p>

      <ul>
        <li><strong>Ahrefs:</strong> Para auditar el perfil de backlinks de las páginas tier 1 y monitorizar cambios de autoridad.</li>
        <li><strong>Majestic:</strong> Trust Flow y Citation Flow son métricas útiles para evaluar la calidad de los enlaces tier 2.</li>
        <li><strong>Screaming Frog:</strong> Para rastrear la estructura de enlaces y detectar patrones repetitivos.</li>
        <li><strong>Google Search Console:</strong> Para monitorizar el impacto en el money site y detectar penalizaciones manuales.</li>
      </ul>

      <h2 id="conclusion">Conclusión</h2>

      <p>El tier 2 link building es una herramienta poderosa cuando se usa con criterio. No es una estrategia para principiantes ni para proyectos que no pueden asumir el riesgo de una penalización, aunque sea indirecta.</p>

      <p>Si decides implementarla, hazlo con una estructura clara, diversificación real y un ritmo de crecimiento natural. La diferencia entre una estrategia tier 2 efectiva y una penalización está, casi siempre, en los detalles de la ejecución.</p>

      <p>Y si buscas medios de calidad para construir tus backlinks tier 1 —la base sobre la que descansa toda la estructura—, plataformas como <a href="https://www.getalink.com" rel="nofollow" target="_blank" style={{ color: "#B5E853" }}>Getalink.com</a> ofrecen acceso a más de 20.000 medios verificados con métricas transparentes.</p>

    </div>
  );
}

// ─── Artículos relacionados ──────────────────────────────────────────────────

function RelatedArticles() {
  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-5">
        <BookOpen size={14} style={{ color: "#B5E853" }} />
        <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#555" }}>
          Artículos relacionados
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {RELATED.map((r, i) => (
          <a
            key={i}
            href={`/articulo/${r.slug}`}
            className="block p-4 rounded-lg transition-all duration-200 group"
            style={{ background: "#141414", border: "1px solid #1E1E1E", textDecoration: "none" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2A2A2A";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1E1E1E";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            }}
          >
            <span className="badge-accent mb-2 inline-block" style={{ fontSize: "0.6rem" }}>
              {r.cluster}
            </span>
            <h4 className="text-sm font-semibold leading-snug mb-2" style={{ color: "#E8E8E8" }}>
              {r.title}
            </h4>
            <div className="flex items-center gap-1 text-xs" style={{ color: "#444" }}>
              <Clock size={10} />
              <span>{r.readTime} min</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Página principal ────────────────────────────────────────────────────────

export default function Article() {
  const [activeId, setActiveId] = useState("");
  const [tocCollapsed, setTocCollapsed] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const contentRef = useRef<HTMLDivElement>(null);

  // Detectar sección activa al hacer scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );

    TOC_ITEMS.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh", fontFamily: "'Open Sans', sans-serif" }}>
      {/* Barra de progreso */}
      <ReadingProgress />

      {/* Navbar */}
      <ArticleNavbar />

      {/* TOC móvil flotante */}
      <div className="lg:hidden fixed bottom-20 right-6 z-40">
        <button
          onClick={() => setMobileTocOpen(!mobileTocOpen)}
          className="flex items-center justify-center rounded-full transition-all duration-200"
          style={{
            width: 44,
            height: 44,
            background: "#141414",
            border: "1px solid #2A2A2A",
            color: "#B5E853",
          }}
          aria-label="Índice de contenidos"
        >
          <AlignLeft size={18} />
        </button>
        {mobileTocOpen && (
          <div
            className="absolute bottom-14 right-0 w-72 rounded-xl overflow-hidden"
            style={{ background: "#111", border: "1px solid #2A2A2A", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}
          >
            <TableOfContents
              items={TOC_ITEMS}
              activeId={activeId}
              collapsed={false}
              onToggle={() => setMobileTocOpen(false)}
            />
          </div>
        )}
      </div>

      {/* Scroll to top */}
      <ScrollToTop />

      {/* Layout principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 items-start">

          {/* ── Columna principal ── */}
          <main>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 mb-6 flex-wrap">
              <a href="/" className="text-xs transition-colors duration-200" style={{ color: "#444" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
                onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
                Inicio
              </a>
              <ChevronRight size={10} style={{ color: "#2A2A2A" }} />
              <a href="/#clusteres" className="text-xs transition-colors duration-200" style={{ color: "#444" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
                onMouseLeave={e => (e.currentTarget.style.color = "#444")}>
                {ARTICLE.cluster}
              </a>
              <ChevronRight size={10} style={{ color: "#2A2A2A" }} />
              <span className="text-xs" style={{ color: "#666" }}>
                {ARTICLE.title.length > 40 ? ARTICLE.title.slice(0, 40) + "…" : ARTICLE.title}
              </span>
            </nav>

            {/* Cluster badge */}
            <div className="mb-4">
              <span className="badge-accent">{ARTICLE.cluster}</span>
            </div>

            {/* Título */}
            <h1
              className="font-bold leading-tight mb-4"
              style={{
                fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
                color: "#F0F0F0",
                letterSpacing: "-0.025em",
              }}
            >
              {ARTICLE.title}
            </h1>

            {/* Descripción */}
            <p className="mb-6 leading-relaxed" style={{ fontSize: 15, color: "#888" }}>
              {ARTICLE.description}
            </p>

            {/* Meta bar */}
            <div
              className="flex flex-wrap items-center justify-between gap-4 py-4 mb-8"
              style={{ borderTop: "1px solid #1A1A1A", borderBottom: "1px solid #1A1A1A" }}
            >
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "rgba(181,232,83,0.12)", color: "#B5E853" }}
                  >
                    {ARTICLE.author.charAt(0)}
                  </div>
                  <span className="text-xs font-medium" style={{ color: "#888" }}>{ARTICLE.author}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "#555" }}>
                  <Calendar size={11} />
                  <span>{ARTICLE.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "#555" }}>
                  <Clock size={11} />
                  <span>{ARTICLE.readTime} min de lectura</span>
                </div>
              </div>

              {/* Controles */}
              <div className="flex items-center gap-2">
                <FontSizeControl size={fontSize} onChange={setFontSize} />
                <ShareButton />
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {ARTICLE.tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                  style={{ background: "#141414", color: "#555", border: "1px solid #1E1E1E" }}
                >
                  <Tag size={9} />
                  {tag}
                </span>
              ))}
            </div>

            {/* TOC móvil inline (visible en tablet) */}
            <div className="lg:hidden mb-8">
              <TableOfContents
                items={TOC_ITEMS}
                activeId={activeId}
                collapsed={tocCollapsed}
                onToggle={() => setTocCollapsed(!tocCollapsed)}
              />
            </div>

            {/* Contenido del artículo */}
            <div ref={contentRef}>
              <ArticleContent fontSize={fontSize} />
            </div>

            {/* Artículos relacionados */}
            <RelatedArticles />

            {/* CTA final */}
            <div
              className="mt-12 p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{
                background: "linear-gradient(135deg, #141414 0%, #111 100%)",
                border: "1px solid #1E1E1E",
                borderLeft: "4px solid #B5E853",
              }}
            >
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: "#E8E8E8" }}>
                  ¿Buscas medios para tus backlinks tier 1?
                </p>
                <p className="text-xs" style={{ color: "#666" }}>
                  Más de 20.000 medios verificados con métricas transparentes en Getalink.
                </p>
              </div>
              <a
                href="https://www.getalink.com"
                rel="nofollow"
                target="_blank"
                className="btn-primary flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold"
              >
                Ver plataforma <ExternalLink size={13} />
              </a>
            </div>
          </main>

          {/* ── Sidebar sticky ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              {/* TOC */}
              <TableOfContents
                items={TOC_ITEMS}
                activeId={activeId}
                collapsed={tocCollapsed}
                onToggle={() => setTocCollapsed(!tocCollapsed)}
              />

              {/* Control de fuente en sidebar */}
              <div
                className="rounded-xl p-4"
                style={{ background: "#111111", border: "1px solid #1E1E1E" }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#555" }}>
                  Tamaño de texto
                </p>
                <FontSizeControl size={fontSize} onChange={setFontSize} />
              </div>

              {/* Compartir */}
              <div
                className="rounded-xl p-4"
                style={{ background: "#111111", border: "1px solid #1E1E1E" }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#555" }}>
                  Compartir
                </p>
                <ShareButton />
              </div>

              {/* CTA sidebar */}
              <div
                className="rounded-xl p-4"
                style={{ background: "#111111", border: "1px solid #1E1E1E" }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#555" }}>
                  Plataforma recomendada
                </p>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: "#444" }}>
                  Medios verificados para ejecutar tu estrategia de link building.
                </p>
                <a
                  href="https://www.getalink.com"
                  rel="nofollow"
                  target="_blank"
                  className="btn-primary w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold"
                >
                  getalink.com <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer mínimo */}
      <footer style={{ background: "#080808", borderTop: "1px solid #141414" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <a href="/" style={{ textDecoration: "none" }}>
            <Logo size="sm" />
          </a>
          <p className="text-xs" style={{ color: "#2A2A2A" }}>
            © {new Date().getFullYear()} ComprarBacklinks — Contenido editorial independiente
          </p>
          <a
            href="https://www.getalink.com"
            rel="nofollow"
            target="_blank"
            className="text-xs flex items-center gap-1 transition-colors duration-200"
            style={{ color: "#333" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
            onMouseLeave={e => (e.currentTarget.style.color = "#333")}
          >
            Powered by getalink.com <ExternalLink size={10} />
          </a>
        </div>
      </footer>
    </div>
  );
}
