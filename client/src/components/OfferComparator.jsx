// ============================================
// HuntOS Offer & Compensation Comparator
// Engineered by Niranjan Krishnakumar
// ============================================

import React, { useState } from 'react';
import { Trophy, DollarSign, Calculator, Building, Sparkles } from 'lucide-react';

const OfferComparator = () => {
  const [offers, setOffers] = useState([
    {
      company: 'Google',
      role: 'SWE L3',
      base: 24,
      bonus: 3.5,
      stocks: 18,
      location: 'Bangalore',
    },
    {
      company: 'Stripe',
      role: 'Software Engineer',
      base: 26,
      bonus: 4,
      stocks: 12,
      location: 'Remote',
    },
  ]);

  const updateOffer = (idx, field, value) => {
    const updated = [...offers];
    updated[idx][field] = value;
    setOffers(updated);
  };

  const addOffer = () => {
    if (offers.length >= 4) return;
    setOffers([
      ...offers,
      { company: `Offer ${offers.length + 1}`, role: 'Engineer', base: 20, bonus: 2, stocks: 5, location: 'Hyderabad' },
    ]);
  };

  const removeOffer = (idx) => {
    if (offers.length <= 1) return;
    setOffers(offers.filter((_, i) => i !== idx));
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <Calculator size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Offer & Compensation Comparator</h3>
            <p className="text-xs text-slate-500">
              Calculate total first-year comp (CTC) and break down base vs RSUs/stocks.
            </p>
          </div>
        </div>
        {offers.length < 4 && (
          <button
            onClick={addOffer}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
          >
            + Add Another Offer
          </button>
        )}
      </div>

      {/* Grid of Offers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {offers.map((offer, idx) => {
          const totalFirstYear =
            (parseFloat(offer.base) || 0) +
            (parseFloat(offer.bonus) || 0) +
            (parseFloat(offer.stocks) || 0);

          return (
            <div
              key={idx}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <Building size={14} className="text-indigo-600" />
                    <input
                      type="text"
                      value={offer.company}
                      onChange={(e) => updateOffer(idx, 'company', e.target.value)}
                      className="font-bold text-sm text-slate-900 bg-transparent border-b border-dashed border-slate-300 focus:border-indigo-600 outline-none w-28"
                    />
                  </div>
                  {offers.length > 1 && (
                    <button
                      onClick={() => removeOffer(idx)}
                      className="text-slate-400 hover:text-rose-600 text-xs p-1"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold uppercase">Role</label>
                    <input
                      type="text"
                      value={offer.role}
                      onChange={(e) => updateOffer(idx, 'role', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold uppercase">Base Salary (LPA)</label>
                    <input
                      type="number"
                      value={offer.base}
                      onChange={(e) => updateOffer(idx, 'base', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold uppercase">Joining Bonus (LPA)</label>
                    <input
                      type="number"
                      value={offer.bonus}
                      onChange={(e) => updateOffer(idx, 'bonus', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 font-semibold uppercase">1st Year Stocks (LPA)</label>
                    <input
                      type="number"
                      value={offer.stocks}
                      onChange={(e) => updateOffer(idx, 'stocks', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Card Summary */}
              <div className="mt-4 pt-3 border-t border-slate-200/80">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                  1st Year Total Compensation
                </span>
                <div className="text-xl font-extrabold text-emerald-600">
                  ₹{totalFirstYear.toFixed(1)} LPA
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OfferComparator;
