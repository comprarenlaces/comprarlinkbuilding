/**
 * DESIGN: Terminal SEO Noir — Página de Aviso Legal
 * Fondo oscuro #0D0D0D, acento verde #B5E853, fuente Open Sans
 */

import { useState } from "react";
import { ExternalLink, Menu, X, ChevronRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

function LegalNavbar() {
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

export default function LegalPage() {
  useDocumentMeta({
    title: "Aviso Legal | Comprar Linkbuilding",
    description: "Aviso legal y condiciones de uso del sitio web comprarlinkbuilding.com conforme a la legislación española y europea.",
    canonical: "https://comprarlinkbuilding.com/aviso-legal/",
  });

  const sections = [
    {
      title: "1. Datos identificativos",
      content: `En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), se informa que el titular del sitio web comprarlinkbuilding.com es el propietario del dominio. Para cualquier consulta o comunicación, puede dirigirse a través de los canales de contacto habilitados en este sitio.`
    },
    {
      title: "2. Objeto y ámbito de aplicación",
      content: `El presente Aviso Legal regula el acceso y uso del sitio web comprarlinkbuilding.com (en adelante, "el Sitio"), así como los contenidos y servicios puestos a disposición de los usuarios. El acceso al Sitio implica la aceptación plena y sin reservas de las presentes condiciones. El titular se reserva el derecho a modificar el presente Aviso Legal en cualquier momento, siendo responsabilidad del usuario su consulta periódica.`
    },
    {
      title: "3. Propiedad intelectual e industrial",
      content: `Todos los contenidos del Sitio, incluyendo textos, imágenes, gráficos, logotipos, iconos, código fuente y cualquier otro elemento, son propiedad del titular o de terceros que han autorizado su uso, y están protegidos por la legislación española e internacional sobre propiedad intelectual e industrial. Queda expresamente prohibida la reproducción, distribución, comunicación pública o transformación de dichos contenidos sin la autorización expresa y por escrito del titular, salvo en los casos previstos por la ley.`
    },
    {
      title: "4. Condiciones de uso",
      content: `El usuario se compromete a hacer un uso lícito y correcto del Sitio, respetando la legislación vigente, la moral, las buenas costumbres y el orden público. Queda prohibido: (a) utilizar el Sitio con fines ilícitos o contrarios a las presentes condiciones; (b) reproducir, copiar, distribuir o modificar los contenidos sin autorización; (c) introducir virus, malware o cualquier otro elemento que pueda dañar los sistemas informáticos del titular o de terceros; (d) utilizar técnicas de scraping masivo o automatizado sin autorización previa.`
    },
    {
      title: "5. Exclusión de responsabilidad",
      content: `El titular no garantiza la disponibilidad continua e ininterrumpida del Sitio, ni la ausencia de errores en los contenidos. El titular no será responsable de los daños y perjuicios que pudieran derivarse de: (a) interrupciones, errores, fallos o indisponibilidad del Sitio; (b) la falta de veracidad, exactitud, exhaustividad o actualidad de los contenidos; (c) el uso que los usuarios hagan de los contenidos del Sitio; (d) la presencia de virus u otros elementos que puedan causar daños en los sistemas informáticos de los usuarios.`
    },
    {
      title: "6. Contenido editorial e independencia",
      content: `Los contenidos publicados en este Sitio tienen carácter exclusivamente informativo y editorial. Las opiniones, análisis y recomendaciones expresadas son independientes y no constituyen asesoramiento profesional. Las referencias a herramientas, plataformas o servicios de terceros (como getalink.com) se realizan con fines informativos y no implican necesariamente una relación comercial, salvo que se indique expresamente lo contrario.`
    },
    {
      title: "7. Enlaces a terceros",
      content: `El Sitio puede contener enlaces a sitios web de terceros. El titular no tiene control sobre dichos sitios ni sobre sus contenidos, y no asume ninguna responsabilidad por los mismos. La inclusión de un enlace no implica la aprobación o recomendación del sitio enlazado. Los enlaces externos se identifican con el atributo rel="nofollow" cuando corresponde, en cumplimiento de las directrices de los motores de búsqueda.`
    },
    {
      title: "8. Legislación aplicable y jurisdicción",
      content: `El presente Aviso Legal se rige por la legislación española. Para la resolución de cualquier controversia derivada del acceso o uso del Sitio, las partes se someten, con renuncia expresa a cualquier otro fuero que pudiera corresponderles, a los Juzgados y Tribunales del domicilio del titular, salvo que la normativa aplicable establezca otro fuero imperativo.`
    },
  ];

  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh", fontFamily: "'Open Sans', sans-serif" }}>
      <LegalNavbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1 mb-8 px-3 py-2 rounded-lg" style={{ background: "#111111", border: "1px solid #1A1A1A", display: "inline-flex" }}>
          <a href="/" className="flex items-center gap-1 text-xs transition-colors duration-200" style={{ color: "#555", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")} onMouseLeave={e => (e.currentTarget.style.color = "#555")}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Inicio
          </a>
          <ChevronRight size={10} style={{ color: "#2A2A2A" }} />
          <span className="text-xs" style={{ color: "#B5E853", fontWeight: 600 }}>Aviso Legal</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <span className="badge-accent mb-4 inline-block">Legal</span>
          <h1 className="font-bold mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", color: "#F0F0F0", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
            Aviso Legal
          </h1>
          <p className="text-sm" style={{ color: "#555" }}>
            Última actualización: {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
          </p>
          <div className="mt-6 p-4 rounded-lg" style={{ background: "#111", border: "1px solid #1A1A1A", borderLeft: "3px solid #B5E853" }}>
            <p className="text-sm leading-relaxed" style={{ color: "#888" }}>
              En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), y demás normativa aplicable, se pone a disposición de los usuarios la siguiente información legal sobre el sitio web comprarlinkbuilding.com.
            </p>
          </div>
        </div>

        {/* Secciones */}
        <div className="space-y-8">
          {sections.map((section, i) => (
            <div key={i} className="pb-8" style={{ borderBottom: i < sections.length - 1 ? "1px solid #141414" : "none" }}>
              <h2 className="font-bold mb-3" style={{ fontSize: "1rem", color: "#B5E853", letterSpacing: "-0.01em" }}>
                {section.title}
              </h2>
              <p className="text-sm leading-relaxed" style={{ color: "#888", textAlign: "justify", textJustify: "inter-word" as const }}>
                {section.content}
              </p>
            </div>
          ))}
        </div>

        {/* CTA footer */}
        <div className="mt-12 p-5 rounded-xl text-center" style={{ background: "#111", border: "1px solid #1A1A1A" }}>
          <p className="text-xs mb-3" style={{ color: "#555" }}>¿Tienes alguna consulta legal?</p>
          <a href="/" className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold">
            Volver al inicio
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "#080808", borderTop: "1px solid #141414" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <a href="/" style={{ textDecoration: "none" }}><Logo size="sm" /></a>
          <p className="text-xs" style={{ color: "#2A2A2A" }}>© {new Date().getFullYear()} ComprarLinkbuilding — Contenido editorial independiente</p>
          <div className="flex items-center gap-4">
            <a href="/privacidad" className="text-xs transition-colors duration-200" style={{ color: "#333" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")} onMouseLeave={e => (e.currentTarget.style.color = "#333")}>Privacidad</a>
            <a href="/aviso-legal" className="text-xs font-semibold" style={{ color: "#B5E853" }}>Aviso Legal</a>
            <a href="https://www.getalink.com" rel="nofollow" target="_blank"
              className="text-xs flex items-center gap-1 transition-colors duration-200" style={{ color: "#333" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")} onMouseLeave={e => (e.currentTarget.style.color = "#333")}>
              getalink.com <ExternalLink size={10} />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
