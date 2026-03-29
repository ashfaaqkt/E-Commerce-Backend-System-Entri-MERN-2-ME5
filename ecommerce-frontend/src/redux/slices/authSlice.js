import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axiosInstance';

export const login = createAsyncThunk('auth/login', async (credentials, thunkAPI) => {
    try {
        const response = await axiosInstance.post('/auth/login', credentials);
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        const response = await axiosInstance.post('/auth/register', userData);
        localStorage.setItem('userInfo', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, thunkAPI) => {
    try {
        const response = await axiosInstance.put('/users/profile', userData);
        const existingInfo = JSON.parse(localStorage.getItem('userInfo'));
        const updatedInfo = { ...existingInfo, user: response.data.data };
        localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
});

export const logout = createAsyncThunk('auth/logout', async () => {
    await axiosInstance.get('/auth/logout');
    localStorage.removeItem('userInfo');
});

export const switchRole = createAsyncThunk('auth/switchRole', async (_, thunkAPI) => {
    try {
        const response = await axiosInstance.put('/users/switch-role');
        const existingInfo = JSON.parse(localStorage.getItem('userInfo'));
        const updatedInfo = { ...existingInfo, user: response.data.data };
        localStorage.setItem('userInfo', JSON.stringify(updatedInfo));
        return response.data.data;
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.data?.error || error.message);
    }
});

const userInfoFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

const initialState = {
    userInfo: userInfoFromStorage ? userInfoFromStorage.user : null,
    token: userInfoFromStorage ? userInfoFromStorage.token : null,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.userInfo = action.payload.user;
            state.token = action.payload.token;
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(register.fulfilled, (state, action) => {
            state.loading = false;
            state.userInfo = action.payload.user;
            state.token = action.payload.token;
        })
        .addCase(register.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(updateProfile.pending, (state) => {
            state.loading = true;
        })
        .addCase(updateProfile.fulfilled, (state, action) => {
            state.loading = false;
            state.userInfo = action.payload;
        })
        .addCase(updateProfile.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(switchRole.pending, (state) => {
            state.loading = true;
        })
        .addCase(switchRole.fulfilled, (state, action) => {
            state.loading = false;
            state.userInfo = action.payload;
        })
        .addCase(switchRole.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(logout.fulfilled, (state) => {
            state.userInfo = null;
            state.token = null;
        });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
