import styled from 'styled-components';

export const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray950};
  color: ${({ theme }) => theme.colors.white};
`;

export const ContentWrapper = styled.div`
  text-align: center;
  max-width: 28rem;
`;

export const IconWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

export const IconCircle = styled.div`
  width: 4rem;
  height: 4rem;
  margin: 0 auto ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: rgba(239, 68, 68, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.red500};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.gray400};
`;

export const HiddenInput = styled.input`
  display: none;
`;

export const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing[2]} ${({ theme }) => theme.spacing[4]};
  background-color: ${({ theme }) => theme.colors.blue600};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  transition: background-color ${({ theme }) => theme.transitions.DEFAULT};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.blue500};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.blue500};
    outline-offset: 2px;
  }

  svg {
    margin-right: ${({ theme }) => theme.spacing[2]};
  }
`;
