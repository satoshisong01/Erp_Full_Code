import React, { useState } from "react";
import DataTable from "react-data-table-component";

const Test11111 = () => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const data = [
        {
            name: "Tiger Nixon",
            position: "System Architect",
            office: "Edinburgh",
            age: 61,
            start_date: "2011/04/25",
            salary: "$320,800",
        },
        {
            name: "aaaaa",
            position: "System Architect",
            office: "Edinburgh",
            age: 33,
            start_date: "2023/05/11",
            salary: "$555,800",
        },
        // Add more data here
    ];

    const columns = [
        {
            name: "Name",
            selector: "name",
            sortable: true,
        },
        {
            name: "Position",
            selector: "position",
            sortable: true,
        },
        {
            name: "Office",
            selector: "office",
            sortable: true,
        },
        {
            name: "Age",
            selector: "age",
            sortable: true,
        },
        {
            name: "Start Date",
            selector: "start_date",
            sortable: true,
        },
        {
            name: "Salary",
            selector: "salary",
            sortable: true,
        },
    ];

    const handleStartDateChange = (event) => {
        setStartDate(event.target.value);
    };

    const handleEndDateChange = (event) => {
        setEndDate(event.target.value);
    };

    const customDateFilter = (rows, columnIds, filterValue) => {
        if (filterValue.start === "" && filterValue.end === "") {
            return rows;
        }

        const startDate = new Date(filterValue.start);
        const endDate = new Date(filterValue.end);

        return rows.filter((row) => {
            const startDateValue = new Date(row.start_date);

            if (filterValue.start !== "" && startDateValue < startDate) {
                return false;
            }

            if (filterValue.end !== "" && startDateValue > endDate) {
                return false;
            }

            return true;
        });
    };

    const dateFilter = {
        placeholder: "Filter by date",
        getFilter: (filter) => ({
            start: startDate,
            end: endDate,
            setStart: handleStartDateChange,
            setEnd: handleEndDateChange,
            reset: () => {
                setStartDate("");
                setEndDate("");
                filter("");
            },
        }),
    };

    return (
        <div>
            <input
                type="text"
                value={startDate}
                onChange={handleStartDateChange}
                placeholder="Start Date"
            />
            <input
                type="text"
                value={endDate}
                onChange={handleEndDateChange}
                placeholder="End Date"
            />
            <DataTable
                title="Date Search Example"
                columns={columns}
                data={data}
                pagination
                paginationPerPage={10}
                paginationRowsPerPageOptions={[10, 20, 30]}
                customStyles={{
                    table: {
                        marginBottom: 0,
                    },
                }}
                customFilters={[dateFilter]}
                customFilterLogic={customDateFilter}
            />
        </div>
    );
};

export default Test11111;
