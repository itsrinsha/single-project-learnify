import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, color }) => {
  const colorStyles = {
    blue: 'bg-primary-50/85 text-primary-600 border-primary-100',
    green: 'bg-success-50/85 text-success-600 border-success-100',
    amber: 'bg-warning-50/85 text-warning-600 border-warning-100',
    red: 'bg-error-50/85 text-error-600 border-error-100',
    purple: 'bg-indigo-50/85 text-indigo-600 border-indigo-100',
    cyan: 'bg-cyan-50/85 text-cyan-600 border-cyan-100',
    slate: 'bg-slate-50/85 text-slate-600 border-slate-100',
  };

  return (
    <div className="card p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-2.5 rounded-xl border ${colorStyles[color] || colorStyles.blue}`}>
          {Icon ? React.createElement(Icon, { size: 20 }) : null}
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-[11px] font-black ${trend > 0 ? 'text-success-600' : 'text-error-600'}`}>
            {trend > 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mb-1">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );
};

export default StatCard;
