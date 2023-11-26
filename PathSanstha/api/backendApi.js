const axios = require("axios");
import { constants } from "../core/constants";

const errorMessage = {
  error: "Api failed",
};

export const backendApi = {
  login: async (data) => {
    try {
      console.log(process.env);
      const response = await axios({
        method: "post",
        headers: { "Content-Type": "application/json" },
        url: `${constants.BACKEND_API_HOST}/api/signin`,
        data: data,
      });

      const body = response.data || {};
      if (body.message == "Success") {
        return body;
      } else {
        return errorMessage;
      }
    } catch (error) {
      return error;
    }
  },
};
