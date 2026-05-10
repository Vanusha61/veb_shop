
export const PRODUCT_API = '/products';
export const ORDER_API = '/cart';   // корзина живёт внутри order_service
export const ORDERS_API = '/orders';


export const getSessionId = () => {
  let sid = localStorage.getItem('session_id');
  if (!sid) {
    sid = 'session_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('session_id', sid);
  }
  return sid;
};