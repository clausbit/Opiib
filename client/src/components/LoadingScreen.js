import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.1); }
`;

const glow = keyframes`
  0%, 100% { 
    text-shadow: 0 0 20px #00fff0, 0 0 40px #00fff0, 0 0 60px #00fff0;
  }
  50% { 
    text-shadow: 0 0 30px #00fff0, 0 0 60px #00fff0, 0 0 90px #00fff0;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  color: #ffffff;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(0, 255, 240, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(179, 0, 255, 0.1) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(255, 0, 128, 0.1) 0%, transparent 50%);
    animation: ${pulse} 4s ease-in-out infinite;
  }
`;

const LogoContainer = styled.div`
  position: relative;
  z-index: 2;
  margin-bottom: 40px;
`;

const Logo = styled.div`
  font-family: 'Orbitron', monospace;
  font-size: 2.5rem;
  font-weight: 900;
  color: #00fff0;
  text-align: center;
  animation: ${glow} 2s ease-in-out infinite;
  text-transform: uppercase;
  letter-spacing: 3px;
`;

const Subtitle = styled.div`
  font-size: 1rem;
  color: #b0b0b0;
  text-align: center;
  margin-top: 10px;
  letter-spacing: 1px;
`;

const SpinnerContainer = styled.div`
  position: relative;
  z-index: 2;
  margin-bottom: 30px;
`;

const Spinner = styled.div`
  width: 60px;
  height: 60px;
  border: 4px solid rgba(0, 255, 240, 0.2);
  border-top: 4px solid #00fff0;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  box-shadow: 0 0 20px rgba(0, 255, 240, 0.5);
`;

const LoadingText = styled.div`
  position: relative;
  z-index: 2;
  font-size: 1.1rem;
  color: #ffffff;
  text-align: center;
  font-weight: 500;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const ProgressBar = styled.div`
  position: relative;
  z-index: 2;
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  margin-top: 20px;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, #00fff0, transparent);
    animation: loading 2s ease-in-out infinite;
  }

  @keyframes loading {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`;

const LoadingScreen = ({ text = "Loading Casino..." }) => {
  return (
    <LoadingContainer>
      <LogoContainer>
        <Logo>Casino Roll</Logo>
        <Subtitle>Neon Gaming Experience</Subtitle>
      </LogoContainer>
      
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
      
      <LoadingText>{text}</LoadingText>
      
      <ProgressBar />
    </LoadingContainer>
  );
};

export default LoadingScreen;