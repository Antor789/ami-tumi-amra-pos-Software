export type ProductCategory = 'Apparel' | 'Electronics' | 'Lifestyle' | 'Fragrance';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  costPrice: number; // in ৳ BDT
  price: number;     // in ৳ BDT
  stock: number;
  imageUrl: string;
  description?: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  price: number;
  costPrice: number;
}

export type SalesChannel = 'In-Store POS' | 'Zatiq Online' | 'Facebook Page';

export type PaymentMethod = 'Cash' | 'bKash' | 'Nagad' | 'COD (Courier)';

export type DeliveryArea = 'Inside Dhaka (৳60)' | 'Outside Dhaka (৳120)' | 'Free Delivery';

export type OrderStatus = 'Completed' | 'Pending Courier' | 'Returned/Cancelled';

export interface Order {
  id: string; // e.g. "ORD-8942"
  customerName: string;
  customerPhone: string;
  customerAddress?: string;
  channel: SalesChannel;
  paymentMethod: PaymentMethod;
  deliveryArea?: DeliveryArea;
  deliveryFee: number;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  profit: number;
  status: OrderStatus;
  createdAt: string; // ISO String
}

export type UserRole = 'Business Owner' | 'Store Manager' | 'POS Cashier';

export type ActiveTab = 'dashboard' | 'inventory' | 'pos';

export type ThemeMode = 'dark' | 'light';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  permissions: string[];
  token: string;
}

export interface JWTPayload {
  sub: string;
  name: string;
  email: string;
  role: UserRole;
  permissions: string[];
  iat: number;
  exp: number;
  iss: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
