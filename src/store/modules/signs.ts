import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import http from "../../utils/http";

export type Infos = {
  [index: string]: unknown;
};
export type SignsState = {
  infos: Infos;
};
type Time = {
  userid: string;
};

export const getTimeAction = createAsyncThunk(
  "signs/getTimeAction",
  async (payload: Time) => {
    const res = await http.get("/signs/time", payload);
    return res;
  }
);

export const putTimeAction = createAsyncThunk(
  "signs/putTimeAction",
  async (payload: Time) => {
    const res = await http.put("/signs/time", payload);
    return res;
  }
);

const signsSlice = createSlice({
  name: "signs",
  initialState: {
    infos: {},
  } as SignsState,
  reducers: {
    updateInfos(state, action: PayloadAction<Infos>) {
      state.infos = action.payload;
    },
  },
});

export const { updateInfos } = signsSlice.actions;

export default signsSlice.reducer;
