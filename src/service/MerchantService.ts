import crypto from 'node:crypto';
import type { MenuItem, MerchantStore, IncomingOrder } from '../domain/types.js';

export class MerchantService {
  private stores = new Map<string, MerchantStore>();
  private menus = new Map<string, MenuItem[]>(); // merchantId -> items
  private orders = new Map<string, IncomingOrder>();

  constructor() {
    this.registerStore({
      name: 'Le Bistro Parisien',
      cuisine: 'French Gourmet',
      address: '14 Rue de Rivoli, Paris',
      payoutAddress: '0xmerchant_bistro_paris_onxc',
    });
  }

  public registerStore(params: {
    name: string;
    cuisine: string;
    address: string;
    payoutAddress: string;
  }): MerchantStore {
    const id = `mch_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`;
    const store: MerchantStore = {
      id,
      name: params.name,
      cuisine: params.cuisine,
      address: params.address,
      payoutAddress: params.payoutAddress,
      isOpen: true,
    };
    this.stores.set(id, store);
    this.menus.set(id, []);
    return store;
  }

  public addMenuItem(params: {
    merchantId: string;
    name: string;
    description: string;
    price: number;
    category: string;
  }): MenuItem {
    const store = this.stores.get(params.merchantId);
    if (!store) throw new Error(`Merchant store '${params.merchantId}' not found.`);

    const item: MenuItem = {
      id: `itm_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      merchantId: params.merchantId,
      name: params.name,
      description: params.description,
      price: params.price,
      available: true,
      category: params.category,
    };

    const list = this.menus.get(params.merchantId) || [];
    list.push(item);
    this.menus.set(params.merchantId, list);
    return item;
  }

  public receiveOrder(order: IncomingOrder): void {
    this.orders.set(order.id, order);
  }

  public acceptOrder(orderId: string): IncomingOrder {
    const ord = this.orders.get(orderId);
    if (!ord) throw new Error(`Order '${orderId}' not found.`);
    ord.status = 'PREPARING';
    return ord;
  }

  public getRevenue(merchantId: string): { totalOrders: number; grossRevenue: number } {
    let count = 0;
    let rev = 0;
    for (const ord of this.orders.values()) {
      if (ord.merchantId === merchantId) {
        count += 1;
        rev += ord.subtotal;
      }
    }
    return { totalOrders: count, grossRevenue: parseFloat(rev.toFixed(2)) };
  }

  public getMenu(merchantId: string): MenuItem[] {
    return this.menus.get(merchantId) || [];
  }
}
