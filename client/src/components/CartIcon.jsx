'use client';

import { useCart } from '@/context/CartContext';
import { useParams, useRouter } from 'next/navigation';
import '@/styles/CartIcon.css';

const CartIcon = () => {
  const { itemCount } = useCart();
  const { locale } = useParams();
  const router = useRouter();

  const handleClick = () => {
    router.push(`/${locale}/cart`);
  };

  return (
    <button className="cart-icon" onClick={handleClick} aria-label="Shopping cart">
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2"
      >
        <path d="M9 2L7 6M17 6l2-4M6 6h12l1 14H5L6 6z"/>
      </svg>
      {itemCount > 0 && (
        <span className="cart-badge">{itemCount}</span>
      )}
    </button>
  );
};

export default CartIcon;