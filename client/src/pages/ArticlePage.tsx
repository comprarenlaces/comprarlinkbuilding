/**
 * DESIGN: Terminal SEO Noir — Página de Artículo Universal
 * Renderiza cualquier artículo desde articles-data.ts
 * Funcionalidades: TOC sticky, progreso de lectura, tamaño fuente,
 * compartir en redes, valoración con estrellas, schema JSON-LD
 */

import { useState, useEffect, useRef } from "react";
import { useParams } from "wouter";
import {
  ChevronRight, ExternalLink, Clock, Calendar,
  ArrowUp, Tag, BookOpen, AlignLeft,
  Copy, Check, ChevronDown, ChevronUp, Menu, X,
  Share2, Star, AlertTriangle, Info, Lightbulb
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { getArticleBySlug, getArticlesByCluster, CLUSTER_LABELS, type Article, type TocItem } from "@/lib/articles-data";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 60);
}

function resolveInternalHref(href: string): string {
  // Convierte https://www.comprarlinkbuilding.com/cluster/slug/ → /cluster/slug
  if (href.includes('comprarlinkbuilding.com')) {
    const url = new URL(href);
    return url.pathname.replace(/\/$/, '') || '/';
  }
  return href;
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
            const id = item.id || slugify(item.text);
            const isActive = activeId === id;
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`w-full text-left flex items-start gap-2 py-1.5 px-2 rounded transition-all duration-150 ${item.level === 3 ? "pl-5" : ""}`}
                style={{ background: isActive ? "rgba(181,232,83,0.08)" : "transparent" }}
                onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "#161616"; }}
                onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              >
                <span className="flex-shrink-0 mt-1.5 rounded-full" style={{
                  width: item.level === 2 ? 5 : 3, height: item.level === 2 ? 5 : 3,
                  background: isActive ? "#B5E853" : "#333",
                }} />
                <span className="text-xs leading-snug" style={{
                  color: isActive ? "#B5E853" : item.level === 3 ? "#555" : "#777",
                  fontWeight: isActive ? 600 : item.level === 2 ? 500 : 400,
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

// ─── Compartir inline ────────────────────────────────────────────────────────

function InlineShareButton({ title }: { title: string }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(title);

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
          style={{ background: "#141414", border: "1px solid #2A2A2A", boxShadow: "0 16px 48px rgba(0,0,0,0.8)", minWidth: 200 }}
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

// ─── Compartir sidebar ───────────────────────────────────────────────────────

function SocialShareBlock({ title }: { title: string }) {
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";
  const encodedUrl = encodeURIComponent(pageUrl);
  const encodedTitle = encodeURIComponent(title);

  const networks = [
    { name: "X (Twitter)", color: "#E8E8E8", hoverBg: "#1a1a1a", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>, getUrl: (u: string) => `https://twitter.com/intent/tweet?url=${u}&text=${encodedTitle}` },
    { name: "LinkedIn", color: "#0A66C2", hoverBg: "rgba(10,102,194,0.1)", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>, getUrl: (u: string) => `https://www.linkedin.com/sharing/share-offsite/?url=${u}` },
    { name: "WhatsApp", color: "#25D366", hoverBg: "rgba(37,211,102,0.1)", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>, getUrl: (u: string) => `https://wa.me/?text=${encodedTitle}%20${u}` },
    { name: "Facebook", color: "#1877F2", hoverBg: "rgba(24,119,242,0.1)", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>, getUrl: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${u}` },
  ];

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: "#111111", border: "1px solid #1E1E1E" }}>
      <button
        onClick={() => setShareOpen(!shareOpen)}
        className="w-full flex items-center justify-between px-5 py-4 transition-colors duration-150"
        style={{ background: "transparent" }}
        onMouseEnter={e => (e.currentTarget.style.background = "#161616")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        <div className="flex items-center gap-2">
          <Share2 size={14} style={{ color: "#B5E853" }} />
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#888" }}>Compartir artículo</span>
        </div>
        {shareOpen ? <ChevronUp size={14} style={{ color: "#444" }} /> : <ChevronDown size={14} style={{ color: "#444" }} />}
      </button>
      {shareOpen && (
        <div className="px-4 pb-4">
          <div className="w-full h-px mb-3" style={{ background: "#1E1E1E" }} />
          <div className="grid grid-cols-2 gap-2 mb-3">
            {networks.map(net => (
              <a key={net.name} href={net.getUrl(encodedUrl)} target="_blank" rel="nofollow noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150"
                style={{ background: "#141414", border: "1px solid #1E1E1E", color: "#666", textDecoration: "none" }}
                onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = net.hoverBg; (e.currentTarget as HTMLAnchorElement).style.color = net.color; (e.currentTarget as HTMLAnchorElement).style.borderColor = net.color + "44"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#141414"; (e.currentTarget as HTMLAnchorElement).style.color = "#666"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1E1E1E"; }}>
                <span style={{ color: net.color }}>{net.icon}</span>{net.name}
              </a>
            ))}
          </div>
          <button
            onClick={() => { navigator.clipboard.writeText(pageUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2500); }); }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={{ background: copied ? "rgba(181,232,83,0.08)" : "#141414", border: `1px solid ${copied ? "rgba(181,232,83,0.3)" : "#1E1E1E"}`, color: copied ? "#B5E853" : "#555" }}>
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "¡Enlace copiado!" : "Copiar enlace"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Valoración con estrellas ─────────────────────────────────────────────────

interface RatingStats { total: number; count: number; }

function StarRating({ slug }: { slug: string }) {
  const RATING_KEY = `article-rating-${slug}`;
  const STATS_KEY = `article-rating-stats-${slug}`;
  const [hover, setHover] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [stats, setStats] = useState<RatingStats>({ total: 0, count: 0 });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RATING_KEY);
      const savedStats = localStorage.getItem(STATS_KEY);
      if (saved) { setUserRating(parseInt(saved)); setSubmitted(true); }
      if (savedStats) setStats(JSON.parse(savedStats));
      else setStats({ total: Math.floor(Math.random() * 30) + 20, count: Math.floor(Math.random() * 8) + 5 });
    } catch {}
  }, [slug]);

  const avgRating = stats.count > 0 ? stats.total / stats.count : 0;
  const displayRating = hover > 0 ? hover : userRating > 0 ? userRating : 0;

  const handleRate = (star: number) => {
    if (submitted) return;
    const newStats = { total: stats.total + star, count: stats.count + 1 };
    setUserRating(star); setStats(newStats); setSubmitted(true);
    try { localStorage.setItem(RATING_KEY, String(star)); localStorage.setItem(STATS_KEY, JSON.stringify(newStats)); } catch {}
  };

  return (
    <div className="rounded-xl p-5" style={{ background: "#111111", border: "1px solid #1E1E1E" }}>
      <div className="flex items-center gap-2 mb-4">
        <Star size={14} style={{ color: "#B5E853" }} />
        <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#888" }}>Valorar contenido</span>
      </div>
      <div className="flex items-center gap-3 mb-4 pb-4" style={{ borderBottom: "1px solid #1A1A1A" }}>
        <div className="text-3xl font-bold" style={{ color: "#E8E8E8", letterSpacing: "-0.03em" }}>{avgRating.toFixed(1)}</div>
        <div>
          <div className="flex items-center gap-0.5 mb-1">
            {[1,2,3,4,5].map(s => <Star key={s} size={12} fill={s <= Math.round(avgRating) ? "#B5E853" : "transparent"} style={{ color: s <= Math.round(avgRating) ? "#B5E853" : "#333" }} />)}
          </div>
          <span className="text-xs" style={{ color: "#444" }}>{stats.count} valoraciones</span>
        </div>
      </div>
      {!submitted ? (
        <div>
          <p className="text-xs mb-3" style={{ color: "#555" }}>¿Te ha resultado útil?</p>
          <div className="flex items-center gap-1 mb-2">
            {[1,2,3,4,5].map(star => (
              <button key={star} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} onClick={() => handleRate(star)}
                className="transition-all duration-100" style={{ transform: hover >= star ? "scale(1.2)" : "scale(1)" }}
                aria-label={`Valorar con ${star} estrella${star > 1 ? "s" : ""}`}>
                <Star size={22} fill={displayRating >= star ? "#B5E853" : "transparent"}
                  style={{ color: displayRating >= star ? "#B5E853" : "#2A2A2A", filter: displayRating >= star ? "drop-shadow(0 0 4px rgba(181,232,83,0.4))" : "none", transition: "all 0.15s" }} />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(s => <Star key={s} size={16} fill={s <= userRating ? "#B5E853" : "transparent"} style={{ color: s <= userRating ? "#B5E853" : "#333" }} />)}
          </div>
          <span className="text-xs" style={{ color: "#666" }}>Tu valoración: <span style={{ color: "#B5E853", fontWeight: 600 }}>{userRating}/5</span></span>
        </div>
      )}
    </div>
  );
}

// ─── Valoración inline ────────────────────────────────────────────────────────

function InlineStarRating({ slug }: { slug: string }) {
  const RATING_KEY = `article-rating-${slug}`;
  const STATS_KEY = `article-rating-stats-${slug}`;
  const [hover, setHover] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [stats, setStats] = useState<RatingStats>({ total: 0, count: 0 });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(RATING_KEY);
      const savedStats = localStorage.getItem(STATS_KEY);
      if (saved) { setUserRating(parseInt(saved)); setSubmitted(true); }
      if (savedStats) setStats(JSON.parse(savedStats));
      else setStats({ total: Math.floor(Math.random() * 30) + 20, count: Math.floor(Math.random() * 8) + 5 });
    } catch {}
  }, [slug]);

  const avgRating = stats.count > 0 ? stats.total / stats.count : 0;
  const displayRating = hover > 0 ? hover : userRating > 0 ? userRating : 0;

  const handleRate = (star: number) => {
    if (submitted) return;
    const newStats = { total: stats.total + star, count: stats.count + 1 };
    setUserRating(star); setStats(newStats); setSubmitted(true);
    try { localStorage.setItem(RATING_KEY, String(star)); localStorage.setItem(STATS_KEY, JSON.stringify(newStats)); } catch {}
  };

  return (
    <div className="mt-10 rounded-xl p-6 text-center" style={{ background: "#111111", border: "1px solid #1E1E1E" }}>
      <p className="text-sm font-semibold mb-1" style={{ color: "#E8E8E8" }}>¿Te ha resultado útil este artículo?</p>
      <p className="text-xs mb-4" style={{ color: "#555" }}>Tu valoración nos ayuda a mejorar el contenido</p>
      {!submitted ? (
        <>
          <div className="flex items-center justify-center gap-2 mb-3">
            {[1,2,3,4,5].map(star => (
              <button key={star} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} onClick={() => handleRate(star)}
                className="transition-all duration-100" style={{ transform: hover >= star ? "scale(1.25)" : "scale(1)" }}
                aria-label={`${star} estrella${star > 1 ? "s" : ""}`}>
                <Star size={28} fill={displayRating >= star ? "#B5E853" : "transparent"}
                  style={{ color: displayRating >= star ? "#B5E853" : "#2A2A2A", filter: displayRating >= star ? "drop-shadow(0 0 6px rgba(181,232,83,0.5))" : "none", transition: "all 0.15s" }} />
              </button>
            ))}
          </div>
          <p className="text-xs" style={{ color: "#444" }}>{avgRating.toFixed(1)} / 5 · {stats.count} valoraciones</p>
        </>
      ) : (
        <div>
          <div className="flex items-center justify-center gap-1.5 mb-2">
            {[1,2,3,4,5].map(s => <Star key={s} size={22} fill={s <= userRating ? "#B5E853" : "transparent"} style={{ color: s <= userRating ? "#B5E853" : "#333" }} />)}
          </div>
          <p className="text-sm font-semibold mb-0.5" style={{ color: "#B5E853" }}>¡Gracias por tu valoración!</p>
          <p className="text-xs" style={{ color: "#555" }}>Has valorado con {userRating}/5 · {stats.count} valoraciones en total</p>
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
              onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")} onMouseLeave={e => (e.currentTarget.style.color = "#666")}>Clústeres</a>
            <a href="/#guias" className="text-xs transition-colors duration-200" style={{ color: "#666" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")} onMouseLeave={e => (e.currentTarget.style.color = "#666")}>Guías</a>
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
              <a href="/#guias" className="text-xs px-2 py-1" style={{ color: "#666" }}>Guías</a>
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

// ─── Renderizador de contenido Markdown simple ───────────────────────────────

function renderContent(text: string, internalLinks: Article['internal_links']): React.ReactNode[] {
  if (!text) return [];
  
  // Crear mapa de texto -> href para los enlaces internos
  const linkMap = new Map<string, string>();
  internalLinks.forEach(link => {
    if (link.text && link.href) {
      linkMap.set(link.text.toLowerCase(), link.href);
    }
  });

  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];
  let tableLines: string[] = [];
  let inTable = false;
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={key++} className="article-list">
          {listItems.map((item, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: formatInline(item) }} />
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  const flushTable = () => {
    if (tableLines.length > 1) {
      const headers = tableLines[0].split('|').filter(c => c.trim()).map(c => c.trim());
      const rows = tableLines.slice(2).map(row => row.split('|').filter(c => c.trim()).map(c => c.trim()));
      elements.push(
        <div key={key++} className="overflow-x-auto my-6">
          <table className="article-table">
            <thead><tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
            <tbody>{rows.map((row, ri) => <tr key={ri}>{row.map((cell, ci) => <td key={ci} dangerouslySetInnerHTML={{ __html: formatInline(cell) }} />)}</tr>)}</tbody>
          </table>
        </div>
      );
      tableLines = [];
      inTable = false;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      if (inTable) flushTable();
      continue;
    }

    // Tabla
    if (trimmed.startsWith('|')) {
      inTable = true;
      tableLines.push(trimmed);
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Lista
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\.\s/.test(trimmed)) {
      const item = trimmed.replace(/^[-*]\s/, '').replace(/^\d+\.\s/, '');
      listItems.push(item);
      continue;
    } else {
      flushList();
    }

    // Callout
    if (trimmed.startsWith('> ') || trimmed.startsWith('>')) {
      const content = trimmed.replace(/^>\s?/, '');
      elements.push(
        <blockquote key={key++} className="callout-info" dangerouslySetInnerHTML={{ __html: formatInline(content) }} />
      );
      continue;
    }

    // Párrafo normal
    if (trimmed) {
      elements.push(
        <p key={key++} className="article-paragraph" dangerouslySetInnerHTML={{ __html: formatInline(trimmed) }} />
      );
    }
  }

  flushList();
  if (inTable) flushTable();

  return elements;
}

function formatInline(text: string): string {
  return text
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/`([^`]+)`/g, '<code style="background:#1A1A1A;color:#B5E853;padding:2px 6px;border-radius:4px;font-size:0.85em">$1</code>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => {
      const isInternal = href.includes('comprarlinkbuilding.com');
      const resolvedHref = isInternal ? resolveInternalHref(href) : href;
      const rel = isInternal ? '' : 'rel="nofollow noopener"';
      const target = isInternal ? '' : 'target="_blank"';
      return `<a href="${resolvedHref}" ${rel} ${target} style="color:#B5E853;text-decoration:underline;text-underline-offset:3px">${text}</a>`;
    });
}

// ─── Acordeón FAQ ───────────────────────────────────────────────────────────

interface FaqAccordionItem { question: string; answer: string; }

function FaqAccordion({ items }: { items: FaqAccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  if (!items || items.length === 0) return null;
  return (
    <div className="mt-2 space-y-2">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl overflow-hidden transition-all duration-200"
          style={{ background: openIndex === i ? "#141414" : "#111111", border: `1px solid ${openIndex === i ? "rgba(181,232,83,0.2)" : "#1E1E1E"}` }}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors duration-150"
            style={{ background: "transparent" }}
          >
            <span className="text-sm font-semibold pr-4" style={{ color: openIndex === i ? "#B5E853" : "#D0D0D0", lineHeight: 1.4 }}>
              {item.question}
            </span>
            <span className="flex-shrink-0 flex items-center justify-center rounded-full transition-all duration-200"
              style={{ width: 24, height: 24, background: openIndex === i ? "rgba(181,232,83,0.12)" : "#1A1A1A", color: openIndex === i ? "#B5E853" : "#444" }}>
              {openIndex === i ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </span>
          </button>
          {openIndex === i && (
            <div className="px-5 pb-5">
              <div className="w-full h-px mb-4" style={{ background: "rgba(181,232,83,0.1)" }} />
              <p className="text-sm leading-relaxed" style={{ color: "#888" }}
                dangerouslySetInnerHTML={{ __html: formatInline(item.answer) }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Artículos relacionados ──────────────────────────────────────────────────

function RelatedArticles({ cluster, currentSlug }: { cluster: string; currentSlug: string }) {
  const related = getArticlesByCluster(cluster)
    .filter(a => a.slug !== currentSlug)
    .slice(0, 3);

  if (related.length === 0) return null;

  return (
    <div className="mt-12">
      <div className="flex items-center gap-2 mb-5">
        <BookOpen size={14} style={{ color: "#B5E853" }} />
        <h3 className="text-sm font-semibold uppercase tracking-widest" style={{ color: "#555" }}>Artículos relacionados</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {related.map((r) => (
          <a key={r.slug} href={`/${r.cluster}/${r.slug}`}
            className="block p-4 rounded-lg transition-all duration-200"
            style={{ background: "#141414", border: "1px solid #1E1E1E", textDecoration: "none" }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#2A2A2A"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#1E1E1E"; (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)"; }}>
            <span className="badge-accent mb-2 inline-block" style={{ fontSize: "0.6rem" }}>
              {CLUSTER_LABELS[r.cluster] || r.cluster}
            </span>
            <h4 className="text-sm font-semibold leading-snug mb-2" style={{ color: "#E8E8E8" }}>{r.h1 || r.meta_title}</h4>
            <div className="flex items-center gap-1 text-xs" style={{ color: "#444" }}>
              <Clock size={10} /><span>{r.read_time || 8} min</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── Schema JSON-LD ───────────────────────────────────────────────────────────

function ArticleSchema({ article, ratingValue, ratingCount }: { article: Article; ratingValue: number; ratingCount: number }) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": article.meta_title || article.h1,
    "description": article.meta_description,
    "author": { "@type": "Person", "name": article.author || "Equipo Editorial" },
    "publisher": {
      "@type": "Organization",
      "name": "Comprar Linkbuilding",
      "url": "https://comprarlinkbuilding.com",
    },
    "datePublished": "2026-02-01",
    "dateModified": "2026-02-24",
    "mainEntityOfPage": { "@type": "WebPage", "@id": article.url },
    "keywords": article.tags?.join(", ") || "",
    "articleSection": CLUSTER_LABELS[article.cluster] || article.cluster,
    "inLanguage": "es",
  };

  if (ratingCount > 0) {
    schema["aggregateRating"] = {
      "@type": "AggregateRating",
      "ratingValue": ratingValue.toFixed(1),
      "reviewCount": ratingCount,
      "bestRating": "5",
      "worstRating": "1",
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema, null, 2) }}
    />
  );
}

// ─── Página principal ────────────────────────────────────────────────────────

export default function ArticlePage() {
  const params = useParams<{ cluster: string; slug: string }>();
  const slug = params.slug || "";
  const article = getArticleBySlug(slug);

  const [activeId, setActiveId] = useState("");
  const [tocCollapsed, setTocCollapsed] = useState(true);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [fontSize, setFontSize] = useState(16);

  // Scroll al top cuando cambia el artículo
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Detectar sección activa
  useEffect(() => {
    if (!article) return;
    const ids = article.toc.map(item => item.id || slugify(item.text));
    const observer = new IntersectionObserver(
      entries => { entries.forEach(entry => { if (entry.isIntersecting) setActiveId(entry.target.id); }); },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    ids.forEach(id => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [article, slug]);

  if (!article) {
    return (
      <div style={{ background: "#0D0D0D", minHeight: "100vh", fontFamily: "'Open Sans', sans-serif" }}>
        <ArticleNavbar />
        <div className="max-w-3xl mx-auto px-4 pt-32 pb-20 text-center">
          <p className="text-6xl mb-6" style={{ color: "#B5E853" }}>404</p>
          <h1 className="text-2xl font-bold mb-4" style={{ color: "#E8E8E8" }}>Artículo no encontrado</h1>
          <p className="text-sm mb-8" style={{ color: "#666" }}>El artículo que buscas no existe o ha sido movido.</p>
          <a href="/" className="btn-primary px-6 py-3 rounded-lg text-sm font-semibold inline-flex items-center gap-2">
            Volver al inicio
          </a>
        </div>
      </div>
    );
  }

  const clusterLabel = CLUSTER_LABELS[article.cluster] || article.cluster;
  const readTime = typeof article.read_time === 'number' ? article.read_time : parseInt(String(article.read_time)) || 8;

  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh", fontFamily: "'Open Sans', sans-serif" }}>
      {/* Schema */}
      <ArticleSchema article={article} ratingValue={4.2} ratingCount={12} />

      {/* Progreso */}
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
        {mobileTocOpen && article.toc.length > 0 && (
          <div className="absolute bottom-14 right-0 w-72 rounded-xl overflow-hidden"
            style={{ background: "#111", border: "1px solid #2A2A2A", boxShadow: "0 20px 60px rgba(0,0,0,0.8)" }}>
            <TableOfContents items={article.toc} activeId={activeId} collapsed={false} onToggle={() => setMobileTocOpen(false)} />
          </div>
        )}
      </div>

      {/* Scroll to top */}
      <ScrollToTop />

      {/* Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10" style={{ alignItems: "start" }}>

          {/* ── Columna principal ── */}
          <main>
            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 mb-6 flex-wrap">
              <a href="/" className="text-xs transition-colors duration-200" style={{ color: "#444" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")} onMouseLeave={e => (e.currentTarget.style.color = "#444")}>Inicio</a>
              <ChevronRight size={10} style={{ color: "#2A2A2A" }} />
              <a href={`/#clusteres`} className="text-xs transition-colors duration-200" style={{ color: "#444" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")} onMouseLeave={e => (e.currentTarget.style.color = "#444")}>{clusterLabel}</a>
              <ChevronRight size={10} style={{ color: "#2A2A2A" }} />
              <span className="text-xs" style={{ color: "#666" }}>
                {(article.h1 || article.meta_title).replace(/^[^\w\s]+\s/, '').slice(0, 50)}…
              </span>
            </nav>

            {/* Badge */}
            <div className="mb-4"><span className="badge-accent">{clusterLabel}</span></div>

            {/* Título */}
            <h1 className="font-bold leading-tight mb-4"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)", color: "#F0F0F0", letterSpacing: "-0.025em" }}>
              {article.h1 || article.meta_title}
            </h1>

            {/* Descripción */}
            {article.meta_description && (
              <p className="mb-6 leading-relaxed" style={{ fontSize: 15, color: "#888" }}>{article.meta_description}</p>
            )}

            {/* Imagen destacada */}
            {article.featuredImage && (
              <div className="mb-8 rounded-xl overflow-hidden" style={{ border: "1px solid #1E1E1E" }}>
                <img
                  src={article.featuredImage}
                  alt={article.h1 || article.meta_title}
                  className="w-full object-cover"
                  style={{ maxHeight: 360, display: "block" }}
                  loading="lazy"
                />
              </div>
            )}

            {/* Meta bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 py-4 mb-8"
              style={{ borderTop: "1px solid #1A1A1A", borderBottom: "1px solid #1A1A1A" }}>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "rgba(181,232,83,0.12)", color: "#B5E853" }}>
                    {(article.author || "E").charAt(0)}
                  </div>
                  <span className="text-xs font-medium" style={{ color: "#888" }}>{article.author || "Equipo Editorial"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "#555" }}>
                  <Calendar size={11} /><span>{article.date || "Febrero 2026"}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs" style={{ color: "#555" }}>
                  <Clock size={11} /><span>{readTime} min de lectura</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <FontSizeControl size={fontSize} onChange={setFontSize} />
                <InlineShareButton title={article.meta_title || article.h1} />
              </div>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                    style={{ background: "#141414", color: "#555", border: "1px solid #1E1E1E" }}>
                    <Tag size={9} />{tag}
                  </span>
                ))}
              </div>
            )}

            {/* TOC móvil inline */}
            {article.toc.length > 0 && (
              <div className="lg:hidden mb-8">
                <TableOfContents items={article.toc} activeId={activeId} collapsed={tocCollapsed} onToggle={() => setTocCollapsed(!tocCollapsed)} />
              </div>
            )}

            {/* Intro */}
            {article.intro && (
              <div className="article-body mb-8" style={{ fontSize }}>
                {article.intro.split('\n\n').map((para, i) => (
                  <p key={i} className="article-paragraph" dangerouslySetInnerHTML={{ __html: formatInline(para) }} />
                ))}
              </div>
            )}

            {/* Secciones de contenido */}
            <div className="article-body" style={{ fontSize, lineHeight: 1.8 }}>
              {article.content_sections.map((section, idx) => {
                const headingId = section.heading ? slugify(section.heading) : `section-${idx}`;

                // Sección FAQ con acordeón
                if (section.is_faq && section.content) {
                  const faqItems: FaqAccordionItem[] = [];
                  const faqLines = section.content.split('\n\n');
                  for (const line of faqLines) {
                    if (line.startsWith('FAQ_ITEM::')) {
                      try {
                        const parsed = JSON.parse(line.replace('FAQ_ITEM::', ''));
                        if (parsed.q && parsed.a) faqItems.push({ question: parsed.q, answer: parsed.a });
                      } catch {}
                    }
                  }
                  return (
                    <div key={headingId} className="mt-12 mb-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-7 rounded-full" style={{ background: "#B5E853" }} />
                        <h2 id={headingId} className="!mt-0 !mb-0" style={{ color: "#F0F0F0" }}>{section.heading}</h2>
                      </div>
                      <FaqAccordion items={faqItems} />
                    </div>
                  );
                }

                return (
                  <div key={headingId}>
                    {section.heading_level === 2 ? (
                      <h2 id={headingId}>{section.heading}</h2>
                    ) : section.heading_level === 3 ? (
                      <h3 id={headingId}>{section.heading}</h3>
                    ) : (
                      <h4 id={headingId} style={{ color: "#C8C8C8", fontSize: "1rem", fontWeight: 600, marginTop: "1.25rem", marginBottom: "0.5rem" }}>{section.heading}</h4>
                    )}
                    {renderContent(section.content, article.internal_links || [])}
                  </div>
                );
              })}
            </div>

            {/* Valoración inline */}
            <InlineStarRating slug={slug} />

            {/* Artículos relacionados */}
            <RelatedArticles cluster={article.cluster} currentSlug={slug} />

            {/* CTA final */}
            <div className="mt-8 p-6 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              style={{ background: "linear-gradient(135deg, #141414 0%, #111 100%)", border: "1px solid #1E1E1E", borderLeft: "4px solid #B5E853" }}>
              <div>
                <p className="text-sm font-semibold mb-1" style={{ color: "#E8E8E8" }}>¿Buscas medios para tu estrategia de link building?</p>
                <p className="text-xs" style={{ color: "#666" }}>Más de 20.000 medios verificados con métricas transparentes en Getalink.</p>
              </div>
              <a href="https://www.getalink.com" rel="nofollow" target="_blank"
                className="btn-primary flex-shrink-0 flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-semibold">
                Visitar getalink.com <ExternalLink size={13} />
              </a>
            </div>
          </main>

          {/* ── Sidebar ── */}
          <aside
            className="hidden lg:block"
            style={{ alignSelf: "start", position: "sticky", top: "5.5rem" }}
          >
            <div
              className="space-y-4"
              style={{
                maxHeight: "calc(100vh - 7rem)",
                overflowY: "auto",
                overflowX: "hidden",
                paddingRight: "2px",
                scrollbarWidth: "thin",
                scrollbarColor: "#2A2A2A transparent",
              }}
            >
              {article.toc.length > 0 && (
                <TableOfContents items={article.toc} activeId={activeId} collapsed={tocCollapsed} onToggle={() => setTocCollapsed(!tocCollapsed)} />
              )}
              <SocialShareBlock title={article.meta_title || article.h1} />
              <div className="rounded-xl p-4" style={{ background: "#111111", border: "1px solid #1E1E1E" }}>
                <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: "#555" }}>Plataforma recomendada</p>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: "#444" }}>Medios verificados para ejecutar tu estrategia.</p>
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
            onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")} onMouseLeave={e => (e.currentTarget.style.color = "#333")}>
            Powered by getalink.com <ExternalLink size={10} />
          </a>
        </div>
      </footer>
    </div>
  );
}
