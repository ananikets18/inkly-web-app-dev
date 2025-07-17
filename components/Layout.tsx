import React from "react";

const glassStyles: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.25)",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)",
  backdropFilter: "blur(12px)",
  WebkitBackdropFilter: "blur(12px)",
  borderRadius: "24px",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  padding: "2rem 1.5rem",
  margin: "2rem auto",
  maxWidth: 700,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={glassStyles}>
      {children}
    </div>
  );
}
