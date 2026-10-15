import React, { useState, useEffect, useMemo } from 'react';
import { Product, Order, AuthUser, ActiveTab, ToastMessage, OrderStatus, ThemeMode } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS } from './data/mockData';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { ExecutiveDashboard } from './components/ExecutiveDashboard';
import { InventoryManager } from './components/InventoryManager';
import { POSTerminal } from './components/POSTerminal';
import { ReceiptModal } from './components/ReceiptModal';
import { JWTModal } from './components/JWTModal';
import { Toast } from './components/Toast';
import { LoginPage } from './components/LoginPage';

const PRODUCTS_STORAGE_KEY = 'ami_tumi_amra_products_v4';
const ORDERS_STORAGE_KEY = 'ami_tumi_amra_orders_v4';
const AUTH_USER_STORAGE_KEY = 'ami_auth_user_v1';
const THEME_STORAGE_KEY = 'ami_theme_v1';

export default function App() {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      return (saved as ThemeMode) || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_USER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [isJWTModalOpen, setIsJWTModalOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_USER_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_USER_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save auth state', e);
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products', e);
    }
  }, [products]);

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders', e);
    }
  }, [orders]);

  useEffect(() => {
    if (user?.role === 'POS Cashier' && activeTab === 'dashboard') {
      setActiveTab('pos');
    }
  }, [user, activeTab]);

  const addToast = (
    title: string,
    message: string,
    type: 'success' | 'info' | 'warning' | 'error' = 'success'
  ) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLoginSuccess = (loggedInUser: AuthUser) => {
    setUser(loggedInUser);
    if (loggedInUser.role === 'POS Cashier') {
      setActiveTab('pos');
    } else {
      setActiveTab('dashboard');
    }
    addToast(
      'Authenticated Successfully',
      `Welcome back, ${loggedInUser.name}! Session signed with JWT.`,
      'success'
    );
  };

  const handleLogout = () => {
    setUser(null);
    setIsJWTModalOpen(false);
    addToast('Signed Out', 'Your session token has been revoked.', 'info');
  };

  const handleResetDemoData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    localStorage.removeItem(ORDERS_STORAGE_KEY);
    addToast('Demo Data Reset', 'Restored initial Ami Tumi Amra catalog & orders.', 'info');
  };

  const handleQuickRestock = (productId: string, amount: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        if (p.id === productId) {
          const updatedStock = p.stock + amount;
          addToast('Stock Restocked', `Added +${amount} items to ${p.name}.`, 'success');
          return { ...p, stock: updatedStock, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );
  };

  const handleUpdateStock = (productId: string, newStock: number) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        if (p.id === productId) {
          addToast('Stock Updated', `Stock for "${p.name}" changed to ${newStock}.`, 'info');
          return { ...p, stock: newStock, updatedAt: new Date().toISOString() };
        }
        return p;
      })
    );
  };

  const handleSaveProduct = (partialProduct: Partial<Product>) => {
    if (partialProduct.id) {
      setProducts((prev) =>
        prev.map((p) =>
          p.id === partialProduct.id
            ? ({ ...p, ...partialProduct, updatedAt: new Date().toISOString() } as Product)
            : p
        )
      );
      addToast('Product Updated', `Changes saved for ${partialProduct.name}.`, 'success');
    } else {
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        sku: partialProduct.sku || `AMI-${Math.floor(100 + Math.random() * 900)}`,
        name: partialProduct.name || 'New Retail Product',
        category: partialProduct.category || 'Apparel',
        costPrice: partialProduct.costPrice || 0,
        price: partialProduct.price || 0,
        stock: partialProduct.stock || 0,
        imageUrl: partialProduct.imageUrl || '',
        description: partialProduct.description || '',
        updatedAt: new Date().toISOString(),
      };
      setProducts((prev) => [newProduct, ...prev]);
      addToast('New Product Created', `${newProduct.name} added to inventory.`, 'success');
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (user?.role !== 'Business Owner') {
      addToast('Access Denied', 'Only Business Owners can delete inventory SKUs.', 'error');
      return;
    }
    const target = products.find((p) => p.id === productId);
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    if (target) {
      addToast('Product Removed', `Deleted ${target.name} from store catalog.`, 'warning');
    }
  };

  const handleCompleteOrder = (newOrder: Order) => {
    setProducts((prevProducts) => {
      return prevProducts.map((product) => {
        const orderItem = newOrder.items.find((item) => item.productId === product.id);
        if (orderItem) {
          const newStock = Math.max(0, product.stock - orderItem.quantity);
          return { ...product, stock: newStock, updatedAt: new Date().toISOString() };
        }
        return product;
      });
    });

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    setReceiptOrder(newOrder);
    addToast(
      'Order Placed Successfully!',
      `Order #${newOrder.id} (${newOrder.channel} / ${newOrder.paymentMethod}) - ৳ ${newOrder.total.toLocaleString('en-BD')}`,
      'success'
    );
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder || targetOrder.status === newStatus) return;

    const oldStatus = targetOrder.status;

    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    if (newStatus === 'Returned/Cancelled' && oldStatus !== 'Returned/Cancelled') {
      setProducts((prevProducts) => {
        return prevProducts.map((product) => {
          const itemToRestore = targetOrder.items.find((i) => i.productId === product.id);
          if (itemToRestore) {
            return {
              ...product,
              stock: product.stock + itemToRestore.quantity,
              updatedAt: new Date().toISOString(),
            };
          }
          return product;
        });
      });

      addToast(
        'Order Returned & Stock Restored!',
        `Order #${orderId} marked Returned/Cancelled. Items returned to inventory stock.`,
        'warning'
      );
    } else if (oldStatus === 'Returned/Cancelled' && newStatus !== 'Returned/Cancelled') {
      setProducts((prevProducts) => {
        return prevProducts.map((product) => {
          const itemToDeduct = targetOrder.items.find((i) => i.productId === product.id);
          if (itemToDeduct) {
            return {
              ...product,
              stock: Math.max(0, product.stock - itemToDeduct.quantity),
              updatedAt: new Date().toISOString(),
            };
          }
          return product;
        });
      });

      addToast(
        'Order Reactivated!',
        `Order #${orderId} marked ${newStatus}. Items deducted from stock.`,
        'info'
      );
    } else {
      addToast(
        'Courier Status Updated',
        `Order #${orderId} status changed to "${newStatus}".`,
        'info'
      );
    }
  };

  const lowStockCount = useMemo(() => {
    return products.filter((p) => p.stock <= 5).length;
  }, [products]);

  if (!user) {
    return (
      <>
        <LoginPage onLoginSuccess={handleLoginSuccess} />
        <Toast toasts={toasts} onDismiss={removeToast} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070B15] text-slate-900 dark:text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white flex flex-col transition-colors duration-200 overflow-x-hidden">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenJWTModal={() => setIsJWTModalOpen(true)}
        onLogout={handleLogout}
        onResetData={handleResetDemoData}
        lowStockCount={lowStockCount}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 pb-28 lg:pb-8">
        {activeTab === 'dashboard' && user.role !== 'POS Cashier' && (
          <ExecutiveDashboard
            products={products}
            orders={orders}
            user={user}
            onQuickRestock={handleQuickRestock}
            onNavigateToPOS={() => setActiveTab('pos')}
            onNavigateToInventory={() => setActiveTab('inventory')}
            onUpdateOrderStatus={handleUpdateOrderStatus}
          />
        )}

        {activeTab === 'inventory' && (
          <InventoryManager
            products={products}
            user={user}
            onUpdateStock={handleUpdateStock}
            onSaveProduct={handleSaveProduct}
            onDeleteProduct={handleDeleteProduct}
          />
        )}

        {activeTab === 'pos' && (
          <POSTerminal products={products} onCompleteOrder={handleCompleteOrder} />
        )}
      </main>

      {/* Mobile Fixed Bottom App Navigation Dock */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={user.role}
        lowStockCount={lowStockCount}
      />

      <ReceiptModal order={receiptOrder} onClose={() => setReceiptOrder(null)} />
      {isJWTModalOpen && <JWTModal user={user} onClose={() => setIsJWTModalOpen(false)} />}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
