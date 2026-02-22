import { useState } from 'react';
import { Separator } from '../ui/separator';
import * as S from '../../../styles/RightPanelStyles';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface SectionProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export function Section({ icon: Icon, title, children, defaultOpen = true }: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  
  return (
    <S.SectionContainer>
      <S.SectionButton onClick={() => setOpen((v) => !v)}>
        <S.SectionIcon>
          <Icon />
        </S.SectionIcon>
        <S.SectionTitle>{title}</S.SectionTitle>
        <S.ChevronIcon>
          {open ? <ChevronDown /> : <ChevronRight />}
        </S.ChevronIcon>
      </S.SectionButton>
      {open && <S.SectionContent>{children}</S.SectionContent>}
      <Separator className="bg-gray-800" />
    </S.SectionContainer>
  );
}
