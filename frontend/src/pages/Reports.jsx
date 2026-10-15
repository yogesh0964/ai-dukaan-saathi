import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

function Reports() {

    const [bills, setBills] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [filterDate, setFilterDate] = useState("");

    useEffect(() => {

        apiFetch("/api/bills")
            .then(response => response.json())
            .then(data => {
                setBills(data);
            });

        apiFetch("/api/stocks")
            .then(response => response.json())
            .then(data => {
                setStocks(data);
            });

    }, []);

    // Date filter
    const filteredBills = filterDate
        ? bills.filter(bill => {

            if (!bill.createdAt) {
                return false;
            }

            const billDate = new Date(bill.createdAt);

            const year = billDate.getFullYear();
            const month = String(
                billDate.getMonth() + 1
            ).padStart(2, "0");
            const day = String(
                billDate.getDate()
            ).padStart(2, "0");

            const formattedDate =
                `${year}-${month}-${day}`;

            return formattedDate === filterDate;
        })
        : bills;

    // Total sales
    const totalSales = filteredBills.reduce(
        (total, bill) =>
            total + Number(bill.totalAmount || 0),
        0
    );

    // Total stock IN
    const totalStockIn = stocks
        .filter(stock => stock.type === "IN")
        .reduce(
            (total, stock) =>
                total + Number(stock.quantity || 0),
            0
        );

    // Total stock OUT
    const totalStockOut = stocks
        .filter(stock => stock.type === "OUT")
        .reduce(
            (total, stock) =>
                total + Number(stock.quantity || 0),
            0
        );

    return (

        <div style={{ padding: "30px" }}>

            <h1>Reports</h1>

            {/* Date Filter */}
            <div style={{
                marginTop: "20px",
                marginBottom: "20px"
            }}>

                <label>
                    <b>Filter by Date: </b>
                </label>

                <input
                    type="date"
                    value={filterDate}
                    onChange={(e) =>
                        setFilterDate(e.target.value)
                    }
                    style={{
                        padding: "8px",
                        marginLeft: "10px"
                    }}
                />

                {filterDate && (
                    <button
                        type="button"
                        onClick={() => setFilterDate("")}
                        style={{
                            padding: "8px",
                            marginLeft: "10px"
                        }}
                    >
                        Clear Filter
                    </button>
                )}

            </div>

            {/* Report Cards */}
            <div style={{
                display: "flex",
                gap: "20px",
                flexWrap: "wrap",
                marginTop: "20px"
            }}>

                <div style={{
                    backgroundColor: "white",
                    padding: "20px",
                    width: "200px",
                    borderRadius: "8px"
                }}>

                    <h3>Total Sales</h3>
                    <h2>₹{totalSales}</h2>

                </div>

                <div style={{
                    backgroundColor: "white",
                    padding: "20px",
                    width: "200px",
                    borderRadius: "8px"
                }}>

                    <h3>Total Bills</h3>
                    <h2>{filteredBills.length}</h2>

                </div>

                <div style={{
                    backgroundColor: "white",
                    padding: "20px",
                    width: "200px",
                    borderRadius: "8px"
                }}>

                    <h3>Stock In</h3>
                    <h2>{totalStockIn}</h2>

                </div>

                <div style={{
                    backgroundColor: "white",
                    padding: "20px",
                    width: "200px",
                    borderRadius: "8px"
                }}>

                    <h3>Stock Out</h3>
                    <h2>{totalStockOut}</h2>

                </div>

            </div>

            {/* Sales Report */}
            <div style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                marginTop: "30px"
            }}>

                <h2>Sales Report</h2>

                {filteredBills.length === 0 ? (

                    <p>
                        No bills found for selected date.
                    </p>

                ) : (

                    <table
                        border="1"
                        cellPadding="10"
                        style={{
                            width: "100%",
                            borderCollapse: "collapse"
                        }}
                    >

                        <thead>

                            <tr>
                                <th>Bill ID</th>
                                <th>Customer ID</th>
                                <th>Total Amount</th>
                                <th>Date</th>
                            </tr>

                        </thead>

                        <tbody>

                            {filteredBills.map(bill => (

                                <tr key={bill.id}>

                                    <td>
                                        {bill.id}
                                    </td>

                                    <td>
                                        {bill.customerId ||
                                            "Walk-in Customer"}
                                    </td>

                                    <td>
                                        ₹{bill.totalAmount}
                                    </td>

                                    <td>
                                        {bill.createdAt
                                            ? new Date(
                                                bill.createdAt
                                            ).toLocaleString()
                                            : ""}
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                )}

            </div>

        </div>
    );
}

export default Reports;