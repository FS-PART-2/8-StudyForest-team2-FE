// Text.jsx
import React from 'react';
import '../../styles/components/atoms/Text.module.css';

function Text({
  size = 'md',
  weight = 'normal',
  color = 'var(--text-basic, #000)',
  tag: Tag = 'p',
  children,
}) {
  const className = `text text-${size} text-${weight}`;
  const style = { color };

  return (
    <Tag className={className} style={style}>
      {children}
    </Tag>
  );
}

export default Text;
