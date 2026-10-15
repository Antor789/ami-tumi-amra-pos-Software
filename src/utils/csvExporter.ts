import { Product, Order } from '../types';

export const exportProductsToCSV = (products: Product[]) => {
  const headers = ['SKU', 'Product Name', 'Category', 'Cost Price (BDT)', 'Retail Price (BDT)', 'Current Stock', 'Total Stock Value (BDT)', 'Last Updated'];
  
  const rows = products.map((p) => [
    `"${p.sku}"`,
    `"${p.name.replace(/"/g, '""')}"`,
    `"${p.category}"`,
    p.costPrice,
    p.price,
    p.stock,
    p.price * p.stock,
    `"${new Date(p.updatedAt).toLocaleString('en-BD')}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadCSVFile(csvContent, `Ami_Tumi_Amra_Inventory_${new Date().toISOString().split('T')[0]}.csv`);
};

export const exportOrdersToCSV = (orders: Order[]) => {
  const headers = ['Order ID', 'Date & Time', 'Customer Name', 'Phone', 'Address', 'Channel', 'Payment Method', 'Subtotal', 'Discount', 'Delivery Fee', 'Grand Total', 'Profit', 'Status'];

  const rows = orders.map((o) => [
    `"${o.id}"`,
    `"${new Date(o.createdAt).toLocaleString('en-BD')}"`,
    `"${o.customerName.replace(/"/g, '""')}"`,
    `"${o.customerPhone}"`,
    `"${(o.customerAddress || 'N/A').replace(/"/g, '""')}"`,
    `"${o.channel}"`,
    `"${o.paymentMethod}"`,
    o.subtotal,
    o.discount,
    o.deliveryFee,
    o.total,
    o.profit,
    `"${o.status}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  downloadCSVFile(csvContent, `Ami_Tumi_Amra_Orders_Report_${new Date().toISOString().split('T')[0]}.csv`);
};

const downloadCSVFile = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
