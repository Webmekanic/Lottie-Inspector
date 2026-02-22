import { LottieShape } from '../types/lottie';
import { SHAPE_TYPE_LABELS } from './lottieConstants';

export interface ShapeTreeNode {
  id: string;
  name: string;
  type: string;
  children?: ShapeTreeNode[];
}

export function buildShapeTree(shapes: LottieShape[], parentId: string): ShapeTreeNode[] {
  return shapes.map((shape, idx) => {
    const id = `${parentId}-s${idx}`;
    const label = shape.nm || SHAPE_TYPE_LABELS[shape.ty as string] || shape.ty || `Shape ${idx}`;
    const children =
      shape.ty === 'gr' && shape.it && shape.it.length > 0
        ? buildShapeTree(shape.it, id)
        : undefined;
    return { id, name: label, type: SHAPE_TYPE_LABELS[shape.ty as string] || shape.ty || '?', children };
  });
}
