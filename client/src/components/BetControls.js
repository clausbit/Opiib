import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';

const BetContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SectionTitle = styled.h3`
  font-family: 'Orbitron', monospace;
  font-size: 1.1rem;
  font-weight: 600;
  color: #00fff0;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 15px;
  text-align: center;
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-bottom: 20px;
`;

const ColorButton = styled(motion.button)`
  background: ${props => props.color};
  border: 2px solid ${props => props.selected ? '#ffffff' : 'transparent'};
  border-radius: 12px;
  padding: 16px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  ${props => props.selected && `
    box-shadow: 0 0 20px ${props.color}, inset 0 0 20px rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  `}
  
  ${props => props.disabled && `
    opacity: 0.5;
    cursor: not-allowed;
  `}

  &:hover:not(:disabled) {
    transform: ${props => props.selected ? 'scale(1.05)' : 'scale(1.02)'};
    border-color: #ffffff;
    box-shadow: 0 0 15px ${props => props.color};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }
`;

const ColorName = styled.div`
  font-weight: 700;
  font-size: 1rem;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 4px;
`;

const Multiplier = styled.div`
  font-family: 'Orbitron', monospace;
  font-weight: 600;
  font-size: 0.9rem;
  color: #ffffff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
`;

const BetAmountSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const BetAmountContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 240, 0.3);
  border-radius: 12px;
  padding: 15px;
`;

const BetButton = styled.button`
  width: 40px;
  height: 40px;
  border: 2px solid #00fff0;
  border-radius: 8px;
  background: transparent;
  color: #00fff0;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #00fff0;
    color: #0a0a0a;
    transform: scale(1.1);
    box-shadow: 0 0 15px rgba(0, 255, 240, 0.5);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const BetAmountDisplay = styled.div`
  font-family: 'Orbitron', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: #00fff0;
  text-shadow: 0 0 10px rgba(0, 255, 240, 0.5);
  min-width: 80px;
  text-align: center;
`;

const QuickBetButtons = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
`;

const QuickBetButton = styled.button`
  background: ${props => props.active ? '#00fff0' : 'transparent'};
  color: ${props => props.active ? '#0a0a0a' : '#00fff0'};
  border: 2px solid #00fff0;
  border-radius: 8px;
  padding: 8px 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    background: #00fff0;
    color: #0a0a0a;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 240, 0.3);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const PlaceBetButton = styled(motion.button)`
  background: linear-gradient(45deg, #00fff0, #b300ff);
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-family: 'Orbitron', monospace;
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 255, 240, 0.3);
  position: relative;
  overflow: hidden;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 30px rgba(0, 255, 240, 0.5);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }
`;

const BetInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 255, 240, 0.2);
  border-radius: 8px;
  padding: 12px 16px;
  margin-top: 10px;
  font-size: 14px;
`;

const BetInfoLabel = styled.span`
  color: #b0b0b0;
`;

const BetInfoValue = styled.span`
  color: #00fff0;
  font-weight: 600;
`;

const BetControls = ({ 
  colors, 
  selectedColor, 
  onColorSelect, 
  betAmount, 
  onBetAmountChange, 
  onPlaceBet, 
  isSpinning, 
  isLoading,
  balance 
}) => {
  const quickBetAmounts = [1, 5, 10, 25];
  const maxBet = Math.min(balance, 100);
  
  const selectedColorData = colors.find(c => c.name === selectedColor);
  const potentialWin = selectedColorData ? betAmount * selectedColorData.multiplier : 0;

  const handleBetIncrease = () => {
    if (betAmount < maxBet) {
      onBetAmountChange(Math.min(betAmount + 1, maxBet));
    }
  };

  const handleBetDecrease = () => {
    if (betAmount > 1) {
      onBetAmountChange(Math.max(betAmount - 1, 1));
    }
  };

  const handleQuickBet = (amount) => {
    if (amount <= balance) {
      onBetAmountChange(amount);
    }
  };

  const isDisabled = isSpinning || isLoading;
  const canPlaceBet = selectedColor && betAmount > 0 && betAmount <= balance && !isDisabled;

  return (
    <BetContainer>
      <div>
        <SectionTitle>Choose Color</SectionTitle>
        <ColorGrid>
          {colors.map((color) => (
            <ColorButton
              key={color.name}
              color={color.color}
              selected={selectedColor === color.name}
              disabled={isDisabled}
              onClick={() => onColorSelect(color.name)}
              whileTap={{ scale: 0.95 }}
            >
              <ColorName>{color.name}</ColorName>
              <Multiplier>x{color.multiplier}</Multiplier>
            </ColorButton>
          ))}
        </ColorGrid>
      </div>

      <BetAmountSection>
        <SectionTitle>Bet Amount</SectionTitle>
        
        <BetAmountContainer>
          <BetButton
            onClick={handleBetDecrease}
            disabled={betAmount <= 1 || isDisabled}
          >
            <Minus />
          </BetButton>
          
          <BetAmountDisplay>{betAmount} AI</BetAmountDisplay>
          
          <BetButton
            onClick={handleBetIncrease}
            disabled={betAmount >= maxBet || isDisabled}
          >
            <Plus />
          </BetButton>
        </BetAmountContainer>

        <QuickBetButtons>
          {quickBetAmounts.map((amount) => (
            <QuickBetButton
              key={amount}
              active={betAmount === amount}
              disabled={amount > balance || isDisabled}
              onClick={() => handleQuickBet(amount)}
            >
              {amount}
            </QuickBetButton>
          ))}
        </QuickBetButtons>

        {selectedColorData && (
          <BetInfo>
            <BetInfoLabel>Potential Win:</BetInfoLabel>
            <BetInfoValue>{potentialWin.toFixed(1)} AI</BetInfoValue>
          </BetInfo>
        )}

        <PlaceBetButton
          disabled={!canPlaceBet}
          onClick={onPlaceBet}
          whileTap={{ scale: 0.95 }}
        >
          {isSpinning ? 'Spinning...' : isLoading ? 'Loading...' : 'Place Bet'}
        </PlaceBetButton>
      </BetAmountSection>
    </BetContainer>
  );
};

export default BetControls;