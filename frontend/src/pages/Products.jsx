import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

function Products() {

    const [products, setProducts] = useState([]);

    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [purchasePrice, setPurchasePrice] = useState("");
    const [sellingPrice, setSellingPrice] = useState("");
    const [stock, setStock] = useState("");

    const [editId, setEditId] = useState(null);

    const getProducts = () => {

        apiFetch("/api/products")
            .then(response => response.json())
            .then(data => {
                setProducts(data);
            });
    };

    useEffect(() => {
        getProducts();
    }, []);

    const saveProduct = () => {

        if (!name || !category || !purchasePrice || !sellingPrice || !stock) {
            alert("Please fill all details");
            return;
        }

        const product = {
            name: name,
            category: category,
            purchasePrice: Number(purchasePrice),
            sellingPrice: Number(sellingPrice),
            stock: Number(stock)
        };

        const url = editId === null
            ? "/api/products"
            : `/api/products/${editId}`;

        const method = editId === null ? "POST" : "PUT";

        apiFetch(url, {
            method: method,
            body: JSON.stringify(product)
        })
            .then(response => response.json())
            .then(() => {
                clearForm();
                getProducts();
            });
    };

    const editProduct = (product) => {

        setEditId(product.id);
        setName(product.name);
        setCategory(product.category);
        setPurchasePrice(product.purchasePrice);
        setSellingPrice(product.sellingPrice);
        setStock(product.stock);
    };

    const deleteProduct = (id) => {

        if (!window.confirm("Delete this product?")) {
            return;
        }

        apiFetch(`/api/products/${id}`, {
            method: "DELETE"
        })
            .then(() => {
                getProducts();
            });
    };

    const clearForm = () => {

        setEditId(null);
        setName("");
        setCategory("");
        setPurchasePrice("");
        setSellingPrice("");
        setStock("");
    };

    return (
        <div style={{ padding: "30px" }}>

            <h1>Products</h1>

            <div style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                marginTop: "20px"
            }}>

                <h2>
                    {editId === null
                        ? "Add Product"
                        : "Edit Product"}
                </h2>

                <div style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap"
                }}>

                    <input
                        placeholder="Product Name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                    />

                    <input
                        placeholder="Category"
                        value={category}
                        onChange={(e) =>
                            setCategory(e.target.value)
                        }
                    />

                    <input
                        placeholder="Purchase Price"
                        type="number"
                        value={purchasePrice}
                        onChange={(e) =>
                            setPurchasePrice(e.target.value)
                        }
                    />

                    <input
                        placeholder="Selling Price"
                        type="number"
                        value={sellingPrice}
                        onChange={(e) =>
                            setSellingPrice(e.target.value)
                        }
                    />

                    <input
                        placeholder="Stock"
                        type="number"
                        value={stock}
                        onChange={(e) =>
                            setStock(e.target.value)
                        }
                    />

                </div>

                <br />

                <button onClick={saveProduct}>
                    {editId === null
                        ? "Add Product"
                        : "Update Product"}
                </button>

                <button
                    onClick={clearForm}
                    style={{ marginLeft: "10px" }}
                >
                    Clear
                </button>

            </div>

            <div style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                marginTop: "20px"
            }}>

                <h2>Product List</h2>

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
                            <th>Name</th>
                            <th>Category</th>
                            <th>Purchase Price</th>
                            <th>Selling Price</th>
                            <th>Stock</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>

                        {products.map(product => (

                            <tr key={product.id}>

                                <td>{product.name}</td>
                                <td>{product.category}</td>
                                <td>₹{product.purchasePrice}</td>
                                <td>₹{product.sellingPrice}</td>
                                <td>{product.stock}</td>

                                <td>

                                    <button
                                        onClick={() =>
                                            editProduct(product)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteProduct(product.id)
                                        }
                                        style={{
                                            marginLeft: "8px"
                                        }}
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

export default Products;