// Sticker.jsx
// React 컴포넌트 정의 및 CSS 파일 임포트
import React from 'react';
import '../../styles/components/atoms/Sticker.module.css';

// 지정된 원 색상 리스트
const circleColors = ['#E8E8E8', '#3A5AB8', '#0A3394', '#4A7BA4'];

// Sticker 컴포넌트: colorIndex prop를 통해 원의 색상을 선택할 수 있음
const Sticker = ({ colorIndex = 0 }) => {
  const backgroundColor = circleColors[colorIndex % circleColors.length];

  return (
    <div className="sticker">
      <div className="circle" style={{ backgroundColor }}></div>
    </div>
  );
};

export default Sticker;