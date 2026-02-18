import { Upload } from 'lucide-react';
import { useRef } from 'react';
import * as S from '../../styles/ErrorStateStyles';

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
    <S.Container>
      <S.ContentWrapper>
        <S.IconWrapper>
          <S.IconCircle>
            <Upload size={32} color="#ef4444" />
          </S.IconCircle>
          <S.Title>Upload Failed</S.Title>
          <S.ErrorMessage>{error || 'Something went wrong'}</S.ErrorMessage>
        </S.IconWrapper>
        <S.HiddenInput
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
        />
        <S.StyledButton onClick={handleButtonClick}>
          <Upload size={16} />
          Upload Another File
        </S.StyledButton>
      </S.ContentWrapper>
    </S.Container>
  );
}