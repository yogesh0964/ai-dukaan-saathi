import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

function Inventory() {

    const [stocks, setStocks] = useState([]);
    const [products, setProducts] = useState([]);

    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [type, setType] = useState("IN");

    const getStocks = () => {

        apiFetch("/api/stocks")
            .then(response => response.json())
            .then(data => {
                setStocks(data);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const getProducts = () => {

        apiFetch("/api/products")
            .then(response => response.json())
            .then(data => {
                setProducts(data);
            })
            .catch(error => {
                console.log(error);
            });
    };

    useEffect(() => {
        getStocks();
        getProducts();
    }, []);

    const addStock = () => {

        if (!productId || !quantity) {
            alert("Please select product and quantity");
            return;
        }

        const stock = {
            productId: productId,
            quantity: Number(quantity),
            type: type
        };

        apiFetch("/api/stocks", {
            method: "POST",
            body: JSON.stringify(stock)
        })
            .then(response => {

                if (!response.ok) {
                    throw new Error("Stock update failed");
                }

                return response.json();
            })
            .then(() => {

                alert("Stock updated successfully");

                setProductId("");
                setQuantity("");
                setType("IN");

                getStocks();
                getProducts();
            })
            .catch(error => {
                alert(error.message);
            });
    };

    const deleteStock = (id) => {

        if (!window.confirm("Delete this stock record?")) {
            return;
        }

        apiFetch(`/api/stocks/${id}`, {
            method: "DELETE"
        })
            .then(() => {
                getStocks();
                getProducts();
            });
    };

    const getProductName = (id) => {

        const product = products.find(
            product => product.id === id
        );

        return product
            ? product.name
            : id;
    };

    return (

        <div style={{ padding: "30px" }}>

            <h1>Inventory</h1>

            <div style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                marginTop: "20px"
            }}>

                <h2>Stock Management</h2>

                <select
                    value={productId}
                    onChange={(e) =>
                        setProductId(e.target.value)
                    }
                >

                    <option value="">
                        Select Product
                    </option>

                    {products.map(product => (

                        <option
                            key={product.id}
                            value={product.id}
                        >
                            {product.name} - {product.stock} available
                        </option>

                    ))}

                </select>

                <input
                    placeholder="Quantity"
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                        setQuantity(e.target.value)
                    }
                    style={{ marginLeft: "10px" }}
                />

                <select
                    value={type}
                    onChange={(e) =>
                        setType(e.target.value)
                    }
                    style={{ marginLeft: "10px" }}
                >

                    <option value="IN">
                        Stock In
                    </option>

                    <option value="OUT">
                        Stock Out
                    </option>

                </select>

                <button
                    onClick={addStock}
                    style={{ marginLeft: "10px" }}
                >
                    Update Stock
                </button>

            </div>

            <div style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                marginTop: "20px"
            }}>

                <h2>Stock History</h2>

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
                            <th>Product</th>
                            <th>Quantity</th>
                            <th>Type</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {stocks.map(stock => (

                            <tr key={stock.id}>

                                <td>
                                    {getProductName(stock.productId)}
                                </td>

                                <td>
                                    {stock.quantity}
                                </td>

                                <td>
                                    {stock.type}
                                </td>

                                <td>

                                    <button
                                        onClick={() =>
                                            deleteStock(stock.id)
                                        }
                                    >
                                        Delete
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default Inventory;