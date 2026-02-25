/**
 * DESIGN: Terminal SEO Noir — Página de Política de Privacidad
 * Fondo oscuro #0D0D0D, acento verde #B5E853, fuente Open Sans
 */

import { useState } from "react";
import { ExternalLink, Menu, X, ChevronRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";

function PrivacyNavbar() {
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

export default function PrivacyPage() {
  useDocumentMeta({
    title: "Política de Privacidad | Comprar Linkbuilding",
    description: "Consulta nuestra política de privacidad y el tratamiento de tus datos personales conforme al RGPD.",
    canonical: "https://comprarlinkbuilding.com/privacidad/",
  });

  const sections = [
    {
      title: "1. Responsable del tratamiento",
      content: `El responsable del tratamiento de los datos personales recabados a través de este sitio web es el titular de comprarlinkbuilding.com, en adelante "el Responsable". Para cualquier consulta relacionada con el tratamiento de tus datos, puedes contactar a través de los canales habilitados en este sitio.`
    },
    {
      title: "2. Datos que recopilamos",
      content: `Este sitio web puede recopilar los siguientes tipos de datos: datos de navegación (dirección IP, tipo de navegador, páginas visitadas, tiempo de permanencia) a través de herramientas de analítica web; y datos que el usuario facilite voluntariamente a través de formularios de contacto, si los hubiera. No se recopilan datos especialmente sensibles.`
    },
    {
      title: "3. Finalidad del tratamiento",
      content: `Los datos de navegación se utilizan exclusivamente para: (a) mejorar la experiencia de usuario y el rendimiento del sitio; (b) elaborar estadísticas de uso anónimas y agregadas; (c) detectar y prevenir fraudes o usos indebidos. Los datos facilitados voluntariamente se utilizan únicamente para atender la consulta o solicitud del usuario.`
    },
    {
      title: "4. Base legal",
      content: `El tratamiento de datos de navegación se basa en el interés legítimo del Responsable para el correcto funcionamiento y mejora del sitio web (art. 6.1.f RGPD). El tratamiento de datos facilitados voluntariamente se basa en el consentimiento del usuario (art. 6.1.a RGPD), que puede ser retirado en cualquier momento sin que ello afecte a la licitud del tratamiento previo.`
    },
    {
      title: "5. Conservación de datos",
      content: `Los datos de navegación se conservan durante un período máximo de 26 meses desde su recogida, conforme a las recomendaciones de las autoridades de protección de datos. Los datos facilitados voluntariamente se conservan durante el tiempo necesario para atender la solicitud y, posteriormente, durante los plazos legales de prescripción aplicables.`
    },
    {
      title: "6. Destinatarios y transferencias internacionales",
      content: `Los datos no se ceden a terceros salvo obligación legal. Algunos proveedores de servicios tecnológicos (como herramientas de analítica) pueden actuar como encargados del tratamiento bajo contrato de encargo conforme al art. 28 RGPD. En caso de que algún proveedor esté ubicado fuera del Espacio Económico Europeo, el Responsable garantiza que la transferencia se realiza con las salvaguardas adecuadas (decisiones de adecuación, cláusulas contractuales tipo, etc.).`
    },
    {
      title: "7. Derechos del usuario",
      content: `El usuario tiene derecho a: acceder a sus datos personales; rectificar datos inexactos; solicitar la supresión cuando los datos ya no sean necesarios; oponerse al tratamiento o solicitar su limitación; solicitar la portabilidad de sus datos; y presentar una reclamación ante la Agencia Española de Protección de Datos (www.aepd.es) si considera que sus derechos han sido vulnerados. Para ejercer estos derechos, el usuario puede contactar con el Responsable a través de los canales disponibles en el sitio.`
    },
    {
      title: "8. Cookies",
      content: `Este sitio web puede utilizar cookies técnicas necesarias para su funcionamiento y cookies analíticas para medir el tráfico de forma anonimizada. Las cookies analíticas solo se instalan si el usuario ha prestado su consentimiento. El usuario puede configurar su navegador para rechazar o eliminar cookies, aunque esto puede afectar a la funcionalidad del sitio. Para más información, consulta nuestra política de cookies.`
    },
    {
      title: "9. Seguridad",
      content: `El Responsable ha adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad de los datos personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado, habida cuenta del estado de la tecnología, la naturaleza de los datos almacenados y los riesgos a que están expuestos.`
    },
    {
      title: "10. Modificaciones",
      content: `El Responsable se reserva el derecho a modificar la presente política de privacidad para adaptarla a novedades legislativas, jurisprudenciales o de práctica empresarial. En caso de modificaciones sustanciales, se informará al usuario a través de los canales habituales. La versión vigente será siempre la publicada en esta página.`
    },
  ];

  return (
    <div style={{ background: "#0D0D0D", minHeight: "100vh", fontFamily: "'Open Sans', sans-serif" }}>
      <PrivacyNavbar />

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
          <span className="text-xs" style={{ color: "#B5E853", fontWeight: 600 }}>Política de Privacidad</span>
        </nav>

        {/* Header */}
        <div className="mb-12">
          <span className="badge-accent mb-4 inline-block">Legal</span>
          <h1 className="font-bold mb-4" style={{ fontSize: "clamp(1.8rem, 4vw, 2.4rem)", color: "#F0F0F0", letterSpacing: "-0.025em", lineHeight: 1.2 }}>
            Política de Privacidad
          </h1>
          <p className="text-sm" style={{ color: "#555" }}>
            Última actualización: {new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
          </p>
          <div className="mt-6 p-4 rounded-lg" style={{ background: "#111", border: "1px solid #1A1A1A", borderLeft: "3px solid #B5E853" }}>
            <p className="text-sm leading-relaxed" style={{ color: "#888" }}>
              En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo (RGPD) y la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD), te informamos sobre el tratamiento de tus datos personales.
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
          <p className="text-xs mb-3" style={{ color: "#555" }}>¿Tienes alguna pregunta sobre el tratamiento de tus datos?</p>
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
            <a href="/aviso-legal" className="text-xs transition-colors duration-200" style={{ color: "#333" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#B5E853")} onMouseLeave={e => (e.currentTarget.style.color = "#333")}>Aviso Legal</a>
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
