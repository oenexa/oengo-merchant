export interface MenuItem {
  id: string;
  merchantId: string;
  name: string;
  description: string;
  price: number;
  available: boolean;
  category: string;
}

export interface MerchantStore {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  payoutAddress: string;
  isOpen: boolean;
}

export interface IncomingOrder {
  id: string;
  merchantId: string;
  items: Array<{ id: string; name: string; price: number; quantity: number }>;
  subtotal: number;
  status: 'PENDING' | 'ACCEPTED' | 'PREPARING' | 'READY_FOR_PICKUP';
  createdAt: string;
}
