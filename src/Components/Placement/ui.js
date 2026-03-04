// pip.ui.jsx — Shared primitive UI components

export function Bar({ pct, color, height = 8 }) {
  return (
    <div
      style={{
        background: "var(--bg4,#222)",
        borderRadius: 99,
        overflow: "hidden",
        height,
      }}
    >
      <div
        style={{
          width: `${Math.min(100, Math.max(0, pct))}%`,
          height: "100%",
          background: color,
          borderRadius: 99,
          transition: "width .6s cubic-bezier(.4,0,.2,1)",
        }}
      />
    </div>
  );
}

export function Tag({ children, color }) {
  return (
    <span
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: ".07em",
        padding: "3px 9px",
        borderRadius: 99,
        background: color + "20",
        color,
        border: `1px solid ${color}44`,
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
      }}
    >
      {children}
    </span>
  );
}

export function Card({ children, style = {}, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        background: "var(--bg2,#111)",
        border: "1px solid var(--border,#333)",
        borderRadius: 16,
        padding: 18,
        cursor: onClick ? "pointer" : undefined,
        transition: onClick ? "border-color .15s" : undefined,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SectionLabel({ children, style = {} }) {
  return (
    <div
      style={{
        fontSize: 11,
        fontWeight: 800,
        letterSpacing: ".1em",
        textTransform: "uppercase",
        color: "var(--txt3,#666)",
        marginBottom: 10,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CompanyLogo({ logo, color, size = 38 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.27),
        background: color,
        color: "#fff",
        fontSize: Math.round(size * 0.35),
        fontWeight: 900,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {logo}
    </div>
  );
}

export const INP_STYLE = {
  width: "100%",
  background: "var(--bg3)",
  border: "1.5px solid var(--border)",
  borderRadius: 10,
  padding: "10px 12px",
  color: "var(--txt)",
  fontSize: 13,
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

export function DifficultyTag({ difficulty }) {
  const color =
    difficulty === "Very Hard"
      ? "#e05252"
      : difficulty === "Hard"
        ? "#e8924a"
        : difficulty === "Easy"
          ? "#4caf7d"
          : "#d4b44a";
  return <Tag color={color}>{difficulty}</Tag>;
}
