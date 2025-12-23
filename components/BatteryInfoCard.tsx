
import React from 'react';
import type { BatteryInfo } from '../types';

interface BatteryInfoCardProps {
    info: BatteryInfo;
    onNew: () => void;
}

const InfoRow: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="flex justify-between items-start py-3 border-b border-slate-300 dark:border-slate-700 last:border-b-0">
            <dt className="text-md text-cyan-600 dark:text-cyan-400 font-semibold">{label}</dt>
            <dd className="text-md text-slate-700 dark:text-slate-200 text-left">{value}</dd>
        </div>
    );
};

export const BatteryInfoCard: React.FC<BatteryInfoCardProps> = ({ info, onNew }) => {
    return (
        <div className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl shadow-2xl p-6 w-full max-w-3xl m-4 text-slate-800 dark:text-white relative flex flex-col animate-slide-up max-h-[90vh] overflow-y-auto scrollbar-hide">
            <h2 className="text-3xl font-bold text-cyan-600 dark:text-cyan-300 mb-2 text-center">{info.name}</h2>
            <p className="text-xl font-mono text-slate-600 dark:text-slate-300 mb-6 text-center">{info.type}</p>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 bg-white/50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-300 dark:border-slate-700 text-center">
                    <h4 className="text-slate-500 dark:text-slate-400 font-semibold mb-1">الجهد الاسمي</h4>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400" dir="ltr">{info.nominalVoltage}</p>
                </div>
                <div className="flex-1 bg-white/50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-300 dark:border-slate-700 text-center">
                    <h4 className="text-slate-500 dark:text-slate-400 font-semibold mb-1">كثافة الطاقة</h4>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400" dir="ltr">{info.energyDensity}</p>
                </div>
                 <div className="flex-1 bg-white/50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-300 dark:border-slate-700 text-center">
                    <h4 className="text-slate-500 dark:text-slate-400 font-semibold mb-1">العمر الافتراضي</h4>
                    <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400" dir="ltr">{info.cycleLife}</p>
                </div>
            </div>

            <div className="w-full bg-white/50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-300 dark:border-slate-700 mb-4">
                <h3 className="text-lg text-cyan-600 dark:text-cyan-400 font-semibold mb-2 text-center">مكونات البطارية</h3>
                <div className="bg-white dark:bg-slate-900 p-2 rounded-md shadow-inner flex justify-center items-center min-h-[200px]">
                    {info.diagramImage ? (
                        <img src={info.diagramImage} alt={`Diagram of ${info.name}`} className="max-w-full h-auto" />
                    ) : (
                        <p className="animate-pulse text-slate-500 dark:text-slate-400">...جاري تحميل المخطط</p>
                    )}
                </div>
            </div>

            <div className="w-full text-right bg-white/50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-300 dark:border-slate-700 mb-4">
                <h3 className="text-lg text-cyan-600 dark:text-cyan-400 font-semibold mb-2">المواصفات الفنية</h3>
                <dl>
                    <InfoRow label="مادة المصعد (Anode)" value={info.anodeMaterial} />
                    <InfoRow label="مادة المهبط (Cathode)" value={info.cathodeMaterial} />
                    <InfoRow label="الإلكتروليت" value={info.electrolyte} />
                    <InfoRow label="خصائص الشحن" value={info.chargingCharacteristics} />
                    <InfoRow label="معدل التفريغ الذاتي" value={info.selfDischargeRate} />
                </dl>
            </div>

             <div className="grid md:grid-cols-2 gap-4 mb-4 text-center">
                <div className="w-full bg-red-100 dark:bg-red-900/50 p-4 rounded-lg border border-red-300 dark:border-red-700">
                  <h3 className="text-lg text-red-700 dark:text-red-400 font-semibold mb-2">تفاعل المصعد</h3>
                  <code dir="ltr" className="text-md font-mono text-red-900 dark:text-red-200">{info.anodeReaction}</code>
                </div>
                <div className="w-full bg-blue-100 dark:bg-blue-900/50 p-4 rounded-lg border border-blue-300 dark:border-blue-700">
                  <h3 className="text-lg text-blue-700 dark:text-blue-400 font-semibold mb-2">تفاعل المهبط</h3>
                  <code dir="ltr" className="text-md font-mono text-blue-900 dark:text-blue-200">{info.cathodeReaction}</code>
                </div>
            </div>

            {/* Safety & Environment Section */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
                 {info.safetyRisks && (
                    <div className="bg-orange-100 dark:bg-orange-900/30 p-4 rounded-lg border border-orange-300 dark:border-orange-700">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">⚠️</span>
                            <h3 className="text-lg font-bold text-orange-800 dark:text-orange-200">مخاطر السلامة</h3>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">{info.safetyRisks}</p>
                    </div>
                )}
                 {info.environmentalRecycling && (
                    <div className="bg-green-100 dark:bg-green-900/30 p-4 rounded-lg border border-green-300 dark:border-green-700">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-xl">♻️</span>
                            <h3 className="text-lg font-bold text-green-800 dark:text-green-200">الأثر البيئي والتدوير</h3>
                        </div>
                        <p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed">{info.environmentalRecycling}</p>
                    </div>
                )}
            </div>

            <div className="w-full text-right bg-white/50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-300 dark:border-slate-700 mb-4">
                <h3 className="text-lg text-cyan-600 dark:text-cyan-400 font-semibold mb-2">التطبيقات الشائعة</h3>
                <p className="text-md text-slate-700 dark:text-slate-300 leading-relaxed">{info.applications}</p>
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
