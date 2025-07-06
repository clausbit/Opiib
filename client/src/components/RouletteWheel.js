import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(1440deg); }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const glow = keyframes`
  0%, 100% { 
    box-shadow: 0 0 20px rgba(0, 255, 240, 0.5), 0 0 40px rgba(0, 255, 240, 0.3); 
  }
  50% { 
    box-shadow: 0 0 30px rgba(0, 255, 240, 0.8), 0 0 60px rgba(0, 255, 240, 0.5); 
  }
`;

const RouletteContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  position: relative;
`;

const WheelContainer = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background: linear-gradient(45deg, #1a1a2e, #16213e);
  border: 4px solid rgba(0, 255, 240, 0.5);
  box-shadow: 
    0 0 20px rgba(0, 255, 240, 0.3),
    inset 0 0 20px rgba(0, 0, 0, 0.5);
  animation: ${glow} 2s ease-in-out infinite;
  overflow: hidden;

  @media (max-width: 480px) {
    width: 200px;
    height: 200px;
  }
`;

const Wheel = styled(motion.div)`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  position: relative;
  animation: ${props => props.spinning ? `${spin} 3s cubic-bezier(0.23, 1, 0.32, 1)` : 'none'};
`;

const ColorSegment = styled.div`
  position: absolute;
  width: 50%;
  height: 50%;
  transform-origin: 100% 100%;
  background: ${props => props.color};
  border: 2px solid rgba(255, 255, 255, 0.1);
  
  ${props => props.angle && `
    transform: rotate(${props.angle}deg);
  `}

  &::before {
    content: '';
    position: absolute;
    top: 10px;
    right: 10px;
    width: 20px;
    height: 20px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.3);
  }

  ${props => props.selected && `
    box-shadow: inset 0 0 20px rgba(255, 255, 255, 0.3);
    border-color: #ffffff;
  `}
`;

const CenterDot = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 30px;
  height: 30px;
  background: linear-gradient(45deg, #00fff0, #b300ff);
  border-radius: 50%;
  border: 3px solid #ffffff;
  box-shadow: 
    0 0 20px rgba(0, 255, 240, 0.8),
    inset 0 0 10px rgba(0, 0, 0, 0.3);
  z-index: 10;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const Pointer = styled.div`
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 20px solid #00fff0;
  filter: drop-shadow(0 0 8px #00fff0);
  z-index: 5;
`;

const StatusText = styled.div`
  margin-top: 20px;
  text-align: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.spinning ? '#00fff0' : '#b0b0b0'};
  animation: ${props => props.spinning ? pulse : 'none'} 1s ease-in-out infinite;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ColorIndicators = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 15px;
  flex-wrap: wrap;
`;

const ColorDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 2px solid ${props => props.selected ? '#ffffff' : 'transparent'};
  box-shadow: 
    0 0 10px ${props => props.color},
    ${props => props.selected ? '0 0 15px #ffffff' : 'none'};
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: scale(1.2);
    border-color: #ffffff;
  }
`;

const RouletteWheel = ({ isSpinning, colors, selectedColor }) => {
  const [currentResult, setCurrentResult] = useState(null);
  
  useEffect(() => {
    if (isSpinning) {
      // Simulate random result after spinning
      setTimeout(() => {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        setCurrentResult(randomColor.name);
      }, 3000);
    }
  }, [isSpinning, colors]);

  const getSegmentAngle = (index, total) => {
    return (360 / total) * index;
  };

  return (
    <RouletteContainer>
      <WheelContainer>
        <Pointer />
        <Wheel spinning={isSpinning}>
          {colors.map((color, index) => (
            <ColorSegment
              key={color.name}
              color={color.color}
              angle={getSegmentAngle(index, colors.length)}
              selected={selectedColor === color.name}
            />
          ))}
        </Wheel>
        <CenterDot />
      </WheelContainer>
      
      <StatusText spinning={isSpinning}>
        {isSpinning ? 'Spinning...' : 'Place your bet!'}
      </StatusText>
      
      <ColorIndicators>
        {colors.map((color) => (
          <ColorDot
            key={color.name}
            color={color.color}
            selected={selectedColor === color.name}
          />
        ))}
      </ColorIndicators>
    </RouletteContainer>
  );
};

export default RouletteWheel;