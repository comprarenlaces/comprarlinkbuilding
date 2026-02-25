/**
 * Logo — "ComprarLinkbuilding"
 * Diseño: bloque tipográfico compacto sin separadores
 * "Comprar" en weight 300 (light), "Link" en weight 800, "building" en weight 800 + accent verde
 * Sin espacio entre palabras — una sola unidad visual
 */

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizes = {
    sm: { base: "0.82rem", dot: 5 },
    md: { base: "0.95rem", dot: 6 },
    lg: { base: "1.25rem", dot: 8 },
  };

  const s = sizes[size];

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={{ gap: 0, lineHeight: 1 }}
    >
      {/* Indicador accent — cuadrado, no círculo */}
      <span
        style={{
          display: "inline-block",
          width: s.dot,
          height: s.dot,
          background: "#B5E853",
          marginRight: "7px",
          flexShrink: 0,
        }}
      />
      {/* Bloque tipográfico unificado */}
      <span
        style={{
          fontFamily: "'Open Sans', sans-serif",
          fontSize: s.base,
          letterSpacing: "0",
          whiteSpace: "nowrap",
        }}
      >
        {/* "Comprar" — ultralight, gris */}
        <span
          style={{
            fontWeight: 300,
            color: "#888",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontSize: `calc(${s.base} * 0.85)`,
          }}
        >
          Comprar
        </span>
        {/* "Link" — extrabold, blanco */}
        <span
          style={{
            fontWeight: 800,
            color: "#F0F0F0",
            letterSpacing: "-0.03em",
          }}
        >
          Link
        </span>
        {/* "building" — extrabold, verde accent */}
        <span
          style={{
            fontWeight: 800,
            color: "#B5E853",
            letterSpacing: "-0.03em",
          }}
        >
          building
        </span>
      </span>
    </div>
  );
}
