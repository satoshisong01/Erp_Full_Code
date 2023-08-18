import axios from "axios";

import CODE from "constants/code";

/* axios 데이터 통신 */
export async function axiosFetch(url, requestData) {
    const headers = {
        Authorization: process.env.REACT_APP_POST,
        "Content-Type": "application/json",
    };

    try {
        const response = await axios.post(url, requestData, { headers });
        console.log(response, "패치한데이터");
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
    }
}

/* axios 데이터 업데이트 */
export async function axiosUpdate(url, requestData) {
    const headers = {
        Authorization: process.env.REACT_APP_POST,
        "Content-Type": "application/json",
    };

    try {
        const response = await axios.put(url, requestData, { headers });
        if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
            return response.data.result.resultData;
        } else {
            return response.data;
        }
    } catch (error) {
        console.error("server error: ", error);
        throw error;
    } finally {
        console.log("axios update finally end");
    }
}

/* axios 데이터 삭제 */
export async function axiosDelete(url, requestData) {
    const headers = {
        Authorization: process.env.REACT_APP_POST,
        "Content-Type": "application/json",
    };

    try {
        console.log(requestData);
        const response = await axios.delete(url, {
            headers: headers,
            data: requestData.data, // 요청 페이로드로 requestData를 설정
        });
        if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
            return response.data.result.resultData;
        } else {
            return response.data;
        }
    } catch (error) {
        console.error("server error: ", error);
        throw error;
    } finally {
        console.log("axios delete finally end");
    }
}

/* axios 데이터 추가하기 */
export async function axiosPost(url, requestData) {
    console.log(requestData);
    const headers = {
        Authorization: process.env.REACT_APP_POST,
        "Content-Type": "application/json",
    };

    try {
        const response = await axios.post(url, requestData, { headers });
        if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
            return response.data.result.resultData;
        } else {
            return response.data;
        }
    } catch (error) {
        console.error("server error: ", error);
        throw error;
    } finally {
        console.log("axios Post finally end");
    }
}

/* axios 데이터 검색하기 */
export async function axiosScan(url, requestData) {
    const headers = {
        Authorization: process.env.REACT_APP_POST,
        "Content-Type": "application/json",
    };

    console.log(requestData, "axios에서 받은값");

    try {
        const response = await axios.post(url, requestData, { headers });
        console.log(response, "패치한데이터");
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
    }
}
