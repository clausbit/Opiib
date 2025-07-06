import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Clock, TrendingUp, TrendingDown } from 'lucide-react';

const HistoryContainer = styled.div`
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 255, 240, 0.3);
  border-radius: 20px;
  padding: 20px;
  margin-bottom: 20px;
`;

const HistoryHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
`;

const HistoryIcon = styled.div`
  color: #00fff0;
  filter: drop-shadow(0 0 8px #00fff0);
`;

const HistoryTitle = styled.h3`
  font-family: 'Orbitron', monospace;
  font-size: 1.1rem;
  font-weight: 600;
  color: #00fff0;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #00fff0;
    border-radius: 3px;
  }
`;

const HistoryItem = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid ${props => props.won ? 'rgba(57, 255, 20, 0.3)' : 'rgba(255, 7, 58, 0.3)'};
  border-radius: 12px;
  padding: 12px 16px;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: ${props => props.won ? '#39ff14' : '#ff073a'};
    box-shadow: 0 5px 15px ${props => props.won ? 'rgba(57, 255, 20, 0.2)' : 'rgba(255, 7, 58, 0.2)'};
  }
`;

const GameInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ColorIndicator = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: ${props => props.color};
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 0 10px ${props => props.color};
`;

const GameDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const BetAmount = styled.span`
  font-weight: 600;
  color: #ffffff;
  font-size: 14px;
`;

const GameTime = styled.span`
  font-size: 12px;
  color: #b0b0b0;
`;

const GameResult = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 700;
  color: ${props => props.won ? '#39ff14' : '#ff073a'};
`;

const ResultIcon = styled.div`
  display: flex;
  align-items: center;
`;

const ResultAmount = styled.span`
  font-family: 'Orbitron', monospace;
  font-size: 14px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #b0b0b0;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 15px;
  opacity: 0.3;
`;

const EmptyText = styled.div`
  font-size: 16px;
  font-weight: 500;
`;

const EmptySubtext = styled.div`
  font-size: 14px;
  margin-top: 8px;
  opacity: 0.7;
`;

const LastGamesIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 6px;
  margin-bottom: 15px;
  padding: 10px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
`;

const GameDot = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${props => props.color};
  box-shadow: 0 0 8px ${props => props.color};
  opacity: ${props => props.opacity || 1};
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.2);
  }
`;

const colorMap = {
  red: '#ff073a',
  blue: '#00d4ff',
  green: '#39ff14',
  yellow: '#ffff00'
};

const GameHistory = ({ history = [] }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    }
    
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const lastFiveGames = history.slice(0, 5);

  if (history.length === 0) {
    return (
      <HistoryContainer>
        <HistoryHeader>
          <HistoryIcon>
            <Clock size={24} />
          </HistoryIcon>
          <HistoryTitle>Game History</HistoryTitle>
        </HistoryHeader>
        
        <EmptyState>
          <EmptyIcon>🎰</EmptyIcon>
          <EmptyText>No games played yet</EmptyText>
          <EmptySubtext>Start playing to see your game history</EmptySubtext>
        </EmptyState>
      </HistoryContainer>
    );
  }

  return (
    <HistoryContainer>
      <HistoryHeader>
        <HistoryIcon>
          <Clock size={24} />
        </HistoryIcon>
        <HistoryTitle>Game History</HistoryTitle>
      </HistoryHeader>

      {lastFiveGames.length > 0 && (
        <LastGamesIndicator>
          {lastFiveGames.map((game, index) => (
            <GameDot
              key={index}
              color={colorMap[game.resultColor] || '#b0b0b0'}
              opacity={1 - (index * 0.15)}
            />
          ))}
        </LastGamesIndicator>
      )}

      <HistoryList>
        {history.map((game, index) => (
          <HistoryItem
            key={game.id || index}
            won={game.won}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GameInfo>
              <ColorIndicator color={colorMap[game.selectedColor] || '#b0b0b0'} />
              <GameDetails>
                <BetAmount>{game.betAmount} AI bet</BetAmount>
                <GameTime>
                  {formatDate(game.timestamp)} at {formatTime(game.timestamp)}
                </GameTime>
              </GameDetails>
            </GameInfo>

            <GameResult won={game.won}>
              <ResultIcon>
                {game.won ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              </ResultIcon>
              <ResultAmount>
                {game.won ? '+' : '-'}{Math.abs(game.amount).toFixed(1)} AI
              </ResultAmount>
            </GameResult>
          </HistoryItem>
        ))}
      </HistoryList>
    </HistoryContainer>
  );
};

export default GameHistory;