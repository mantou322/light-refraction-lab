import React from 'react';
import { MATERIALS, Material } from '../types';
import { Settings2, ArrowDownToLine, Waves, Info } from 'lucide-react';

interface Props {
  angle: number;
  setAngle: (a: number) => void;
  material1: Material;
  setMaterial1: (m: Material) => void;
  material2: Material;
  setMaterial2: (m: Material) => void;
}

const ControlPanel: React.FC<Props> = ({ 
  angle, setAngle, 
  material1, setMaterial1, 
  material2, setMaterial2 
}) => {
  return (
    <div className="bg-cyber-panel border border-white/5 rounded-xl p-6 flex flex-col gap-6 shadow-xl h-full">
      
      <div className="flex items-center gap-2 mb-2 border-b border-white/10 pb-4">
        <Settings2 className="w-6 h-6 text-cyber-accent" />
        <h2 className="text-xl font-bold text-white tracking-wider">实验室控制台</h2>
      </div>

      {/* Angle Slider */}
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2 text-cyber-accent font-mono">
            <ArrowDownToLine size={16} />
            入射角度
          </label>
          <span className="bg-cyber-dark px-2 py-1 rounded border border-white/10 text-white font-mono">
            {angle}°
          </span>
        </div>
        <input 
          type="range" 
          min="0" 
          max="89" 
          value={angle} 
          onChange={(e) => setAngle(parseInt(e.target.value))}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyber-accent hover:accent-white transition-all"
        />
      </div>

      {/* Material 1 Selector */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm text-purple-400 font-mono">
          <Waves size={16} />
          上层介质 (起点)
        </label>
        <div className="grid grid-cols-1 gap-2">
          {MATERIALS.map((m) => (
            <button
              key={m.name}
              onClick={() => setMaterial1(m)}
              className={`
                px-3 py-2 text-sm rounded-md font-medium text-left transition-all flex justify-between
                ${material1.name === m.name 
                  ? 'bg-purple-500/20 text-purple-200 border border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'}
              `}
            >
              <span>{m.name}</span>
              <span className="opacity-50 text-xs mt-1">n={m.ior}</span>
            </button>
          ))}
        </div>
      </div>

       {/* Material 2 Selector */}
       <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm text-cyan-400 font-mono">
          <Waves size={16} />
          下层介质 (终点)
        </label>
        <div className="grid grid-cols-1 gap-2">
          {MATERIALS.map((m) => (
            <button
              key={m.name}
              onClick={() => setMaterial2(m)}
              className={`
                px-3 py-2 text-sm rounded-md font-medium text-left transition-all flex justify-between
                ${material2.name === m.name 
                  ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-transparent'}
              `}
            >
               <span>{m.name}</span>
               <span className="opacity-50 text-xs mt-1">n={m.ior}</span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="mt-auto bg-blue-900/20 p-3 rounded border border-blue-500/30 text-xs text-blue-200 flex gap-2">
        <Info className="shrink-0 w-4 h-4 mt-0.5" />
        <p>试着移动“入射角度”滑块，观察光束何时弯曲或反弹！</p>
      </div>

    </div>
  );
};

export default ControlPanel;