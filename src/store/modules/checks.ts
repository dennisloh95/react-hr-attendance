import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { SignsState } from "./signs";
import http from "../../utils/http";

export type Infos = {
  [index: string]: unknown;
};

type ChecksState = {
  applyList: Infos[];
  checkList: Infos[];
};

type GetApply = {
  applicantid?: string;
  approverid?: string;
};

type PostApply = {
  applicantid: string;
  applicantname: string;
  approverid: string;
  approvername: string;
  note: string;
  reason: string;
  time: [string, string];
};

type PutApply = {
  _id: string;
  state: "已通过" | "未通过";
};

export const getApplyAction = createAsyncThunk(
  "checks/getApplyAction",
  async (payload: GetApply) => {
    const res = await http.get("/checks/apply", payload);
    return res;
  }
);

export const postApplyAction = createAsyncThunk(
  "checks/postApplyAction",
  async (payload: PostApply) => {
    const res = await http.post("/checks/apply", payload);
    return res;
  }
);

export const putApplyAction = createAsyncThunk(
  "checks/putApplyAction",
  async (payload: PutApply) => {
    const res = await http.put("/checks/apply", payload);
    return res;
  }
);

const checksSlice = createSlice({
  name: "checks",
  initialState: {
    applyList: [],
    checkList: [],
  } as ChecksState,
  reducers: {
    updateApplyList(state, action: PayloadAction<Infos[]>) {
      state.applyList = action.payload;
    },
    updateCheckList(state, action: PayloadAction<Infos[]>) {
      state.checkList = action.payload;
    },
  },
});

export const { updateApplyList, updateCheckList } = checksSlice.actions;

export default checksSlice.reducer;
