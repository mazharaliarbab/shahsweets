import React, { useState, useRef } from 'react';
import { Product, WeightVariant, AvailabilityStatus } from '../../types';
import { useStore } from '../../context/StoreContext';
import { BRAND_ASSETS } from '../../data/initialData';
import { X, Upload, Plus, Trash2, AlertCircle, Check, Sparkles } from 'lucide-react';

interface ProductFormModalProps {
  initialProduct?: Product | null;
  onClose: () => void;
  onSaved: () => void;
}

const getCategoryDefaultImage = (catName?: string) => {
  if (catName === 'Cakes & Pastries') return BRAND_ASSETS.categoryCakes;
  if (catName === 'Fresh Bakery & Savories') return BRAND_ASSETS.categoryBakery;
  return BRAND_ASSETS.categoryMithai;
};

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  initialProduct,
  onClose,
  onSaved,
}) => {
  const { categories, addProduct, updateProduct, setSelectedCategory, setSearchQuery } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalScrollRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const priceInputRef = useRef<HTMLInputElement>(null);

  const isEditing = Boolean(initialProduct);

  const [name, setName] = useState(initialProduct?.name || '');
  const [category, setCategory] = useState(
    initialProduct?.category || (categories[0]?.name || 'Traditional Mithai')
  );
  const [image, setImage] = useState(
    initialProduct?.image || getCategoryDefaultImage(initialProduct?.category)
  );
  const [description, setDescription] = useState(initialProduct?.description || '');
  const [price, setPrice] = useState<string>(
    initialProduct?.price !== undefined ? String(initialProduct.price) : '350'
  );
  const [availability, setAvailability] = useState<AvailabilityStatus>(
    initialProduct?.availability || 'in_stock'
  );
  const [isFeatured, setIsFeatured] = useState<boolean>(initialProduct?.isFeatured || false);
  const [badge, setBadge] = useState<string>(initialProduct?.badge || '');

  // Weight variants
  const [hasVariants, setHasVariants] = useState<boolean>(
    initialProduct?.hasVariants !== undefined ? initialProduct.hasVariants : true
  );
  const [variants, setVariants] = useState<WeightVariant[]>(
    initialProduct?.variants && initialProduct.variants.length > 0
      ? initialProduct.variants
      : [
          { id: 'v-1', label: '250 g', price: 350, inStock: true },
          { id: 'v-2', label: '500 g', price: 680, inStock: true },
          { id: 'v-3', label: '1 kg', price: 1300, inStock: true },
        ]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    price?: string;
    variants?: string;
  }>({});

  // When category changes, auto-switch default image if user hasn't uploaded custom image
  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    const isDefault =
      !image ||
      image === BRAND_ASSETS.categoryMithai ||
      image === BRAND_ASSETS.categoryCakes ||
      image === BRAND_ASSETS.categoryBakery;
    if (isDefault) {
      setImage(getCategoryDefaultImage(newCat));
    }
  };

  // Handle local image file upload with client-side canvas compression to preserve localStorage quota
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setGeneralError('Image file is too large (max 15 MB). Please choose a smaller photo.');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const rawData = event.target?.result as string;
        if (!rawData) return;
        // Compress using Canvas so localStorage won't exceed quota
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 800;
          let width = img.width;
          let height = img.height;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.82);
            setImage(compressed);
            setGeneralError('');
          } else {
            setImage(rawData);
          }
        };
        img.src = rawData;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddVariant = () => {
    const newId = `v-${Date.now()}`;
    const baseP = Number(price) || 500;
    setVariants((prev) => [
      ...prev,
      { id: newId, label: 'Portion / Weight', price: baseP, inStock: true },
    ]);
    if (fieldErrors.variants) {
      setFieldErrors((prev) => ({ ...prev, variants: undefined }));
    }
  };

  const handleUpdateVariant = (id: string, field: keyof WeightVariant, value: any) => {
    setVariants((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
    if (fieldErrors.variants) {
      setFieldErrors((prev) => ({ ...prev, variants: undefined }));
    }
  };

  const handleRemoveVariant = (id: string) => {
    setVariants((prev) => prev.filter((v) => v.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { name?: string; price?: string; variants?: string } = {};

    // 1. Name is genuinely required
    if (!name.trim()) {
      errors.name = 'Product name is required. Please enter a sweet or bakery item name.';
    }

    // 2. Price validation
    const numPrice = Number(price);
    const hasValidBasePrice = !isNaN(numPrice) && numPrice > 0;
    const hasValidVariants =
      hasVariants && variants.length > 0 && variants.some((v) => Number(v.price) > 0);

    // If variants are enabled with prices, base price is NOT strictly required
    if (!hasValidBasePrice && !hasValidVariants) {
      errors.price = 'Please enter a valid base price in PKR (or enable weight variants with prices).';
    }

    // 3. Variant details if enabled
    if (hasVariants) {
      if (variants.length === 0) {
        errors.variants = 'Please add at least one weight variant or uncheck variants.';
      } else {
        const hasEmptyLabel = variants.some((v) => !v.label || !v.label.trim());
        if (hasEmptyLabel) {
          errors.variants = 'Please give each variant a label (e.g. 250 g, 500 g, 1 kg).';
        }
      }
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setGeneralError(Object.values(errors)[0] || 'Please complete all required fields.');
      // Scroll modal to top so error message is immediately visible to user
      if (modalScrollRef.current) {
        modalScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      if (errors.name && nameInputRef.current) {
        nameInputRef.current.focus();
      } else if (errors.price && priceInputRef.current) {
        priceInputRef.current.focus();
      }
      return;
    }

    setFieldErrors({});
    setGeneralError('');
    setIsLoading(true);

    // Calculate effective base price
    const effectivePrice = hasValidBasePrice
      ? numPrice
      : (hasValidVariants ? (variants.find((v) => Number(v.price) > 0)?.price || 350) : 350);

    // Fallback image if user left image empty
    const effectiveImage = image && image.trim() ? image.trim() : getCategoryDefaultImage(category);

    // Clean variants
    const validVariants = hasVariants
      ? variants
          .filter((v) => v.label && v.label.trim())
          .map((v) => ({
            ...v,
            label: v.label.trim(),
            price: Number(v.price) || effectivePrice,
          }))
      : [];

    const effectiveDescription =
      description.trim() ||
      `Authentic ${name.trim()} handcrafted daily with pure khoya and desi ghee at Shah Sweets and Bakers in Shabqadar.`;

    setTimeout(() => {
      const payload = {
        name: name.trim(),
        category,
        image: effectiveImage,
        description: effectiveDescription,
        price: effectivePrice,
        availability,
        hasVariants: hasVariants && validVariants.length > 0,
        variants: validVariants,
        isFeatured,
        badge: badge.trim() || undefined,
      };

      if (isEditing && initialProduct) {
        updateProduct(initialProduct.id, payload);
      } else {
        addProduct(payload);
        // Reset category filter & search so newly added product is guaranteed to show
        setSelectedCategory('all');
        setSearchQuery('');
      }

      setIsLoading(false);
      onSaved();
      onClose();
    }, 200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div
        ref={modalScrollRef}
        className="relative w-full max-w-2xl bg-[#170509] border border-[#c99846]/45 rounded-3xl p-5 sm:p-8 shadow-2xl space-y-6 my-6 max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#c99846]/20">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-serif-brand text-[#fdfaf4]">
              {isEditing ? 'Edit Product' : 'Add New Delicacy'}
            </h2>
            <p className="text-xs text-[#c99846]">
              Shah Sweets and Bakers • Shabqadar Catalogue
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[#f8f1e3]/60 hover:text-white rounded-full bg-[#240810] hover:bg-[#380e18] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clear Validation Alert Banner */}
        {generalError && (
          <div className="p-3.5 rounded-xl bg-rose-950/90 border border-rose-500/60 text-rose-200 text-xs flex items-center gap-2.5 shadow-lg animate-fade-in">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="font-medium">{generalError}</span>
          </div>
        )}

        {/* Form with noValidate to prevent browser generic "Please fill in this field" popups */}
        <form noValidate onSubmit={handleSubmit} className="space-y-6">
          {/* Main Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Product Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#e8c86a] uppercase tracking-wider block">
                Product Name <span className="text-rose-400">*</span>
              </label>
              <input
                ref={nameInputRef}
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (fieldErrors.name) {
                    setFieldErrors((prev) => ({ ...prev, name: undefined }));
                    setGeneralError('');
                  }
                }}
                placeholder="e.g. Pistachio Khoya Barfi"
                className={`w-full bg-[#240810] border rounded-xl px-3.5 py-2.5 text-xs text-[#fdfaf4] focus:outline-none transition-colors ${
                  fieldErrors.name
                    ? 'border-rose-500 focus:border-rose-400 ring-1 ring-rose-500/40'
                    : 'border-[#c99846]/30 focus:border-[#e8c86a]'
                }`}
              />
              {fieldErrors.name && (
                <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.name}</span>
                </p>
              )}
            </div>

            {/* Category */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#e8c86a] uppercase tracking-wider block">
                Category <span className="text-rose-400">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full bg-[#240810] border border-[#c99846]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#fdfaf4] focus:outline-none focus:border-[#e8c86a] cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Price & Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Base Price */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#e8c86a] uppercase tracking-wider block">
                Base Price (PKR) {!hasVariants && <span className="text-rose-400">*</span>}
              </label>
              <input
                ref={priceInputRef}
                type="number"
                min="0"
                step="10"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (fieldErrors.price) {
                    setFieldErrors((prev) => ({ ...prev, price: undefined }));
                    setGeneralError('');
                  }
                }}
                placeholder={hasVariants ? 'Optional (uses variant)' : '350'}
                className={`w-full bg-[#240810] border rounded-xl px-3.5 py-2.5 text-xs text-[#fdfaf4] focus:outline-none transition-colors ${
                  fieldErrors.price
                    ? 'border-rose-500 focus:border-rose-400 ring-1 ring-rose-500/40'
                    : 'border-[#c99846]/30 focus:border-[#e8c86a]'
                }`}
              />
              {fieldErrors.price && (
                <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  <span>{fieldErrors.price}</span>
                </p>
              )}
            </div>

            {/* Availability */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#e8c86a] uppercase tracking-wider block">
                Availability Status
              </label>
              <select
                value={availability}
                onChange={(e) => setAvailability(e.target.value as AvailabilityStatus)}
                className="w-full bg-[#240810] border border-[#c99846]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#fdfaf4] focus:outline-none focus:border-[#e8c86a] cursor-pointer"
              >
                <option value="in_stock">In Stock (Available)</option>
                <option value="out_of_stock">Out of Stock</option>
                <option value="pre_order">Pre-order Required</option>
              </select>
            </div>

            {/* Special Badge */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#e8c86a] uppercase tracking-wider block">
                Special Badge (Optional)
              </label>
              <input
                type="text"
                value={badge}
                onChange={(e) => setBadge(e.target.value)}
                placeholder="e.g. Bestseller, Fresh Today"
                className="w-full bg-[#240810] border border-[#c99846]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#fdfaf4] focus:outline-none focus:border-[#e8c86a]"
              />
            </div>
          </div>

          {/* Image Upload & Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#e8c86a] uppercase tracking-wider block">
                Product Image
              </label>
              <span className="text-[11px] text-[#f8f1e3]/60">
                Defaults to {category} image if empty
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-[#240810] border border-[#c99846]/30 p-3.5 rounded-2xl">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-black shrink-0 border border-[#c99846]/30 relative flex items-center justify-center">
                <img
                  src={image || getCategoryDefaultImage(category)}
                  alt="Preview"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = getCategoryDefaultImage(category);
                  }}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex-1 space-y-2 w-full">
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 bg-[#3b0e17] hover:bg-[#501320] text-[#e8c86a] border border-[#c99846]/40 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload from Device</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setImage(getCategoryDefaultImage(category))}
                    className="text-[11px] text-[#e8c86a] hover:underline cursor-pointer"
                  >
                    Reset to Category Default
                  </button>
                </div>

                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Or paste an image URL here..."
                  className="w-full bg-[#170509] border border-[#c99846]/20 rounded-lg px-3 py-1.5 text-xs text-[#fdfaf4] focus:outline-none focus:border-[#e8c86a]"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#e8c86a] uppercase tracking-wider block">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe ingredients, taste profile, khoya quality, etc..."
              className="w-full bg-[#240810] border border-[#c99846]/30 rounded-xl px-3.5 py-2.5 text-xs text-[#fdfaf4] focus:outline-none focus:border-[#e8c86a]"
            />
          </div>

          {/* Weight & Portion Variants Builder */}
          <div className="space-y-3 pt-2 border-t border-[#c99846]/20">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <label className="flex items-center gap-2 text-xs font-semibold text-[#e8c86a] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={hasVariants}
                  onChange={(e) => {
                    setHasVariants(e.target.checked);
                    if (fieldErrors.variants) {
                      setFieldErrors((prev) => ({ ...prev, variants: undefined }));
                    }
                  }}
                  className="rounded accent-[#c99846] w-3.5 h-3.5"
                />
                <span>Enable Weight / Portion Variants with Separate Prices</span>
              </label>

              {hasVariants && (
                <button
                  type="button"
                  onClick={handleAddVariant}
                  className="flex items-center gap-1 text-[11px] font-bold text-[#e8c86a] hover:text-white bg-[#3b0e17] hover:bg-[#501320] px-3 py-1.5 rounded-lg border border-[#c99846]/30 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Variant</span>
                </button>
              )}
            </div>

            {fieldErrors.variants && (
              <p className="text-[11px] text-rose-400 font-medium flex items-center gap-1 pt-0.5">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fieldErrors.variants}</span>
              </p>
            )}

            {hasVariants && (
              <div className="space-y-2">
                {variants.map((v) => (
                  <div
                    key={v.id}
                    className="flex items-center gap-2 bg-[#240810] p-2.5 rounded-xl border border-[#c99846]/20"
                  >
                    <input
                      type="text"
                      value={v.label}
                      onChange={(e) => handleUpdateVariant(v.id, 'label', e.target.value)}
                      placeholder="e.g. 250 g, 500 g, 1 kg"
                      className="flex-1 bg-[#170509] border border-[#c99846]/30 rounded-lg px-2.5 py-1.5 text-xs text-[#fdfaf4]"
                    />
                    <div className="flex items-center gap-1 w-36">
                      <span className="text-[11px] text-[#c99846] font-bold">PKR</span>
                      <input
                        type="number"
                        min="0"
                        step="10"
                        value={v.price}
                        onChange={(e) =>
                          handleUpdateVariant(v.id, 'price', Number(e.target.value) || 0)
                        }
                        placeholder="Price"
                        className="w-full bg-[#170509] border border-[#c99846]/30 rounded-lg px-2.5 py-1.5 text-xs text-[#fdfaf4]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(v.id)}
                      className="p-1.5 text-rose-400 hover:text-rose-200 rounded-lg hover:bg-rose-950 cursor-pointer"
                      title="Remove variant"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center gap-2 pt-2 border-t border-[#c99846]/15">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded accent-[#c99846] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="isFeatured" className="text-xs text-[#f8f1e3]/90 font-medium cursor-pointer">
              Mark as Featured Product (Highlights in top showcase on Homepage)
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-[#c99846]/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#260810] text-[#f8f1e3]/70 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#c99846] to-[#a8792c] hover:brightness-110 text-[#140508] text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-[#140508] border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>{isEditing ? 'Save Product Changes' : 'Publish Product'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
