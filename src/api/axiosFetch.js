import axios from "axios";

import URL from "constants/url";
import CODE from "constants/code";

/* axios 데이터 통신 */
export async function axiosFetch(url, requestData) {
    const headers = {
        Authorization: process.env.REACT_APP_POST,
        "Content-Type": "application/json",
    };

    try {
        const response = await axios.post(url, requestData, { headers });
        if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
            return response.data.result.resultData;
        } else if (
            Number(response.data.resultCode) === Number(CODE.RCV_ERROR_AUTH)
        ) {
            sessionStorage.setItem("loginUser", JSON.stringify({ id: "" }));
            window.location.href = URL.LOGIN;
            return false;
        } else {
            return response.data;
        }
    } catch (error) {
        console.error("server error: ", error);
        throw error;
    } finally {
        console.log("axios fetch finally end");
    }
}
