import axios from "axios";

import CODE from "constants/code";

/* axios 데이터 통신 */
export async function axiosFetch(handleLoading, url, requestData) {
    const headers = {
        Authorization: process.env.REACT_APP_POST,
        "Content-Type": "application/json",
    };

    try {
        handleLoading(true);
        const response = await axios.post(url, requestData, { headers });
        console.log(response, "aaa");
        if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
            return response.data.result.resultData;
        } else {
            return response.data;
        }
    } catch (error) {
        console.error("server error: ", error);
        throw error;
    } finally {
        console.log("axios fetch finally end");
        handleLoading(false);
    }
}
