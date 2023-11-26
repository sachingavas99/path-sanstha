import {
  SET_USER,
  SET_BENIFICIERY_LIST,
  SET_STATEMENT,
  SET_MY_ACCOUNTS,
  SET_MY_TOOL_TIP,
} from "../actions/types";

const initialState = {
  testStateObject: null,
  foodList: [],
  increMentalValue: 0,
  user: {},
  benificieries: [],
  accounts: [],
  statementData: [],
  myToolTip: "",
};

const foodReducer = (state = initialState, action) => {
  console.log("**", action);
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.data,
      };
    case SET_BENIFICIERY_LIST:
      return {
        ...state,
        benificieries: action.data.BenificieryList,
      };
    case SET_STATEMENT:
      return {
        ...state,
        statementData: action.data.statementData,
      };
    case SET_MY_ACCOUNTS:
      return {
        ...state,
        accounts: action.data.myAccountList,
      };
    case SET_MY_TOOL_TIP:
      return {
        ...state,
        myToolTip: action.data.myToolTip,
      };
    default:
      return state;
  }
};

export default foodReducer;
