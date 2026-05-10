import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Header() {
  const items = useSelector((state) => state.cart.items);
  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">Магазин лампочек</Link>
        <Link to="/cart" className="cart-link">
          🛒 Корзина <span>{itemsCount}</span>
        </Link>
      </div>
    </header>
  );
}

export default Header;