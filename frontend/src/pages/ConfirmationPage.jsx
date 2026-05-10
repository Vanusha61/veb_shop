import { useLocation, Link } from 'react-router-dom';

function ConfirmationPage() {
  const location = useLocation();
  const { name, phone, total, orderId } = location.state || {};

  return (
    <div className="confirmation-page">
      <h1>Заказ подтверждён!</h1>
      <p>Спасибо, {name}! Ваш заказ №{orderId} на сумму {total} ₽ принят.</p>
      <p>Мы свяжемся с вами по телефону {phone}.</p>
      <Link to="/">Вернуться в каталог</Link>
    </div>
  );
}

export default ConfirmationPage;