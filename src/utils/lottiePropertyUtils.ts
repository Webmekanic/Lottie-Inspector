import { LottieShape } from '../types/lottie';

export function getPropValue(prop: any, index?: number): number {
  if (!prop) return 0;
  if (prop.a === 0) {
    if (Array.isArray(prop.k)) return index !== undefined ? (prop.k[index] ?? 0) : prop.k[0] ?? 0;
    return typeof prop.k === 'number' ? prop.k : 0;
  }
  if (Array.isArray(prop.k) && prop.k.length > 0) {
    const kf = prop.k[0];
    if (kf.s) return index !== undefined ? (kf.s[index] ?? 0) : kf.s[0] ?? 0;
  }
  return 0;
}

export function buildUpdatedProp(existing: any, newValue: number, index?: number): any {
  if (!existing) {
    if (index !== undefined) {
      const arr = [100, 100, 100];
      arr[index] = newValue;
      return { a: 0, k: arr };
    }
    return { a: 0, k: newValue };
  }
  
  if (existing.a === 0) {
    if (index !== undefined) {
      let arr: number[];
      if (Array.isArray(existing.k)) {
        arr = [...existing.k];
        while (arr.length < 3) {
          arr.push(100);
        }
      } else {
        arr = [100, 100, 100];
      }
      arr[index] = newValue;
      return { ...existing, k: arr };
    }
    return { ...existing, k: newValue };
  }
  
  if (!existing.k || !Array.isArray(existing.k) || existing.k.length === 0) {
    const defaultValue = index !== undefined ? [100, 100, 100] : [newValue];
    if (index !== undefined) {
      defaultValue[index] = newValue;
    }
    return { ...existing, k: [{ t: 0, s: defaultValue }] };
  }
  
  const keyframes = JSON.parse(JSON.stringify(existing.k));
  if (keyframes[0]) {
    if (index !== undefined) {
      if (Array.isArray(keyframes[0].s)) {
        keyframes[0].s = [...keyframes[0].s];
        while (keyframes[0].s.length < 3) {
          keyframes[0].s.push(100);
        }
      } else {
        keyframes[0].s = [100, 100, 100];
      }
      keyframes[0].s[index] = newValue;
    } else {
      keyframes[0].s = [newValue];
    }
  }
  return { ...existing, k: keyframes };
}

export function lottieColorToHex(c: number[]): string {
  const r = Math.round((c[0] ?? 0) * 255);
  const g = Math.round((c[1] ?? 0) * 255);
  const b = Math.round((c[2] ?? 0) * 255);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function hexToLottieColor(hex: string): [number, number, number, number] {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  return [r, g, b, 1];
}

export function findFillShape(shapes: LottieShape[] | undefined): LottieShape | null {
  if (!shapes) return null;
  for (const s of shapes) {
    if (s.ty === 'fl' || s.ty === 'gf') return s;
    if (s.ty === 'gr' && s.it) {
      const found = findFillShape(s.it);
      if (found) return found;
    }
  }
  return null;
}

export function findStrokeShape(shapes: LottieShape[] | undefined): LottieShape | null {
  if (!shapes) return null;
  for (const s of shapes) {
    if (s.ty === 'st' || s.ty === 'gs') return s;
    if (s.ty === 'gr' && s.it) {
      const found = findStrokeShape(s.it);
      if (found) return found;
    }
  }
  return null;
}

export function updateFillColor(shapes: LottieShape[], color: [number, number, number, number]): LottieShape[] {
  return shapes.map((shape) => {
    if (shape.ty === 'fl' || shape.ty === 'gf') {
      return { ...shape, c: { a: 0, k: color } };
    }
    if (shape.ty === 'gr' && shape.it) {
      return { ...shape, it: updateFillColor(shape.it, color) };
    }
    return shape;
  });
}

export function updateFillOpacity(shapes: LottieShape[], opacity: number): LottieShape[] {
  return shapes.map((shape) => {
    if (shape.ty === 'fl' || shape.ty === 'gf') {
      return { ...shape, o: { a: 0, k: opacity } };
    }
    if (shape.ty === 'gr' && shape.it) {
      return { ...shape, it: updateFillOpacity(shape.it, opacity) };
    }
    return shape;
  });
}

export function updateStrokeColor(shapes: LottieShape[], color: [number, number, number, number]): LottieShape[] {
  return shapes.map((shape) => {
    if (shape.ty === 'st' || shape.ty === 'gs') {
      return { ...shape, c: { a: 0, k: color } };
    }
    if (shape.ty === 'gr' && shape.it) {
      return { ...shape, it: updateStrokeColor(shape.it, color) };
    }
    return shape;
  });
}

export function updateStrokeWidth(shapes: LottieShape[], width: number): LottieShape[] {
  return shapes.map((shape) => {
    if (shape.ty === 'st' || shape.ty === 'gs') {
      return { ...shape, w: { a: 0, k: width } };
    }
    if (shape.ty === 'gr' && shape.it) {
      return { ...shape, it: updateStrokeWidth(shape.it, width) };
    }
    return shape;
  });
}

export function updateStrokeOpacity(shapes: LottieShape[], opacity: number): LottieShape[] {
  return shapes.map((shape) => {
    if (shape.ty === 'st' || shape.ty === 'gs') {
      return { ...shape, o: { a: 0, k: opacity } };
    }
    if (shape.ty === 'gr' && shape.it) {
      return { ...shape, it: updateStrokeOpacity(shape.it, opacity) };
    }
    return shape;
  });
}
