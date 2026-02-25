/**
 * Hook para inyectar meta tags dinámicos en el <head> del documento.
 * Usado en ArticlePage y ClusterPage para SEO on-page.
 */
import { useEffect } from "react";

interface DocumentMetaOptions {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: "article" | "website";
}

export function useDocumentMeta({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "article",
}: DocumentMetaOptions) {
  useEffect(() => {
    // Title
    if (title) {
      document.title = title;
    }

    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    const setLink = (rel: string, href: string) => {
      let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement("link");
        el.setAttribute("rel", rel);
        document.head.appendChild(el);
      }
      el.setAttribute("href", href);
    };

    if (description) {
      setMeta("description", description);
      setMeta("og:description", ogDescription || description, true);
      setMeta("twitter:description", ogDescription || description);
    }

    if (title) {
      setMeta("og:title", ogTitle || title, true);
      setMeta("twitter:title", ogTitle || title);
    }

    if (ogImage) {
      setMeta("og:image", ogImage, true);
      setMeta("twitter:image", ogImage);
      setMeta("twitter:card", "summary_large_image");
    }

    if (ogType) {
      setMeta("og:type", ogType, true);
    }

    setMeta("og:site_name", "Comprar Linkbuilding", true);

    if (canonical) {
      setLink("canonical", canonical);
    }

    // Cleanup: restaurar título al salir de la página
    return () => {
      document.title = "Comprar Link Building | Enlaces SEO, PR & Reputación";
    };
  }, [title, description, canonical, ogTitle, ogDescription, ogImage, ogType]);
}
