import React, { useEffect, useState, useRef } from 'react';
import { Material } from '../types';
import { getExplanation } from '../services/geminiService';
import { Bot, Sparkles, Loader2 } from 'lucide-react';

interface Props {
  angle: number;
  material1: Material;
  material2: Material;
}

const GeminiTutor: React.FC<Props> = ({ angle, material1, material2 }) => {
  const [explanation, setExplanation] = useState<string>("调整控制参数开始实验！");
  const [loading, setLoading] = useState(false);
  // Fix: Use ReturnType<typeof setTimeout> to handle missing NodeJS namespace in browser environments
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Determine if TIR (Total Internal Reflection) is happening locally for the prompt logic
    const theta1 = angle * (Math.PI / 180);
    const n1 = material1.ior;
    const n2 = material2.ior;
    const sinTheta2 = (n1 / n2) * Math.sin(theta1);
    const isTIR = Math.abs(sinTheta2) > 1;

    setLoading(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      const text = await getExplanation(angle, material1, material2, isTIR);
      setExplanation(text);
      setLoading(false);
    }, 1500); // 1.5s debounce to avoid spamming API while sliding slider

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [angle, material1, material2]);

  return (
    <div className="bg-cyber-panel border border-white/10 rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden">
        {/* Decorative Grid Background */}
        <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <div className="flex items-center gap-2 z-10">
        <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2 rounded-full shadow-lg">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
          光子教授 (PROFESSOR PHOTON)
        </h3>
        {loading && <Loader2 className="w-4 h-4 text-purple-400 animate-spin ml-auto" />}
      </div>

      <div className="bg-black/40 rounded-lg p-4 min-h-[100px] border-l-4 border-purple-500 z-10 transition-all">
        <p className="text-gray-200 text-sm leading-relaxed font-medium">
          {loading && <span className="text-gray-500 animate-pulse">正在思考物理原理...</span>}
          {!loading && explanation}
        </p>
      </div>

      <div className="flex gap-2 z-10">
        <div className="text-[10px] uppercase tracking-wider text-gray-500 font-mono mt-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          AI 智能讲解
        </div>
      </div>
    </div>
  );
};

export default GeminiTutor;