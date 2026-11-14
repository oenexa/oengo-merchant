import { describe, it, expect } from 'vitest';
import { MerchantService } from '../service/MerchantService.js';

describe('OENGO Merchant Management Application Service', () => {
  it('registers store and adds catalogue menu items', () => {
    const service = new MerchantService();
    const store = service.registerStore({
      name: 'Tokyo Ramen Bar',
      cuisine: 'Japanese Ramen',
      address: 'Shibuya 1-1, Tokyo',
      payoutAddress: '0xtokyo_ramen_onxc',
    });

    const item = service.addMenuItem({
      merchantId: store.id,
      name: 'Spicy Tonkotsu Ramen',
      description: 'Rich pork broth with chashu pork and soft egg',
      price: 14.50,
      category: 'Mains',
    });

    expect(item.id.startsWith('itm_')).toBe(true);
    expect(service.getMenu(store.id)).toHaveLength(1);
    expect(service.getMenu(store.id)[0].price).toBe(14.50);
  });

  it('receives order, transitions status to PREPARING, and calculates revenue', () => {
    const service = new MerchantService();
    const store = service.registerStore({
      name: 'Napoli Pizza',
      cuisine: 'Italian',
      address: 'Spaccanapoli 10, Naples',
      payoutAddress: '0xnapoli_onxc',
    });

    service.receiveOrder({
      id: 'ord_napoli_101',
      merchantId: store.id,
      items: [{ id: 'itm_margherita', name: 'Margherita DOC', price: 12.00, quantity: 2 }],
      subtotal: 24.00,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    });

    const accepted = service.acceptOrder('ord_napoli_101');
    expect(accepted.status).toBe('PREPARING');

    const rev = service.getRevenue(store.id);
    expect(rev.totalOrders).toBe(1);
    expect(rev.grossRevenue).toBe(24.00);
  });
});
