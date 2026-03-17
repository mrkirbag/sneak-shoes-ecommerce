import { useStore } from '@nanostores/react';
import { cartItems, isCartOpen, removeCartItem, updateQuantity, updateCartItemDetails } from '../store/cartStore';
import { useEffect, useState, type ComponentProps } from 'react';

export default function Cart() {
  const $cartItems = useStore(cartItems);
  const $isCartOpen = useStore(isCartOpen);
  const [user, setUser] = useState({ name: '' });
  const [isHydrated, setIsHydrated] = useState(false);

  const itemsArray = Object.values($cartItems);
  const total = itemsArray.reduce((acc, item) => acc + item.price * item.quantity, 0);

  useEffect(() => {
    setIsHydrated(true);

    const openCart = () => isCartOpen.set(true);
    window.addEventListener('open-cart', openCart);
    return () => window.removeEventListener('open-cart', openCart);
  }, []);

  const handleCheckout: NonNullable<ComponentProps<'form'>['onSubmit']> = (e) => {
    e.preventDefault();
    const message = `
                      *Hola buen día! Mi nombre es ${user.name}*%0A` +
                      `*Me gustaria consultar la existencia de los siguientes productos:*%0A` +
                      itemsArray.map(i => {
                        const opts = [];
                        if (i.size) opts.push(`talla:${i.size}`);
                        if (i.color) opts.push(`color:${i.color}`);
                        return `- ${i.name} [x${i.quantity}]${opts.length ? ' ('+opts.join(', ')+')' : ''} ($${i.price * i.quantity})`;
                      }).join('%0A') +
                      `%0A%0A*Total a pagar:* $${total}
                      %0A%0A*Quedo atento a tu respuesta, muchas gracias!*
                  `;

    window.open(`https://wa.me/584247217176?text=${message}`, '_blank');
  };

  if (!isHydrated) return null;
  if (!$isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-end"
      onClick={() => isCartOpen.set(false)}
    >
      <div
        className="bg-white w-full max-w-md h-full flex flex-col shadow-2xl animate-fade-left animate-duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 flex justify-between items-center border-b border-zinc-200">
          <h2 className="text-lg font-semibold tracking-[0.14em] uppercase text-zinc-900">Tu SelecciÓn</h2>
          <button
            onClick={() => isCartOpen.set(false)}
            className="w-9 h-9 rounded-full border border-zinc-200 text-zinc-500 hover:text-black hover:border-zinc-400 transition"
            aria-label="Cerrar carrito"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {itemsArray.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-zinc-400 italic">
              <p>TU CARRITO ESTÁ VACÍO</p>
            </div>
          ) : (
            itemsArray.map(item => {
              const availableSizes = Array.isArray(item.sizes) ? item.sizes : [];
              const availableColors = Array.isArray(item.colors) ? item.colors : [];
              const previewImage = Array.isArray(item.images) && item.images.length > 0 ? item.images[0] : '';

              return (
              <div key={item.id} className="flex gap-4 rounded-xl border border-zinc-200 bg-white p-3">
                <img src={previewImage} className="w-20 h-24 object-cover bg-zinc-100 rounded-lg" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="uppercase text-sm font-semibold tracking-wide text-zinc-900">{item.name}</h3>
                    <span className="text-sm font-semibold text-zinc-900">${item.price * item.quantity}</span>
                  </div>
                  <div className="flex flex-col gap-3 mt-4">
                    <div className="flex gap-2">
                      {availableSizes.length > 0 && (
                        <select
                          value={item.size || ''}
                          onChange={e => updateCartItemDetails(item.id, { size: e.target.value })}
                          className="w-1/2 text-xs border border-zinc-300 rounded-md px-2 py-2 bg-white focus:border-black outline-none"
                        >
                          <option value="">Talla</option>
                          {availableSizes.map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      )}
                      <select
                        value={item.color || ''}
                        onChange={e => updateCartItemDetails(item.id, { color: e.target.value })}
                        className="w-1/2 text-xs border border-zinc-300 rounded-md px-2 py-2 bg-white focus:border-black outline-none"
                      >
                        <option value="">Color</option>
                        {availableColors.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center border border-zinc-300 rounded-md overflow-hidden">
                        <button onClick={() => updateQuantity(item.id, -1)} className="px-3 py-1.5 text-sm hover:bg-zinc-100 transition">-</button>
                        <span className="text-sm px-3 border-x border-zinc-300">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="px-3 py-1.5 text-sm hover:bg-zinc-100 transition">+</button>
                      </div>
                      <button
                        onClick={() => removeCartItem(item.id)}
                        className="w-8 h-8 grid place-items-center rounded-md text-zinc-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        aria-label="Eliminar articulo"
                        title="Eliminar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
            })
          )}
        </div>

        {itemsArray.length > 0 && (
          <form onSubmit={handleCheckout} className="p-6 border-t border-zinc-200 bg-zinc-50 space-y-3">
            <input 
              required type="text" placeholder="NOMBRE COMPLETO"
              className="w-full bg-white border border-zinc-300 rounded-md px-3 py-2.5 text-sm tracking-[0.08em] placeholder:text-zinc-400 focus:border-black focus:ring-2 focus:ring-black/5 outline-none transition"
              onChange={e => setUser({...user, name: e.target.value})}
            />
            <div className="pt-2">
              <div className="flex justify-between mb-4 font-bold text-lg text-zinc-900">
                <span>Total</span>
                <span>${total}</span>
              </div>
              <button type="submit" className="w-full bg-black text-white py-3.5 text-xs tracking-[0.2em] font-bold hover:bg-zinc-800 rounded-md transition uppercase cursor-pointer">
                Consultar por WhatsApp
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}