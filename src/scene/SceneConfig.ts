type VectorType = string

export interface VectorBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface SceneConfig {
  vectorBounds: VectorBounds;
  originX: number;
  originY: number;
  worldWidth?: number;
  worldHeight?: number;
  refMagnitudes?: Partial<Record<VectorType, number>>;
}
