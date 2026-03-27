import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';
import { clearCart } from './cartSlice';

export const createOrder = createAsyncThunk('orders/create', async (order, thunkAPI) => {
    try {
        const response = await axiosInstance.post('/orders', order);
        thunkAPI.dispatch(clearCart());
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.error || error.message);
    }
});

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        order: null,
        loading: false,
        error: null,
        success: false
    },
    reducers: {
        orderCreateReset: (state) => {
            state.success = false;
            state.order = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(createOrder.pending, (state) => {
            state.loading = true;
        })
        .addCase(createOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.success = true;
            state.order = action.payload.data;
        })
        .addCase(createOrder.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export const { orderCreateReset } = orderSlice.actions;
export default orderSlice.reducer;
