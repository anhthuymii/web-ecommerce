import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // User data
  token: "", // User authentication token
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    signOut: (state) => {
      state.user = null;
      state.token = "";
    },
  },
});

export const { setUser, setToken, signOut } = userSlice.actions;

export const selectUser = (state) => state.user.user;
export const selectToken = (state) => state.user.token;

export default userSlice.reducer;
