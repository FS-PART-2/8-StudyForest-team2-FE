// Text.jsx
import React from "react";
import "../../styles/Text.module.css";

function Text({
  size = "md",
  weight = "normal",
  color = "var(--text-basic, #000)",
  as: Component = "p",
  children,
}) {
  const className = `text text-${size} text-${weight}`;
  const style = { color };

  return <Component className={className} style={style}>{children}</Component>;
}

export default Text;
