import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGES } from '@/config/contact';

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart();
  const [isMinimized, setIsMinimized] = useState(false);

  if (cart.length === 0) {
    return null;
  }

  if (isMinimized) {
    return (
      <button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-4 right-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-3 rounded-full shadow-2xl z-50 flex items-center gap-2 hover:scale-105 transition-transform"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <div className="text-left">
          <p className="text-xs font-semibold">{getTotalItems()} items</p>
          <p className="text-sm font-black">₦{getTotalPrice().toLocaleString()}</p>
        </div>
        <div className="bg-white text-emerald-600 rounded-full w-6 h-6 flex items-center justify-center font-bold text-xs">
          {getTotalItems()}
        </div>
      </button>
    );
  }

  const sendWhatsAppOrder = () => {
    const orderDetails = cart.map(item => 
      `*${item.name}* (${item.brand || 'Generic'})\n` +
      `Quantity: ${item.quantity}\n` +
      `Subtotal: ₦${item.subtotal.toLocaleString()}`
    ).join('\n\n');

    const message = `Hello JOBICA FOODS, I'd like to place an order:\n\n${orderDetails}\n\n*Total: ₦${getTotalPrice().toLocaleString()}*`;
    
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-emerald-600 shadow-2xl z-50 max-h-[70vh] flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <div>
            <h3 className="text-white font-bold text-lg">Shopping Cart</h3>
            <p className="text-emerald-100 text-xs">{getTotalItems()} items</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(true)}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition"
            title="Minimize cart"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button
            onClick={clearCart}
            className="text-white hover:bg-white hover:bg-opacity-20 px-3 py-1 rounded-lg text-sm transition"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {cart.map(item => {
          // Smart row/half-row detection
          const hasRowPricing = item.pricePerRow && item.pricePerRow > 0;
          const hasHalfRowPricing = item.pricePerHalfRow && item.pricePerHalfRow > 0;
          
          const piecesPerRow = 5;
          const piecesPerHalfRow = 3;
          
          const rows = hasRowPricing ? Math.floor(item.quantity / piecesPerRow) : 0;
          const halfRows = hasHalfRowPricing && !hasRowPricing ? Math.floor(item.quantity / piecesPerHalfRow) : 0;
          const remaining = hasRowPricing 
            ? item.quantity % piecesPerRow 
            : hasHalfRowPricing 
              ? item.quantity % piecesPerHalfRow 
              : 0;

          return (
            <div key={item.id} className="bg-gray-50 rounded-lg p-3 flex gap-3">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
              
              <div className="flex-1">
                <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.brand}</p>
                
                {/* Show row/half-row breakdown */}
                {rows > 0 && (
                  <p className="text-xs text-emerald-600 font-semibold mt-1">
                    💰 {rows} row{rows > 1 ? 's' : ''} {remaining > 0 && `+ ${remaining} unit${remaining > 1 ? 's' : ''}`}
                  </p>
                )}
                {halfRows > 0 && rows === 0 && (
                  <p className="text-xs text-emerald-600 font-semibold mt-1">
                    💰 {halfRows} half row{halfRows > 1 ? 's' : ''} {remaining > 0 && `+ ${remaining} unit${remaining > 1 ? 's' : ''}`}
                  </p>
                )}
                
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center hover:bg-gray-300 active:scale-95"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>
                  
                  <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                  
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-7 h-7 bg-emerald-600 text-white rounded-full flex items-center justify-center hover:bg-emerald-700 active:scale-95"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-bold text-emerald-600">₦{item.subtotal.toLocaleString()}</p>
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700 text-xs mt-2"
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t bg-white p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-900">Total:</span>
          <span className="text-2xl font-black text-emerald-600">₦{getTotalPrice().toLocaleString()}</span>
        </div>
        
        <button
          onClick={sendWhatsAppOrder}
          className="w-full bg-green-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-600 active:scale-98 transition shadow-lg"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Send Order via WhatsApp
        </button>
      </div>
    </div>
  );
}
