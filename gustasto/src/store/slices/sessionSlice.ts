import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface SessionState {
  restaurantId: string | null;
  tableId: string | null;
  tableNumber: string | null;
  restaurantName: string | null;
  logo: string | null;
  address: string | null;
}

const getInitialState = (): SessionState => {
  try {
    const saved = localStorage.getItem('gusto_session');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to parse saved session', e);
  }
  return {
    restaurantId: null,
    tableId: null,
    tableNumber: null,
    restaurantName: null,
    logo: null,
    address: null,
  };
};

const sessionSlice = createSlice({
  name: 'session',
  initialState: getInitialState(),
  reducers: {
    setSession: (state, action: PayloadAction<SessionState>) => {
      state.restaurantId = action.payload.restaurantId;
      state.tableId = action.payload.tableId;
      state.tableNumber = action.payload.tableNumber;
      state.restaurantName = action.payload.restaurantName;
      state.logo = action.payload.logo;
      state.address = action.payload.address;
      localStorage.setItem('gusto_session', JSON.stringify(action.payload));
    },
    clearSession: (state) => {
      state.restaurantId = null;
      state.tableId = null;
      state.tableNumber = null;
      state.restaurantName = null;
      state.logo = null;
      state.address = null;
      localStorage.removeItem('gusto_session');
    },
  },
});

export const { setSession, clearSession } = sessionSlice.actions;
export default sessionSlice.reducer;
