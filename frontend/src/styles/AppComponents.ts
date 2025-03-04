import styled from 'styled-components';
import { TabButtonProps, StatusBadgeProps, ProgressBarFillProps } from '../types/props.interface';
const colors = {
  darkBlue: '#0a1929',  
  mediumBlue: '#1a365d', 
  lightBlue: '#4a90e2',  
  gold: '#ffc107',      
  white: '#FFFFFF',     
  lightGray: '#F0F2F5', 
  gray: '#e0e0e0',      
  darkGray: '#333333',  
  green: '#4caf50',     
  red: '#f44336',       
  orange: '#ff9800',    
  blue: '#2196f3',      
};

export const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Roboto', 'Segoe UI', sans-serif;
  background-color: ${colors.white};
  color: ${colors.darkGray};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const AppHeader = styled.header`
  margin-bottom: 30px;
  padding: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${colors.darkBlue};
  color: ${colors.white};
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

export const Logo = styled.img`
  height: 50px;
  margin-right: 15px;
`;

export const AppTitle = styled.h1`
  font-size: 28px;
  color: ${colors.white};
  margin: 0 0 20px 0;
  font-weight: 600;
  letter-spacing: 0.5px;
  span {
    color: ${colors.gold};
    font-weight: 700;
  }
`;

export const TabContainer = styled.div`
  display: flex;
  gap: 15px;
  margin-bottom: 10px;
  width: 100%;
  max-width: 600px;
  justify-content: center;
`;

export const TabButton = styled.button<TabButtonProps>`
  padding: 12px 24px;
  background-color: ${props => props.$active ? colors.gold : 'transparent'};
  color: ${props => props.$active ? colors.darkBlue : colors.white};
  border: 2px solid ${props => props.$active ? colors.gold : 'transparent'};
  border-radius: 30px;
  cursor: pointer;
  font-size: 16px;
  font-weight: ${props => props.$active ? '600' : '400'};
  transition: all 0.3s ease;
  &:hover {
    background-color: ${props => props.$active ? colors.gold : 'rgba(255, 255, 255, 0.1)'};
    border-color: ${props => props.$active ? colors.gold : colors.white};
  }
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.5);
  }
`;

export const FileUploadContainer = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 30px;
  background-color: ${colors.white};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  h2 {
    color: ${colors.darkBlue};
    font-size: 24px;
    margin-bottom: 25px;
    text-align: center;
    font-weight: 600;
  }
`;

export const FileInputLabel = styled.label`
  display: inline-block;
  padding: 12px 24px;
  background-color: ${colors.lightBlue};
  color: white;
  border-radius: 30px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
  text-align: center;
  &:hover {
    background-color: #3a7bc8;
    transform: translateY(-2px);
  }
`;

export const FileInput = styled.input`
  display: none;
`;

export const SelectedFileInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  padding: 15px;
  background-color: ${colors.lightGray};
  border-radius: 8px;
  p {
    margin: 0;
    flex-grow: 1;
    font-size: 15px;
  }
  button {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 20px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.2s ease;    
    &:hover:not(:disabled) {
      background-color: #d32f2f;
    }    
    &:disabled {
      background-color: #9e9e9e;
      cursor: not-allowed;
    }
  }
`;

export const UploadButton = styled.button`
  margin-top: 25px;
  background-color: ${colors.gold};
  color: ${colors.darkBlue};
  border: none;
  padding: 12px 30px;
  border-radius: 30px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: block;
  width: 100%;
  max-width: 250px;
  margin-left: auto;
  margin-right: auto;  
  &:hover:not(:disabled) {
    background-color: #e5ac00;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  &:disabled {
    background-color: #9e9e9e;
    cursor: not-allowed;
  }
`;

export const StatusContainer = styled.div`
  margin-top: 25px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  h3 {
    margin-top: 0;
    margin-bottom: 15px;
    color: ${colors.darkBlue};
    font-size: 18px;
    font-weight: 600;
  }
  p {
    margin: 8px 0;
    font-size: 15px;
    line-height: 1.5;
  }
`;

export const StatusBadge = styled.span<StatusBadgeProps>`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 15px;
  background-color: ${props => {
    switch (props.color) {
      case 'green': return 'rgba(76, 175, 80, 0.15)';
      case 'red': return 'rgba(244, 67, 54, 0.15)';
      case 'orange': return 'rgba(255, 152, 0, 0.15)';
      case 'blue': return 'rgba(33, 150, 243, 0.15)';
      default: return 'rgba(158, 158, 158, 0.15)';
    }
  }};
  color: ${props => {
    switch (props.color) {
      case 'green': return colors.green;
      case 'red': return colors.red;
      case 'orange': return colors.orange;
      case 'blue': return colors.blue;
      default: return '#9e9e9e';
    }
  }};
  border: 1px solid ${props => {
    switch (props.color) {
      case 'green': return 'rgba(76, 175, 80, 0.3)';
      case 'red': return 'rgba(244, 67, 54, 0.3)';
      case 'orange': return 'rgba(255, 152, 0, 0.3)';
      case 'blue': return 'rgba(33, 150, 243, 0.3)';
      default: return 'rgba(158, 158, 158, 0.3)';
    }
  }};
`;

export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${colors.lightGray};
  border-radius: 4px;
  margin: 15px 0;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div<ProgressBarFillProps>`
  height: 100%;
  width: ${props => props.width};
  background-color: ${colors.lightBlue};
  border-radius: 4px;
  transition: width 0.5s ease;
`;

export const ErrorMessage = styled.p`
  color: #d32f2f;
  font-size: 14px;
  margin: 15px 0;
  padding: 10px;
  background-color: rgba(211, 47, 47, 0.1);
  border-radius: 4px;
  text-align: center;
`;

export const AppFooter = styled.footer`
  margin-top: auto;
  padding-top: 20px;
  border-top: 1px solid ${colors.gray};
  text-align: center;
  color: ${colors.darkGray};
  font-size: 14px;
`; 
