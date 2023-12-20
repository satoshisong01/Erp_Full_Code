export const columns = {
    /** 기준정보관리-품목관리-품목그룹관리 */
    reference: {
        itemGroupMgmt: [
            {
                header: "품목그룹ID",
                col: "pgId",
                cellWidth: "40%",
                //enable: false,
                //modify: true,
                //add: false,
                notView: true,
                //require: true,
            },
            {
                header: "품목그룹명",
                col: "pgNm",
                cellWidth: "40%",
                type: "button",
                modify: true,
                add: true,
                require: true,
            },
            {
                header: "품목그룹코드",
                col: "pgCode",
                cellWidth: "30%",
                modify: true,
                add: true,
                require: true,
            },

            { header: "작성일", col: "createDate", cellWidth: "30%" },
            { header: "작성자", col: "createIdBy", cellWidth: "30%" },
            { header: "수정일", col: "lastModifyDate", cellWidth: "30%" },
            { header: "수정자", col: "lastModifiedIdBy", cellWidth: "30%" },
        ],
        itemDetailMgmt: [
            {
                header: "품목ID",
                col: "pdiId",
                cellWidth: "20%",
                placeholder: "숫자만넣어주세요",
                enable: false,
                modify: true,
                add: false,
                require: true,
                notView: true,
            },
            {
                header: "품목그룹명",
                col: "pgNm",
                type: "button",
                cellWidth: "20%",
                modify: true,
                add: true,
                require: true,
            },
            {
                header: "품번",
                col: "pdiNum",
                cellWidth: "20%",
                modify: true,
                add: true,
            },
            {
                header: "품목명",
                col: "pdiNm",
                cellWidth: "20%",
                modify: true,
                add: true,
                require: true,
            },
            { header: "단위", col: "pdiWght", cellWidth: "20%", modify: true, add: true },
            {
                header: "품목코드",
                col: "pdiCode",
                cellWidth: "20%",
                modify: true,
                add: true,
            },
            { header: "규격", col: "pdiStnd", cellWidth: "20%" },
            {
                header: "품목그룹ID",
                col: "pgId",
                cellWidth: "20%",
                enable: false,
                modify: true,
                add: true,
                require: true,
                notView: true,
            },
        ],
    },
    /* 영업관리 */
    orderMgmt: {
        project: [
            //프로젝트관리
            // { header: "수주 아이디", col: "poiId", cellWidth: "5%" },
            { header: "프로젝트이름", col: "poiNm", cellWidth: "25%" },
            { header: "고객사", col: "cltNm", cellWidth: "15%" },
            { header: "수주부서", col: "poiGroupId", cellWidth: "7%" },
            { header: "매출부서", col: "poiSalesGroupId", cellWidth: "7%" },
            { header: "영업대표", col: "poiSalmanagerId", cellWidth: "10%" },
            { header: "담당자", col: "poiManagerId", cellWidth: "10%" },
            { header: "통화", col: "poiCurrcy", cellWidth: "5%" },
            { header: "계약일", col: "poiBeginDt", cellWidth: "10%" },
            { header: "납기시작일", col: "poiDueBeginDt", cellWidth: "10%" },
            { header: "납기종료일", col: "poiDueEndDt", cellWidth: "10%" },
            { header: "기준이익률", col: "standardMargin", cellWidth: "8%" },
            { header: "상태", col: "poiStatus", cellWidth: "10%" },
        ],
        condition: [
            { title: "프로젝트명", col: "poiNm", type: "input" },
            { title: "영업대표", col: "poiSalmanagerId", type: "input" },
            { title: "담당자", col: "poiManagerId", type: "input" },
            {
                title: "상태",
                col: "poiStatus",
                type: "select",
                option: [
                    { label: "인벤토리접수", value: "인벤토리접수" },
                    { label: "원가작성중", value: "원가작성중" },
                    { label: "견적완료", value: "견적완료" },
                    { label: "견적완료", value: "견적완료" },
                ],
            },
            { title: "계약일", col: "poiBeginDt", type: "input" },
        ],
        addMod: [
            { items: [{ header: "프로젝트이름", col: "poiNm", require: true, type: "input" }] },
            { items: [{ header: "코드(임시)", col: "poiCode", require: true, type: "input" }] },
            {
                items: [
                    {
                        header: "수주부서",
                        col: "poiGroupId",
                        placeholder: "부서를 선택하세요.",
                        require: true,
                        type: "select",
                        option: [
                            { label: "PS", value: "PS" },
                            { label: "PA", value: "PA" },
                        ],
                    },
                    {
                        header: "매출부서",
                        col: "poiSalesGroupId",
                        placeholder: "부서를 선택하세요.",
                        require: true,
                        type: "select",
                        option: [
                            { label: "PS", value: "PS" },
                            { label: "PA", value: "PA" },
                        ],
                    },
                ],
            },
            {
                items: [
                    { header: "영업대표", col: "poiSalmanagerId", placeholder: "영업대표를 선택하세요.", require: true, type: "input" },
                    { header: "담당자", col: "poiManagerId", placeholder: "담당자를 선택하세요.", require: true, type: "input" },
                ],
            },
            {
                items: [
                    { header: "계약일", col: "poiBeginDt", type: "dayPicker" },
                    { header: "이익률", col: "standardMargin", type: "number" },
                ],
            },
            {
                items: [
                    { header: "납기시작일", col: "poiDueBeginDt", type: "dayPicker" },
                    { header: "납기종료일", col: "poiDueEndDt", type: "dayPicker" },
                ],
            },
            {
                items: [
                    { header: "통화", col: "poiCurrcy", type: "input" },
                    {
                        header: "상태",
                        col: "poiStatus",
                        cellWidth: "10%",
                        //type: "itemSelect",
                        type: "select",
                        option: [
                            { label: "인벤토리접수", value: "인벤토리접수" },
                            { label: "원가작성중", value: "원가작성중" },
                            { label: "견적완료", value: "견적완료" },
                            { label: "계약완료", value: "계약완료" },
                        ],
                        enable: true,
                        modify: true,
                        add: true,
                        require: true,
                    },
                ],
            },
            {
                items: [
                    { header: "기준연도", col: "poiMonth", require: true, type: "yearPicker" },
                    { header: "고객사", col: "cltNm", placeholder: "고객사를 선택하세요.", require: true, type: "company" },
                ],
            },
            { items: [{ header: "비고", col: "poiDesc", type: "desc" }] },
        ],
    },
    orderPlanMgmt: {
        // 계획관리
        condition: [
            { title: "프로젝트명", col: "poiNm", type: "input", value: "", searchLevel: "1" },
            { title: "기준연도", col: "clCode2", type: "input", value: "", searchLevel: "1" },
            { title: "사전원가 버전", col: "clCodeNm", type: "input", value: "", searchLevel: "2" },
            { title: "최종 수정일", col: "clCodeNm", type: "input", value: "", searchLevel: "2" },
        ],
        version: [
            //원가버전조회
            { header: "프로젝트명", col: "poiNm", cellWidth: "25%" },
            { header: "원가버전", col: "version", cellWidth: "10%" },
            { header: "계약일", col: "poiBeginDt", cellWidth: "10%" },
            { header: "납기시작일", col: "poiDueBeginDt", cellWidth: "10%", type: "input" },
            { header: "납기종료일", col: "poiDueEndDt", cellWidth: "10%", type: "input" },
            { header: "인건비", col: "labor", cellWidth: "10%", type: "input" },
            { header: "구매비", col: "purchase", cellWidth: "10%", type: "input" },
            { header: "외주비", col: "outsourcing", cellWidth: "10%", type: "input" },
            { header: "경비", col: "expenses", cellWidth: "10%", type: "input" },
            { header: "영업관리비", col: "generalExpenses", cellWidth: "10%", type: "input" },
        ],
        labor: [
            //인건비
            { header: "연월", col: "pmpMonth", cellWidth: "10%", type: "datepicker" },
            { header: "M/M계", col: "total", cellWidth: "10%" },
            { header: "인건비계", col: "totalPrice", cellWidth: "10%", type: "number" },
            { header: "임원", col: "pmpmmPositionCode1", cellWidth: "10%", type: "input", notView: "true" },
            { header: "특급기술사", col: "pmpmmPositionCode2", cellWidth: "10%", type: "input", notView: "true" },
            { header: "고급기술사", col: "pmpmmPositionCode3", cellWidth: "10%", type: "input", notView: "true" },
            { header: "중급기술사", col: "pmpmmPositionCode4", cellWidth: "10%", type: "input", notView: "true" },
            { header: "초급기술사", col: "pmpmmPositionCode5", cellWidth: "10%", type: "input", notView: "true" },
            { header: "고급기능사", col: "pmpmmPositionCode6", cellWidth: "10%", type: "input", notView: "true" },
            { header: "중급기능사", col: "pmpmmPositionCode7", cellWidth: "10%", type: "input", notView: "true" },
            { header: "초급기능사", col: "pmpmmPositionCode8", cellWidth: "10%", type: "input", notView: "true" },
            { header: "부장", col: "pmpmmPositionCode9", cellWidth: "10%", type: "input" },
            { header: "차장", col: "pmpmmPositionCode10", cellWidth: "10%", type: "input" },
            { header: "과장", col: "pmpmmPositionCode11", cellWidth: "10%", type: "input" },
            { header: "대리", col: "pmpmmPositionCode12", cellWidth: "10%", type: "input" },
            { header: "주임", col: "pmpmmPositionCode13", cellWidth: "10%", type: "input" },
            { header: "사원", col: "pmpmmPositionCode14", cellWidth: "10%", type: "input" },
        ],
        expenses: [
            // 경비
            {
                header: "경비목록",
                col: "pjbgTypeCode",
                cellWidth: "25%",
                type: "select",
                options: [
                    { value: "", label: "선택" },
                    { value: "EXPNS01", label: "교통비" },
                    { value: "EXPNS02", label: "숙박비" },
                    { value: "EXPNS03", label: "일비/파견비" },
                    { value: "EXPNS04", label: "식비" },
                    { value: "EXPNS05", label: "자재/소모품외" },
                ],
            },
            { header: "비고", col: "pjbgDesc", cellWidth: "50%", type: "desc" },
            { header: "금액", col: "pjbgPrice", cellWidth: "25%", type: "input" },
            { header: "프로젝트ID", col: "poiId", cellWidth: "50%", type: "input", notView: "true" },
            { header: "영업타입", col: "modeCode", cellWidth: "50%", type: "input", notView: "true" },
            { header: "사용여부", col: "deleteAt", cellWidth: "50%", type: "input", notView: "true" },
            { header: "삭제여부", col: "useAt", cellWidth: "50%", type: "input", notView: "true" },
        ],
        outsourcing: [
            // 개발외주비
            { header: "회사목록", col: "esntlId", cellWidth: "50%", type: "buttonCompany" },
            { header: "턴키/MM", col: "pjbgDesc", cellWidth: "25%", type: "input" },
            { header: "금액", col: "pjbgPrice", cellWidth: "25%", type: "input" },
            { header: "프로젝트ID", col: "poiId", cellWidth: "50%", type: "input", notView: "true" },
            { header: "영업타입", col: "modeCode", cellWidth: "50%", type: "input", notView: "true" },
            { header: "경비타입", col: "pjbgTypeCode", cellWidth: "50%", type: "input", notView: "true" },
            { header: "사용여부", col: "deleteAt", cellWidth: "50%", type: "input", notView: "true" },
            { header: "삭제여부", col: "useAt", cellWidth: "50%", type: "input", notView: "true" },
        ],
        generalExpenses: [
            // 영업관리비
            {
                header: "영업관리비 목록",
                col: "pjbgTypeCode",
                cellWidth: "25%",
                type: "select",
                options: [
                    { value: "", label: "선택" },
                    { value: "EXPNS07", label: "기업이윤" },
                    { value: "EXPNS08", label: "일반관리비" },
                    { value: "EXPNS09", label: "네고" },
                ],
            },
            { header: "비고", col: "pjbgDesc", cellWidth: "50%", type: "desc" },
            { header: "금액", col: "pjbgPrice", cellWidth: "25%", type: "input" },
            { header: "프로젝트ID", col: "poiId", cellWidth: "50%", type: "input", notView: "true" },
            { header: "영업타입", col: "modeCode", cellWidth: "50%", type: "input", notView: "true" },
            { header: "사용여부", col: "deleteAt", cellWidth: "50%", type: "input", notView: "true" },
            { header: "삭제여부", col: "useAt", cellWidth: "50%", type: "input", notView: "true" },
        ],
        purchase: [
            // 구매비
            { header: "품명", col: "pdiNm", cellWidth: "20%", type: "buttonPdiNm" },
            { header: "품목그룹명", col: "pgNm", cellWidth: "20%" },
            { header: "규격", col: "pdiStnd", cellWidth: "20%" },
            { header: "수량", col: "byQunty", cellWidth: "10%", type: "input" },
            { header: "단위", col: "pdiUnit", cellWidth: "10%" },
            { header: "소비자 단가", col: "consumerPrice", cellWidth: "14%" },
            { header: "소비자 금액", col: "consumerAmount", cellWidth: "14%" },
            { header: "단가", col: "unitPrice", cellWidth: "10%" },
            { header: "금액", col: "planAmount", cellWidth: "10%" },
            { header: "제조사", col: "pdiMenufut", cellWidth: "12%" },
            { header: "비고", col: "pdiDesc", cellWidth: "10%", type: "desc" },
            { header: "원단가", col: "byUnitPrice", cellWidth: "12%", type: "input" },
            { header: "원가(견적가)", col: "estimatedCost", cellWidth: "10%" },
            { header: "이익금", col: "plannedProfits", cellWidth: "12%" },
            { header: "이익률", col: "plannedProfitMargin", cellWidth: "12%" },
            { header: "기준 이익률", col: "byStandardMargin", cellWidth: "15%", type: "input" },
            { header: "소비자가 산출률", col: "byConsumerOutputRate", cellWidth: "15%", type: "input" },
        ],
        addMod: [
            { items: [{ header: "프로젝트이름", col: "poiId", require: true, type: "input" }] },
            { items: [{ header: "버전", col: "versionNum", require: true, type: "input" }] },
            { items: [{ header: "비고", col: "versionDesc", type: "desc" }] },
        ],
        estimateLabor: [
            //견적용 인건비
            { header: "품목그룹아이디", col: "pgId", cellWidth: "10%", require: true, type: "input", notView: true },
            { header: "품목그룹", col: "pgNm", cellWidth: "10%", require: true, type: "button" },
            { header: "직급", col: "pecPosition", cellWidth: "10%", require: true, type: "input" },
            { header: "M", col: "m", type: "input", cellWidth: "10%" },
            { header: "M+1", col: "m1", type: "input", cellWidth: "10%" },
            { header: "M+2", col: "m2", type: "input", cellWidth: "10%" },
            { header: "M+3", col: "m3", type: "input", cellWidth: "10%" },
            { header: "M+4", col: "m4", type: "input", cellWidth: "10%" },
            { header: "M+5", col: "m5", type: "input", cellWidth: "10%" },
            { header: "M+6", col: "m6", type: "input", cellWidth: "10%" },
            { header: "M+7", col: "m7", type: "input", cellWidth: "10%" },
            { header: "M+8", col: "m8", type: "input", cellWidth: "10%" },
            { header: "M+9", col: "m9", type: "input", cellWidth: "10%" },
            { header: "M+10", col: "m10", type: "input", cellWidth: "10%" },
            { header: "M+11", col: "m11", type: "input", cellWidth: "10%" },
            { header: "합계", col: "total", cellWidth: "10%" },
            { header: "단가", col: "unitPrice", type: "input", cellWidth: "10%" },
            { header: "금액", col: "price", cellWidth: "10%" },
            { header: "비고", col: "desc", type: "input", cellWidth: "10%" },
        ],
        estimatePurchase: [
            //견적용 구매비
            { header: "품목그룹", col: "pgNm", cellWidth: "15%", require: true },
            { header: "품명", col: "pdiNm", cellWidth: "15%", type: "buttonPdiNm", require: true },
            { header: "품목 규격", col: "pdiDesc", cellWidth: "20%", require: true },
            { header: "수량", col: "unit", cellWidth: "10%", type: "input" },
            { header: "소비자 단가", col: "customersUnitPrice", cellWidth: "10%" },
            { header: "소비자 금액", col: "customersPrice", cellWidth: "10%" },
            { header: "단가", col: "unitPrice", cellWidth: "10%" },
            { header: "금액", col: "price", cellWidth: "10%" },
            { header: "D/C%", col: "dc", cellWidth: "10%" },
            { header: "비고", col: "desc", cellWidth: "25%", type: "input" },
        ],
    },

    /* 실행관리 */
    executionCost: {
        //실행원가관리
        project: [
            //프로젝트 목록
            { header: "프로젝트ID", col: "poiId", cellWidth: "12%", type: "input", enable: false, modify: true, add: true, require: true },
            { header: "프로젝트 이름", col: "poiNm", cellWidth: "20%", type: "input", enable: true, modify: true, add: true, require: true },
            { header: "프로젝트 코드", col: "poiCode", cellWidth: "15%", type: "input", enable: false, modify: false, add: true, require: true },
            { header: "프로젝트 타이틀", col: "poiTitle", cellWidth: "25%", type: "input", enable: true, modify: true, add: true, require: false },
            { header: "거래처ID", col: "cltId", cellWidth: "15%", type: "input", enable: false, modify: true, add: false, require: true },
            { header: "거래처명", col: "cltNm", cellWidth: "15%", type: "input", enable: false, modify: true, add: false, require: true },
            { header: "수주부서", col: "poiGroupId", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
            { header: "매출부서", col: "poiSalesGroupId", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
            { header: "영업대표", col: "poiSalmanagerId", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
            { header: "PM", col: "poiManagerId", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
            { header: "통화", col: "poiCurrcy", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
            { header: "기준이익률", col: "standardMargin", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
            { header: "상태", col: "poiStatus", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
            { header: "계약일", col: "poiBeginDt", cellWidth: "15%", type: "input", enable: true, modify: true, add: true, require: false },
            { header: "종료일", col: "poiEndDt", cellWidth: "15%", type: "input", enable: true, modify: true, add: true, require: false },
            { header: "납기시작일", col: "poiDueBeginDt", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
            { header: "납기종료일", col: "poiDueEndDt", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
            { header: "비고", col: "poiDesc", cellWidth: "10%", type: "desc", enable: true, modify: true, add: true, require: false },
            { header: "첨부파일", col: "poFileId", cellWidth: "10%", type: "input", enable: true, modify: true, add: true, require: false },
        ],
        condition: [
            //조건
            {
                title: "프로젝트명",
                col: "poiId", //컬럼명
                type: "input",
                value: "",
            },
            {
                title: "계약일",
                col: "poiBeginDt",
                type: "datepicker",
            },
            {
                title: "고객사",
                col: "clCodeNm", //컬럼명
                type: "input",
                value: "",
            },
            {
                title: "상태",
                col: "name",
                type: "select",
                option: [{ value: "프로젝트접수" }, { value: "실행예산완료" }, { value: "실행정산중" }, { value: "프로젝트종료" }],
            },
        ],
    },
    laborCostMgmt: {
        //인건비관리
        condition: [
            //조건
            { title: "프로젝트명", col: "clCode", type: "input", value: "", searchLevel: "1" },
            { title: "품목그룹명", col: "clCode2", type: "input", value: "", searchLevel: "1" },
            { title: "연월", col: "clCodeNm", type: "input", value: "", searchLevel: "2" },
        ],
        project: [
            //프로젝트 목록
            {
                header: "프로젝트명",
                col: "poiNm",
                cellWidth: "50%",
                type: "input",
            },
            {
                header: "계획인건비",
                col: "pmpmmNum1",
                cellWidth: "30%",
                type: "input",
            },
            {
                header: "실행인건비",
                col: "pmpmmNum2",
                cellWidth: "20%",
                type: "input",
            },
        ],
        sub: [
            //인건비 상세
            { header: "연월", col: "pmpMonth", cellWidth: "10%", type: "datepicker" },
            { header: "M/M계", col: "total", cellWidth: "10%", type: "input" },
            {
                header: "인건비계",
                col: "totalPrice",
                cellWidth: "10%",
                type: "number",
            },
            {
                header: "임원",
                col: "pmpmmPositionCode1",
                cellWidth: "10%",
                type: "input",
                notView: "true",
            },
            {
                header: "특급기술사",
                col: "pmpmmPositionCode2",
                cellWidth: "10%",
                type: "input",
                notView: "true",
            },
            {
                header: "고급기술사",
                col: "pmpmmPositionCode3",
                cellWidth: "10%",
                type: "input",
                notView: "true",
            },
            {
                header: "중급기술사",
                col: "pmpmmPositionCode4",
                cellWidth: "10%",
                type: "input",
                notView: "true",
            },
            {
                header: "초급기술사",
                col: "pmpmmPositionCode5",
                cellWidth: "10%",
                type: "input",
                notView: "true",
            },
            {
                header: "고급기능사",
                col: "pmpmmPositionCode6",
                cellWidth: "10%",
                type: "input",
                notView: "true",
            },
            {
                header: "중급기능사",
                col: "pmpmmPositionCode7",
                cellWidth: "10%",
                type: "input",
                notView: "true",
            },
            {
                header: "초급기능사",
                col: "pmpmmPositionCode8",
                cellWidth: "10%",
                type: "input",
                notView: "true",
            },
            {
                header: "부장",
                col: "pmpmmPositionCode9",
                cellWidth: "10%",
                type: "input",
            },
            {
                header: "차장",
                col: "pmpmmPositionCode10",
                cellWidth: "10%",
                type: "input",
            },
            {
                header: "과장",
                col: "pmpmmPositionCode11",
                cellWidth: "10%",
                type: "input",
            },
            {
                header: "대리",
                col: "pmpmmPositionCode12",
                cellWidth: "10%",
                type: "input",
            },
            {
                header: "주임",
                col: "pmpmmPositionCode13",
                cellWidth: "10%",
                type: "input",
            },
            {
                header: "사원",
                col: "pmpmmPositionCode14",
                cellWidth: "10%",
                type: "input",
            },
        ],
        inquiry: [
            //인건비 조회
            {
                header: "구분코드",
                col: "pecModeCode",
                cellWidth: "20%",
            },
            {
                header: "품목그룹명",
                col: "pgNm",
                cellWidth: "20%",
            },
            {
                header: "인력",
                col: "pecManpower",
                cellWidth: "15%",
            },
            {
                header: "직급",
                col: "pecPosition",
                cellWidth: "10%",
                type: "input",
                notView: "true",
            },
            {
                header: "실행(M/M)",
                col: "pecMm",
                cellWidth: "10%",
            },
            {
                header: "시작일",
                col: "pecStartdate",
                cellWidth: "10%",
                // type: "datepicker"
            },
            {
                header: "종료일",
                col: "pecEnddate",
                cellWidth: "10%",
                // type: "datepicker"
            },
            {
                header: "금액",
                col: "pecUnitPrice111",
                cellWidth: "15%",
            },
            {
                header: "투입률",
                col: "pmpmmPositionCode1",
                cellWidth: "10%",
            },
            {
                header: "누계율",
                col: "pmpmmPositionCode2",
                cellWidth: "10%",
            },
        ],
        orderPlan: [
            //인건비 수주
            {
                header: "품목그룹명",
                col: "pgNm",
                cellWidth: "25%",
                type: "button",
                require: true,
            },
            { header: "수주수량(M/M)", col: "pecMm", cellWidth: "25%", type: "input", require: true },
            {
                header: "단가",
                col: "pecUnitPrice",
                cellWidth: "25%",
                type: "input",
                require: true,
            },
            {
                header: "금액",
                col: "price",
                cellWidth: "25%",
            },
        ],
        budget: [
            //인건비 예산
            {
                header: "품목그룹명",
                col: "pgNm",
                cellWidth: "25%",
                type: "button",
                require: true,
            },
            { header: "인력", col: "pecManpower", cellWidth: "25%", type: "input" },
            {
                header: "직급",
                col: "pecPosition",
                cellWidth: "10%",
                type: "select",
                require: true,
                options: [
                    { value: "", label: "선택" },
                    { value: "부장", label: "부장" },
                    { value: "차장", label: "차장" },
                    { value: "과장", label: "과장" },
                    { value: "대리", label: "대리" },
                    { value: "주임", label: "주임" },
                    { value: "사원", label: "사원" },
                ],
            },
            {
                header: "직급단가",
                col: "positionPrice",
                cellWidth: "10%",
            },
            {
                header: "예산(M/M)",
                col: "pecMm",
                cellWidth: "25%",
                type: "input",
                require: true,
            },
            {
                header: "금액",
                col: "price",
                cellWidth: "40%",
                type: "input",
            },
        ],
        budgetView: [
            {
                header: "품목그룹명",
                col: "pgNm",
                cellWidth: "25%",
            },
            { header: "수주수량(M/M)", col: "pecMm", cellWidth: "25%" },
            {
                header: "단가",
                col: "pecUnitPrice",
                cellWidth: "25%",
            },
            {
                header: "금액",
                col: "pmpmmNum1",
                cellWidth: "25%",
            },
        ],
        run: [
            {
                header: "품목그룹명",
                col: "pgNm",
                cellWidth: "15%",
                type: "button",
                require: true,
            },
            { header: "인력", col: "pecManpower", cellWidth: "25%", type: "input" },
            {
                header: "직급",
                col: "pecPosition",
                cellWidth: "10%",
                type: "select",
                options: [
                    { value: "", label: "선택" },
                    { value: "부장", label: "부장" },
                    { value: "차장", label: "차장" },
                    { value: "과장", label: "과장" },
                    { value: "대리", label: "대리" },
                    { value: "주임", label: "주임" },
                    { value: "사원", label: "사원" },
                ],
                require: true,
            },
            {
                header: "직급단가",
                col: "positionPrice",
                cellWidth: "10%",
            },
            {
                header: "실행(M/M)",
                col: "pecMm",
                cellWidth: "10%",
                type: "input",
                require: true,
            },
            {
                header: "시작일",
                col: "pecStartdate",
                cellWidth: "10%",
                type: "daypicker",
            },
            {
                header: "종료일",
                col: "pecEnddate",
                cellWidth: "10%",
                type: "daypicker",
            },
            {
                header: "금액",
                col: "price",
                cellWidth: "10%",
            },
            {
                header: "투입률",
                col: "pmpmmPositionCode1",
                cellWidth: "10%",
            },
            {
                header: "누계율",
                col: "pmpmmPositionCode2",
                cellWidth: "10%",
            },
        ],
    },
    expenseMgmt: {
        //경비관리
        condition: [
            { title: "프로젝트명", col: "clCode", type: "input", value: "", searchLevel: "1" },
            { title: "기간검색", col: "selectedDate", type: "datepicker", value: "", searchLevel: "1" },
            { title: "출장인", col: "clCodeNm", type: "input", value: "", searchLevel: "2" },
        ],
        projectView: [
            {
                header: "프로젝트명",
                col: "poiNm",
                cellWidth: "50%",
                type: "input",
            },
            {
                header: "계획인건비",
                col: "pmpmmNum1",
                cellWidth: "30%",
                type: "input",
            },
            {
                header: "실행인건비",
                col: "pmpmmNum2",
                cellWidth: "20%",
                type: "input",
            },
        ],
        inquiry: [
            {
                header: "구분코드",
                col: "modeCode",
                cellWidth: "10%",
            },
            {
                header: "품목그룹명",
                col: "pgNm",
                cellWidth: "20%",
                type: "button",
            },
            { header: "연월", col: "pjbgDt", cellWidth: "10%" },
            {
                header: "출장인",
                col: "pjbgManpower",
                cellWidth: "10%",
            },
            {
                header: "시작일",
                col: "pjbgBeginDt",
                cellWidth: "10%",
            },
            {
                header: "종료일",
                col: "pjbgEndDt",
                cellWidth: "10%",
            },
            {
                header: "교통비",
                col: "pjbgPrice01",
                cellWidth: "10%",
                type: "input",
            },
            {
                header: "숙박비",
                col: "pjbgPrice02",
                cellWidth: "10%",
                type: "input",
            },
            {
                header: "일비/파견비",
                col: "pjbgPrice03",
                cellWidth: "10%",
                type: "input",
            },
            {
                header: "식비",
                col: "pjbgPrice04",
                cellWidth: "10%",
                type: "input",
            },
            {
                header: "자재/소모품외",
                col: "pjbgPrice05",
                cellWidth: "20%",
                type: "input",
            },
            {
                header: "지출합계",
                col: "pmpmmNum62",
                cellWidth: "10%",
            },
            {
                header: "월합계",
                col: "pmpmmNum63",
                cellWidth: "10%",
            },
            {
                header: "비고",
                col: "pjbgDesc",
                cellWidth: "10%",
                type: "desc",
            },
        ],
        contract: [
            { header: "교통비", col: "EXPNS01", cellWidth: "15%", type: "input" },
            { header: "숙박비", col: "EXPNS02", cellWidth: "15%", type: "input" },
            {
                header: "일비/파견비",
                col: "EXPNS03",
                cellWidth: "20%",
                type: "input",
            },
            {
                header: "식비",
                col: "EXPNS04",
                cellWidth: "15%",
                type: "input",
            },
            {
                header: "자재/소모품외",
                col: "EXPNS05",
                cellWidth: "20%",
                type: "input",
            },
            {
                header: "영업비",
                col: "EXPNS06",
                cellWidth: "15%",
                type: "input",
            },
        ],
        budget: [
            {
                header: "품목그룹명",
                col: "pgNm",
                cellWidth: "20%",
                type: "button",
            },
            { header: "연월", col: "pjbgDt", cellWidth: "10%", type: "monthpicker" },
            {
                header: "출장인",
                col: "pjbgManpower",
                cellWidth: "10%",
                type: "input",
            },
            {
                header: "시작일",
                col: "pjbgBeginDt",
                cellWidth: "10%",
                type: "daypicker",
            },
            {
                header: "종료일",
                col: "pjbgEndDt",
                cellWidth: "10%",
                type: "daypicker",
            },
            {
                header: "교통비",
                col: "pjbgPrice01",
                cellWidth: "10%",
                type: "input",
            },
            {
                header: "숙박비",
                col: "pjbgPrice02",
                cellWidth: "10%",
                type: "input",
            },
            {
                header: "일비/파견비",
                col: "pjbgPrice03",
                cellWidth: "10%",
                type: "input",
            },
            {
                header: "식비",
                col: "pjbgPrice04",
                cellWidth: "10%",
                type: "input",
            },
            {
                header: "자재/소모품외",
                col: "pjbgPrice05",
                cellWidth: "20%",
                type: "input",
            },
            {
                header: "지출합계",
                col: "pmpmmNum62",
                cellWidth: "10%",
            },
            {
                header: "월합계",
                col: "pmpmmNum63",
                cellWidth: "10%",
            },
            {
                header: "비고",
                col: "pjbgDesc",
                cellWidth: "10%",
                type: "desc",
            },
        ],
    },
    purchasingMgmt: {
        //구매관리
        project: [
            {
                header: "프로젝트명",
                col: "poiNm",
                cellWidth: "20%",
            },
            {
                header: "발주번호",
                col: "pmpmmNum1",
                cellWidth: "20%",
            },
            {
                header: "발주일",
                col: "pmpmmNum2",
                cellWidth: "20%",
            },
            {
                header: "발주금액",
                col: "pmpmmNum23",
                cellWidth: "20%",
            },
            {
                header: "발주부서",
                col: "pmpmmNum24",
                cellWidth: "20%",
            },
            {
                header: "담당자",
                col: "pmpmmNum25",
                cellWidth: "20%",
            },
            {
                header: "구매요청유형",
                col: "pmpmmNum26",
                cellWidth: "30%",
            },
            {
                header: "진행상태",
                col: "pmpmmNum27",
                cellWidth: "20%",
            },
        ],
        inquiry: [
            //구매 조회
            { header: "품목그룹명", col: "pgNm", cellWidth: "15%" },
            { header: "품명", col: "pdiNm", cellWidth: "30%" },
            { header: "규격", col: "pdiStnd", cellWidth: "35%", type: "input" },
            {
                header: "수량",
                col: "byQunty",
                cellWidth: "10%",
            },
            {
                header: "미입고",
                col: "temp6",
                cellWidth: "10%",
            },
            {
                header: "입고",
                col: "temp5",
                cellWidth: "10%",
            },
            {
                header: "단위",
                col: "pdiUnit",
                cellWidth: "10%",
            },
            {
                header: "단가",
                col: "byUnitPrice",
                cellWidth: "15%",
            },
            {
                header: "금액",
                col: "price",
                cellWidth: "15%",
            },
            {
                header: "구매거래처",
                col: "cltNm",
                cellWidth: "20%",
            },
            {
                header: "발주일",
                col: "byOrderDt",
                cellWidth: "15%",
            },
            {
                header: "제조사",
                col: "pdiMenufut",
                cellWidth: "20%",
            },
            {
                header: "요청납기일",
                col: "temp3",
                cellWidth: "15%",
            },
            {
                header: "입고일",
                col: "createDate",
                cellWidth: "15%",
            },
            {
                header: "발주상태",
                col: "temp1",
                cellWidth: "15%",
            },
            {
                header: "입고상태",
                col: "temp2",
                cellWidth: "15%",
            },
        ],
        budget: [
            //구매 예산
            {
                header: "품목그룹명",
                col: "pgNm",
                cellWidth: "15%",
                type: "button",
            },
            { header: "품명", col: "pdiNm", cellWidth: "15%", type: "buttonPdiNm" },
            { header: "규격", col: "pdiStnd", cellWidth: "20%" },
            {
                header: "수량",
                col: "byQunty",
                cellWidth: "10%",
                type: "input",
            },
            {
                header: "단가",
                col: "byUnitPrice",
                cellWidth: "10%",
                type: "input",
            },
            {
                header: "금액",
                col: "price",
                cellWidth: "10%",
            },
            {
                header: "구매예상일",
                col: "temp1",
                cellWidth: "10%",
                type: "daypicker",
            },
            {
                header: "비고",
                col: "byDesc",
                cellWidth: "20%",
                type: "desc",
            },
        ],
        run: [
            //구매 실행
            {
                header: "품목그룹명",
                col: "pgNm",
                cellWidth: "15%",
            },
            { header: "품명", col: "pdiNm", cellWidth: "15%", type: "buttonPdiNm" },
            { header: "규격", col: "pdiStnd", cellWidth: "30%", type: "input" },
            {
                header: "수량",
                col: "byQunty",
                cellWidth: "10%",
                type: "input",
            },
            {
                header: "단가",
                col: "byUnitPrice",
                cellWidth: "10%",
                type: "input",
            },
            {
                header: "금액",
                col: "price",
                cellWidth: "10%",
            },
            {
                header: "구매거래처",
                col: "cltId",
                cellWidth: "10%",
            },
            {
                header: "발주일",
                col: "byOrderDt",
                cellWidth: "10%",
            },
            {
                header: "제조사",
                col: "tmp3",
                cellWidth: "10%",
            },
            {
                header: "요청납기일",
                col: "temp1",
                cellWidth: "10%",
            },
            {
                header: "입고일",
                col: "temp2",
                cellWidth: "10%",
            },
        ],
        condition: [
            //검색조건
            {
                title: "프로젝트명",
                colName: "clCode",
                type: "input",
                value: "",
                searchLevel: "1",
            },
            {
                title: "기간검색",
                colName: "selectedDate",
                type: "datepicker",
                searchLevel: "0",
            },
            {
                title: "품목그룹명",
                colName: "clCodeNm", //컬럼명
                type: "input",
                value: "",
                searchLevel: "2",
            },
            {
                title: "품목명",
                colName: "clCodeNm", //컬럼명
                type: "input",
                value: "",
                searchLevel: "2",
            },
            {
                title: "구매거래처",
                colName: "clCodeNm", //컬럼명
                type: "input",
                value: "",
                searchLevel: "2",
            },
            {
                title: "발주부서",
                colName: "clCodeNm", //컬럼명
                type: "input",
                value: "",
                searchLevel: "2",
            },
            {
                title: "발주상태",
                colName: "name",
                type: "select",
                option: [{ value: "발주완료" }, { value: "미발주" }],
                searchLevel: "3",
            },
            {
                title: "입고상태",
                colName: "name",
                type: "select",
                option: [{ value: "입고완료" }, { value: "미입고" }],
                searchLevel: "3",
            },
        ],
    },
};
