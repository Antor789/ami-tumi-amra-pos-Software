⚡ AMI POS & Real-Time Inventory Cloud

An Enterprise-Grade Omnichannel POS, Real-Time Inventory Tracker & Executive Analytics Dashboard

Built for Modern Bangladeshi Retail & E-Commerce Ecosystems (Zatiq, Facebook & In-Store Counter)

📖 Overview

AMI POS & Inventory is a cloud-based Point of Sale (POS) and real-time stock management platform designed to unify Zatiq e-commerce orders, Facebook social commerce, and physical retail counter sales under a single executive dashboard.

Business owners can monitor daily, weekly, and monthly revenue, net profit margins, and critical low-stock alerts directly from any mobile or desktop browser in real time.

✨ Key Features

📊 1. Executive Performance Dashboard

Real-Time KPI Tracking: Instant calculation of Today's Revenue (৳), Net Profit & Margin (%), Today's Completed Orders (split by Online vs. POS), and 7-Day / Monthly Revenue.

Interactive Revenue & Profit Charts: Dynamic area charts powered by Recharts with Daily (7 Days), Weekly, and Monthly toggles.

Inventory Health Monitor: Live tracking of total active SKUs with automatic badges for Low Stock ($\le 5$) and Out of Stock ($0$) items.

Courier & Order Status Management: Track orders across Completed, Pending Courier, and Returned/Cancelled states—with automatic stock restoration upon order return.

📦 2. Real-Time Inventory & Media Manager

1-Click Instant Stock Adjustment: Increment (+) or decrement (-) stock levels directly from the product table/card with instant dashboard synchronization.

Live Product Image Upload: Drag-and-drop local product photos or paste external image URLs with immediate browser preview and state persistence.

SKU Valuation & Cost Tracking: Tracks both Cost Price (৳) and Retail Price (৳) to compute total stock valuation in real time.

Smart Filtering: Search by Product Name or SKU (AMI-PNJ-001), filter by category (Apparel, Electronics, Lifestyle, Fragrance), or filter by stock health.

🛒 3. Omnichannel POS Terminal

Multi-Channel Order Origin: Tag incoming orders by source—POS Counter, Zatiq Website, or Facebook Page.

Bangladeshi Payment & Delivery Integration: Supports Cash, bKash, Nagad, and COD (Courier) along with Inside/Outside Dhaka delivery charge calculation.

Automatic Stock Deduction: Completing an order immediately deducts item quantities from inventory and updates financial metrics without page reloads.

Printable Thermal Receipt Preview: Generates an instant invoice slip upon checkout.

📱 4. 100% Responsive Multi-Device UI/UX

Adaptive Breakpoints: Seamlessly transitions from a 7-column desktop data table to touch-friendly mobile inventory cards and a floating bottom navigation dock on smartphones (360px to 1920px+).

🔐 Security & Role-Based Access Control (RBAC)

The application features a custom JWT (JSON Web Token) session handler with a built-in JWT Payload Inspector and strict permission enforcement across three roles:

Role

Demo Email / PIN

Access Level & Restrictions

👑 Business Owner

owner@amitumi.com    (PIN: 1111)

Full Unrestricted Access: Can view Net Profit, Cost Price, Monthly Revenue, manage inventory, and delete SKUs.

📦 Store Manager

manager@amitumi.com    (PIN: 2222)

Operations Access: Can add products, upload images, and update stock. Cost Price & Net Profit are masked (🔒 Owner Only) and product deletion is locked.

🛒 POS Cashier

cashier@amitumi.com    (PIN: 3333)

Counter Billing Only: Default access to POS Terminal and read-only stock view. Executive Dashboard and financial analytics are restricted.

💡 Quick Demo Testing: The login screen includes 1-Click Role Demo Cards so clients and reviewers can switch between Owner, Manager, and Cashier views instantaneously.

🛠️ Tech Stack

Frontend Framework: React.js (Vite / Next.js compatible)

Styling & Design System: Tailwind CSS (Custom Dark Obsidian & Cyan Glassmorphism Theme)

Data Visualization: Recharts (AreaChart, ResponsiveContainer)

Icons: Lucide React

State & Persistence: React Hooks (useState, useMemo, useEffect) + localStorage Live Sync Engine

Authentication: Base64 JWT Token Generator & Role Permission Guard

🚀 Getting Started Locally

Follow these steps to run the project on your local machine:

# 1. Clone the repository
git clone https://github.com/Antor789/ami-pos-inventory.git

# 2. Navigate to the project directory
cd ami-pos-inventory

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev



Open http://localhost:5173 (or http://localhost:3000) in your browser to view the application.

🌐 Deployment (Vercel)

This project is pre-configured for 1-Click Deployment on Vercel:

Push the repository to GitHub.

Log in to Vercel and click "Add New Project".

Import your GitHub repository and click Deploy.

👨‍💻 Author

Ummet Hasan Antor

GitHub: @Antor789
