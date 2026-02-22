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
  const isEditing = useRef(false);

  useEffect(() => {
    if (!isEditing.current) {
      setLocal(String(Math.round(value * 100) / 100));
      lastCommittedValue.current = value;
    }
  }, [value]);

  const handleCommit = () => {
    isEditing.current = false;
    const n = parseFloat(local);
    if (!isNaN(n) && n !== lastCommittedValue.current) {
      lastCommittedValue.current = n;
      onChange(n);
    } else if (isNaN(n)) {
      setLocal(String(lastCommittedValue.current));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    isEditing.current = true;
    const newValue = e.target.value;
    setLocal(newValue);
    
    const n = parseFloat(newValue);
    if (!isNaN(n)) {
      lastCommittedValue.current = n;
      onChange(n);
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
        onFocus={() => {
          isEditing.current = true;
        }}
        onChange={handleChange}
        onBlur={handleCommit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.currentTarget.blur();
          }
        }}
        className="h-7 bg-gray-800 border-gray-700 text-gray-200 text-xs font-mono pr-6"
      />
      {suffix && <S.NumberInputSuffix>{suffix}</S.NumberInputSuffix>}
    </S.NumberInputWrapper>
  );
}
