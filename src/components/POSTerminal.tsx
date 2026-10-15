import React, { useState, useMemo } from 'react';
import {
  Search,
  ShoppingCart,
  Trash2,
  Store,
  Globe,
  Facebook,
  User,
  Phone,
  Tag,
  Receipt,
  Truck,
  Wallet,
  X,
  ChevronUp,
} from 'lucide-react';
import {
  Product,
  SalesChannel,
  PaymentMethod,
  DeliveryArea,
  Order,
  OrderItem,
} from '../types';
import { ProductImage } from './ProductImage';

interface POSTerminalProps {
  products: Product[];
  onCompleteOrder: (newOrder: Order) => void;
}

interface CartEntry {
  product: Product;
  quantity: number;
}

export const POSTerminal: React.FC<POSTerminalProps> = ({ products, onCompleteOrder }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isMobileCartOpen, setIsMobileCartOpen] = useState(false);

  // Checkout Form State
  const [channel, setChannel] = useState<SalesChannel>('In-Store POS');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [deliveryArea, setDeliveryArea] = useState<DeliveryArea>('Inside Dhaka (৳60)');
  const [customerName, setCustomerName] = useState('Walk-in Customer');
  const [customerPhone, setCustomerPhone] = useState('+8801700000000');
  const [customerAddress, setCustomerAddress] = useState('');
  const [discount, setDiscount] = useState<number>(0);

  // Cart State
  const [cart, setCart] = useState<CartEntry[]>([]);

  const deliveryFee = useMemo(() => {
    if (channel === 'In-Store POS') return 0;
    if (deliveryArea === 'Inside Dhaka (৳60)') return 60;
    if (deliveryArea === 'Outside Dhaka (৳120)') return 120;
    return 0;
  }, [channel, deliveryArea]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) return;

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prevCart;
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart((prevCart) => {
      return prevCart
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.product.stock) return item;
            return { ...item, quantity: newQty };
          }
          return item;
        })
        .filter(Boolean) as CartEntry[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setDiscount(0);
  };

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const grandTotal = useMemo(() => {
    return Math.max(0, subtotal - discount + deliveryFee);
  }, [subtotal, discount, deliveryFee]);

  const totalProfit = useMemo(() => {
    const totalCost = cart.reduce((sum, item) => sum + item.product.costPrice * item.quantity, 0);
    return Math.max(0, grandTotal - totalCost - deliveryFee);
  }, [cart, grandTotal, deliveryFee]);

  const totalItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const orderItems: OrderItem[] = cart.map((item) => ({
      productId: item.product.id,
      productName: item.product.name,
      sku: item.product.sku,
      quantity: item.quantity,
      price: item.product.price,
      costPrice: item.product.costPrice,
    }));

    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: customerName || 'Walk-in Customer',
      customerPhone: customerPhone || '+8801700000000',
      customerAddress: channel !== 'In-Store POS' ? customerAddress : undefined,
      channel,
      paymentMethod,
      deliveryArea: channel !== 'In-Store POS' ? deliveryArea : undefined,
      deliveryFee,
      items: orderItems,
      subtotal,
      discount,
      total: grandTotal,
      profit: totalProfit,
      status: channel === 'In-Store POS' ? 'Completed' : 'Pending Courier',
      createdAt: new Date().toISOString(),
    };

    onCompleteOrder(newOrder);
    clearCart();
    setIsMobileCartOpen(false);
  };

  // Reusable Active Cart Content Panel
  const CartContent = (
    <div className="flex flex-col h-full justify-between overflow-hidden">
      {/* Cart Header */}
      <div className="p-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-indigo-600 dark:text-cyan-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active POS Cart</h3>
          <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-100 dark:bg-cyan-950 text-indigo-700 dark:text-cyan-300 rounded-full">
            {totalItemCount} items
          </span>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear
          </button>
        )}
      </div>

      {/* Order Options */}
      <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 space-y-2.5 overflow-y-auto max-h-[220px]">
        {/* Sales Channel */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Sales Channel Origin
          </label>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setChannel('In-Store POS')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-1.5 rounded-xl text-xs font-semibold border transition-all ${
                channel === 'In-Store POS'
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Store className="w-3.5 h-3.5" /> POS Counter
            </button>

            <button
              type="button"
              onClick={() => setChannel('Zatiq Online')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-1.5 rounded-xl text-xs font-semibold border transition-all ${
                channel === 'Zatiq Online'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Zatiq Online
            </button>

            <button
              type="button"
              onClick={() => setChannel('Facebook Page')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-1.5 rounded-xl text-xs font-semibold border transition-all ${
                channel === 'Facebook Page'
                  ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Facebook className="w-3.5 h-3.5" /> Facebook
            </button>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
            <Wallet className="w-3 h-3 text-indigo-600 dark:text-cyan-400" /> Payment Method
          </label>
          <div className="grid grid-cols-4 gap-1">
            {(['Cash', 'bKash', 'Nagad', 'COD (Courier)'] as PaymentMethod[]).map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`py-1.5 px-1 rounded-lg text-[10px] sm:text-[11px] font-bold border transition-all text-center ${
                  paymentMethod === method
                    ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                }`}
              >
                {method}
              </button>
            ))}
          </div>
        </div>

        {/* Delivery Options */}
        {channel !== 'In-Store POS' && (
          <div className="p-2.5 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/50 space-y-2">
            <label className="block text-[10px] font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-indigo-600 dark:text-cyan-400" /> Delivery Charge
            </label>

            <div className="grid grid-cols-3 gap-1">
              {(['Inside Dhaka (৳60)', 'Outside Dhaka (৳120)', 'Free Delivery'] as DeliveryArea[]).map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => setDeliveryArea(area)}
                  className={`py-1 px-1 rounded-lg text-[10px] font-bold border transition-all text-center ${
                    deliveryArea === area
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-indigo-200 dark:border-slate-700'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              placeholder="Shipping Address..."
              className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-indigo-200 dark:border-slate-700 rounded-lg text-xs"
            />
          </div>
        )}

        {/* Customer Fields */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
              Customer Name
            </label>
            <div className="relative">
              <User className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Walk-in Customer"
                className="w-full pl-8 pr-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-0.5">
              Phone Number
            </label>
            <div className="relative">
              <Phone className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+88017..."
                className="w-full pl-8 pr-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cart Item List */}
      <div className="flex-1 p-3.5 overflow-y-auto space-y-2 divide-y divide-slate-100 dark:divide-slate-800">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-6">
            <ShoppingCart className="w-10 h-10 text-slate-200 dark:text-slate-800 mb-2" />
            <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">POS Cart is Empty</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Click products on the left to add items to cart.</p>
          </div>
        ) : (
          cart.map((item) => (
            <div key={item.product.id} className="pt-2 first:pt-0 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <ProductImage src={item.product.imageUrl} alt={item.product.name} category={item.product.category} />
                </div>
                <div className="min-w-0">
                  <h5 className="text-xs font-semibold text-slate-900 dark:text-white truncate">{item.product.name}</h5>
                  <div className="text-[11px] text-slate-500 font-mono">
                    ৳ {item.product.price.toLocaleString('en-BD')} x {item.quantity}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => updateCartQuantity(item.product.id, -1)}
                    className="w-5 h-5 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="w-6 text-center text-xs font-bold tabular-nums">{item.quantity}</span>
                  <button
                    onClick={() => updateCartQuantity(item.product.id, 1)}
                    className="w-5 h-5 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 flex items-center justify-center text-xs font-bold"
                  >
                    +
                  </button>
                </div>

                <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums w-16 text-right">
                  ৳ {(item.product.price * item.quantity).toLocaleString('en-BD')}
                </span>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 rounded"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Billing Footer */}
      <div className="p-4 bg-slate-900 dark:bg-slate-950 text-white rounded-b-2xl space-y-3">
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between text-slate-400">
            <span>Items Subtotal:</span>
            <span className="font-semibold text-white tabular-nums">৳ {subtotal.toLocaleString('en-BD')}</span>
          </div>

          {deliveryFee > 0 && (
            <div className="flex justify-between text-indigo-300">
              <span>Delivery Charge:</span>
              <span className="font-bold tabular-nums">+৳ {deliveryFee}</span>
            </div>
          )}

          <div className="flex justify-between items-center text-slate-400">
            <span className="flex items-center gap-1">
              <Tag className="w-3 h-3 text-indigo-400" /> Discount (৳):
            </span>
            <input
              type="number"
              min="0"
              value={discount}
              onChange={(e) => setDiscount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-20 px-2 py-0.5 bg-slate-800 text-right font-bold text-emerald-400 border border-slate-700 rounded text-xs focus:outline-none"
            />
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
            <span className="text-sm font-bold text-slate-200">Grand Total:</span>
            <span className="text-xl font-extrabold text-emerald-400 tabular-nums">
              ৳ {grandTotal.toLocaleString('en-BD')}
            </span>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          disabled={cart.length === 0}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 disabled:cursor-not-allowed"
        >
          <Receipt className="w-4 h-4" />
          Complete Order ({paymentMethod}) & Deduct Stock
        </button>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px] relative">
      {/* Left Column: Product Selector Grid (7 cols desktop / 12 cols mobile) */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs flex flex-col overflow-hidden">
        {/* Search & Category Tabs */}
        <div className="p-3.5 sm:p-4 border-b border-slate-100 dark:border-slate-800 space-y-2.5">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search POS items by Name or SKU..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            {['All', 'Apparel', 'Electronics', 'Lifestyle', 'Fragrance'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="flex-1 p-3 sm:p-4 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {filteredProducts.map((p) => {
            const isOutOfStock = p.stock <= 0;
            const inCart = cart.find((item) => item.product.id === p.id);

            return (
              <button
                key={p.id}
                onClick={() => addToCart(p)}
                disabled={isOutOfStock}
                className={`relative p-2.5 sm:p-3 rounded-2xl border text-left transition-all flex flex-col justify-between group ${
                  isOutOfStock
                    ? 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-60 cursor-not-allowed'
                    : inCart
                    ? 'bg-indigo-50/50 dark:bg-indigo-950/40 border-indigo-400 ring-2 ring-indigo-500/20'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700'
                }`}
              >
                <div className="h-24 sm:h-28 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 relative mb-2">
                  <ProductImage src={p.imageUrl} alt={p.name} category={p.category} />
                  <span
                    className={`absolute top-1.5 right-1.5 px-2 py-0.5 rounded-md text-[9px] sm:text-[10px] font-bold ${
                      isOutOfStock
                        ? 'bg-rose-600 text-white'
                        : p.stock <= 5
                        ? 'bg-amber-500 text-white'
                        : 'bg-slate-900/80 text-white backdrop-blur-xs'
                    }`}
                  >
                    {isOutOfStock ? 'Sold Out' : `${p.stock} left`}
                  </span>

                  {inCart && (
                    <span className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
                      {inCart.quantity}
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">{p.sku}</span>
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
                    {p.name}
                  </h4>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 dark:text-white tabular-nums">
                      ৳ {p.price.toLocaleString('en-BD')}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">
                      {p.category}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Column: Active Cart & Billing Panel (DESKTOP ONLY lg:block) */}
      <div className="hidden lg:block lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs overflow-hidden sticky top-20 h-[calc(100vh-140px)]">
        {CartContent}
      </div>

      {/* MOBILE FLOATING CHECKOUT BAR & BOTTOM SHEET (< lg) */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 inset-x-3 z-30 lg:hidden animate-slide-up">
          <div className="bg-slate-900/95 border border-cyan-500/30 text-white p-3 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 text-xs font-bold">
                <span className="w-5 h-5 rounded-full bg-cyan-500 text-slate-950 flex items-center justify-center text-[11px] font-extrabold">
                  {totalItemCount}
                </span>
                <span>In Cart</span>
              </div>
              <div className="text-sm font-extrabold text-emerald-400 tabular-nums">
                ৳ {grandTotal.toLocaleString('en-BD')}
              </div>
            </div>

            <button
              onClick={() => setIsMobileCartOpen(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold rounded-xl shadow-lg flex items-center gap-1.5"
            >
              Checkout Cart <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MOBILE FULL-SCREEN / BOTTOM-SHEET CART MODAL */}
      {isMobileCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in lg:hidden">
          <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg h-[92vh] sm:h-[85vh] border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
            <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <span className="text-xs font-bold">Mobile Cart & Checkout</span>
              <button
                onClick={() => setIsMobileCartOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-hidden">{CartContent}</div>
          </div>
        </div>
      )}
    </div>
  );
};
