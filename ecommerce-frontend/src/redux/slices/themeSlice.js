import { createSlice } from '@reduxjs/toolkit';

const themeFromStorage = localStorage.getItem('darkMode') === null ? true : localStorage.getItem('darkMode') === 'true';

const themeSlice = createSlice({
    name: 'theme',
    initialState: {
        darkMode: themeFromStorage,
    },
    reducers: {
        toggleTheme: (state) => {
            state.darkMode = !state.darkMode;
            localStorage.setItem('darkMode', state.darkMode);
        },
    },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;
