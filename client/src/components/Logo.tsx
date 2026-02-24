/**
 * Logo — "Comprar Linkbuilding"
 * Diseño: "Comprar" en weight 300 (light), "Linkbuilding" en weight 800 (extrabold)
 * Sin icono: solo tipografía pura con punto de accent verde
 */

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizes = {
    sm: { comprar: "0.7rem", link: "0.85rem", dot: 5 },
    md: { comprar: "0.85rem", link: "1.05rem", dot: 6 },
    lg: { comprar: "1.1rem", link: "1.4rem", dot: 8 },
  };

  const s = sizes[size];

  return (
    <div className={`inline-flex items-baseline gap-0 select-none ${className}`}>
      {/* Punto accent */}
      <span
        style={{
          display: "inline-block",
          width: s.dot,
          height: s.dot,
          borderRadius: "50%",
          background: "#B5E853",
          marginRight: "5px",
          marginBottom: "1px",
          flexShrink: 0,
          alignSelf: "center",
        }}
      />
      {/* "Comprar" — light */}
      <span
        style={{
          fontFamily: "'Open Sans', sans-serif",
          fontWeight: 300,
          fontSize: s.comprar,
          color: "#A0A0A0",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
        }}
      >
        Comprar
      </span>
      {/* Separador */}
      <span style={{ color: "#2A2A2A", fontSize: s.comprar, fontWeight: 300, margin: "0 2px" }}>·</span>
      {/* "Linkbuilding" — extrabold */}
      <span
        style={{
          fontFamily: "'Open Sans', sans-serif",
          fontWeight: 800,
          fontSize: s.link,
          color: "#E8E8E8",
          letterSpacing: "-0.02em",
        }}
      >
        Link<span style={{ color: "#B5E853" }}>building</span>
      </span>
    </div>
  );
}
