import { createContext, useContext, useState, ReactNode } from 'react';
import { Product } from '@/types/product';

interface CartItem extends Product {
  quantity: number;
  subtotal: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notification, setNotification] = useState<string>('');

  const showNotification = (message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 2000);
  };

  const calculateSubtotal = (product: Product, quantity: number): number => {
    // Smart row pricing: If product has pricePerRow, automatically apply bundle discount
    if (product.pricePerRow && product.pricePerRow > 0) {
      // Calculate how many complete rows (assume 1 row = 5 pieces by default)
      const piecesPerRow = 5;
      const rows = Math.floor(quantity / piecesPerRow);
      const remaining = quantity % piecesPerRow;
      
      // Row price + remaining units at single price
      return (rows * product.pricePerRow) + (remaining * product.sellingPrice);
    }

    // Half row pricing (if product has pricePerHalfRow)
    if (product.pricePerHalfRow && product.pricePerHalfRow > 0 && quantity >= 3) {
      const piecesPerHalfRow = 3;
      const halfRows = Math.floor(quantity / piecesPerHalfRow);
      const remaining = quantity % piecesPerHalfRow;
      
      return (halfRows * product.pricePerHalfRow) + (remaining * product.sellingPrice);
    }

    // Default calculation
    return product.sellingPrice * quantity;
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      
      if (existingItem) {
        showNotification(`${product.name} is already in cart! Quantity increased.`);
        const newQuantity = existingItem.quantity + 1;
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: newQuantity, subtotal: calculateSubtotal(product, newQuantity) }
            : item
        );
      }
      
      showNotification(`${product.name} added to cart!`);
      return [...prevCart, { ...product, quantity: 1, subtotal: calculateSubtotal(product, 1) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === productId) {
          return { ...item, quantity, subtotal: calculateSubtotal(item, quantity) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
      
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg z-[60] animate-bounce">
          <p className="text-sm font-semibold">{notification}</p>
        </div>
      )}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
