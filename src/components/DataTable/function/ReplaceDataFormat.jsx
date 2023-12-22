export const ChangePrmnPlanData = (data, poiId) => {
    const groupedData = {}; //인건비 바꿔서 넣어줄 빈 객체
    // 포지션에 대한 고정된 번호를 매핑하는 객체 생성
    const positionMapping = {
        임원: 1,
        특급기술사: 2,
        고급기술사: 3,
        중급기술사: 4,
        초급기술사: 5,
        고급기능사: 6,
        중급기능사: 7,
        초급기능사: 8,
        부장: 9,
        차장: 10,
        과장: 11,
        대리: 12,
        주임: 13,
        사원: 14,
    };

    //날짜포맷
    data.forEach((item) => {
        const key = `${item.pmpMonth}`;
        if (!groupedData[key]) {
            groupedData[key] = {
                //pgNm: item.pgNm,
                pmpId: [],
                poiId: item.poiId,
                useAt: "Y",
                deleteAt: "N",
                calendarVisible: false,
                pmpmmPositionCode1: 0,
                pmpmmPositionCode2: 0,
                pmpmmPositionCode3: 0,
                pmpmmPositionCode4: 0,
                pmpmmPositionCode5: 0,
                pmpmmPositionCode6: 0,
                pmpmmPositionCode7: 0,
                pmpmmPositionCode8: 0,
                pmpmmPositionCode9: 0,
                pmpmmPositionCode10: 0,
                pmpmmPositionCode11: 0,
                pmpmmPositionCode12: 0,
                pmpmmPositionCode13: 0,
                pmpmmPositionCode14: 0,
                pmpMonth2: `${item.pmpMonth}`,
                pmpMonth: `${item.pmpMonth}`,
                total: 0,
                versionId: item.versionId,
            };
        }

        groupedData[key].pmpId.push(item.pmpId);

        // 포지션에 해당하는 번호를 가져오고, 해당 위치에 pmpmmNum을 저장
        const positionNumber = positionMapping[item.pmpmmPositionCode];
        //console.log(positionNumber, "🥱🥱🥱🥱");
        //console.log(item.pmpmmPositionCode, "🆗🆗🆗🆗");

        if (positionNumber) {
            const pmpmmNumKey = `pmpmmPositionCode${positionNumber}`;
            groupedData[key][pmpmmNumKey] = item.pmpmmNum;

            //console.log(groupedData[key][pmpmmNumKey], "💚💚💚💚💚");

            groupedData[key].total += item.pmpmmNum;
        }
    });

    // groupedData 객체를 배열로 변환
    const transformedData = Object.values(groupedData);
    return transformedData;
};

/* 영업구매-조회: 계산 */
export const buyIngInfoCalculation = (list) => {
    const updatedData = list.map((row) => {
        const {
            byQunty, // 수량
            consumerPrice, // 소비자단가
            consumerAmount, // 소비자금액
            unitPrice, // 단가
            planAmount, // 금액
            byUnitPrice, // 원단가
            estimatedCost, // 원가
            plannedProfits, // 이익금
            plannedProfitMargin, // 이익률
            byStandardMargin, // 구매-기준이익률
            byConsumerOutputRate, // 구매-소비자가산출률
        } = {
            ...row,
            consumerPrice: row.consumerPrice ? row.consumerPrice : 0,
            byStandardMargin: row.byStandardMargin ? row.byStandardMargin : 0,
            byConsumerOutputRate: row.byConsumerOutputRate ? row.byConsumerOutputRate : 0,
        };
        // 1.원가(견적가) : 수량 * 원단가
        const updatedEstimatedCost = estimatedCost ? estimatedCost : byQunty * byUnitPrice;
        // 2.단가 : 원가(견적가) / (1 - 사전원가기준이익율)
        const updatedUnitPrice = unitPrice ? unitPrice : division(updatedEstimatedCost, 1 - byStandardMargin / 100);
        // 3.금액 : 수량 * 단가
        const updatedPlanAmount = planAmount ? planAmount : byQunty * updatedUnitPrice;
        // 4.소비자단가 : 단가 / 소비자산출율
        const updatedConsumerPrice = consumerPrice ? consumerPrice : division(updatedUnitPrice, byConsumerOutputRate);
        // 5.소비자금액 : 수량 * 소비자단가
        const updatedConsumerAmount = consumerAmount ? consumerAmount : byQunty * updatedConsumerPrice;
        // 6.이익금 : 금액 - 원가(견적가)
        const updatedPlannedProfits = plannedProfits ? plannedProfits : updatedPlanAmount - updatedEstimatedCost;
        // 7.이익률 : 이익금 / 금액
        const updatedPlannedProfitMargin = plannedProfitMargin ? plannedProfitMargin : division(updatedPlannedProfits, updatedPlanAmount);

        return {
            ...row,
            estimatedCost: Math.round(updatedEstimatedCost),
            unitPrice: Math.round(updatedUnitPrice),
            planAmount: Math.round(updatedPlanAmount),
            consumerPrice: Math.round(updatedConsumerPrice * 100),
            consumerAmount: Math.round(updatedConsumerAmount * 100),
            plannedProfits: Math.round(updatedPlannedProfits),
            plannedProfitMargin: Math.round(updatedPlannedProfitMargin * 100),
            byStandardMargin: Math.round(byStandardMargin),
            byConsumerOutputRate: Math.round(byConsumerOutputRate),
        };
    });

    return updatedData;
};

const division = (value1, value2) => {
    if (!value1 || !value2) {
        return 0;
    }
    return Math.round(value1 / value2);
};
