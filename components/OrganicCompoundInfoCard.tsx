
import React from 'react';
import type { OrganicCompoundInfo } from '../types';

interface OrganicCompoundInfoCardProps {
  info: OrganicCompoundInfo;
  onNew: () => void;
}

const StatRow: React.FC<{ label: string; value?: string | number; }> = ({ label, value }) => {
  if (value === undefined || value === null || value === '') return null;
  return (
    <div className="flex items-start justify-between py-4">
      <dt className="w-40 text-cyan-400 text-right font-bold text-sm shrink-0">{label}</dt>
      <dd className="flex-1 pl-6 text-slate-200 text-right font-medium leading-relaxed text-sm">{value}</dd>
    </div>
  );
};

export const OrganicCompoundInfoCard: React.FC<OrganicCompoundInfoCardProps> = ({ info, onNew }) => {
  const isComparison = info.family === 'مقارنة';

  return (
    <div className="w-full max-w-3xl mx-auto py-10 px-4 animate-fade-in">
      <div className="bg-[#1e293b] border border-slate-700/30 rounded-[2rem] overflow-hidden shadow-2xl">
        <div className="p-8">
          <h3 className="text-white font-bold text-lg mb-4 text-right border-b-2 border-slate-700 pb-4">
            {isComparison ? info.name : info.name}
          </h3>
          {isComparison ? (
            <div className="text-slate-300 leading-loose text-right whitespace-pre-wrap">
              {info.description}
            </div>
          ) : (
            <>
              {info.lewisStructureImage && (
                  <section className="mb-8">
                      <h3 className="text-cyan-400 font-bold text-sm mb-4 text-center uppercase tracking-widest">تمثيل لويس والتركيب</h3>
                      <div className="bg-white rounded-3xl p-6 border border-slate-700/50 flex justify-center shadow-inner min-h-[160px] items-center">
                          <img src={info.lewisStructureImage} alt={`تركيب لويس لـ ${info.name}`} className="max-h-64 object-contain" />
                      </div>
                  </section>
              )}
              <dl className="divide-y divide-slate-700/50">
                  <StatRow label="العائلة الكيميائية" value={info.family} />
                  <StatRow label="تسمية IUPAC" value={info.iupacNaming} />
                  <StatRow label="الحالة عند STP" value={info.stateAtSTP} />
                  <StatRow label="نقطة الغليان" value={info.boilingPoint} />
                  <StatRow label="نقطة الانصهار" value={info.meltingPoint} />
                  <StatRow label="الكثافة" value={info.density} />
                  <StatRow label="الذوبانية" value={info.solubility} />
                  <StatRow label="عدد المتشكلات" value={info.isomersCount} />
                  <StatRow label="تصنيف القابلية للاشتعال" value={info.flammabilityRating} />
              </dl>
            </>
          )}
        </div>
        <div className="p-6 bg-slate-900/40 border-t border-slate-700/50">
            <button onClick={onNew} className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-900 py-3 rounded-xl font-bold transition-all shadow-md active:scale-95">استكشاف جديد</button>
        </div>
      </div>
    </div>
  );
};
