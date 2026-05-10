import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getSessionId } from './api';

// Оформить заказ
export const createOrderAsync = createAsyncThunk('orders/createOrder', async (_, { getState }) => {
  const sid = getSessionId();
  const res = await fetch('/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sid }),
  });
  if (!res.ok) throw new Error('Не удалось создать заказ');
  return await res.json();
});

// Получить список заказов
export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const sid = getSessionId();
  const res = await fetch(`/orders?session_id=${sid}`);
  if (!res.ok) throw new Error('Ошибка загрузки заказов');
  return await res.json();
});

const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    list: [],
    currentOrder: null,
    status: 'idle',
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrderAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrderAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentOrder = action.payload;
      })
      .addCase(createOrderAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(fetchOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default ordersSlice.reducer;