import axios from "axios";

import CODE from "constants/code";

/* axios 데이터 통신 */
export async function axiosFetch(url, requestData) {
    const headers = {
        Authorization: process.env.REACT_APP_POST,
        "Content-Type": "application/json",
    };
    console.log(url);

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

//export async function axiosFetch(url, requestData) {
//    const headers = {
//        Authorization: process.env.REACT_APP_POST,
//        "Content-Type": "application/json",
//    };
//    console.log(url);

//    try {
//        const response = await axios.post(url, requestData, { headers });
//        console.log(response, "패치한 데이터");

//        if (
//            Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS) &&
//            url.includes("product/gradeunitPrice/type")
//        ) {
//            const resultData = [];

//            response.data.result.resultData.forEach((item) => {
//                const { gupDesc, gupPrice, guppId } = item;

//                let existingData = resultData.find(
//                    (dataItem) => dataItem.gupDesc === gupDesc
//                );

//                if (!existingData) {
//                    existingData = { gupDesc };
//                    resultData.push(existingData);
//                }

//                // gupPrice를 해당 위치에 맞게 채웁니다.
//                existingData[`gupPrice${guppId}`] = gupPrice;

//                existingData[`gupId${guppId}`] = item.gupId;

//                existingData[`gupType${guppId}`] = item.gupType;
//            });

//            console.log(resultData);
//            return resultData;
//        } else {
//            return response.data.result.resultData;
//        }
//    } catch (error) {
//        console.error("server error: ", error);
//        throw error;
//    } finally {
//        console.log("axios fetch finally end");
//    }
//}

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

/* axios 데이터 업데이트 */
//export async function axiosUpdate(url, requestData) {
//    const headers = {
//        Authorization: process.env.REACT_APP_POST,
//        "Content-Type": "application/json",
//    };

//    console.log(requestData, "먼저 받은값");

//    try {
//        const response = await axios.put(url, requestData, { headers });
//        console.log(response, "받은값");
//        if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
//            console.log("출력되나");
//            const newData = [];
//            newData = response.data.result.resultData.forEach((item, index) => {
//                const { gupDesc, gupPrice, gupId, gupType, guppId } = item;

//                newData.push({
//                    gupDesc,
//                    gupId,
//                    gupPrice: Number(gupPrice),
//                    gupType,
//                    guppId,
//                });
//            });
//            console.log(newData, "나온값좀보자");
//            return newData;
//        } else {
//            return response.data;
//        }
//    } catch (error) {
//        console.error("server error: ", error);
//        throw error;
//    } finally {
//        console.log("axios update finally end");
//    }
//}

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
    console.log(requestData, "추가하기위해서 받는 데이터");
    const headers = {
        Authorization: process.env.REACT_APP_POST,
        "Content-Type": "application/json",
    };

    try {
        const response = await axios.post(url, requestData, { headers });
        if (Number(response.data.resultCode) === Number(CODE.RCV_SUCCESS)) {
            console.log(response.data.resultCode);
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

export async function axiosPostPersonel(url, requestData) {
    console.log(requestData, "추가하기 위해서 받는 데이터");
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
                if (
                    Number(response.data.resultCode) ===
                    Number(CODE.RCV_SUCCESS)
                ) {
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
                return response.data;
            }
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
