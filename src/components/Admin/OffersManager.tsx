import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SpecialOffer } from '../../types';
import { Plus, Tag, Trash2, Edit2, Sparkles, Check, X } from 'lucide-react';

export const OffersManager: React.FC = () => {
  const { offers, addOffer, updateOffer, deleteOffer } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<SpecialOffer | null>(null);

  const [title, setTitle] = useState('');
  const [discountBadge, setDiscountBadge] = useState('');
  const [description, setDescription] = useState('');
  const [highlightText, setHighlightText] = useState('');
  const [active, setActive] = useState(true);

  const openAdd = () => {
    setEditingOffer(null);
    setTitle('');
    setDiscountBadge('10% Off Family Box');
    setDescription('');
    setHighlightText('');
    setActive(true);
    setIsModalOpen(true);
  };

  const openEdit = (offer: SpecialOffer) => {
    setEditingOffer(offer);
    setTitle(offer.title);
    setDiscountBadge(offer.discountBadge);
    setDescription(offer.description);
    setHighlightText(offer.highlightText || '');
    setActive(offer.active);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !discountBadge.trim()) return;

    if (editingOffer) {
      updateOffer(editingOffer.id, {
        title: title.trim(),
        discountBadge: discountBadge.trim(),
        description: description.trim(),
        highlightText: highlightText.trim() || undefined,
        active,
      });
    } else {
      addOffer({
        title: title.trim(),
        discountBadge: discountBadge.trim(),
        description: description.trim(),
        highlightText: highlightText.trim() || undefined,
        active,
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif-brand text-[#fdfaf4]">
            Special Offers &amp; Promotions
          </h2>
          <p className="text-xs text-[#c99846]">
            Configure promotional deals and festive packages displayed on the homepage
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#c99846] to-[#a8792c] hover:brightness-110 text-[#140508] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Special Offer</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="bg-[#1b070d] border border-[#c99846]/30 rounded-2xl p-5 space-y-4 shadow-lg flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-[#c99846] text-[#140508] px-2.5 py-0.5 rounded-full">
                  {offer.discountBadge}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                    offer.active
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {offer.active ? 'Active on Website' : 'Inactive'}
                </span>
              </div>

              <h3 className="text-lg font-bold font-serif-brand text-[#fdfaf4]">
                {offer.title}
              </h3>
              <p className="text-xs text-[#f8f1e3]/80 leading-relaxed">
                {offer.description}
              </p>
              {offer.highlightText && (
                <div className="text-[11px] text-[#e8c86a] italic bg-[#120407] p-2 rounded-lg border border-[#c99846]/20">
                  {offer.highlightText}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-[#c99846]/20 flex items-center justify-between">
              <button
                onClick={() => updateOffer(offer.id, { active: !offer.active })}
                className="text-xs text-[#f8f1e3]/70 hover:text-white cursor-pointer"
              >
                {offer.active ? 'Deactivate' : 'Activate'}
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEdit(offer)}
                  className="p-1.5 text-[#e8c86a] hover:bg-[#2b0c15] rounded-lg cursor-pointer"
                  title="Edit Offer"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteOffer(offer.id)}
                  className="p-1.5 text-rose-400 hover:bg-rose-950 rounded-lg cursor-pointer"
                  title="Delete Offer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Offer Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#18060b] border border-[#c99846]/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#c99846]/20">
              <h3 className="text-lg font-bold font-serif-brand text-[#fdfaf4]">
                {editingOffer ? 'Edit Special Offer' : 'Create Special Offer'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#f8f1e3]/60 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#e8c86a] block uppercase tracking-wider">
                  Offer Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Weekend Eid Sweet Box"
                  className="w-full bg-[#240810] border border-[#c99846]/30 rounded-xl px-3.5 py-2 text-xs text-[#fdfaf4] focus:outline-none focus:border-[#e8c86a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#e8c86a] block uppercase tracking-wider">
                  Discount / Badge Label *
                </label>
                <input
                  type="text"
                  value={discountBadge}
                  onChange={(e) => setDiscountBadge(e.target.value)}
                  placeholder="e.g. Free Gift Box / 15% Off"
                  className="w-full bg-[#240810] border border-[#c99846]/30 rounded-xl px-3.5 py-2 text-xs text-[#fdfaf4] focus:outline-none focus:border-[#e8c86a]"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#e8c86a] block uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Offer details and applicability in Shabqadar..."
                  className="w-full bg-[#240810] border border-[#c99846]/30 rounded-xl px-3.5 py-2 text-xs text-[#fdfaf4] focus:outline-none focus:border-[#e8c86a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#e8c86a] block uppercase tracking-wider">
                  Highlight Note (Optional)
                </label>
                <input
                  type="text"
                  value={highlightText}
                  onChange={(e) => setHighlightText(e.target.value)}
                  placeholder="e.g. Freshly baked every weekend"
                  className="w-full bg-[#240810] border border-[#c99846]/30 rounded-xl px-3.5 py-2 text-xs text-[#fdfaf4] focus:outline-none focus:border-[#e8c86a]"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeOffer"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded accent-[#c99846] w-4 h-4 cursor-pointer"
                />
                <label htmlFor="activeOffer" className="text-xs text-[#f8f1e3]/85 cursor-pointer">
                  Display actively on website homepage
                </label>
              </div>

              <div className="pt-3 border-t border-[#c99846]/20 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#260810] text-[#f8f1e3]/70 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#c99846] text-[#140508] font-bold text-xs uppercase tracking-wider cursor-pointer"
                >
                  Save Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
