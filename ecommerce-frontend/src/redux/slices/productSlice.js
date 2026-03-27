import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const fetchProducts = createAsyncThunk('products/fetchAll', async (keyword = '', thunkAPI) => {
    try {
        const response = await axiosInstance.get(`/products?keyword=${keyword}`);
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response.data.error || error.message);
    }
});

const productSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchProducts.pending, (state) => {
            state.loading = true;
        })
        .addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload;
        })
        .addCase(fetchProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        });
    },
});

export default productSlice.reducer;
