import styled from 'styled-components';
import { Upload } from 'lucide-react';
import { useRef } from 'react';

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.gray950};
  color: ${({ theme }) => theme.colors.white};
`;

const ContentWrapper = styled.div`
  text-align: center;
  max-width: 28rem;
`;

const IconWrapper = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing[6]};
`;

const IconCircle = styled.div`
  width: 4rem;
  height: 4rem;
  margin: 0 auto ${({ theme }) => theme.spacing[4]};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: rgba(239, 68, 68, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.red500};
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.gray400};
`;

const HiddenInput = styled.input`
  display: none;
`;

const StyledButton = styled.button`
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

interface ErrorStateProps {
  error: string | null;
  onFileUpload: (file: File) => void;
}

export function ErrorState({ error, onFileUpload }: ErrorStateProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  return (
    <Container>
      <ContentWrapper>
        <IconWrapper>
          <IconCircle>
            <Upload size={32} color="#ef4444" />
          </IconCircle>
          <Title>Upload Failed</Title>
          <ErrorMessage>{error || 'Something went wrong'}</ErrorMessage>
        </IconWrapper>
        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
        />
        <StyledButton onClick={handleButtonClick}>
          <Upload size={16} />
          Upload Another File
        </StyledButton>
      </ContentWrapper>
    </Container>
  );
}