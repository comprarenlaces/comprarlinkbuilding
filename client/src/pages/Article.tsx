/**
 * DESIGN: Terminal SEO Noir — Página de Artículo/Entrada
 * Funcionalidades UX:
 * - Barra de progreso de lectura (top)
 * - Tabla de contenidos sticky con anclas y resaltado activo
 * - Control de tamaño de fuente (3 niveles)
 * - Scroll-to-top flotante
 * - Compartir en redes sociales (X, LinkedIn, WhatsApp, Facebook, copiar enlace)
 * - Valoración con estrellas (persistente en localStorage)
 * - Schema markup JSON-LD (Article + AggregateRating) inyectado en <head>
 * - Breadcrumb, metadatos, artículos relacionados
 */

import { useState, useEffect, useRef } from "react";
import {
  ChevronRight, ExternalLink, Clock, Calendar,
  ArrowUp, Tag, BookOpen, AlignLeft,
  Copy, Check, ChevronDown, ChevronUp, Menu, X,
  Share2, Star
} from "lucide-react";
import { Logo } from "@/components/Logo";

// ─── Tipos ───────────────────────────────────────────────────────────────────

interface TocItem {
  id: string;
  text: string;
  level: number;
}

// ─── Datos del artículo ──────────────────────────────────────────────────────

const ARTICLE = {
  slug: "tier-2-link-building",
  title: "Tier 2 link building: estructura, usos y riesgos",
  description: "Cómo funciona la estructura tiered, cuándo tiene sentido aplicarla, qué tipo de backlinks usar en cada capa y qué riesgos evitar para que no se convierta en un problema para el money site.",
  cluster: "Estrategia de link building",
  clusterSlug: "estrategia-link-building",
  author: "Juan Glez",
  authorUrl: "https://comprarlinkbuilding.com",
  date: "24 de febrero de 2026",
  dateISO: "2026-02-24",
  readTime: 12,
  tags: ["Tier 2", "Link building", "SEO offpage", "Estrategia"],
  image: "https://comprarlinkbuilding.com/og-tier2.jpg",
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
  { title: "Skyscraper technique: cómo ejecutarla correctamente en 2026", cluster: "Estrategia de link building", readTime: 9, slug: "skyscraper-technique" },
  { title: "Footprints en link building: qué son y cómo detectarlos", cluster: "Estrategia de link building", readTime: 7, slug: "footprints-link-building" },
  { title: "Anchor text sobreoptimizado: cómo detectarlo y corregirlo", cluster: "Estrategia de link building", readTime: 8, slug: "anchor-text-sobreoptimizado" },
];

// ─── Schema Markup JSON-LD ───────────────────────────────────────────────────

function ArticleSchema({ ratingValue, ratingCount }: { ratingValue: number; ratingCount: number }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": ARTICLE.title,
    "description": ARTICLE.description,
    "author": {
      "@type": "Person",
      "name": ARTICLE.author,
      "url": ARTICLE.authorUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "Comprar Linkbuilding",
      "url": "https://comprarlinkbuilding.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://comprarlinkbuilding.com/logo.png"
      }
    },
    "datePublished": ARTICLE.dateISO,
    "dateModified": ARTICLE.dateISO,
    "image": ARTICLE.image,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://comprarlinkbuilding.com/articulo/${ARTICLE.slug}`
    },
    "aggregateRating": ratingCount > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": ratingValue.toFixed(1),
      "reviewCount": ratingCount,
      "bestRating": "5",
      "worstRating": "1"
    } : undefined,
    "keywords": ARTICLE.tags.join(", "),
    "articleSection": ARTICLE.cluster,
    "inLanguage": "es"
  };

  // Limpiar campos undefined
  const clean = JSON.parse(JSON.stringify(schema));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(clean, null, 2) }}
    />
  );
}

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
    <div className="fixed top-0 left-0 right-0 z-[100] h-[3px]" style={{ background: "#1A1A1A" }}>
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
        width: 44, height: 44,
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

function TableOfContents({ items, activeId, collapsed, onToggle }: {
  items: TocItem[]; activeId: string; collapsed: boolean; onToggle: () => void;
}) {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  };
  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#111111", border: "1px solid #1E1E1E" }}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-4 transition-colors duration-150"
        style={{ background: "transparent" }}
        onMouseEnter={e => (e.currentTarget.style.background = "#161616")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        <div className="flex items-center gap-2">
          <AlignLeft size={14} style={{ color: "#B5E853" }} />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#888" }}>Índice de contenidos</span>
        </div>
        {collapsed ? <ChevronDown size={14} style={{ color: "#444" }} /> : <ChevronUp size={14} style={{ color: "#444" }} />}
      </button>
      {!collapsed && (
        <div className="px-3 pb-4">
          <div className="w-full h-px mb-3" style={{ background: "#1E1E1E" }} />
          {items.map(item => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className={`w-full text-left flex items-start gap-2 py-1.5 px-2 rounded transition-all duration-150 ${item.level === 3 ? "pl-4" : ""}`}
                style={{ background: isActive ? "rgba(181,232,83,0.08)" : "transparent" }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "#161616"; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              >
                <span className="flex-shrink-0 mt-1.5 rounded-full" style={{
                  width: item.level === 2 ? 5 : 3, height: item.level === 2 ? 5 : 3,
                  background: isActive ? "#B5E853" : "#333", transition: "background 0.2s",
                }} />
                <span className="text-xs leading-snug" style={{
                  color: isActive ? "#B5E853" : item.level === 3 ? "#555" : "#777",
                  fontWeight: isActive ? 600 : item.level === 2 ? 500 : 400,
                  transition: "color 0.2s",
                }}>{item.text}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Control de fuente ───────────────────────────────────────────────────────

function FontSizeControl({ size, onChange }: { size: number; onChange: (s: number) => void }) {
  const sizes = [14, 16, 18];
  return (
    <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: "#141414", border: "1px solid #1E1E1E" }}>
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
          title={["Texto pequeño", "Texto normal", "Texto grande"][i]}
        >
          A
        </button>
      ))}
    </div>
  );
}

// ─── Compartir en redes sociales ─────────────────────────────────────────────

interface SocialNetwork {
  name: string;
  color: string;
  hoverBg: string;
  icon: React.ReactNode;
  getUrl: (url: string, title: string) => string;
}

function SocialShareBlock({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const pageUrl = typeof window !== "undefined" ? window.location.href : `https://comprarlinkbuilding.com/articulo/${ARTICLE.slug}`;
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(title);

  const networks: SocialNetwork[] = [
    {
      name: "X (Twitter)",
      color: "#E8E8E8",
      hoverBg: "#1a1a1a",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      getUrl: (u, t) => `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
    },
    {
      name: "LinkedIn",
      color: "#0A66C2",
      hoverBg: "rgba(10,102,194,0.1)",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      getUrl: (u, t) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
    },
    {
      name: "WhatsApp",
      color: "#25D366",
      hoverBg: "rgba(37,211,102,0.1)",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
      getUrl: (u, t) => `https://wa.me/?text=${t}%20${u}`,
    },
    {
      name: "Facebook",
      color: "#1877F2",
      hoverBg: "rgba(24,119,242,0.1)",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      getUrl: (u) => `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ background: "#111111", border: "1px solid #1E1E1E" }}
    >
      {/* Header */}
      <button
        onClick={() => setShareOpen(!shareOpen)}
        className="w-full flex items-center justify-between px-5 py-4 transition-colors duration-150"
        style={{ background: "transparent" }}
        onMouseEnter={e => (e.currentTarget.style.background = "#161616")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        <div className="flex items-center gap-2">
          <Share2 size={14} style={{ color: "#B5E853" }} />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#888" }}>
            Compartir artículo
          </span>
        </div>
        {shareOpen ? <ChevronUp size={14} style={{ color: "#444" }} /> : <ChevronDown size={14} style={{ color: "#444" }} />}
      </button>

      {shareOpen && (
        <div className="px-4 pb-4">
          <div className="w-full h-px mb-3" style={{ background: "#1E1E1E" }} />

          {/* Redes sociales */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {networks.map(net => (
              <a
                key={net.name}
                href={net.getUrl(encodedUrl, encodedTitle)}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150"
                style={{
                  background: "#141414",
                  border: "1px solid #1E1E1E",
                  color: "#666",
                  textDecoration: "none",
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = net.hoverBg;
                  (e.currentTarget as HTMLAnchorElement).style.color = net.color;
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = net.color + "44";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "#141414";
                  (e.currentTarget as HTMLAnchorElement).style.color = "#666";
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1E1E1E";
                }}
              >
                <span style={{ color: net.color }}>{net.icon}</span>
                {net.name}
              </a>
            ))}
          </div>

          {/* Copiar enlace */}
          <button
            onClick={copyLink}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={{
              background: copied ? "rgba(181,232,83,0.08)" : "#141414",
              border: `1px solid ${copied ? "rgba(181,232,83,0.3)" : "#1E1E1E"}`,
              color: copied ? "#B5E853" : "#555",
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "¡Enlace copiado!" : "Copiar enlace"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Versión inline para la meta bar ─────────────────────────────────────────

function InlineShareButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(ARTICLE.title);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const copyLink = () => {
    navigator.clipboard.writeText(pageUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const networks = [
    { name: "X", color: "#E8E8E8", icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, url: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}` },
    { name: "LinkedIn", color: "#0A66C2", icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>, url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
    { name: "WhatsApp", color: "#25D366", icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>, url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}` },
    { name: "Facebook", color: "#1877F2", icon: <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
  ];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg transition-all duration-200"
        style={{
          background: open ? "rgba(181,232,83,0.08)" : "#141414",
          border: `1px solid ${open ? "rgba(181,232,83,0.3)" : "#1E1E1E"}`,
          color: open ? "#B5E853" : "#555",
        }}
      >
        <Share2 size={11} />
        Compartir
      </button>
      {open && (
        <div
          className="absolute right-0 top-10 z-50 rounded-xl overflow-hidden"
          style={{
            background: "#141414",
            border: "1px solid #2A2A2A",
            boxShadow: "0 16px 48px rgba(0,0,0,0.8)",
            minWidth: 200,
          }}
        >
          <div className="p-3 space-y-1">
            {networks.map(n => (
              <a
                key={n.name}
                href={n.url}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-150"
                style={{ color: "#666", textDecoration: "none" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#1A1A1A"; (e.currentTarget as HTMLAnchorElement).style.color = n.color; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; (e.currentTarget as HTMLAnchorElement).style.color = "#666"; }}
              >
                <span style={{ color: n.color }}>{n.icon}</span>
                {n.name}
              </a>
            ))}
            <div className="h-px my-1" style={{ background: "#1E1E1E" }} />
            <button
              onClick={copyLink}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-all duration-150"
              style={{ color: copied ? "#B5E853" : "#666" }}
              onMouseEnter={e => { if (!copied) (e.currentTarget as HTMLButtonElement).style.background = "#1A1A1A"; }}
              onMouseLeave={e => { if (!copied) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
            >
              {copied ? <Check size={11} style={{ color: "#B5E853" }} /> : <Copy size={11} />}
              {copied ? "¡Copiado!" : "Copiar enlace"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Valoración con estrellas ─────────────────────────────────────────────────

const RATING_KEY = `article-rating-${ARTICLE.slug}`;
const RATING_STATS_KEY = `article-rating-stats-${ARTICLE.slug}`;

interface RatingStats {
  total: number;
  count: number;
}

function StarRating() {
  const [hover, setHover] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [stats, setStats] = useState<RatingStats>({ total: 47, count: 12 }); // Datos iniciales demo
  const [submitted, setSubmitted] = useState(false);

  // Cargar estado desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RATING_KEY);
      const savedStats = localStorage.getItem(RATING_STATS_KEY);
      if (saved) {
        setUserRating(parseInt(saved));
        setSubmitted(true);
      }
      if (savedStats) {
        setStats(JSON.parse(savedStats));
      }
    } catch {}
  }, []);

  const avgRating = stats.count > 0 ? stats.total / stats.count : 0;
  const displayRating = hover > 0 ? hover : userRating > 0 ? userRating : 0;

  const handleRate = (star: number) => {
    if (submitted) return;
    const newStats = { total: stats.total + star, count: stats.count + 1 };
    setUserRating(star);
    setStats(newStats);
    setSubmitted(true);
    try {
      localStorage.setItem(RATING_KEY, String(star));
      localStorage.setItem(RATING_STATS_KEY, JSON.stringify(newStats));
    } catch {}
  };

  const ratingLabels = ["", "Poco útil", "Mejorable", "Útil", "Muy útil", "Excelente"];

  return (
    <div
      className="rounded-xl p-5"
      style={{ background: "#111111", border: "1px solid #1E1E1E" }}
    >
      {/* Encabezado */}
      <div className="flex items-center gap-2 mb-4">
        <Star size={14} style={{ color: "#B5E853" }} />
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#888" }}>
          Valorar contenido
        </span>
      </div>

      {/* Promedio actual */}
      <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: "1px solid #1A1A1A" }}>
        <div className="text-3xl font-bold" style={{ color: "#E8E8E8", letterSpacing: "-0.03em" }}>
          {avgRating.toFixed(1)}
        </div>
        <div>
          <div className="flex items-center gap-0.5 mb-1">
            {[1, 2, 3, 4, 5].map(s => (
              <Star
                key={s}
                size={12}
                fill={s <= Math.round(avgRating) ? "#B5E853" : "transparent"}
                style={{ color: s <= Math.round(avgRating) ? "#B5E853" : "#333" }}
              />
            ))}
          </div>
          <span className="text-xs" style={{ color: "#444" }}>{stats.count} valoraciones</span>
        </div>
      </div>

      {/* Estrellas interactivas */}
      {!submitted ? (
        <div>
          <p className="text-xs mb-3" style={{ color: "#555" }}>¿Te ha resultado útil este artículo?</p>
          <div className="flex items-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => handleRate(star)}
                className="transition-all duration-100"
                style={{ transform: hover >= star ? "scale(1.2)" : "scale(1)" }}
                aria-label={`Valorar con ${star} estrella${star > 1 ? "s" : ""}`}
              >
                <Star
                  size={22}
                  fill={displayRating >= star ? "#B5E853" : "transparent"}
                  style={{
                    color: displayRating >= star ? "#B5E853" : "#2A2A2A",
                    filter: displayRating >= star ? "drop-shadow(0 0 4px rgba(181,232,83,0.4))" : "none",
                    transition: "all 0.15s",
                  }}
                />
              </button>
            ))}
          </div>
          {hover > 0 && (
            <p className="text-xs" style={{ color: "#B5E853" }}>{ratingLabels[hover]}</p>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
              <Star
                key={s}
                size={16}
                fill={s <= userRating ? "#B5E853" : "transparent"}
                style={{ color: s <= userRating ? "#B5E853" : "#333" }}
              />
            ))}
          </div>
          <span className="text-xs" style={{ color: "#666" }}>
            Tu valoración: <span style={{ color: "#B5E853", fontWeight: 600 }}>{userRating}/5</span>
          </span>
        </div>
      )}
    </div>
  );
}

// ─── Valoración inline (al final del artículo) ────────────────────────────────

function InlineStarRating() {
  const [hover, setHover] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [stats, setStats] = useState<RatingStats>({ total: 47, count: 12 });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RATING_KEY);
      const savedStats = localStorage.getItem(RATING_STATS_KEY);
      if (saved) { setUserRating(parseInt(saved)); setSubmitted(true); }
      if (savedStats) setStats(JSON.parse(savedStats));
    } catch {}
  }, []);

  const avgRating = stats.count > 0 ? stats.total / stats.count : 0;
  const displayRating = hover > 0 ? hover : userRating > 0 ? userRating : 0;

  const handleRate = (star: number) => {
    if (submitted) return;
    const newStats = { total: stats.total + star, count: stats.count + 1 };
    setUserRating(star);
    setStats(newStats);
    setSubmitted(true);
    try {
      localStorage.setItem(RATING_KEY, String(star));
      localStorage.setItem(RATING_STATS_KEY, JSON.stringify(newStats));
    } catch {}
  };

  return (
    <div
      className="mt-10 rounded-xl p-6 text-center"
      style={{ background: "#111111", border: "1px solid #1E1E1E" }}
    >
      <p className="text-sm font-semibold mb-1" style={{ color: "#E8E8E8" }}>
        ¿Te ha resultado útil este artículo?
      </p>
      <p className="text-xs mb-4" style={{ color: "#555" }}>
        Tu valoración nos ayuda a mejorar el contenido
      </p>

      {!submitted ? (
        <>
          <div className="flex items-center justify-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                key={star}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => handleRate(star)}
                className="transition-all duration-100"
                style={{ transform: hover >= star ? "scale(1.25)" : "scale(1)" }}
                aria-label={`${star} estrella${star > 1 ? "s" : ""}`}
              >
                <Star
                  size={28}
                  fill={displayRating >= star ? "#B5E853" : "transparent"}
                  style={{
                    color: displayRating >= star ? "#B5E853" : "#2A2A2A",
                    filter: displayRating >= star ? "drop-shadow(0 0 6px rgba(181,232,83,0.5))" : "none",
                    transition: "all 0.15s",
                  }}
                />
              </button>
            ))}
          </div>
          <p className="text-xs" style={{ color: "#444" }}>
            {avgRating.toFixed(1)} / 5 · {stats.count} valoraciones
          </p>
        </>
      ) : (
        <div>
          <div className="flex items-center justify-center gap-1.5 mb-2">
            {[1, 2, 3, 4, 5].map(s => (
              <Star
                key={s}
                size={22}
                fill={s <= userRating ? "#B5E853" : "transparent"}
                style={{ color: s <= userRating ? "#B5E853" : "#333" }}
              />
            ))}
          </div>
          <p className="text-sm font-semibold mb-0.5" style={{ color: "#B5E853" }}>
            ¡Gracias por tu valoración!
          </p>
          <p className="text-xs" style={{ color: "#555" }}>
            Has valorado con {userRating}/5 · {stats.count} valoraciones en total
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Navbar ──────────────────────────────────────────────────────────────────

function ArticleNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="navbar fixed top-[3px] left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <a href="/" style={{ textDecoration: "none" }}><Logo size="sm" /></a>
          <div className="hidden md:flex items-center gap-4">
            <a href="/#clusteres" className="text-xs transition-colors duration-200" style={{ color: "#666" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
              onMouseLeave={e => (e.currentTarget.style.color = "#666")}>Clústeres</a>
            <a href="/#guias" className="text-xs transition-colors duration-200" style={{ color: "#666" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
              onMouseLeave={e => (e.currentTarget.style.color = "#666")}>Guías</a>
            <a href="https://www.getalink.com" rel="nofollow" target="_blank"
              className="btn-primary text-xs px-3 py-2 rounded font-semibold flex items-center gap-1">
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
        <thead><tr><th>Tipo de enlace</th><th>Riesgo</th><th>Efectividad</th><th>Escala</th></tr></thead>
        <tbody>
          <tr><td>Guest posts en blogs de nicho</td><td style={{ color: "#B5E853" }}>Bajo</td><td>Alta</td><td>Media</td></tr>
          <tr><td>Artículos en plataformas de contenido</td><td style={{ color: "#B5E853" }}>Bajo-Medio</td><td>Media</td><td>Alta</td></tr>
          <tr><td>Perfiles en foros especializados</td><td style={{ color: "#E8A838" }}>Medio</td><td>Baja-Media</td><td>Alta</td></tr>
          <tr><td>Web 2.0 y blogs gratuitos</td><td style={{ color: "#E8A838" }}>Medio</td><td>Baja</td><td>Muy alta</td></tr>
          <tr><td>PBNs y redes privadas</td><td style={{ color: "#E85353" }}>Alto</td><td>Variable</td><td>Alta</td></tr>
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
        <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#555" }}>Artículos relacionados</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {RELATED.map((r, i) => (
          <a
            key={i}
            href={`/articulo/${r.slug}`}
            className="block p-4 rounded-lg transition-all duration-200"
            style={{ background: "#141414", border: "1px solid #1E1E1E", textDecoration: "none" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2A2A2A"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1E1E1E"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}
          >
            <span className="badge-accent mb-2 inline-block" style={{ fontSize: "0.6rem" }}>{r.cluster}</span>
            <h4 className="text-sm font-semibold leading-snug mb-2" style={{ color: "#E8E8E8" }}>{r.title}</h4>
            <div className="flex items-center gap-1 text-xs" style={{ color: "#444" }}>
              <Clock size={10} /><span>{r.readTime} min</span>
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
  const [ratingStats, setRatingStats] = useState<RatingStats>({ total: 47, count: 12 });
  const contentRef = useRef<HTMLDivElement>(null);

  // Cargar stats de valoración para el schema
  useEffect(() => {
    try {
      const savedStats = localStorage.getItem(RATING_STATS_KEY);
      if (savedStats) setRatingStats(JSON.parse(savedStats));
    } catch {}
  }, []);

  // Detectar sección activa al hacer scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => { if (entry.isIntersecting) setActiveId(entry.target.id); });
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    TOC_ITEMS.forEach(item => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const avgRating = ratingStats.count > 0 ? ratingStats.total / ratingStats.count : 0;

  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh", fontFamily: "'Open Sans', sans-serif" }}>
      {/* Schema JSON-LD */}
      <ArticleSchema ratingValue={avgRating} ratingCount={ratingStats.count} />

      {/* Barra de progreso */}
      <ReadingProgress />

      {/* Navbar */}
      <ArticleNavbar />

      {/* TOC móvil flotante */}
      <div className="lg:hidden fixed bottom-20 right-6 z-40">
        <button
          onClick={() => setMobileTocOpen(!mobileTocOpen)}
          className="flex items-center justify-center rounded-full transition-all duration-200"
          style={{ width: 44, height: 44, background: "#141414", border: "1px solid #2A2A2A", color: "#B5E853" }}
          aria-label="Índice de contenidos"
        >
          <AlignLeft size={18} />
        </button>
        {mobileTocOpen && (
          <div className="absolute bottom-14 right-0 w-72 rounded-xl overflow-hidden"
            style={{ background: "#111", border: "1px solid #2A2A2A", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}>
            <TableOfContents items={TOC_ITEMS} activeId={activeId} collapsed={false} onToggle={() => setMobileTocOpen(false)} />
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
                onMouseLeave={e => (e.currentTarget.style.color = "#444")}>Inicio</a>
              <ChevronRight size={10} style={{ color: "#2A2A2A" }} />
              <a href="/#clusteres" className="text-xs transition-colors duration-200" style={{ color: "#444" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
                onMouseLeave={e => (e.currentTarget.style.color = "#444")}>{ARTICLE.cluster}</a>
              <ChevronRight size={10} style={{ color: "#2A2A2A" }} />
              <span className="text-xs" style={{ color: "#666" }}>
                {ARTICLE.title.length > 40 ? ARTICLE.title.slice(0, 40) + "…" : ARTICLE.title}
              </span>
            </nav>

            {/* Cluster badge */}
            <div className="mb-4"><span className="badge-accent">{ARTICLE.cluster}</span></div>

            {/* Título */}
            <h1 className="font-bold leading-tight mb-4" style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", color: "#F0F0F0", letterSpacing: "-0.025em" }}>
              {ARTICLE.title}
            </h1>

            {/* Descripción */}
            <p className="mb-6 leading-relaxed" style={{ fontSize: 15, color: "#888" }}>{ARTICLE.description}</p>

            {/* Meta bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-8"
              style={{ borderTop: "1px solid #1A1A1A", borderBottom: "1px solid #1A1A1A" }}>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "rgba(181,232,83,0.12)", color: "#B5E853" }}>
                    {ARTICLE.author.charAt(0)}
                  </div>
                  <span className="text-xs font-medium" style={{ color: "#888" }}>{ARTICLE.author}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "#555" }}>
                  <Calendar size={11} /><span>{ARTICLE.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "#555" }}>
                  <Clock size={11} /><span>{ARTICLE.readTime} min de lectura</span>
                </div>
                {/* Rating inline en meta bar */}
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(s => (
                      <Star key={s} size={10}
                        fill={s <= Math.round(avgRating) ? "#B5E853" : "transparent"}
                        style={{ color: s <= Math.round(avgRating) ? "#B5E853" : "#333" }} />
                    ))}
                  </div>
                  <span className="text-xs" style={{ color: "#555" }}>
                    {avgRating.toFixed(1)} ({ratingStats.count})
                  </span>
                </div>
              </div>
              {/* Controles */}
              <div className="flex items-center gap-2">
                <FontSizeControl size={fontSize} onChange={setFontSize} />
                <InlineShareButton />
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {ARTICLE.tags.map(tag => (
                <span key={tag} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                  style={{ background: "#141414", color: "#555", border: "1px solid #1E1E1E" }}>
                  <Tag size={9} />{tag}
                </span>
              ))}
            </div>

            {/* TOC móvil inline */}
            <div className="lg:hidden mb-8">
              <TableOfContents items={TOC_ITEMS} activeId={activeId} collapsed={tocCollapsed} onToggle={() => setTocCollapsed(!tocCollapsed)} />
            </div>

            {/* Contenido */}
            <div ref={contentRef}>
              <ArticleContent fontSize={fontSize} />
            </div>

            {/* Valoración inline al final del contenido */}
            <InlineStarRating />

            {/* Artículos relacionados */}
            <RelatedArticles />

            {/* CTA final */}
            <div className="mt-8 p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{ background: "linear-gradient(135deg, #141414 0%, #111 100%)", border: "1px solid #1E1E1E", borderLeft: "4px solid #B5E853" }}>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: "#E8E8E8" }}>¿Buscas medios para tus backlinks tier 1?</p>
                <p className="text-xs" style={{ color: "#666" }}>Más de 20.000 medios verificados con métricas transparentes en Getalink.</p>
              </div>
              <a href="https://www.getalink.com" rel="nofollow" target="_blank"
                className="btn-primary flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold">
                Ver plataforma <ExternalLink size={13} />
              </a>
            </div>
          </main>

          {/* ── Sidebar sticky ── */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-4">
              {/* TOC */}
              <TableOfContents items={TOC_ITEMS} activeId={activeId} collapsed={tocCollapsed} onToggle={() => setTocCollapsed(!tocCollapsed)} />

              {/* Tamaño de texto */}
              <div className="rounded-xl p-4" style={{ background: "#111111", border: "1px solid #1E1E1E" }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#555" }}>Tamaño de texto</p>
                <FontSizeControl size={fontSize} onChange={setFontSize} />
              </div>

              {/* Compartir en redes */}
              <SocialShareBlock title={ARTICLE.title} />

              {/* Valoración */}
              <StarRating />

              {/* CTA sidebar */}
              <div className="rounded-xl p-4" style={{ background: "#111111", border: "1px solid #1E1E1E" }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#555" }}>Plataforma recomendada</p>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: "#444" }}>Medios verificados para ejecutar tu estrategia de link building.</p>
                <a href="https://www.getalink.com" rel="nofollow" target="_blank"
                  className="btn-primary w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-semibold">
                  getalink.com <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "#080808", borderTop: "1px solid #141414" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <a href="/" style={{ textDecoration: "none" }}><Logo size="sm" /></a>
          <p className="text-xs" style={{ color: "#2A2A2A" }}>© {new Date().getFullYear()} ComprarBacklinks — Contenido editorial independiente</p>
          <a href="https://www.getalink.com" rel="nofollow" target="_blank"
            className="text-xs flex items-center gap-1 transition-colors duration-200" style={{ color: "#333" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")}
            onMouseLeave={e => (e.currentTarget.style.color = "#333")}>
            Powered by getalink.com <ExternalLink size={10} />
          </a>
        </div>
      </footer>
    </div>
  );
}
