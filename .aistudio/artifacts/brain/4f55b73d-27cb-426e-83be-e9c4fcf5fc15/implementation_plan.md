# Cloud E-Commerce POS & Real-Time Inventory Management Dashboard (Sheba Retail - ৳ BDT)

Complete, real-time executive dashboard, inventory controller, and point-of-sale (POS) terminal tailored for Bangladeshi e-commerce and retail operations. Features real-time stock sync, profit analytics, live image uploads, and browser persistence (`localStorage`).

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The design choices and domain settings have been aligned based on user input:

- **Confirmed Store Branding**: **Sheba Retail** (Bangladeshi retail featuring Panjabi, Jamdani Saree, Sneakers, Smartwatches, Fragrances, Wireless Earbuds, with prices in Bangladeshi Taka `৳`).
- **Confirmed Visual Theme**: **Modern SaaS Clean** (Slate-50 background, crisp white cards, Indigo-600 accents, Emerald-600 revenue highlights, Rose-600 low stock alerts).
- **Confirmed Key Reporting Feature**: **Profit Margin & Cost Price Analytics** integrated directly alongside gross revenue and order volume in the charts and KPI cards.
- **State Persistence & Synchronization**: All inventory updates, stock adjustments, order completions, and custom added products persist in `localStorage` with a 1-click **Reset Demo Data** option in the navbar.

---

## 1. Overview & Core Concept

**Sheba Retail Cloud POS & Inventory System** connects multi-channel sales (In-Store POS, Zatiq Website, Facebook Page) into a unified real-time dashboard. Store owners and cashiers can:
1. **Monitor Business Health (Owner View)**: Executive KPIs for Today's Revenue, Orders breakdown (Online vs POS), Weekly/Monthly trends, Profit Margins, and Low-Stock warnings.
2. **Manage Stock & Products (Store Manager View)**: Instant `-` / `+` inline stock updates, search/filter by SKU and stock state, live inventory value calculation (`price * stock`), and a dynamic Add/Edit Product Modal supporting both file drag-and-drop file picker and URL inputs.
3. **Run Quick In-Store POS Terminal**: Multi-channel checkout with instant stock deduction, discount calculations, customer details, and a printable itemized receipt preview modal.

---

## 2. User Experience & Visual Design

### A. Navigation & Top Header Contract
- **Brand Title**: `Sheba Retail POS` wordmark with a live green pulsing badge (`● Live Sync Active`).
- **Role Switcher**: Segmented toggle in navbar: `Owner View` vs. `Store Manager View` to dynamically show/hide executive financials or focus on inventory/terminal operations.
- **Header Actions**: `Reset Demo Data` button (restores rich Bangladeshi default catalog and order history) + current datetime in BDT locale.

### B. View Structure & Tabbed Layout
1. **View A: Live Executive Dashboard**:
   - **4 Core KPI Cards**:
     - *Today's Revenue (৳)*: Today's sum + growth badge + Gross Profit (৳) & Margin % breakdown.
     - *Today's Orders*: Total count + Online (Zatiq Sync / Facebook) vs POS Counter orders.
     - *Weekly & Monthly Revenue (৳)*: Toggleable comparison of Last 7 Days vs. Current Month.
     - *Inventory Health*: Total Active SKUs + Critical Red Badge for Low Stock ($\le 5$) and Out of Stock ($= 0$).
   - **Interactive Revenue, Order & Profit Chart (Recharts)**:
     - Filter toggle: `Daily (Last 7 Days)` | `Weekly` | `Monthly`.
     - Tooltip showing Revenue (৳), Profit (৳), and Order Volume.
   - **Two-Column Live Feed**:
     - *Left Column*: Real-time Order Feed table (Order ID, Customer Name/Phone, Channel Badge, Total ৳, Time, Status).
     - *Right Column*: Critical Stock Alerts with thumbnail, SKU, stock level, and 1-click `+ Quick Restock` button.

2. **View B: Real-Time Inventory & Instant Image/Stock Updater**:
   - **Search & Filters**: Search bar (name/SKU) + Category filter (Apparel, Electronics, Lifestyle, Fragrance) + Stock Status filter (`All`, `In Stock`, `Low Stock <= 5`, `Out of Stock = 0`).
   - **Grid / Table Layout Toggle**: Table view with compact rows or visual Product Cards.
   - **Inline Stock Adjuster**: Instant `-` / `+` buttons and direct numerical input on each item. Any edit fires a subtle toast notification and instantly recalculates dashboard totals.
   - **Add / Edit Product Modal**: Inputs for Product Name, SKU, Category, Cost Price (৳), Retail Price (৳), Initial Stock, and **Live Image Input** (file upload converted to Data URL or image URL paste).

3. **View C: Quick POS Terminal & Order Entry**:
   - **Left Panel (Product Selector)**: Grid of product cards with stock badges. Disabled state for out-of-stock items. Category tabs for quick filtering.
   - **Right Panel (Cart & Checkout)**:
     - Channel Selector: `In-Store POS`, `Zatiq Website Order`, `Facebook Page Order`.
     - Customer Info (Name, Phone number).
     - Cart items with quantity adjustments, Subtotal, Discount (৳) input, Tax/Shipping (if applicable), and Grand Total (৳).
     - **"Complete Order & Deduct Stock" Button**: Instantly creates the order, deducts product inventory in real time, updates Executive KPIs, and launches a printable **Receipt Preview Modal**.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Client-Side Persistence with `localStorage`**:
  - *Chosen Approach*: Maintain full state in React with `localStorage` hydration and fallback to realistic Bangladeshi mock data.
  - *Why*: Guarantees instant responsiveness, offline capability, zero external server dependency, and full persistence across browser refreshes.
- **Decision 2: Image File Handling via Data URL**:
  - *Chosen Approach*: Support file picker / drag-and-drop image files converted to Base64 Data URL (`FileReader.readAsDataURL`) along with direct URL links.
  - *Why*: Works natively in browser without backend image storage services, saving directly into `localStorage`.
- **Decision 3: Recharts Area & Bar Visualization**:
  - *Chosen Approach*: Use `Recharts` with responsive containers, dual axis/tooltip for Revenue (৳) and Profit (৳).
  - *Why*: Clean rendering, customizable theme matching Slate/Indigo palette, and smooth tooltips.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   Sheba Retail App                                     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Top Bar: Brand Wordmark | Role Switcher (Owner/Manager) | Live Sync Indicator | Reset │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  Navigation Tabs:  [1. Executive Dashboard]  [2. Inventory Manager]  [3. POS Terminal]  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  ┌───────────────────────────┐  ┌──────────────────────────┐  ┌─────────────────────┐ │
│  │ Executive Dashboard View  │  │ Real-Time Inventory View │  │  POS Terminal View  │ │
│  ├───────────────────────────┤  ├──────────────────────────┤  ├─────────────────────┤ │
│  │ - 4 Top KPI Cards         │  │ - Search & Category Filter│  │ - Product Grid      │ │
│  │ - Revenue & Profit Chart  │  │ - Table/Grid Toggle      │  │ - Multi-Channel Cart│ │
│  │ - Recent Orders Feed      │  │ - Inline Stock (- / +)   │  │ - Stock Auto-Deduct │ │
│  │ - Critical Low-Stock Panel│  │ - Add/Edit Product Modal │  │ - Printable Receipt │ │
│  └─────────────┬─────────────┘  └────────────┬─────────────┘  └──────────┬──────────┘ │
│                │                             │                           │             │
└────────────────┴─────────────────────────────┴───────────────────────────┴─────────────┘
                                               │
                                               ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              Centralized React State Store                             │
│                      (Products, Orders, Role, Active View, Toasts)                     │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                              localStorage Persistence Sync                             │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### Data Models & State Structure

```typescript
export interface Product {
  id: string;
  sku: string;
  name: string;
  category: 'Apparel' | 'Electronics' | 'Lifestyle' | 'Fragrance';
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

export interface Order {
  id: string; // e.g. "ORD-8942"
  customerName: string;
  customerPhone: string;
  channel: 'Zatiq Online' | 'In-Store POS' | 'Facebook Page';
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  profit: number;
  status: 'Completed' | 'Pending' | 'Cancelled';
  createdAt: string; // ISO String
}
```
