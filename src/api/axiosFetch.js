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
        if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
            return response.data.result.resultData;
        } else {
            console.error("❌axiosFetch error: ", response);
            return false;
        }
    } catch (error) {
        throw error;
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
            console.error("❌axiosUpdate error: ", response);
            return false;
        }
    } catch (error) {
        throw error;
    }
}

/* axios 데이터 삭제 */
export async function axiosDelete(url, requestData) {
    const headers = {
        Authorization: process.env.REACT_APP_POST,
        "Content-Type": "application/json",
    };

    try {
        const response = await axios.delete(url, {
            headers: headers,
            data: requestData, // 요청 페이로드로 requestData를 설정
        });
        if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
            return response.data.result.resultData;
        } else {
            console.error("❌axiosDelete error: ", response);
            return false;
        }
    } catch (error) {
        throw error;
    }
}

/* axios 데이터 추가하기 */
export async function axiosPost(url, requestData) {
    const headers = {
        Authorization: process.env.REACT_APP_POST,
        "Content-Type": "application/json",
    };

    try {
        const response = await axios.post(url, requestData, { headers });
        if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
            return response.data.result.resultData;
        } else {
            console.error("axiosPost error: ", response);
            return false;
        }
    } catch (error) {
        console.error("❌server error: ", error);
        throw error;
    }
}

export async function axiosPostPersonel(url, requestData) {
    const headers = {
        Authorization: process.env.REACT_APP_POST,
        "Content-Type": "application/json",
    };

    try {
        if (requestData === true) {
            const results = [];

            for (let i = 2; i <= 14; i++) {
                const data = {
                    gupDesc: "123",
                    gupId: (16 - i).toString(), // 2부터 14까지 13번 반복하여 -1씩 감소
                    gupPrice: "0",
                    gupType: "P",
                    guppId: i.toString(), // 2부터 14까지 반복
                    lockAt: "Y",
                    userAt: "Y",
                };

                const response = await axios.post(url, data, { headers });
                if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
                    console.log(response.data.resultCode);
                    results.push(response.data.result.resultData);
                } else {
                    results.push(response.data);
                }
            }

            return results; // 모든 요청이 완료된 후에 결과를 반환
        } else {
            const response = await axios.post(url, requestData, { headers });
            if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
                console.log(response.data.resultCode);
                return response.data.result.resultData;
            } else {
                return Number(response.data.resultCode);
            }
        }
    } catch (error) {
        console.error("server error: ", error);
        throw error;
    }
}

/* axios 데이터 검색하기 */
export async function axiosScan(url, requestData) {
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
    }
}

/* get */
export async function axiosGet(url) {
    const headers = {
        Authorization: process.env.REACT_APP_POST,
        "Content-Type": "application/json",
    };

    try {
        const response = await axios.get(url, { headers });
        if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
            return true;
        } else {
        console.error("❌axiosGet error: ");
            return false;
        }
    } catch (error) {
        throw error;
    }
}
