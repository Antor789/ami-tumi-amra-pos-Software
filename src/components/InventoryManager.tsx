import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Grid,
  List,
  Minus,
  Upload,
  Link as LinkIcon,
  X,
  PackageCheck,
  Download,
  Lock,
} from 'lucide-react';
import { Product, ProductCategory, AuthUser } from '../types';
import { ProductImage } from './ProductImage';
import { exportProductsToCSV } from '../utils/csvExporter';

interface InventoryManagerProps {
  products: Product[];
  user: AuthUser;
  onUpdateStock: (productId: string, newStock: number) => void;
  onSaveProduct: (product: Partial<Product>) => void;
  onDeleteProduct: (productId: string) => void;
}

type StockFilter = 'All' | 'In Stock' | 'Low Stock' | 'Out of Stock';

export const InventoryManager: React.FC<InventoryManagerProps> = ({
  products,
  user,
  onUpdateStock,
  onSaveProduct,
  onDeleteProduct,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [stockFilter, setStockFilter] = useState<StockFilter>('All');
  const [layoutView, setLayoutView] = useState<'table' | 'grid'>('table');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const isOwner = user.role === 'Business Owner';
  const isCashier = user.role === 'POS Cashier';

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Apparel' as ProductCategory,
    costPrice: 0,
    price: 0,
    stock: 0,
    imageUrl: '',
    description: '',
  });

  const [imageTab, setImageTab] = useState<'upload' | 'url'>('upload');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalValue = useMemo(() => {
    return products.reduce((sum, p) => sum + p.price * p.stock, 0);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;

      let matchesStock = true;
      if (stockFilter === 'In Stock') matchesStock = p.stock > 5;
      else if (stockFilter === 'Low Stock') matchesStock = p.stock > 0 && p.stock <= 5;
      else if (stockFilter === 'Out of Stock') matchesStock = p.stock === 0;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, searchQuery, selectedCategory, stockFilter]);

  const handleOpenAddModal = () => {
    if (isCashier) return;
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: `AMI-${Math.floor(100 + Math.random() * 900)}`,
      category: 'Apparel',
      costPrice: 1500,
      price: 2800,
      stock: 10,
      imageUrl: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=600&q=80',
      description: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    if (isCashier) return;
    setEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      category: p.category,
      costPrice: p.costPrice,
      price: p.price,
      stock: p.stock,
      imageUrl: p.imageUrl,
      description: p.description || '',
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFormData((prev) => ({ ...prev, imageUrl: e.target!.result as string }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSubmitModal = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProduct({
      id: editingProduct ? editingProduct.id : undefined,
      ...formData,
      updatedAt: new Date().toISOString(),
    });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Ami Tumi Amra Inventory Manager
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Adjust stock levels in 1-click, upload product media, and track SKU valuation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="text-left md:text-right mr-2">
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">
              Total Stock Value
            </span>
            <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tabular-nums">
              ৳ {totalValue.toLocaleString('en-BD')}
            </span>
          </div>

          <button
            onClick={() => exportProductsToCSV(products)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold rounded-xl transition-colors border border-slate-200 dark:border-slate-700"
            title="Export full inventory list to CSV"
          >
            <Download className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" />
            <span className="hidden sm:inline">Export</span> CSV
          </button>

          {!isCashier && (
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          )}
        </div>
      </div>

      {/* Toolbar: Search & Scrollable Filter Pills */}
      <div className="p-3.5 sm:p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Product Name or SKU (e.g. Jamdani, AMI-PNJ)..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 md:pb-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Apparel">Apparel</option>
            <option value="Electronics">Electronics</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Fragrance">Fragrance</option>
          </select>

          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700 shrink-0 overflow-x-auto no-scrollbar">
            {(['All', 'In Stock', 'Low Stock', 'Out of Stock'] as StockFilter[]).map((status) => (
              <button
                key={status}
                onClick={() => setStockFilter(status)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  stockFilter === status
                    ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/60 dark:border-slate-700 shrink-0">
            <button
              onClick={() => setLayoutView('table')}
              className={`p-1.5 rounded-lg transition-colors ${
                layoutView === 'table' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-2xs' : 'text-slate-500'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setLayoutView('grid')}
              className={`p-1.5 rounded-lg transition-colors ${
                layoutView === 'grid' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-cyan-400 shadow-2xs' : 'text-slate-500'
              }`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500">
          <PackageCheck className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">No matching products found</h3>
          <p className="text-xs text-slate-400 mt-1">Try adjusting your search query or reset filters.</p>
        </div>
      ) : (
        <>
          {/* 1. MOBILE & TABLET RENDERING (< lg / under 1024px): Touch-Friendly Inventory Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 lg:hidden">
            {filteredProducts.map((p) => (
              <div
                key={p.id}
                className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col justify-between space-y-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                    <ProductImage src={p.imageUrl} alt={p.name} category={p.category} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-[10px] font-mono text-slate-400">{p.sku}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                          p.stock === 0
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : p.stock <= 5
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {p.stock === 0 ? 'Out of Stock' : p.stock <= 5 ? 'Low Stock' : 'In Stock'}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                      {p.name}
                    </h4>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="font-bold text-slate-900 dark:text-white tabular-nums">
                        ৳ {p.price.toLocaleString('en-BD')}
                      </span>
                      {isOwner ? (
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Cost: ৳ {p.costPrice.toLocaleString('en-BD')}
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> Owner Only
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile Stepper & Actions */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
                    <button
                      onClick={() => onUpdateStock(p.id, Math.max(0, p.stock - 1))}
                      disabled={p.stock === 0}
                      className="min-w-[36px] min-h-[36px] rounded-lg bg-white dark:bg-slate-900 hover:bg-rose-50 dark:hover:bg-rose-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm font-bold transition-colors disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="w-10 text-center text-xs font-extrabold text-slate-900 dark:text-white tabular-nums">
                      {p.stock}
                    </span>
                    <button
                      onClick={() => onUpdateStock(p.id, p.stock + 1)}
                      className="min-w-[36px] min-h-[36px] rounded-lg bg-white dark:bg-slate-900 hover:bg-emerald-50 dark:hover:bg-emerald-950 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-sm font-bold transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {!isCashier && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(p)}
                        className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-indigo-50 text-indigo-600 dark:text-cyan-400 text-xs font-semibold rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      {isOwner && (
                        <button
                          onClick={() => onDeleteProduct(p.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 2. DESKTOP RENDERING (>= lg / 1024px): Full 7-Column Data Table */}
          <div className="hidden lg:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Item Details</th>
                    <th className="py-3 px-4">SKU & Category</th>
                    <th className="py-3 px-4 text-right">Cost Price (৳)</th>
                    <th className="py-3 px-4 text-right">Retail Price (৳)</th>
                    <th className="py-3 px-4 text-center">Instant Stock Adjust</th>
                    <th className="py-3 px-4 text-right">Total Value (৳)</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                            <ProductImage src={p.imageUrl} alt={p.name} category={p.category} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-white text-xs">{p.name}</h4>
                            <span
                              className={`inline-block text-[10px] font-bold px-1.5 py-0.2 rounded mt-0.5 ${
                                p.stock === 0
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                  : p.stock <= 5
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              }`}
                            >
                              {p.stock === 0 ? 'Out of Stock' : p.stock <= 5 ? 'Low Stock' : 'In Stock'}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-mono text-slate-800 dark:text-slate-200 font-medium">{p.sku}</div>
                        <div className="text-[11px] text-slate-400">{p.category}</div>
                      </td>

                      <td className="py-3 px-4 text-right text-slate-500 dark:text-slate-400 tabular-nums">
                        {isOwner ? (
                          `৳ ${p.costPrice.toLocaleString('en-BD')}`
                        ) : (
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium flex items-center justify-end gap-1">
                            <Lock className="w-3 h-3" /> Owner Only
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right font-semibold text-slate-900 dark:text-white tabular-nums">
                        ৳ {p.price.toLocaleString('en-BD')}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/80 dark:border-slate-700">
                          <button
                            onClick={() => onUpdateStock(p.id, Math.max(0, p.stock - 1))}
                            disabled={p.stock === 0}
                            className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 hover:bg-rose-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-colors disabled:opacity-40"
                            title="Decrement 1"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>

                          <input
                            type="number"
                            value={p.stock}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              onUpdateStock(p.id, Math.max(0, val));
                            }}
                            className="w-12 text-center text-xs font-bold text-slate-900 dark:text-white bg-transparent focus:outline-none tabular-nums"
                          />

                          <button
                            onClick={() => onUpdateStock(p.id, p.stock + 1)}
                            className="w-7 h-7 rounded-lg bg-white dark:bg-slate-900 hover:bg-emerald-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-colors"
                            title="Increment 1"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white tabular-nums">
                        ৳ {(p.price * p.stock).toLocaleString('en-BD')}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {!isCashier && (
                            <>
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                title="Edit Product"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              {isOwner && (
                                <button
                                  onClick={() => onDeleteProduct(p.id)}
                                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl shadow-xl w-[95vw] max-w-lg max-h-[90vh] border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold">
                {editingProduct ? 'Edit Product Details' : 'Add New Inventory Product'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitModal} className="p-4 sm:p-5 space-y-4 overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Royal Silk Jamdani Panjabi"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">SKU Code *</label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as ProductCategory })
                    }
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium"
                  >
                    <option value="Apparel">Apparel</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Fragrance">Fragrance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cost Price (৳) {!isOwner && '(Locked)'}
                  </label>
                  <input
                    type="number"
                    required
                    disabled={!isOwner}
                    min="0"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Retail Price (৳)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Initial Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold">Product Media Image</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setImageTab('upload')}
                      className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        imageTab === 'upload' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-slate-500'
                      }`}
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageTab('url')}
                      className={`text-[11px] font-medium px-2 py-0.5 rounded ${
                        imageTab === 'url' ? 'bg-indigo-100 text-indigo-700 font-semibold' : 'text-slate-500'
                      }`}
                    >
                      External URL
                    </button>
                  </div>
                </div>

                {imageTab === 'upload' ? (
                  <div
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`p-4 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-colors ${
                      dragActive ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      className="hidden"
                    />
                    <Upload className="w-6 h-6 text-indigo-500 mx-auto mb-1" />
                    <p className="text-xs font-medium">Click or Drag & Drop image file here</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Converts to local Data URL preview instantly</p>
                  </div>
                ) : (
                  <div>
                    <div className="relative">
                      <LinkIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                )}

                {formData.imageUrl && (
                  <div className="flex items-center gap-3 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 mt-2">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-300 dark:border-slate-600">
                      <ProductImage src={formData.imageUrl} alt="Preview" category={formData.category} />
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 truncate">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 block">Live Media Preview</span>
                      <span className="text-[10px] text-slate-400 truncate block">Ready to sync across POS and Dashboard</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs"
                >
                  {editingProduct ? 'Update Product' : 'Save & Sync Inventory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
