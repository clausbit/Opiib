import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp } from 'lucide-react';

const glow = keyframes`
  0%, 100% { 
    text-shadow: 0 0 20px rgba(0, 255, 240, 0.5);
  }
  50% { 
    text-shadow: 0 0 30px rgba(0, 255, 240, 0.8);
  }
`;

const BalanceContainer = styled(motion.div)`
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 255, 240, 0.3);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, 
      rgba(0, 255, 240, 0.05) 0%, 
      transparent 50%, 
      rgba(179, 0, 255, 0.05) 100%);
    pointer-events: none;
  }
`;

const BalanceHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const BalanceIcon = styled.div`
  color: #00fff0;
  filter: drop-shadow(0 0 8px #00fff0);
`;

const BalanceTitle = styled.h2`
  font-family: 'Orbitron', monospace;
  font-size: 1.2rem;
  font-weight: 600;
  color: #00fff0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const BalanceAmount = styled.div`
  font-family: 'Orbitron', monospace;
  font-size: 2.5rem;
  font-weight: 900;
  color: #00fff0;
  text-align: center;
  animation: ${glow} 2s ease-in-out infinite;
  margin-bottom: 10px;

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const BalanceCurrency = styled.span`
  font-size: 1.5rem;
  margin-left: 8px;
  color: #b0b0b0;

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const BalanceInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 240, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  margin-top: 15px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 12px;
  color: #b0b0b0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  font-weight: 600;
  color: #ffffff;
  font-size: 14px;
`;

const ProfitIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: ${props => props.positive ? '#39ff14' : '#ff073a'};
  font-size: 14px;
  font-weight: 600;
`;

const UserBalance = ({ balance = 0, totalWon = 0, totalBets = 0 }) => {
  const profit = totalWon - totalBets;
  const isProfit = profit >= 0;

  return (
    <BalanceContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BalanceHeader>
        <BalanceIcon>
          <Wallet size={24} />
        </BalanceIcon>
        <BalanceTitle>Your Balance</BalanceTitle>
      </BalanceHeader>

      <BalanceAmount>
        {balance.toFixed(1)}
        <BalanceCurrency>AI</BalanceCurrency>
      </BalanceAmount>

      <BalanceInfo>
        <InfoItem>
          <InfoLabel>Total Bets</InfoLabel>
          <InfoValue>{totalBets}</InfoValue>
        </InfoItem>

        <InfoItem>
          <InfoLabel>Total Won</InfoLabel>
          <InfoValue>{totalWon.toFixed(1)} AI</InfoValue>
        </InfoItem>

        <InfoItem>
          <InfoLabel>Profit</InfoLabel>
          <ProfitIndicator positive={isProfit}>
            <TrendingUp size={16} />
            {isProfit ? '+' : ''}{profit.toFixed(1)} AI
          </ProfitIndicator>
        </InfoItem>
      </BalanceInfo>
    </BalanceContainer>
  );
};

export default UserBalance;