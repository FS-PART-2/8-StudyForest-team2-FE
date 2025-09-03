/*
사용 가이드 (Text 컴포넌트용)

크기 클래스 → font-size
- text-xs   → 1.0rem (10px)
- text-sm   → 1.2rem (12px)
- text-md   → 1.4rem (14px)
- text-base → 1.6rem (16px)
- text-lg   → 1.8rem (18px)
- text-xl   → 2.0rem (20px)
- text-2xl  → 2.4rem (24px)
- text-3xl  → 3.2rem (32px)

두께 클래스 → font-weight
- text-light   → 300
- text-regular → 400
- text-medium  → 500
- text-bold    → 700

예시
- <Text size="md" weight="regular">기본 텍스트</Text>
- <Text size="xl" weight="bold" color="#222">굵은 큰 텍스트</Text>
*/
import React from 'react';
import '../../styles/components/atoms/Text.module.css';

function Text({
  size = 'md',
  weight = 'normal',
  color = '',
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
