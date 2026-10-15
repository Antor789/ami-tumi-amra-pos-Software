import { AuthUser, JWTPayload, UserRole } from '../types';

// Helper to base64url encode JSON
const base64UrlEncode = (obj: object): string => {
  const jsonStr = JSON.stringify(obj);
  return btoa(jsonStr).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
};

// Helper to decode Base64Url
export const decodeJWT = (token: string): { header: object; payload: JWTPayload; signature: string } | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const headerStr = atob(parts[0].replace(/-/g, '+').replace(/_/g, '/'));
    const payloadStr = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'));
    
    return {
      header: JSON.parse(headerStr),
      payload: JSON.parse(payloadStr),
      signature: parts[2],
    };
  } catch (e) {
    console.error('Failed to decode JWT token', e);
    return null;
  }
};

// Generate authentic JWT token for user session
export const generateJWT = (
  userId: string,
  name: string,
  email: string,
  role: UserRole,
  permissions: string[]
): string => {
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };

  const now = Math.floor(Date.now() / 1000);
  const payload: JWTPayload = {
    sub: userId,
    name,
    email,
    role,
    permissions,
    iat: now,
    exp: now + 8 * 3600, // 8 hours session expiry
    iss: 'https://auth.amitumiamra.com',
  };

  const headerB64 = base64UrlEncode(header);
  const payloadB64 = base64UrlEncode(payload);
  
  // Simulated HMAC-SHA256 signature string
  const signature = 's5E_ami_tumi_amra_sig_' + Math.random().toString(36).substring(2, 12);

  return `${headerB64}.${payloadB64}.${signature}`;
};

// Demo User Credentials & Role Definitions
export const DEMO_ROLES = {
  owner: {
    id: 'usr-001',
    name: 'Tanvir Rahman (Owner)',
    email: 'owner@amitumiamra.com',
    role: 'Business Owner' as UserRole,
    pin: '8888',
    permissions: [
      'read:financial_kpi',
      'read:net_profit',
      'read:cost_price',
      'write:inventory_stock',
      'write:product_catalog',
      'delete:product',
      'create:pos_order',
      'update:order_status',
      'export:csv_reports',
    ],
  },
  manager: {
    id: 'usr-002',
    name: 'Sabbir Ahmed (Store Mgr)',
    email: 'manager@amitumiamra.com',
    role: 'Store Manager' as UserRole,
    pin: '1234',
    permissions: [
      'read:inventory_stock',
      'write:inventory_stock',
      'write:product_catalog',
      'create:pos_order',
      'update:order_status',
      'export:csv_reports',
    ],
  },
  cashier: {
    id: 'usr-003',
    name: 'Fatema Akter (POS Cashier)',
    email: 'cashier@amitumiamra.com',
    role: 'POS Cashier' as UserRole,
    pin: '0000',
    permissions: [
      'create:pos_order',
      'read:inventory_stock',
      'print:receipt',
    ],
  },
};
