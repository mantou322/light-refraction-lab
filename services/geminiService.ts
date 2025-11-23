import { GoogleGenAI } from "@google/genai";
import { Material } from '../types';

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getExplanation = async (
  angle: number,
  m1: Material,
  m2: Material,
  isTIR: boolean
): Promise<string> => {
  if (!ai) {
    return "AI 导师正在休息（缺少 API Key）。不过看看那些激光弯曲的样子吧！";
  }

  try {
    const prompt = `
      你是一位名叫“光子教授”的有趣、热情的三年级科学老师。
      请用中文解释这个模拟中光线发生了什么。
      
      场景：
      - 光线从 ${m1.name} (折射率: ${m1.ior}) 进入 ${m2.name} (折射率: ${m2.ior})。
      - 入射光的角度是 ${angle} 度。
      - 全反射现象正在发生: ${isTIR ? '是' : '否'}。

      规则：
      1. 保持非常简短（最多 2-3 句话）。
      2. 使用简单的类比（比如汽车在泥地与柏油路上行驶，或者弹球）。
      3. 语气要兴奋！
      4. 如果全反射为“是”，解释为什么光被困住了。
      5. 如果全反射为“否”，解释为什么它弯曲了（偏向还是偏离法线）。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "哎呀，我刚才走神了！";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "我现在无法连接到科学数据库。";
  }
};