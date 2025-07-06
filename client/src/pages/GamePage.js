import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import Confetti from 'react-confetti';
import { useAuth } from '../hooks/useAuth';
import { hapticFeedback } from '../utils/telegram';
import RouletteWheel from '../components/RouletteWheel';
import BetControls from '../components/BetControls';
import GameHistory from '../components/GameHistory';
import UserBalance from '../components/UserBalance';
import axios from 'axios';

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
  padding: 20px 16px 100px;
  position: relative;
  overflow-x: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: 
      radial-gradient(circle at 20% 50%, rgba(0, 255, 240, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(179, 0, 255, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 40% 80%, rgba(255, 0, 128, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const GameContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-family: 'Orbitron', monospace;
  font-size: 2rem;
  font-weight: 900;
  color: #00fff0;
  text-shadow: 0 0 20px rgba(0, 255, 240, 0.5);
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 2px;

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

const Subtitle = styled.p`
  color: #b0b0b0;
  font-size: 14px;
  letter-spacing: 1px;
`;

const GameSection = styled.div`
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 255, 240, 0.3);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const WinningsDisplay = styled(motion.div)`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(20px);
  border: 2px solid #39ff14;
  border-radius: 20px;
  padding: 30px;
  text-align: center;
  z-index: 1000;
  box-shadow: 0 0 50px rgba(57, 255, 20, 0.5);
`;

const WinAmount = styled.div`
  font-family: 'Orbitron', monospace;
  font-size: 2.5rem;
  font-weight: 900;
  color: #39ff14;
  text-shadow: 0 0 20px rgba(57, 255, 20, 0.8);
  margin-bottom: 10px;
  animation: ${pulse} 1s ease-in-out infinite;
`;

const WinText = styled.div`
  font-size: 1.2rem;
  color: #ffffff;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const GamePage = ({ user }) => {
  const { balance, updateBalance } = useAuth();
  const [isSpinning, setIsSpinning] = useState(false);
  const [gameHistory, setGameHistory] = useState([]);
  const [showWinnings, setShowWinnings] = useState(false);
  const [winAmount, setWinAmount] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const [selectedColor, setSelectedColor] = useState(null);
  const [betAmount, setBetAmount] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

  const colors = [
    { name: 'red', color: '#ff073a', multiplier: 2.2 },
    { name: 'blue', color: '#00d4ff', multiplier: 2.2 },
    { name: 'green', color: '#39ff14', multiplier: 5 },
    { name: 'yellow', color: '#ffff00', multiplier: 45 }
  ];

  useEffect(() => {
    fetchGameHistory();
  }, []);

  const fetchGameHistory = async () => {
    try {
      const response = await axios.get('/api/game/history');
      setGameHistory(response.data.games || []);
    } catch (error) {
      console.error('Failed to fetch game history:', error);
    }
  };

  const placeBet = async () => {
    if (!selectedColor || betAmount <= 0) {
      toast.error('Please select a color and bet amount');
      return;
    }

    if (betAmount > balance) {
      toast.error('Insufficient balance');
      return;
    }

    if (isSpinning || isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      setIsSpinning(true);
      hapticFeedback('impact', 'medium');

      const response = await axios.post('/api/game/play', {
        color: selectedColor,
        amount: betAmount
      });

      const { result, winnings, newBalance } = response.data;

      // Simulate spinning time
      setTimeout(() => {
        setIsSpinning(false);
        
        if (winnings > 0) {
          setWinAmount(winnings);
          setShowWinnings(true);
          setShowConfetti(true);
          hapticFeedback('notification', 'success');
          toast.success(`You won ${winnings} AI!`);
          
          setTimeout(() => {
            setShowWinnings(false);
            setShowConfetti(false);
          }, 3000);
        } else {
          hapticFeedback('notification', 'error');
          toast.error('Better luck next time!');
        }

        updateBalance(newBalance);
        fetchGameHistory();
        setIsLoading(false);
      }, 3000);

    } catch (error) {
      console.error('Game error:', error);
      setIsSpinning(false);
      setIsLoading(false);
      toast.error(error.response?.data?.message || 'Game failed');
      hapticFeedback('notification', 'error');
    }
  };

  const handleColorSelect = (color) => {
    if (!isSpinning && !isLoading) {
      setSelectedColor(color);
      hapticFeedback('selection');
    }
  };

  const handleBetAmountChange = (amount) => {
    if (!isSpinning && !isLoading) {
      setBetAmount(amount);
      hapticFeedback('selection');
    }
  };

  return (
    <PageContainer>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}

      <GameContainer>
        <Header>
          <Title>Casino Roll</Title>
          <Subtitle>Choose your color and win big!</Subtitle>
        </Header>

        <UserBalance balance={balance} />

        <GameSection>
          <RouletteWheel 
            isSpinning={isSpinning}
            colors={colors}
            selectedColor={selectedColor}
          />
        </GameSection>

        <GameSection>
          <BetControls
            colors={colors}
            selectedColor={selectedColor}
            onColorSelect={handleColorSelect}
            betAmount={betAmount}
            onBetAmountChange={handleBetAmountChange}
            onPlaceBet={placeBet}
            isSpinning={isSpinning}
            isLoading={isLoading}
            balance={balance}
          />
        </GameSection>

        <GameHistory history={gameHistory} />
      </GameContainer>

      <AnimatePresence>
        {showWinnings && (
          <WinningsDisplay
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <WinAmount>+{winAmount} AI</WinAmount>
            <WinText>Congratulations!</WinText>
          </WinningsDisplay>
        )}
      </AnimatePresence>
    </PageContainer>
  );
};

export default GamePage;