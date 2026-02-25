/**
 * Logo — "ComprarLinkbuilding"
 * Diseño: todo bold, todo blanco, tipografía limpia y directa
 */

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizes = {
    sm: "0.85rem",
    md: "1rem",
    lg: "1.3rem",
  };

  return (
    <div
      className={`inline-flex items-center select-none ${className}`}
      style={{ lineHeight: 1 }}
    >
      <span
        style={{
          fontFamily: "'Open Sans', sans-serif",
          fontSize: sizes[size],
          fontWeight: 800,
          color: "#FFFFFF",
          letterSpacing: "-0.02em",
          whiteSpace: "nowrap",
        }}
      >
        Comprar<span style={{ color: "#B5E853" }}>Linkbuilding</span>
      </span>
    </div>
  );
}
