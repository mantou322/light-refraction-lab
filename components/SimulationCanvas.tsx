import React, { useMemo } from 'react';
import { Material, RayPath } from '../types';

interface Props {
  angle: number;
  material1: Material;
  material2: Material;
  width?: number;
  height?: number;
}

const SimulationCanvas: React.FC<Props> = ({ angle, material1, material2 }) => {
  // Fixed canvas coordinate system
  const VIEWBOX_W = 800;
  const VIEWBOX_H = 600;
  const CENTER_X = VIEWBOX_W / 2;
  const CENTER_Y = VIEWBOX_H / 2;
  const RAY_LENGTH = 400;

  // Physics Logic
  const calculatePhysics = (): RayPath => {
    // Convert incident angle to radians (angle is measured from the Normal - Y axis)
    // But for drawing, 0 degrees incident means coming straight down?
    // Usually in optics, 0 deg is along the normal.
    // Let's assume Angle is degrees from the Normal (Vertical).
    // Source is always in Top Half (Material 1).
    
    const theta1 = angle * (Math.PI / 180);
    const n1 = material1.ior;
    const n2 = material2.ior;

    // Snell's Law: n1 * sin(t1) = n2 * sin(t2)
    // sin(t2) = (n1/n2) * sin(t1)
    const sinTheta2 = (n1 / n2) * Math.sin(theta1);
    
    let isTIR = false;
    let theta2 = 0;

    if (Math.abs(sinTheta2) > 1) {
      isTIR = true;
      theta2 = 0; // Not used for drawing refraction
    } else {
      theta2 = Math.asin(sinTheta2);
    }

    // Coordinates for Source (Start)
    // Angle is relative to negative Y axis (Normal)
    // x = -sin(theta1) * L
    // y = -cos(theta1) * L
    const startX = CENTER_X - Math.sin(theta1) * RAY_LENGTH;
    const startY = CENTER_Y - Math.cos(theta1) * RAY_LENGTH;

    // Coordinates for Refraction (End in Mat 2)
    // Angle theta2 is relative to positive Y axis
    const endXRefract = CENTER_X + Math.sin(theta2) * RAY_LENGTH;
    const endYRefract = CENTER_Y + Math.cos(theta2) * RAY_LENGTH;

    // Coordinates for Reflection (End in Mat 1)
    // Reflection angle = Incident angle
    const endXReflect = CENTER_X + Math.sin(theta1) * RAY_LENGTH;
    const endYReflect = CENTER_Y - Math.cos(theta1) * RAY_LENGTH; // Goes back up

    return {
      startX,
      startY,
      centerX: CENTER_X,
      centerY: CENTER_Y,
      endXRefract,
      endYRefract,
      endXReflect,
      endYReflect,
      angleRefract: isTIR ? null : theta2 * (180 / Math.PI),
      isTIR
    };
  };

  const physics = useMemo(calculatePhysics, [angle, material1, material2]);

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden shadow-2xl border border-cyber-accent/20 bg-cyber-dark">
      {/* Background Materials */}
      <div className="absolute inset-0 flex flex-col pointer-events-none">
        <div 
          className="h-1/2 w-full transition-colors duration-500 relative"
          style={{ backgroundColor: `${material1.color}10` }} // 10 is low opacity hex
        >
          <div className="absolute top-4 left-4 text-xs font-mono text-cyan-500/50 uppercase tracking-widest">
            介质 1: {material1.name} (n={material1.ior})
          </div>
        </div>
        <div 
          className="h-1/2 w-full transition-colors duration-500 relative border-t border-cyber-glass"
          style={{ backgroundColor: `${material2.color}20` }}
        >
          <div className="absolute bottom-4 left-4 text-xs font-mono text-purple-500/50 uppercase tracking-widest">
            介质 2: {material2.name} (n={material2.ior})
          </div>
        </div>
      </div>

      <svg 
        viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`} 
        className="w-full h-full relative z-10"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10" fill="#00f0ff" />
          </marker>
        </defs>

        {/* Normal Line (Dashed) */}
        <line 
          x1={CENTER_X} y1={50} 
          x2={CENTER_X} y2={VIEWBOX_H - 50} 
          stroke="#ff00ff" 
          strokeWidth="1" 
          strokeDasharray="5,5" 
          opacity="0.4"
        />
        
        {/* Incident Ray */}
        <line 
          x1={physics.startX} y1={physics.startY} 
          x2={CENTER_X} y2={CENTER_Y} 
          stroke="#00f0ff" 
          strokeWidth="4" 
          filter="url(#glow)"
        />
        {/* Incident Particle Animation (Simulated with dashed line moving) */}
        <line 
          x1={physics.startX} y1={physics.startY} 
          x2={CENTER_X} y2={CENTER_Y} 
          stroke="white" 
          strokeWidth="2" 
          strokeDasharray="10, 20"
          className="animate-flow"
        />

        {/* Refracted Ray (Only if not TIR) */}
        {!physics.isTIR && (
          <>
            <line 
              x1={CENTER_X} y1={CENTER_Y} 
              x2={physics.endXRefract} y2={physics.endYRefract} 
              stroke="#00f0ff" 
              strokeWidth="3" 
              opacity="0.8"
              filter="url(#glow)"
            />
            <line 
              x1={CENTER_X} y1={CENTER_Y} 
              x2={physics.endXRefract} y2={physics.endYRefract} 
              stroke="white" 
              strokeWidth="1" 
              strokeDasharray="10, 20"
              className="animate-flow"
            />
          </>
        )}

        {/* Reflected Ray (Always present, but stronger in TIR) */}
        <line 
          x1={CENTER_X} y1={CENTER_Y} 
          x2={physics.endXReflect} y2={physics.endYReflect} 
          stroke="#00f0ff" 
          strokeWidth={physics.isTIR ? "4" : "1"} 
          opacity={physics.isTIR ? "1" : "0.3"} 
          filter="url(#glow)"
        />
        {physics.isTIR && (
           <line 
           x1={CENTER_X} y1={CENTER_Y} 
           x2={physics.endXReflect} y2={physics.endYReflect} 
           stroke="white" 
           strokeWidth="2" 
           strokeDasharray="10, 20"
           className="animate-flow"
         />
        )}

        {/* Angle Indicators (Arcs) */}
        {/* Incident Arc */}
        <path
          d={`M ${CENTER_X - 40 * Math.sin(angle * Math.PI/180)} ${CENTER_Y - 40 * Math.cos(angle * Math.PI/180)} A 40 40 0 0 1 ${CENTER_X} ${CENTER_Y - 40}`}
          stroke="white"
          fill="none"
          opacity="0.5"
        />
        <text x={CENTER_X - 60} y={CENTER_Y - 60} fill="white" fontSize="14" fontFamily="monospace">
          {angle}°
        </text>

        {/* Refracted Arc */}
        {!physics.isTIR && physics.angleRefract !== null && (
          <>
             <text x={CENTER_X + 20} y={CENTER_Y + 60} fill="white" fontSize="14" fontFamily="monospace">
              {Math.round(physics.angleRefract)}°
            </text>
          </>
        )}

        {/* TIR Label */}
        {physics.isTIR && (
          <text 
            x={CENTER_X} 
            y={CENTER_Y + 40} 
            fill="#ff0055" 
            fontSize="24" 
            fontWeight="bold" 
            textAnchor="middle"
            filter="url(#glow)"
          >
            全反射!
          </text>
        )}
      </svg>
    </div>
  );
};

export default SimulationCanvas;