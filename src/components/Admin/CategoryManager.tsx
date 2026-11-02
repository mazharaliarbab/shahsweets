import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';
import { BRAND_ASSETS } from '../../data/initialData';
import { Plus, Trash2, Edit2, FolderTree, X, Check } from 'lucide-react';

export const CategoryManager: React.FC = () => {
  const { categories, products, addCategory, updateCategory, deleteCategory } = useStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(BRAND_ASSETS.categoryMithai);

  const openAdd = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setImage(BRAND_ASSETS.categoryMithai);
    setIsModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setImage(cat.image);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    if (editingCategory) {
      updateCategory(editingCategory.id, {
        name: name.trim(),
        slug,
        description: description.trim(),
        image,
      });
    } else {
      addCategory({
        name: name.trim(),
        slug,
        description: description.trim(),
        image,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-serif-brand text-[#fdfaf4]">
            Category Management
          </h2>
          <p className="text-xs text-[#c99846]">
            Organize products into traditional mithai, cakes, and fresh bakery sections
          </p>
        </div>

        <button
          onClick={openAdd}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-[#c99846] to-[#a8792c] hover:brightness-110 text-[#140508] font-bold text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl shadow-lg transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((cat) => {
          const productCount = products.filter((p) => p.category === cat.name).length;
          return (
            <div
              key={cat.id}
              className="bg-[#1b070d] border border-[#c99846]/30 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between"
            >
              <div className="relative h-40 overflow-hidden bg-black">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 bg-[#140508]/85 px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[#e8c86a] border border-[#c99846]/30">
                  {productCount} Products
                </div>
              </div>

              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold font-serif-brand text-[#fdfaf4]">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-[#f8f1e3]/75 mt-1 line-clamp-2">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#c99846]/20 flex items-center justify-end gap-2">
                  <button
                    onClick={() => openEdit(cat)}
                    className="p-1.5 text-[#e8c86a] hover:bg-[#2b0c15] rounded-lg cursor-pointer"
                    title="Edit category"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        confirm(
                          `Are you sure you want to delete category "${cat.name}"? Existing products will remain.`
                        )
                      ) {
                        deleteCategory(cat.id);
                      }
                    }}
                    className="p-1.5 text-rose-400 hover:bg-rose-950 rounded-lg cursor-pointer"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#18060b] border border-[#c99846]/40 rounded-3xl p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#c99846]/20">
              <h3 className="text-lg font-bold font-serif-brand text-[#fdfaf4]">
                {editingCategory ? 'Edit Category' : 'Create Category'}
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
                  Category Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Saffron &amp; Halwa Delights"
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
                  placeholder="Brief summary of items in this category..."
                  className="w-full bg-[#240810] border border-[#c99846]/30 rounded-xl px-3.5 py-2 text-xs text-[#fdfaf4] focus:outline-none focus:border-[#e8c86a]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#e8c86a] block uppercase tracking-wider">
                  Category Image URL
                </label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  className="w-full bg-[#240810] border border-[#c99846]/30 rounded-xl px-3.5 py-2 text-xs text-[#fdfaf4] focus:outline-none focus:border-[#e8c86a]"
                />
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
