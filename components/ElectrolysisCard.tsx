
import React from 'react';
import type { ElectrolysisInfo } from '../types';

export const ElectrolysisCard: React.FC<{ info: ElectrolysisInfo; onNew: () => void }> = ({ info, onNew }) => {
  if (!info) return null;

  return (
    <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-3xl m-4 text-slate-800 dark:text-white relative flex flex-col animate-slide-up max-h-[90vh] overflow-y-auto scrollbar-hide">
      <h2 className="text-3xl font-bold text-cyan-600 dark:text-cyan-300 mb-4 text-center">
        التحليل الكهربائي: {info.electrolyte || 'محلول غير محدد'}
      </h2>

      <div className="w-full bg-white/50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-300 dark:border-slate-700 mb-4">
        <h3 className="text-lg text-cyan-600 dark:text-cyan-400 font-semibold mb-2 text-center">مخطط خلية التحليل</h3>
        <div className="bg-white dark:bg-slate-900 p-2 rounded-md shadow-inner flex justify-center items-center min-h-[250px]">
          {info.diagramImage ? (
            <img src={info.diagramImage} alt="Electrolysis Cell Diagram" className="max-w-full h-auto" />
          ) : (
            <p className="animate-pulse text-slate-500">...جاري تحميل المخطط</p>
          )}
        </div>
      </div>
      
      <div className="w-full text-center bg-white/50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-300 dark:border-slate-700 mb-4">
        <h3 className="text-lg text-slate-700 dark:text-slate-300 font-semibold mb-2">الجهد الأدنى اللازم</h3>
        <p dir="ltr" className="text-3xl font-mono py-2 text-indigo-600 dark:text-indigo-300 font-bold">{info.minVoltage || '---'}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4 text-center">
        <div className="w-full bg-red-100 dark:bg-red-900/50 p-4 rounded-lg border border-red-300 dark:border-red-700">
          <h3 className="text-lg text-red-700 dark:text-red-400 font-semibold mb-2">عند المصعد (أكسدة)</h3>
          <p className="text-md font-bold text-slate-700 dark:text-slate-300 mb-2">الناتج: {info.anodeProduct || '---'}</p>
          <code dir="ltr" className="text-sm font-mono text-red-900 dark:text-red-200 block bg-white/50 dark:bg-black/20 p-2 rounded">{info.anodeReaction || '---'}</code>
        </div>
        <div className="w-full bg-blue-100 dark:bg-blue-900/50 p-4 rounded-lg border border-blue-300 dark:border-blue-700">
          <h3 className="text-lg text-blue-700 dark:text-blue-400 font-semibold mb-2">عند المهبط (اختزال)</h3>
           <p className="text-md font-bold text-slate-700 dark:text-slate-300 mb-2">الناتج: {info.cathodeProduct || '---'}</p>
          <code dir="ltr" className="text-sm font-mono text-blue-900 dark:text-blue-200 block bg-white/50 dark:bg-black/20 p-2 rounded">{info.cathodeReaction || '---'}</code>
        </div>
      </div>

      <div className="w-full text-right bg-white/50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-300 dark:border-slate-700 mb-4">
        <h3 className="text-lg text-cyan-600 dark:text-cyan-400 font-semibold mb-2">التطبيقات العملية</h3>
        <p className="text-md text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{info.applications || 'لا توجد تطبيقات مدرجة.'}</p>
      </div>
      
      <div className="w-full mt-4 flex flex-col gap-3">
        <button 
          onClick={onNew}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-colors w-full text-lg mt-2"
        >
          تحليل جديد
        </button>
      </div>
    </div>
  );
};
