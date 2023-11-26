import {
  SET_USER,
  SET_BENIFICIERY_LIST,
  SET_STATEMENT,
  SET_MY_ACCOUNTS,
  SET_MY_TOOL_TIP,
} from "./types";

export const setUserData = (userData) => ({
  type: SET_USER,
  data: userData,
});

export const setBenificieryList = (benificieries) => ({
  type: SET_BENIFICIERY_LIST,
  data: benificieries,
});

export const setStatement = (statementData) => ({
  type: SET_STATEMENT,
  data: statementData,
});

export const setMyAccounts = (myAccountsList) => ({
  type: SET_MY_ACCOUNTS,
  data: myAccountsList,
});

export const setMyToolTip = (myToolTip) => ({
  type: SET_MY_TOOL_TIP,
  data: myToolTip,
});
