import styled from 'styled-components';

export const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  background-color: ${({ theme }) => theme.colors.gray950};
  overflow: hidden;
`;

export const Header = styled.div`
  padding: ${({ theme }) => `${theme.spacing[2.5]} ${theme.spacing[3]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray800};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  flex-shrink: 0;
  position: relative;

  svg {
    width: 16px;
    height: 16px;
    color: ${({ theme }) => theme.colors.blue400};
  }
`;

export const HeaderTitle = styled.span`
  font-size: 11px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.gray400};
  flex: 1;
`;

export const SettingsButton = styled.button`
  padding: ${({ theme }) => theme.spacing[1]};
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.gray500};
  transition: color ${({ theme }) => theme.transitions.DEFAULT};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm};

  &:hover {
    color: ${({ theme }) => theme.colors.gray300};
    background-color: ${({ theme }) => theme.colors.gray800};
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

export const ApiKeyContainer = styled.div`
  padding: ${({ theme }) => theme.spacing[3]};
  background-color: ${({ theme }) => theme.colors.gray800};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray700};
  flex-shrink: 0;
`;

export const ApiKeyLabel = styled.label`
  display: block;
  font-size: 10px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.gray400};
  margin-bottom: ${({ theme }) => theme.spacing[1.5]};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

export const ApiKeyInputWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[1.5]};
  align-items: center;
`;

export const ApiKeyInput = styled.input`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.gray900};
  border: 1px solid ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => `${theme.spacing[1.5]} ${theme.spacing[2]}`};
  font-size: 11px;
  color: ${({ theme }) => theme.colors.gray200};
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray600};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.blue500};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.blue500};
  }
`;

export const ApiKeyButton = styled.button`
  padding: ${({ theme }) => `${theme.spacing[1.5]} ${theme.spacing[3]}`};
  background-color: ${({ theme }) => theme.colors.blue600};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 11px;
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.DEFAULT};

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.blue500};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ApiKeyClearButton = styled.button`
  padding: ${({ theme }) => theme.spacing[1.5]};
  background: none;
  border: 1px solid ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.gray400};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.DEFAULT};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.red600};
    border-color: ${({ theme }) => theme.colors.red600};
    color: ${({ theme }) => theme.colors.white};
  }

  svg {
    width: 12px;
    height: 12px;
  }
`;

export const ApiKeyHelp = styled.p`
  font-size: 9px;
  color: ${({ theme }) => theme.colors.gray500};
  margin-top: ${({ theme }) => theme.spacing[1.5]};

  a {
    color: ${({ theme }) => theme.colors.blue400};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const InfoBanner = styled.div`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  background-color: ${({ theme }) => `${theme.colors.amber500}10`};
  border-bottom: 1px solid ${({ theme }) => `${theme.colors.amber500}20`};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing[2]};

  svg {
    width: 14px;
    height: 14px;
    color: ${({ theme }) => theme.colors.amber400};
    flex-shrink: 0;
    margin-top: 2px;
  }
`;

export const InfoText = styled.p`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.amber400};
  line-height: 1.5;
`;

export const SuggestedPromptsContainer = styled.div`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray800};
`;

export const SuggestedPromptsTitle = styled.div`
  font-size: 9px;
  color: ${({ theme }) => theme.colors.gray500};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

export const SuggestedPromptsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[1.5]};
`;

export const PromptButton = styled.button`
  font-size: 10px;
  padding: ${({ theme }) => `${theme.spacing[1]} ${theme.spacing[2]}`};
  background-color: ${({ theme }) => `${theme.colors.gray800}80`};
  border: 1px solid ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.gray400};
  transition: all ${({ theme }) => theme.transitions.DEFAULT};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray800};
    color: ${({ theme }) => theme.colors.gray200};
  }
`;

export const MessagesContainer = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding: ${({ theme }) => theme.spacing[3]};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const MessageWrapper = styled.div<{ $isUser?: boolean }>`
  display: flex;
  justify-content: ${({ $isUser }) => ($isUser ? 'flex-end' : 'flex-start')};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
`;

export const MessageContent = styled.div<{ $isUser?: boolean }>`
  max-width: 85%;
  order: ${({ $isUser }) => ($isUser ? '2' : '1')};
`;

export const MessageBubble = styled.div<{ $isUser?: boolean; $isError?: boolean }>`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  background-color: ${({ theme, $isUser, $isError }) =>
    $isUser
      ? theme.colors.blue600
      : $isError
      ? `${theme.colors.red600}33`
      : theme.colors.gray800};
  color: ${({ theme, $isUser, $isError }) =>
    $isUser
      ? theme.colors.white
      : $isError
      ? theme.colors.red400
      : theme.colors.gray200};
  border: ${({ theme, $isError }) =>
    $isError ? `1px solid ${theme.colors.red500}4D` : 'none'};
`;

export const MessageText = styled.p`
  font-size: 12px;
  line-height: 1.5;
  white-space: pre-wrap;
`;

export const PreviewContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing[2]};
  padding-top: ${({ theme }) => theme.spacing[2]};
  border-top: 1px solid ${({ theme }) => `${theme.colors.gray700}80`};
`;

export const PreviewLabel = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.colors.gray400};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
`;

export const PreviewCode = styled.div`
  font-size: 10px;
  font-family: ${({ theme }) => theme.typography.fontFamily.mono};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[0.5]};
`;

export const PreviewOldValue = styled.div`
  color: ${({ theme }) => theme.colors.gray500};
`;

export const PreviewNewValue = styled.div`
  color: ${({ theme }) => theme.colors.green400};
`;

export const ApplyButton = styled.button`
  margin-top: ${({ theme }) => theme.spacing[2]};
  width: 100%;
  background-color: ${({ theme }) => theme.colors.blue600};
  color: ${({ theme }) => theme.colors.white};
  font-size: 10px;
  padding: ${({ theme }) => theme.spacing[1.5]} 0;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: none;
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.DEFAULT};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};

  &:hover {
    background-color: ${({ theme }) => theme.colors.blue500};
  }
`;

export const AppliedIndicator = styled.div`
  margin-top: ${({ theme }) => theme.spacing[2]};
  padding-top: ${({ theme }) => theme.spacing[2]};
  border-top: 1px solid ${({ theme }) => `${theme.colors.gray700}80`};
  font-size: 10px;
  color: ${({ theme }) => theme.colors.green400};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`;

export const AppliedDot = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.green400};
`;

export const MessageTimestamp = styled.div<{ $isUser?: boolean }>`
  font-size: 9px;
  color: ${({ theme }) => theme.colors.gray600};
  margin-top: ${({ theme }) => theme.spacing[1]};
  padding: 0 ${({ theme }) => theme.spacing[1]};
  text-align: ${({ $isUser }) => ($isUser ? 'right' : 'left')};
`;

export const LoadingBubble = styled.div`
  display: flex;
  justify-content: flex-start;

  > div {
    background-color: ${({ theme }) => theme.colors.gray800};
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing[2]};
  }

  svg {
    width: 12px;
    height: 12px;
    color: ${({ theme }) => theme.colors.blue400};
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  span {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.gray400};
  }
`;

export const InputForm = styled.form`
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
  border-top: 1px solid ${({ theme }) => theme.colors.gray800};
  flex-shrink: 0;
`;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
`;

export const Input = styled.input`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.gray800};
  border: 1px solid ${({ theme }) => theme.colors.gray700};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => `${theme.spacing[1.5]} ${theme.spacing[3]}`};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.gray200};
  transition: all ${({ theme }) => theme.transitions.DEFAULT};

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray600};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.blue500};
    box-shadow: 0 0 0 1px ${({ theme }) => theme.colors.blue500};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const SendButton = styled.button`
  background-color: ${({ theme }) => theme.colors.blue600};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing[1.5]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: none;
  cursor: pointer;
  transition: background-color ${({ theme }) => theme.transitions.DEFAULT};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover:not(:disabled) {
    background-color: ${({ theme }) => theme.colors.blue500};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray700};
    cursor: not-allowed;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;
