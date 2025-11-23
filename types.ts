export interface Material {
  name: string;
  ior: number; // Index of Refraction
  color: string;
  description: string;
}

export const MATERIALS: Material[] = [
  { name: '真空 / 太空', ior: 1.00, color: '#1a1a2e', description: '真空环境，光速最快！' },
  { name: '空气', ior: 1.0003, color: '#eef2f3', description: '我们呼吸的空气。' },
  { name: '水', ior: 1.33, color: '#00b4d8', description: '比如像在游泳池里。' },
  { name: '玻璃', ior: 1.50, color: '#a8dadc', description: '比如窗户或镜片。' },
  { name: '钻石', ior: 2.42, color: '#e0aaff', description: '超级闪亮且致密！' },
];

export interface SimulationState {
  angle: number; // Incident angle in degrees
  material1: Material;
  material2: Material;
}

export interface RayPath {
  startX: number;
  startY: number;
  centerX: number;
  centerY: number;
  endXRefract: number;
  endYRefract: number;
  endXReflect: number;
  endYReflect: number;
  angleRefract: number | null; // Null implies Total Internal Reflection
  isTIR: boolean;
}