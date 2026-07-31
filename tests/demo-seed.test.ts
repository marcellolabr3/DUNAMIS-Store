import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const demoSql = readFileSync(join(process.cwd(), 'seeds', 'demo.sql'), 'utf8');
const clearDemoSql = readFileSync(
  join(process.cwd(), 'seeds', 'clear-demo.sql'),
  'utf8'
);

describe('demo seed', () => {
  it('contains the required demo categories', () => {
    for (const category of [
      'Camisetas',
      'Livros',
      'Acessorios',
      'Eventos',
      'Infantil'
    ]) {
      expect(demoSql).toContain(category);
    }
  });

  it('contains the required demo products', () => {
    for (const product of [
      'Camiseta Dunamis Classica',
      'Camiseta Fe em Movimento',
      'Devocional 30 Dias',
      'Biblia de Estudo',
      'Caneca Dunamis',
      'Pulseira Dunamis',
      'Conferencia Dunamis',
      'Camiseta Dunamis Kids'
    ]) {
      expect(demoSql).toContain(product);
    }
  });

  it('contains five fictitious orders with different operational states', () => {
    expect(demoSql.match(/DNS-2026-00000[1-5]/g)).toHaveLength(10);
    expect(demoSql).toContain('PENDING_PAYMENT');
    expect(demoSql).toContain('RECEIPT_SUBMITTED');
    expect(demoSql).toContain('PAID');
    expect(demoSql).toContain('PREPARING');
    expect(demoSql).toContain('READY_FOR_PICKUP');
  });

  it('can clear all demo-owned records by id prefix', () => {
    for (const prefix of [
      'demo-history-',
      'demo-receipt-',
      'demo-payment-',
      'demo-item-',
      'demo-order-',
      'demo-customer-',
      'demo-banner-',
      'demo-img-',
      'demo-var-',
      'demo-prod-',
      'demo-cat-'
    ]) {
      expect(clearDemoSql).toContain(prefix);
    }
  });
});
