// AUTO-GENERATED — No editar manualmente
// Datos reescritos con deep research + FAQ + interlinking SEO
// Dividido en clústeres para code splitting WPO

export interface TocItem {
  id: string;
  text: string;
  level: number;
}
export interface ContentSection {
  heading: string;
  heading_level: number;
  content: string;
  is_faq?: boolean;
}
export interface FaqItem {
  question: string;
  answer: string;
}
export interface InternalLink {
  text: string;
  href: string;
}
export interface Article {
  url: string;
  slug: string;
  cluster: string;
  meta_title: string;
  meta_description: string;
  h1: string;
  intro: string;
  toc: TocItem[];
  content_sections: ContentSection[];
  internal_links: InternalLink[];
  tags: string[];
  author: string;
  date: string;
  read_time: number;
  featuredImage?: string;
}

import { ARTICLES_PAISES } from './clusters/paises';
import { ARTICLES_ESTRATEGIA_LINK_BUILDING } from './clusters/estrategia-link-building';
import { ARTICLES_TACTICAS_Y_METODOS } from './clusters/tacticas-y-metodos';
import { ARTICLES_REPUTACION_DE_MARCA } from './clusters/reputacion-de-marca';
import { ARTICLES_AUDITORIAS_Y_ANALISIS } from './clusters/auditorias-y-analisis';
import { ARTICLES_HERRAMIENTAS } from './clusters/herramientas';
import { ARTICLES_SECTORES } from './clusters/sectores';
import { ARTICLES_TENDENCIAS_SEO } from './clusters/tendencias-seo';
import { ARTICLES_RIESGOS_Y_PENALIZACIONES } from './clusters/riesgos-y-penalizaciones';
import { ARTICLES_METRICAS_Y_MEDICION } from './clusters/metricas-y-medicion';
import { ARTICLES_PLANIFICACION_Y_PRESUPUESTO } from './clusters/planificacion-y-presupuesto';
import { ARTICLES_LLMS_Y_BUSQUEDA_GENERATIVA } from './clusters/llms-y-busqueda-generativa';

export const ARTICLES: Article[] = [
  ...ARTICLES_PAISES,
  ...ARTICLES_ESTRATEGIA_LINK_BUILDING,
  ...ARTICLES_TACTICAS_Y_METODOS,
  ...ARTICLES_REPUTACION_DE_MARCA,
  ...ARTICLES_AUDITORIAS_Y_ANALISIS,
  ...ARTICLES_HERRAMIENTAS,
  ...ARTICLES_SECTORES,
  ...ARTICLES_TENDENCIAS_SEO,
  ...ARTICLES_RIESGOS_Y_PENALIZACIONES,
  ...ARTICLES_METRICAS_Y_MEDICION,
  ...ARTICLES_PLANIFICACION_Y_PRESUPUESTO,
  ...ARTICLES_LLMS_Y_BUSQUEDA_GENERATIVA,
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find(a => a.slug === slug);
}
export function getArticlesByCluster(cluster: string): Article[] {
  return ARTICLES.filter(a => a.cluster === cluster);
}
export function getAllSlugs(): string[] {
  return ARTICLES.map(a => a.slug);
}
export const CLUSTER_LABELS: Record<string, string> = {
  'paises': 'Países',
  'estrategia-link-building': 'Estrategia de link building',
  'tacticas-y-metodos': 'Tácticas y Métodos',
  'riesgos-y-penalizaciones': 'Riesgos y Penalizaciones',
  'auditorias-y-analisis': 'Auditorías y Análisis',
  'metricas-y-medicion': 'Métricas y Medición',
  'herramientas': 'Herramientas',
  'sectores': 'Sectores',
  'reputacion-de-marca': 'Reputación de marca',
  'llms-y-busqueda-generativa': 'LLMs y Búsqueda Generativa',
  'planificacion-y-presupuesto': 'Planificación y Presupuesto',
  'tendencias-seo': 'Tendencias SEO',
  // Legacy slugs (backward compat)
  'tacticas-metodos': 'Tácticas y Métodos',
  'reputacion-marca': 'Reputación de marca',
  'auditorias-analisis': 'Auditorías y Análisis',
};
