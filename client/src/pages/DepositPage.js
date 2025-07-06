import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Plus, Star, Bitcoin, DollarSign, Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { hapticFeedback } from '../utils/telegram';

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

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 30px;
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

const Section = styled.div`
  background: rgba(26, 26, 46, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 255, 240, 0.3);
  border-radius: 20px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

const SectionTitle = styled.h3`
  font-family: 'Orbitron', monospace;
  font-size: 1.2rem;
  font-weight: 600;
  color: #00fff0;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 20px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const SectionIcon = styled.div`
  color: #00fff0;
  filter: drop-shadow(0 0 8px #00fff0);
`;

const PaymentMethodsGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const PaymentMethod = styled(motion.button)`
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid ${props => props.selected ? '#00fff0' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  ${props => props.selected && `
    background: rgba(0, 255, 240, 0.1);
    box-shadow: 0 0 20px rgba(0, 255, 240, 0.3);
  `}

  &:hover {
    border-color: #00fff0;
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 255, 240, 0.2);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }
`;

const MethodHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const MethodIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: ${props => props.bgColor || 'linear-gradient(45deg, #00fff0, #b300ff)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 4px 15px ${props => props.shadowColor || 'rgba(0, 255, 240, 0.3)'};
`;

const MethodInfo = styled.div`
  text-align: left;
  flex: 1;
`;

const MethodName = styled.div`
  font-weight: 700;
  color: #ffffff;
  font-size: 16px;
  margin-bottom: 4px;
`;

const MethodDescription = styled.div`
  font-size: 12px;
  color: #b0b0b0;
`;

const AmountSelector = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
`;

const AmountButton = styled.button`
  background: ${props => props.selected ? '#00fff0' : 'transparent'};
  color: ${props => props.selected ? '#0a0a0a' : '#00fff0'};
  border: 2px solid #00fff0;
  border-radius: 12px;
  padding: 16px 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    background: #00fff0;
    color: #0a0a0a;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 255, 240, 0.3);
  }
`;

const CustomAmountInput = styled.input`
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(0, 255, 240, 0.3);
  border-radius: 12px;
  padding: 16px;
  color: #ffffff;
  font-size: 16px;
  font-family: 'Orbitron', monospace;
  text-align: center;
  margin-bottom: 20px;

  &:focus {
    outline: none;
    border-color: #00fff0;
    box-shadow: 0 0 20px rgba(0, 255, 240, 0.3);
  }

  &::placeholder {
    color: #b0b0b0;
  }
`;

const DepositButton = styled(motion.button)`
  width: 100%;
  background: linear-gradient(45deg, #00fff0, #b300ff);
  border: none;
  border-radius: 16px;
  padding: 18px 24px;
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

const InfoBox = styled.div`
  background: rgba(0, 255, 240, 0.1);
  border: 1px solid rgba(0, 255, 240, 0.3);
  border-radius: 12px;
  padding: 16px;
  margin-top: 20px;
  font-size: 14px;
  color: #00fff0;
  text-align: center;
`;

const DepositPage = ({ user }) => {
  const { refreshBalance } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const paymentMethods = [
    {
      id: 'telegram_stars',
      name: 'Telegram Stars',
      description: 'Quick and easy payment',
      icon: Star,
      bgColor: '#229ED9',
      shadowColor: 'rgba(34, 158, 217, 0.5)',
      minAmount: 1,
      exchangeRate: 1 // 1 Star = 1 AI
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      description: 'TON, BTC, ETH, USDT and more',
      icon: Bitcoin,
      bgColor: '#F7931A',
      shadowColor: 'rgba(247, 147, 26, 0.5)',
      minAmount: 5,
      exchangeRate: 1
    },
    {
      id: 'wallet',
      name: 'Crypto Wallet',
      description: 'Connect your crypto wallet',
      icon: DollarSign,
      bgColor: 'linear-gradient(45deg, #00fff0, #b300ff)',
      shadowColor: 'rgba(0, 255, 240, 0.5)',
      minAmount: 1,
      exchangeRate: 1
    }
  ];

  const presetAmounts = [10, 25, 50, 100, 250, 500];

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setSelectedAmount(null);
    setCustomAmount('');
    hapticFeedback('selection');
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    hapticFeedback('selection');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value) || value === '') {
      setCustomAmount(value);
      setSelectedAmount(null);
    }
  };

  const getDepositAmount = () => {
    return selectedAmount || parseFloat(customAmount) || 0;
  };

  const handleDeposit = async () => {
    const amount = getDepositAmount();
    
    if (!selectedMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (amount < selectedMethod.minAmount) {
      toast.error(`Minimum deposit is ${selectedMethod.minAmount} AI`);
      return;
    }

    try {
      setIsLoading(true);
      hapticFeedback('impact', 'medium');

      // Simulate payment process
      if (selectedMethod.id === 'telegram_stars') {
        // Handle Telegram Stars payment
        toast.success('Redirecting to Telegram Stars payment...');
        // In real implementation, you would use Telegram's payment API
      } else if (selectedMethod.id === 'crypto') {
        // Handle crypto payment
        toast.success('Opening crypto payment gateway...');
        // In real implementation, you would integrate with crypto payment provider
      } else {
        // Handle wallet connection
        toast.success('Opening wallet connection...');
        // In real implementation, you would connect to crypto wallets
      }

      // Simulate successful payment after 2 seconds
      setTimeout(() => {
        toast.success(`Successfully deposited ${amount} AI!`);
        refreshBalance();
        setSelectedMethod(null);
        setSelectedAmount(null);
        setCustomAmount('');
        setIsLoading(false);
        hapticFeedback('notification', 'success');
      }, 2000);

    } catch (error) {
      console.error('Deposit error:', error);
      toast.error('Deposit failed. Please try again.');
      setIsLoading(false);
      hapticFeedback('notification', 'error');
    }
  };

  return (
    <PageContainer>
      <Container>
        <Header>
          <Title>
            <Plus size={32} />
            Deposit
          </Title>
          <Subtitle>Add funds to your account</Subtitle>
        </Header>

        <Section>
          <SectionTitle>
            <SectionIcon>
              <Zap size={24} />
            </SectionIcon>
            Payment Methods
          </SectionTitle>

          <PaymentMethodsGrid>
            {paymentMethods.map((method) => {
              const IconComponent = method.icon;
              
              return (
                <PaymentMethod
                  key={method.id}
                  selected={selectedMethod?.id === method.id}
                  onClick={() => handleMethodSelect(method)}
                  whileTap={{ scale: 0.98 }}
                >
                  <MethodHeader>
                    <MethodIcon 
                      bgColor={method.bgColor}
                      shadowColor={method.shadowColor}
                    >
                      <IconComponent size={20} />
                    </MethodIcon>
                    <MethodInfo>
                      <MethodName>{method.name}</MethodName>
                      <MethodDescription>{method.description}</MethodDescription>
                    </MethodInfo>
                  </MethodHeader>
                </PaymentMethod>
              );
            })}
          </PaymentMethodsGrid>
        </Section>

        {selectedMethod && (
          <Section>
            <SectionTitle>
              <SectionIcon>
                <DollarSign size={24} />
              </SectionIcon>
              Select Amount
            </SectionTitle>

            <AmountSelector>
              {presetAmounts.map((amount) => (
                <AmountButton
                  key={amount}
                  selected={selectedAmount === amount}
                  onClick={() => handleAmountSelect(amount)}
                >
                  {amount} AI
                </AmountButton>
              ))}
            </AmountSelector>

            <CustomAmountInput
              type="text"
              placeholder="Custom amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
            />

            <DepositButton
              disabled={getDepositAmount() < selectedMethod.minAmount || isLoading}
              onClick={handleDeposit}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Processing...' : `Deposit ${getDepositAmount()} AI`}
            </DepositButton>

            <InfoBox>
              💡 Minimum deposit: {selectedMethod.minAmount} AI
              <br />
              Exchange rate: 1 {selectedMethod.id === 'telegram_stars' ? 'Star' : 'USD'} = {selectedMethod.exchangeRate} AI
            </InfoBox>
          </Section>
        )}
      </Container>
    </PageContainer>
  );
};

export default DepositPage;