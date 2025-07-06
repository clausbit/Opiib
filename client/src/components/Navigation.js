import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  Gamepad2, 
  User, 
  Plus, 
  Minus, 
  Target, 
  Users 
} from 'lucide-react';
import { hapticFeedback } from '../utils/telegram';

const NavigationContainer = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(0, 255, 240, 0.3);
  padding: 8px 16px 8px;
  z-index: 1000;
  box-shadow: 0 -10px 30px rgba(0, 0, 0, 0.5);

  @media (max-width: 480px) {
    padding: 6px 12px 6px;
  }
`;

const NavList = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  max-width: 100%;
  margin: 0 auto;
`;

const NavItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  position: relative;
  min-width: 50px;

  ${props => props.active && `
    background: rgba(0, 255, 240, 0.1);
    transform: translateY(-2px);
    
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: 50%;
      transform: translateX(-50%);
      width: 20px;
      height: 2px;
      background: #00fff0;
      border-radius: 1px;
      box-shadow: 0 0 10px #00fff0;
    }
  `}

  &:hover {
    transform: translateY(-2px);
    background: rgba(0, 255, 240, 0.05);
  }

  &:active {
    transform: translateY(0px);
  }

  @media (max-width: 480px) {
    padding: 6px 8px;
    min-width: 45px;
  }
`;

const NavIcon = styled.div`
  color: ${props => props.active ? '#00fff0' : '#b0b0b0'};
  transition: all 0.3s ease;
  filter: ${props => props.active ? 'drop-shadow(0 0 8px #00fff0)' : 'none'};
  
  svg {
    width: 24px;
    height: 24px;
  }

  @media (max-width: 480px) {
    svg {
      width: 22px;
      height: 22px;
    }
  }
`;

const NavLabel = styled.span`
  font-size: 10px;
  font-weight: 500;
  color: ${props => props.active ? '#00fff0' : '#b0b0b0'};
  margin-top: 4px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  text-shadow: ${props => props.active ? '0 0 8px #00fff0' : 'none'};

  @media (max-width: 480px) {
    font-size: 9px;
    margin-top: 2px;
  }
`;

const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    {
      path: '/',
      icon: Gamepad2,
      label: 'Play',
      active: location.pathname === '/'
    },
    {
      path: '/deposit',
      icon: Plus,
      label: 'Deposit',
      active: location.pathname === '/deposit'
    },
    {
      path: '/withdraw',
      icon: Minus,
      label: 'Withdraw',
      active: location.pathname === '/withdraw'
    },
    {
      path: '/tasks',
      icon: Target,
      label: 'Tasks',
      active: location.pathname === '/tasks'
    },
    {
      path: '/friends',
      icon: Users,
      label: 'Friends',
      active: location.pathname === '/friends'
    },
    {
      path: '/profile',
      icon: User,
      label: 'Profile',
      active: location.pathname === '/profile'
    }
  ];

  const handleNavigation = (path) => {
    if (location.pathname !== path) {
      hapticFeedback('selection');
      navigate(path);
    }
  };

  return (
    <NavigationContainer>
      <NavList>
        {navItems.map((item) => {
          const IconComponent = item.icon;
          
          return (
            <NavItem
              key={item.path}
              active={item.active}
              onClick={() => handleNavigation(item.path)}
            >
              <NavIcon active={item.active}>
                <IconComponent />
              </NavIcon>
              <NavLabel active={item.active}>
                {item.label}
              </NavLabel>
            </NavItem>
          );
        })}
      </NavList>
    </NavigationContainer>
  );
};

export default Navigation;