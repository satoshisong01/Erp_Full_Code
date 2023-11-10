export const ChangePrmnPlanData = (data, projectInfo) => {
    //if (!data || data.length === 0) {
    //    return [
    //        {
    //            pmpId: [],
    //            poiId: projectInfo.poiId,
    //            useAt: "Y",
    //            deleteAt: "N",
    //            calendarVisible: false,
    //            pmpmmPositionCode1: 0,
    //            pmpmmPositionCode2: 0,
    //            pmpmmPositionCode3: 0,
    //            pmpmmPositionCode4: 0,
    //            pmpmmPositionCode5: 0,
    //            pmpmmPositionCode6: 0,
    //            pmpmmPositionCode7: 0,
    //            pmpmmPositionCode8: 0,
    //            pmpmmPositionCode9: 0,
    //            pmpmmPositionCode10: 0,
    //            pmpmmPositionCode11: 0,
    //            pmpmmPositionCode12: 0,
    //            pmpmmPositionCode13: 0,
    //            pmpMonth2: "", // Adjust the default value as needed
    //            pmpMonth: "", // Adjust the default value as needed
    //            total: 0,
    //        },
    //    ];
    //}
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
        부장: 8,
        차장: 9,
        과장: 10,
        대리: 11,
        주임: 12,
        사원: 13,
    };

    //날짜포맷
    data.forEach((item) => {
        //console.log(item, "아이템@@#@#@#");
        const key = `${item.pmpMonth}`;
        console.log(key, "🔥🔥🔥key");
        if (!groupedData[key]) {
            groupedData[key] = {
                //pgNm: item.pgNm,
                pmpId: [],
                poiId: projectInfo.poiId,
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
                pmpMonth2: `${item.pmpMonth}`,
                pmpMonth: `${item.pmpMonth}`,
                total: 0,
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
