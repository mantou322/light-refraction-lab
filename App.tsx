import React, { useState } from 'react';
import SimulationCanvas from './components/SimulationCanvas';
import ControlPanel from './components/ControlPanel';
import GeminiTutor from './components/GeminiTutor';
import { MATERIALS, Material } from './types';
import { Zap } from 'lucide-react';

const App: React.FC = () => {
  // Default State: Air to Glass, 45 degrees
  const [angle, setAngle] = useState<number>(45);
  const [material1, setMaterial1] = useState<Material>(MATERIALS[1]); // Air
  const [material2, setMaterial2] = useState<Material>(MATERIALS[3]); // Glass

  return (
    <div className="min-h-screen bg-[#050508] text-white p-4 md:p-8 font-sans selection:bg-cyan-500/30">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-8 flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyber-accent/10 rounded-lg border border-cyber-accent/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Zap className="w-8 h-8 text-cyber-accent" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-white">
              LUMINA <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyber-accent to-purple-500">LAB</span>
            </h1>
            <p className="text-gray-400 text-sm font-mono mt-1">光学模拟单元 V1.0</p>
          </div>
        </div>
        <div className="hidden md:block text-right">
           <div className="text-xs text-gray-500 uppercase tracking-widest mb-1">当前实验</div>
           <div className="text-sm font-bold text-cyan-400">{material1.name} ➔ {material2.name}</div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)] min-h-[600px]">
        
        {/* Left Col: Controls (3 cols) */}
        <div className="lg:col-span-3 h-full flex flex-col gap-6">
          <ControlPanel 
            angle={angle} setAngle={setAngle}
            material1={material1} setMaterial1={setMaterial1}
            material2={material2} setMaterial2={setMaterial2}
          />
        </div>

        {/* Middle Col: Visualizer (6 cols) */}
        <div className="lg:col-span-6 h-full flex flex-col">
          <SimulationCanvas 
            angle={angle}
            material1={material1}
            material2={material2}
          />
        </div>

        {/* Right Col: AI Tutor & Stats (3 cols) */}
        <div className="lg:col-span-3 h-full flex flex-col gap-6">
          <GeminiTutor 
             angle={angle}
             material1={material1}
             material2={material2}
          />
          
          {/* Quick Stats Panel */}
          <div className="bg-cyber-panel border border-white/10 rounded-xl p-6 flex-1 flex flex-col justify-center gap-4">
             <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest border-b border-white/10 pb-2">数据流</h4>
             
             <div className="flex justify-between items-end">
               <span className="text-gray-500 text-sm">入射光速</span>
               <span className="text-xl font-mono text-white">{(299792 / material1.ior).toFixed(0)} <span className="text-xs text-gray-600">km/s</span></span>
             </div>
             
             <div className="flex justify-between items-end">
               <span className="text-gray-500 text-sm">折射光速</span>
               <span className="text-xl font-mono text-cyber-accent">{(299792 / material2.ior).toFixed(0)} <span className="text-xs text-gray-600">km/s</span></span>
             </div>

             <div className="mt-4 p-3 bg-white/5 rounded text-xs text-gray-400 font-mono leading-relaxed">
               你知道吗？光在密度较大的物质中速度会变慢，这正是导致它弯曲的原因！
             </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;