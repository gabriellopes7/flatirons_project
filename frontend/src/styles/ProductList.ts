import styled from "styled-components";


const colors = {
  darkBlue: '#0a1929',  
  mediumBlue: '#1a365d', 
  lightBlue: '#4a90e2',  
  gold: '#ffc107',      
  white: '#FFFFFF',     
  lightGray: '#F0F2F5', 
  gray: '#e0e0e0',      
  darkGray: '#333333',  
};

export const ProductListContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  h2 {
    color: ${colors.darkBlue};
    font-size: 24px;
    margin-bottom: 25px;
    text-align: center;
    font-weight: 600;
  }
`;

export const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  margin-top: 30px;
`;

export const ProductCard = styled.div`
  border: 1px solid ${colors.gray};
  border-radius: 12px;
  padding: 20px;
  background-color: ${colors.white};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    border-color: ${colors.lightBlue};
  }
`;

export const ProductTitle = styled.h3`
  margin: 0 0 12px 0;
  font-size: 18px;
  color: ${colors.darkBlue};
  font-weight: 600;
`;

export const ProductPrice = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: ${colors.gold};
  margin: 12px 0;
`;

export const ProductDescription = styled.p`
  color: ${colors.darkGray};
  margin: 12px 0;
  font-size: 14px;
  line-height: 1.5;
`;

export const FilterContainer = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background-color: ${colors.white};
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
`;

export const FilterInput = styled.input`
  padding: 10px 15px;
  border: 1px solid ${colors.gray};
  border-radius: 30px;
  font-size: 14px;
  flex: 1;
  min-width: 120px;
  transition: all 0.3s ease;
  &:focus {
    outline: none;
    border-color: ${colors.lightBlue};
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

export const FilterButton = styled.button`
  padding: 10px 20px;
  background-color: ${colors.gold};
  color: ${colors.darkBlue};
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  &:hover {
    background-color: #e5ac00;
    transform: translateY(-2px);
  }
`;

export const NoProducts = styled.div`
  text-align: center;
  padding: 50px;
  color: ${colors.darkGray};
  font-size: 16px;
  background-color: ${colors.lightGray};
  border-radius: 12px;
  margin: 30px 0;
`;

export const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 30px;
  gap: 10px;
`;

export const PageButton = styled.button<{ $active?: boolean }>`
  padding: 10px 15px;
  background-color: ${props => props.$active ? colors.gold : colors.white};
  color: ${props => props.$active ? colors.darkBlue : colors.darkGray};
  border: 1px solid ${props => props.$active ? colors.gold : colors.gray};
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: ${props => props.$active ? '#e5ac00' : colors.lightGray};
    transform: translateY(-2px);
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

export const SelectFilter = styled.select`
  padding: 10px 15px;
  border: 1px solid ${colors.gray};
  border-radius: 30px;
  font-size: 14px;
  background-color: ${colors.white};
  min-width: 120px;
  cursor: pointer;
  &:focus {
    outline: none;
    border-color: ${colors.lightBlue};
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

export const DateInput = styled.input`
  padding: 10px 15px;
  border: 1px solid ${colors.gray};
  border-radius: 30px;
  font-size: 14px;
  min-width: 120px;
  &:focus {
    outline: none;
    border-color: ${colors.lightBlue};
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;

export const ExchangeRatesContainer = styled.div`
  margin-top: 15px;
  border-top: 1px solid ${colors.gray};
  padding-top: 15px;
`;

export const ExchangeRateItem = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: ${colors.darkGray};
  margin: 5px 0;
`;

export const CurrencySelector = styled.select`
  padding: 10px 15px;
  border: 1px solid ${colors.gray};
  border-radius: 30px;
  font-size: 14px;
  background-color: ${colors.white};
  min-width: 120px;
  cursor: pointer;
  margin-left: auto;
  &:focus {
    outline: none;
    border-color: ${colors.lightBlue};
    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
  }
`;