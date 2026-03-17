import { atom, map } from 'nanostores';
import type { CartItem, Product } from '../types/shop';

export const isCartOpen = atom<boolean>(false);
export const cartItems = map<Record<number, CartItem>>({});
const CART_STORAGE_KEY = 'fadikirbag-shoes-cart-items';
const CART_OPEN_STORAGE_KEY = 'fadikirbag-shoes-cart-open';

function loadCartFromStorage() {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Record<number, CartItem>;
    if (parsed && typeof parsed === 'object') {
      const normalized = Object.fromEntries(
        Object.entries(parsed).map(([id, item]) => {
          const safeItem = {
            ...item,
            images: Array.isArray(item.images) ? item.images : [],
            sizes: Array.isArray(item.sizes) ? item.sizes : [],
            colors: Array.isArray((item as CartItem).colors) ? (item as CartItem).colors : []
          } as CartItem;
          return [id, safeItem];
        })
      ) as Record<number, CartItem>;
      cartItems.set(normalized);
    }
  } catch {
    console.error('Failed to load cart from storage');
  }
}

function persistCartToStorage(items: Record<number, CartItem>) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    console.error('Failed to persist cart to storage');
  }
}

function loadCartOpenFromStorage() {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(CART_OPEN_STORAGE_KEY);
    if (raw === null) return;
    isCartOpen.set(raw === 'true');
  } catch {
    console.error('Failed to load cart open state from storage');
  }
}

function persistCartOpenToStorage(open: boolean) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CART_OPEN_STORAGE_KEY, String(open));
  } catch {
    console.error('Failed to persist cart open state');
  }
}

loadCartFromStorage();
loadCartOpenFromStorage();

cartItems.listen((items) => {
  persistCartToStorage(items);
});

isCartOpen.listen((open) => {
  persistCartOpenToStorage(open);
});

export function addCartItem(product: Product) {
  const existingItem = cartItems.get()[product.id];
  if (existingItem) {
    cartItems.setKey(product.id, { ...existingItem, quantity: existingItem.quantity + 1 });
  } else {
    cartItems.setKey(product.id, { ...product, quantity: 1 });
  }
}

export function updateCartItemDetails(id: number, changes: Partial<{ size: string; color: string }>) {
  const item = cartItems.get()[id];
  if (!item) return;
  cartItems.setKey(id, { ...item, ...changes });
}

export function removeCartItem(id: number) {
  const items = { ...cartItems.get() };
  delete items[id];
  cartItems.set(items);
}

export function updateQuantity(id: number, delta: number) {
  const item = cartItems.get()[id];
  if (!item) return;
  const newQty = item.quantity + delta;
  if (newQty <= 0) removeCartItem(id);
  else cartItems.setKey(id, { ...item, quantity: newQty });
}