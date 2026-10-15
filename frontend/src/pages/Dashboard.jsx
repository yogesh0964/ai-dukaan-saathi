import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

function Dashboard() {

    const [dashboard, setDashboard] = useState({
        totalProducts: 0,
        totalCustomers: 0,
        lowStockProducts: 0,
        todaySale: 0
    });

    const [bills, setBills] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            const dashboardResponse = await apiFetch("/api/dashboard");
            const billsResponse = await apiFetch("/api/bills");
            const customersResponse = await apiFetch("/api/customers");
            const productsResponse = await apiFetch("/api/products");

            if (
                !dashboardResponse ||
                !billsResponse ||
                !customersResponse ||
                !productsResponse
            ) {
                return;
            }

            const dashboardData = await dashboardResponse.json();
            const billsData = await billsResponse.json();
            const customersData = await customersResponse.json();
            const productsData = await productsResponse.json();

            setDashboard(dashboardData);
            setBills(billsData);
            setCustomers(customersData);
            setProducts(productsData);

        } catch (error) {
            console.log("Dashboard Error:", error);
        }
    };

    const getCustomerName = (customerId) => {
        const customer = customers.find(
            c => c.id === customerId
        );

        return customer
            ? customer.name
            : "Walk-in Customer";
    };

    const getProductName = (productId) => {
        const product = products.find(
            p => p.id === productId
        );

        return product
            ? product.name
            : "Product Deleted";
    };

    const recentBills = [...bills]
        .sort((a, b) => {
            const dateA = a.createdAt
                ? new Date(a.createdAt).getTime()
                : 0;

            const dateB = b.createdAt
                ? new Date(b.createdAt).getTime()
                : 0;

            return dateB - dateA;
        })
        .slice(0, 5);

    // Low stock products
    const lowStockProducts = products.filter(
        product => product.stock <= 5
    );

    return (
        <div style={{ padding: "30px" }}>

            <h1>AI Dukaan Saathi</h1>
            <h2>Dashboard</h2>

            {/* Dashboard Cards */}
            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    marginTop: "30px",
                    flexWrap: "wrap"
                }}
            >

                <div
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        width: "200px"
                    }}
                >
                    <h3>Today's Sale</h3>
                    <h2>₹{dashboard.todaySale}</h2>
                </div>

                <div
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        width: "200px"
                    }}
                >
                    <h3>Total Products</h3>
                    <h2>{dashboard.totalProducts}</h2>
                </div>

                <div
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        width: "200px"
                    }}
                >
                    <h3>Total Customers</h3>
                    <h2>{dashboard.totalCustomers}</h2>
                </div>

                <div
                    style={{
                        border: "1px solid #ddd",
                        padding: "20px",
                        width: "200px"
                    }}
                >
                    <h3>Low Stock</h3>
                    <h2>{dashboard.lowStockProducts}</h2>
                </div>

            </div>

            {/* Low Stock Products */}
            <h2 style={{ marginTop: "40px" }}>
                Low Stock Products
            </h2>

            {lowStockProducts.length === 0 ? (

                <p>No low stock products</p>

            ) : (

                <table
                    border="1"
                    cellPadding="10"
                    style={{
                        borderCollapse: "collapse",
                        width: "100%"
                    }}
                >

                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Category</th>
                            <th>Current Stock</th>
                        </tr>
                    </thead>

                    <tbody>

                        {lowStockProducts.map(product => (

                            <tr key={product.id}>

                                <td>{product.name}</td>

                                <td>
                                    {product.category || "-"}
                                </td>

                                <td>
                                    {product.stock}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>
            )}

            {/* Recent Bills */}
            <h2 style={{ marginTop: "40px" }}>
                Recent Bills
            </h2>

            {recentBills.length === 0 ? (

                <p>No bills available</p>

            ) : (

                <table
                    border="1"
                    cellPadding="10"
                    style={{
                        borderCollapse: "collapse",
                        width: "100%"
                    }}
                >

                    <thead>

                        <tr>
                            <th>Bill ID</th>
                            <th>Customer</th>
                            <th>Products</th>
                            <th>Total Amount</th>
                            <th>Date</th>
                        </tr>

                    </thead>

                    <tbody>

                        {recentBills.map(bill => (

                            <tr key={bill.id}>

                                <td>{bill.id}</td>

                                <td>
                                    {getCustomerName(
                                        bill.customerId
                                    )}
                                </td>

                                <td>

                                    {bill.items &&
                                    bill.items.length > 0 ? (

                                        bill.items.map(
                                            (item, index) => (

                                                <div
                                                    key={index}
                                                    style={{
                                                        marginBottom: "4px"
                                                    }}
                                                >
                                                    {getProductName(
                                                        item.productId
                                                    )}
                                                    {" × "}
                                                    {item.quantity}
                                                </div>

                                            )
                                        )

                                    ) : (

                                        "No Items"

                                    )}

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
    );
}

export default Dashboard;