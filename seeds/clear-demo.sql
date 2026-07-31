PRAGMA foreign_keys = ON;

DELETE FROM order_status_history WHERE id LIKE 'demo-history-%';
DELETE FROM payment_receipts WHERE id LIKE 'demo-receipt-%';
DELETE FROM payments WHERE id LIKE 'demo-payment-%';
DELETE FROM order_items WHERE id LIKE 'demo-item-%';
DELETE FROM orders WHERE id LIKE 'demo-order-%';
DELETE FROM addresses WHERE id LIKE 'demo-address-%';
DELETE FROM customers WHERE id LIKE 'demo-customer-%';
DELETE FROM banners WHERE id LIKE 'demo-banner-%';
DELETE FROM product_images WHERE id LIKE 'demo-img-%';
DELETE FROM product_variants WHERE id LIKE 'demo-var-%';
DELETE FROM products WHERE id LIKE 'demo-prod-%';
DELETE FROM categories WHERE id LIKE 'demo-cat-%';
