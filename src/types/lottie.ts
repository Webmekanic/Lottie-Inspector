export interface LottieAnimation {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm?: string;
  ddd?: number;
  assets?: LottieAsset[];
  layers: LottieLayer[];
  markers?: LottieMarker[];
}

export interface LottieAsset {
  id: string;
  w?: number;
  h?: number;
  u?: string;
  p?: string;
  e?: number;
  layers?: LottieLayer[];
}
export interface LottieLayer {
  ddd?: number;
  ind: number;
  ty: number;
  nm: string;
  sr?: number;
  ks: LottieTransform;
  ao?: number;
  ip: number;
  op: number;
  st: number;
  bm?: number;
  parent?: number;
  
  // Shape layer specific
  shapes?: LottieShape[];
  
  // Text layer specific
  t?: any;
  
  // Solid layer specific
  sc?: string; 
  sw?: number; 
  sh?: number; 
  
  // Image/Precomp specific
  refId?: string;
  
  // Additional properties
  visible?: boolean;
  locked?: boolean;
}

export interface LottieTransform {
  a?: LottieKeyframeProperty;
  p: LottieKeyframeProperty;
  s: LottieKeyframeProperty;
  r: LottieKeyframeProperty;
  o: LottieKeyframeProperty;
  sk?: LottieKeyframeProperty;
  sa?: LottieKeyframeProperty;
}

export interface LottieKeyframeProperty {
  a: number;
  k: number | number[] | LottieKeyframe[];
}

export interface LottieKeyframe {
  t: number;
  s: number[];
  e?: number[];
  i?: { x: number[]; y: number[] };
  o?: { x: number[]; y: number[] };
}

export interface LottieShape {
  ty: string;
  nm: string;
  mn?: string;
  hd?: boolean;
  
  // Fill properties
  c?: LottieKeyframeProperty;
  o?: LottieKeyframeProperty;
  
  // Stroke properties
  lc?: number;
  lj?: number;
  ml?: number;
  w?: LottieKeyframeProperty;
  
  // Group properties
  it?: LottieShape[];
  
  // Transform
  ks?: LottieTransform;
  
  // Path
  ks_path?: LottieKeyframeProperty;
}

export interface LottieMarker {
  tm: number;
  cm: string;
  dr: number;
}

export type RenderMode = 'svg' | 'canvas';
export interface LayerTreeNode {
  layer: LottieLayer;
  children: LayerTreeNode[];
  depth: number;
}