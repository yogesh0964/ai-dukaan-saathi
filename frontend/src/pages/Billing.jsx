import React, { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

function Billing() {

    const [bills, setBills] = useState([]);
    const [products, setProducts] = useState([]);
    const [customers, setCustomers] = useState([]);

    const [customerId, setCustomerId] = useState("");
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [price, setPrice] = useState("");

    const [items, setItems] = useState([]);
    const [editBillId, setEditBillId] = useState(null);

    // Search and Date Filter
    const [searchBill, setSearchBill] = useState("");
    const [filterDate, setFilterDate] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {

        try {

            const billResponse = await apiFetch("/api/bills");
            const productResponse = await apiFetch("/api/products");
            const customerResponse = await apiFetch("/api/customers");

            if (!billResponse || !productResponse || !customerResponse) {
                return;
            }

            const billData = await billResponse.json();
            const productData = await productResponse.json();
            const customerData = await customerResponse.json();

            setBills(billData);
            setProducts(productData);
            setCustomers(customerData);

        } catch (error) {

            console.error("Load Data Error:", error);

        }
    };

    const handleProductChange = (e) => {

        const id = e.target.value;

        setProductId(id);

        const product = products.find(
            p => p.id === id
        );

        if (product) {
            setPrice(product.sellingPrice);
        } else {
            setPrice("");
        }
    };

    const addProduct = () => {

        if (!productId) {
            alert("Please select product");
            return;
        }

        if (quantity <= 0) {
            alert("Quantity must be greater than 0");
            return;
        }

        const product = products.find(
            p => p.id === productId
        );

        if (!product) {
            alert("Product not found");
            return;
        }

        const availableStock = getAvailableStock(productId);

        if (quantity > availableStock) {
            alert("Not enough stock");
            return;
        }

        const existingItem = items.find(
            item => item.productId === productId
        );

        if (existingItem) {

            const newQuantity =
                existingItem.quantity + Number(quantity);

            if (newQuantity > availableStock) {
                alert("Not enough stock");
                return;
            }

            setItems(
                items.map(item =>
                    item.productId === productId
                        ? {
                            ...item,
                            quantity: newQuantity
                        }
                        : item
                )
            );

        } else {

            setItems([
                ...items,
                {
                    productId: productId,
                    quantity: Number(quantity),
                    price: Number(price)
                }
            ]);
        }

        setProductId("");
        setQuantity(1);
        setPrice("");
    };

    const removeItem = (productId) => {

        setItems(
            items.filter(
                item => item.productId !== productId
            )
        );
    };

    const increaseQuantity = (productId) => {

        const product = products.find(
            p => p.id === productId
        );

        if (!product) {
            return;
        }

        setItems(
            items.map(item => {

                if (item.productId === productId) {

                    const availableStock = getAvailableStock(productId);

                    if (item.quantity >= availableStock) {
                        alert("Not enough stock");
                        return item;
                    }

                    return {
                        ...item,
                        quantity: item.quantity + 1
                    };
                }

                return item;
            })
        );
    };

    const decreaseQuantity = (productId) => {

        setItems(
            items.map(item => {

                if (item.productId === productId) {

                    if (item.quantity <= 1) {
                        return item;
                    }

                    return {
                        ...item,
                        quantity: item.quantity - 1
                    };
                }

                return item;
            })
        );
    };

    const totalAmount = items.reduce(
        (total, item) =>
            total + item.quantity * item.price,
        0
    );

    const createBill = async () => {

        if (items.length === 0) {
            alert("Please add at least one product");
            return;
        }

        const bill = {
            customerId: customerId,
            items: items,
            totalAmount: totalAmount
        };

        try {

            const response = await apiFetch(
                "/api/bills",
                {
                    method: "POST",
                    body: JSON.stringify(bill)
                }
            );

            if (!response) {
                return;
            }

            if (response.ok) {

                alert("Bill created successfully");

                setCustomerId("");
                setItems([]);
                setProductId("");
                setQuantity(1);
                setPrice("");

                await loadData();

            } else {

                const error = await response.text();
                alert(error);
            }

        } catch (error) {

            console.error(error);
            alert("Bill create nahi hua.");
        }
    };

    const getAvailableStock = (productId) => {

        const product = products.find(
            p => p.id === productId
        );

        if (!product) {
            return 0;
        }

        // Create mode
        if (!editBillId) {
            return product.stock;
        }

        // Original bill find karo
        const originalBill = bills.find(
            bill => bill.id === editBillId
        );

        if (!originalBill) {
            return product.stock;
        }

        // Original bill me product ki quantity
        const originalItem = originalBill.items?.find(
            item => item.productId === productId
        );

        const originalQuantity = originalItem
            ? originalItem.quantity
            : 0;

        // Edit ke time old quantity ko available stock me add karo
        return product.stock + originalQuantity;
    };

    const editBill = (bill) => {

        setEditBillId(bill.id);
        setCustomerId(bill.customerId || "");
        setItems(bill.items || []);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const updateBill = async () => {

        if (!editBillId) {
            return;
        }

        if (items.length === 0) {
            alert("Please add at least one product");
            return;
        }

        const bill = {
            customerId: customerId,
            items: items,
            totalAmount: totalAmount
        };

        try {

            const response = await apiFetch(
                `/api/bills/${editBillId}`,
                {
                    method: "PUT",
                    body: JSON.stringify(bill)
                }
            );

            if (!response) {
                return;
            }

            if (response.ok) {

                alert("Bill updated successfully");

                setEditBillId(null);
                setCustomerId("");
                setItems([]);
                setProductId("");
                setQuantity(1);
                setPrice("");

                await loadData();

            } else {

                const error = await response.text();
                alert(error);
            }

        } catch (error) {

            console.error(error);
            alert("Bill update nahi hua.");
        }
    };

    const cancelEdit = () => {

        setEditBillId(null);
        setCustomerId("");
        setItems([]);
        setProductId("");
        setQuantity(1);
        setPrice("");
    };

    const deleteBill = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this bill?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            const response = await apiFetch(
                `/api/bills/${id}`,
                {
                    method: "DELETE"
                }
            );

            if (!response) {
                return;
            }

            if (response.ok) {

                setBills(prevBills =>
                    prevBills.filter(
                        bill => bill.id !== id
                    )
                );

                await loadData();

                alert("Bill deleted successfully");

            } else {

                const error = await response.text();

                alert(
                    error || "Bill delete nahi hua."
                );
            }

        } catch (error) {

            console.error(
                "Delete Bill Error:",
                error
            );

            alert(
                "Bill delete karte time error aa gaya."
            );
        }
    };

    const printBill = (bill) => {

        const customer = customers.find(
            c => c.id === bill.customerId
        );

        const invoiceWindow = window.open(
            "",
            "_blank"
        );

        if (!invoiceWindow) {
            alert(
                "Please allow popup for printing invoice."
            );
            return;
        }

        let rows = "";

        bill.items.forEach(item => {

            const product = products.find(
                p => p.id === item.productId
            );

            const productName = product
                ? product.name
                : item.productId;

            rows += `
                <tr>
                    <td>${productName}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.price}</td>
                    <td>₹${item.quantity * item.price}</td>
                </tr>
            `;
        });

        invoiceWindow.document.write(`
            <html>
            <head>
                <title>Invoice</title>

                <style>

                    body {
                        font-family: Arial;
                        padding: 30px;
                    }

                    h1 {
                        text-align: center;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }

                    th, td {
                        border: 1px solid #000;
                        padding: 10px;
                        text-align: center;
                    }

                    .total {
                        text-align: right;
                        margin-top: 20px;
                        font-size: 20px;
                        font-weight: bold;
                    }

                </style>
            </head>

            <body>

                <h1>AI Dukaan Saathi</h1>

                <p>
                    <b>Customer:</b>
                    ${customer ? customer.name : "Walk-in Customer"}
                </p>

                <p>
                    <b>Date:</b>
                    ${
                        bill.createdAt
                            ? new Date(
                                bill.createdAt
                            ).toLocaleString()
                            : ""
                    }
                </p>

                <table>

                    <thead>

                        <tr>
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>

                    </thead>

                    <tbody>

                        ${rows}

                    </tbody>

                </table>

                <div class="total">
                    Total Amount: ₹${bill.totalAmount}
                </div>

            </body>
            </html>
        `);

        invoiceWindow.document.close();

        invoiceWindow.print();
    };

    // SEARCH + DATE FILTER
    const filteredBills = bills.filter(bill => {

        const customer = customers.find(
            c => c.id === bill.customerId
        );

        const customerName = customer
            ? customer.name.toLowerCase()
            : "walk-in customer";

        const productNames = bill.items
            ? bill.items
                .map(item => {

                    const product = products.find(
                        p => p.id === item.productId
                    );

                    return product
                        ? product.name.toLowerCase()
                        : "";
                })
                .join(" ")
            : "";

        const search = searchBill
            .toLowerCase()
            .trim();

        const searchMatch =
            customerName.includes(search) ||
            productNames.includes(search);

        let dateMatch = true;

        if (filterDate) {

            if (!bill.createdAt) {
                dateMatch = false;
            } else {

                const billDate = new Date(
                    bill.createdAt
                );

                const year = billDate.getFullYear();
                const month = String(
                    billDate.getMonth() + 1
                ).padStart(2, "0");
                const day = String(
                    billDate.getDate()
                ).padStart(2, "0");

                const billDateString =
                    `${year}-${month}-${day}`;

                dateMatch =
                    billDateString === filterDate;
            }
        }

        return searchMatch && dateMatch;
    });

    return (

        <div style={{ padding: "20px" }}>

            <h1>Billing</h1>

            <hr />

            <h2>
                {editBillId
                    ? "Edit Bill"
                    : "Create New Bill"}
            </h2>

            <div>

                <label>
                    Customer:
                </label>

                <select
                    value={customerId}
                    onChange={(e) =>
                        setCustomerId(e.target.value)
                    }
                >

                    <option value="">
                        Walk-in Customer
                    </option>

                    {customers.map(customer => (

                        <option
                            key={customer.id}
                            value={customer.id}
                        >
                            {customer.name}
                        </option>

                    ))}

                </select>

            </div>

            <br />

            <div>

                <select
                    value={productId}
                    onChange={handleProductChange}
                >

                    <option value="">
                        Select Product
                    </option>

                    {products.map(product => (

                        <option
                            key={product.id}
                            value={product.id}
                        >
                            {product.name} - Stock: {product.stock}
                        </option>

                    ))}

                </select>

                <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) =>
                        setQuantity(Number(e.target.value))
                    }
                    style={{
                        marginLeft: "10px"
                    }}
                />

                <input
                    type="number"
                    value={price}
                    readOnly
                    placeholder="Price"
                    style={{
                        marginLeft: "10px"
                    }}
                />

                <button
                    type="button"
                    onClick={addProduct}
                    style={{
                        marginLeft: "10px"
                    }}
                >
                    Add Product
                </button>

            </div>

            <br />

            <h3>Current Bill</h3>

            {items.length === 0 ? (

                <p>No products added</p>

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
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Total</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {items.map((item, index) => {

                            const product = products.find(
                                p =>
                                    p.id === item.productId
                            );

                            return (

                                <tr key={index}>

                                    <td>
                                        {product
                                            ? product.name
                                            : item.productId}
                                    </td>

                                    <td>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                decreaseQuantity(
                                                    item.productId
                                                )
                                            }
                                        >
                                            −
                                        </button>

                                        <span
                                            style={{
                                                margin: "0 12px",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {item.quantity}
                                        </span>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                increaseQuantity(
                                                    item.productId
                                                )
                                            }
                                        >
                                            +
                                        </button>

                                    </td>

                                    <td>
                                        ₹{item.price}
                                    </td>

                                    <td>
                                        ₹{
                                            item.quantity *
                                            item.price
                                        }
                                    </td>

                                    <td>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeItem(
                                                    item.productId
                                                )
                                            }
                                        >
                                            Remove
                                        </button>

                                    </td>

                                </tr>

                            );
                        })}

                    </tbody>

                </table>
            )}

            <h3>
                Total: ₹{totalAmount}
            </h3>

            {editBillId ? (

                <div>

                    <button
                        type="button"
                        onClick={updateBill}
                    >
                        Update Bill
                    </button>

                    <button
                        type="button"
                        onClick={cancelEdit}
                        style={{
                            marginLeft: "10px"
                        }}
                    >
                        Cancel
                    </button>

                </div>

            ) : (

                <button
                    type="button"
                    onClick={createBill}
                >
                    Create Bill
                </button>
            )}

            <hr />

            <h2>Bill List</h2>

            {/* SEARCH */}
            <input
                type="text"
                placeholder="Search customer or product..."
                value={searchBill}
                onChange={(e) =>
                    setSearchBill(e.target.value)
                }
                style={{
                    padding: "8px",
                    width: "280px",
                    marginRight: "10px"
                }}
            />

            {/* DATE FILTER */}
            <input
                type="date"
                value={filterDate}
                onChange={(e) =>
                    setFilterDate(e.target.value)
                }
                style={{
                    padding: "8px"
                }}
            />

            {/* CLEAR FILTER */}
            {(searchBill || filterDate) && (

                <button
                    type="button"
                    onClick={() => {
                        setSearchBill("");
                        setFilterDate("");
                    }}
                    style={{
                        marginLeft: "10px",
                        padding: "8px"
                    }}
                >
                    Clear Filter
                </button>
            )}

            <br />
            <br />

            {filteredBills.length === 0 ? (

                <p>
                    {bills.length === 0
                        ? "No bills available"
                        : "No matching bills found"}
                </p>

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
                            <th>Customer</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Date</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {filteredBills.map(bill => {

                            const customer = customers.find(
                                c =>
                                    c.id === bill.customerId
                            );

                            return (

                                <tr key={bill.id}>

                                    <td>
                                        {customer
                                            ? customer.name
                                            : "Walk-in Customer"}
                                    </td>

                                    <td>

                                        {bill.items &&
                                        bill.items.length > 0 ? (

                                            bill.items.map(
                                                (item, index) => {

                                                    const product =
                                                        products.find(
                                                            p =>
                                                                p.id ===
                                                                item.productId
                                                        );

                                                    return (

                                                        <div
                                                            key={index}
                                                            style={{
                                                                marginBottom:
                                                                    "4px"
                                                            }}
                                                        >
                                                            {product
                                                                ? product.name
                                                                : "Product Deleted"}
                                                            {" × "}
                                                            {item.quantity}
                                                        </div>
                                                    );
                                                }
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

                                    <td>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                editBill(bill)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                printBill(bill)
                                            }
                                            style={{
                                                marginLeft: "5px"
                                            }}
                                        >
                                            Print
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() =>
                                                deleteBill(bill.id)
                                            }
                                            style={{
                                                marginLeft: "5px"
                                            }}
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>
                            );
                        })}

                    </tbody>

                </table>
            )}

        </div>
    );
}

export default Billing;