// Tag.jsx
import React from "react";
import "../../styles/components/atoms/Tag.css";

export default function Tag({
  points = 0,
  size = "md", // "sm" | "md" | "lg"
  className = "",
  ariaLabel, // 선택적 커스텀 aria-label
}) {
  const label = `${points}P 획득`;
  return (
    <div
      className={`tag tag-${size} ${className}`}
      role="status"
      aria-label={ariaLabel || label}
      title={label}
    >
      <span className="tag_icon" aria-hidden="true">
        🥏
      </span>
      <span className="tag_points">{points}P 획득</span>
    </div>
  );
}
