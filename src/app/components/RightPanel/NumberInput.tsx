import { useEffect, useState, useRef } from 'react';
import { Input } from '../ui/input';
import * as S from '../../../styles/RightPanelStyles';

interface NumberInputProps {
  value: number;
  onChange: (v: number) => void;
  suffix?: string;
  step?: number;
  min?: number;
  max?: number;
}

export function NumberInput({
  value,
  onChange,
  suffix,
  step = 1,
  min,
  max,
}: NumberInputProps) {
  const [local, setLocal] = useState(String(Math.round(value * 100) / 100));
  const lastCommittedValue = useRef(value);

  useEffect(() => {
    setLocal(String(Math.round(value * 100) / 100));
    lastCommittedValue.current = value;
  }, [value]);

  const handleCommit = () => {
    const n = parseFloat(local);
    if (!isNaN(n) && n !== lastCommittedValue.current) {
      lastCommittedValue.current = n;
      onChange(n);
    } else if (isNaN(n)) {
      setLocal(String(value));
    }
  };

  return (
    <S.NumberInputWrapper>
      <Input
        type="number"
        value={local}
        step={step}
        min={min}
        max={max}
        onChange={(e) => {
          const newValue = e.target.value;
          setLocal(newValue);
          // Only update local state, don't trigger onChange yet
        }}
        onBlur={handleCommit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleCommit();
          }
        }}
        className="h-7 bg-gray-800 border-gray-700 text-gray-200 text-xs font-mono pr-6"
      />
      {suffix && <S.NumberInputSuffix>{suffix}</S.NumberInputSuffix>}
    </S.NumberInputWrapper>
  );
}
