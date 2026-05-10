import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSessionId } from './api';

// Получить корзину с сервера
export const fetchCart = createAsyncThunk('cart/fetchCart', async () => {
  const sid = getSessionId();
  const res = await fetch(`/cart?session_id=${sid}`);
  if (!res.ok) throw new Error('Ошибка загрузки корзины');
  const data = await res.json();
  return data.items || [];
});

// Добавить товар в корзину
export const addToCartAsync = createAsyncThunk('cart/addToCart', async ({ product, quantity = 1 }) => {
  const sid = getSessionId();
  const res = await fetch('/cart/items', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      session_id: sid,
      product_id: product.id,
      quantity,
    }),
  });
  if (!res.ok) throw new Error('Не удалось добавить в корзину');
  // После добавления возвращаем актуальное состояние корзины
  const cartRes = await fetch(`/cart?session_id=${sid}`);
  const cartData = await cartRes.json();
  return cartData.items || [];
});

// Обновить количество товара в корзине
export const updateCartItemAsync = createAsyncThunk('cart/updateCartItem', async ({ itemId, quantity }) => {
  const res = await fetch(`/cart/items/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  if (!res.ok) throw new Error('Не удалось обновить корзину');
  const sid = getSessionId();
  const cartRes = await fetch(`/cart?session_id=${sid}`);
  const cartData = await cartRes.json();
  return cartData.items || [];
});

// Удалить товар из корзины
export const removeFromCartAsync = createAsyncThunk('cart/removeFromCart', async (itemId) => {
  const res = await fetch(`/cart/items/${itemId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Ошибка удаления');
  const sid = getSessionId();
  const cartRes = await fetch(`/cart?session_id=${sid}`);
  const cartData = await cartRes.json();
  return cartData.items || [];
});

// Очистить корзину
export const clearCartAsync = createAsyncThunk('cart/clearCart', async () => {
  const sid = getSessionId();
  const res = await fetch('/cart', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sid }),
  });
  if (!res.ok) throw new Error('Ошибка очистки корзины');
  return [];
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(addToCartAsync.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(updateCartItemAsync.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(removeFromCartAsync.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(clearCartAsync.fulfilled, (state, action) => {
        state.items = [];
      });
  },
});

export default cartSlice.reducer;