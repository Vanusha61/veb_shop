import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/productsSlice';
import { addToCartAsync } from '../store/cartSlice';

function CatalogPage() {
  const dispatch = useDispatch();
  const { items: products, status, error } = useSelector((state) => state.products);
  const cartItems = useSelector((state) => state.cart.items);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const getInCartQty = (productId) => {
    const item = cartItems.find((i) => i.product_id === productId);
    return item ? item.quantity : 0;
  };

  const handleAddToCart = (product, e) => {
    e.preventDefault();
    dispatch(addToCartAsync({ product, quantity: 1 }));
  };

  if (status === 'loading') return <div style={{ padding: 20 }}>Загрузка товаров...</div>;
  if (status === 'failed') return <div style={{ padding: 20, color: 'red' }}>Ошибка: {error}</div>;

  return (
    <div>
      <h1 style={{ fontSize: '2rem', margin: '20px 0' }}>Каталог ламп</h1>
      <div className="catalog-grid">
        {products.map((product) => {
          const inCart = getInCartQty(product.id);
          const isMax = inCart >= product.stock_quantity; // сервер возвращает stock_quantity
          return (
            <div key={product.id} className="product-card">
              <Link to={`/product/${product.id}`}>
                <img src={product.image} alt={product.name} />
              </Link>
              <div className="info">
                <h3><Link to={`/product/${product.id}`}>{product.name}</Link></h3>
                <p style={{ color: '#4b5563', fontSize: '0.9rem', marginBottom: '8px' }}>
                  {product.description?.length > 80
                    ? product.description.substring(0, 80) + '…'
                    : product.description}
                </p>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '10px' }}>
                  {product.tags?.map((tag) => (
                    <span key={tag} style={{ background: '#f3f4f6', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', color: '#374151' }}>
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="price">{product.price} ₽</div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                  <Link to={`/product/${product.id}`} className="details-btn">Подробнее</Link>
                  <button
                    className="add-to-cart"
                    style={{ padding: '10px 16px', fontSize: '0.9rem', whiteSpace: 'nowrap', opacity: isMax ? 0.6 : 1 }}
                    disabled={isMax}
                    onClick={(e) => handleAddToCart(product, e)}
                  >
                    {isMax ? 'В корзине' : 'В корзину'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CatalogPage;