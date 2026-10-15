import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

function Customers() {

    const [customers, setCustomers] = useState([]);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");

    const [editId, setEditId] = useState(null);

    const getCustomers = () => {

        apiFetch("/api/customers")
            .then(response => {

                if (!response.ok) {
                    throw new Error("Failed to load customers");
                }

                return response.json();
            })
            .then(data => {
                setCustomers(data);
            })
            .catch(error => {
                console.log(error);
            });
    };

    useEffect(() => {
        getCustomers();
    }, []);

    const saveCustomer = () => {

        if (!name || !phone) {
            alert("Name and phone are required");
            return;
        }

        const customer = {
            name: name,
            phone: phone,
            email: email,
            address: address
        };

        let url = "/api/customers";
        let method = "POST";

        if (editId !== null) {
            url = `/api/customers/${editId}`;
            method = "PUT";
        }

        apiFetch(url, {
            method: method,
            body: JSON.stringify(customer)
        })
            .then(response => {

                if (!response.ok) {
                    throw new Error("Customer save failed");
                }

                return response.json();
            })
            .then(() => {

                alert(
                    editId === null
                        ? "Customer added successfully"
                        : "Customer updated successfully"
                );

                clearForm();
                getCustomers();
            })
            .catch(error => {
                alert(error.message);
            });
    };

    const editCustomer = (customer) => {

        setEditId(customer.id);

        setName(customer.name);
        setPhone(customer.phone);
        setEmail(customer.email);
        setAddress(customer.address);
    };

    const deleteCustomer = (id) => {

        if (!window.confirm("Delete this customer?")) {
            return;
        }

        apiFetch(`/api/customers/${id}`, {
            method: "DELETE"
        })
            .then(response => {

                if (!response.ok) {
                    throw new Error("Customer delete failed");
                }

                getCustomers();
            })
            .catch(error => {
                alert(error.message);
            });
    };

    const clearForm = () => {

        setEditId(null);

        setName("");
        setPhone("");
        setEmail("");
        setAddress("");
    };

    return (

        <div style={{ padding: "30px" }}>

            <h1>Customers</h1>

            <div style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "8px",
                marginTop: "20px"
            }}>

                <h2>
                    {editId === null
                        ? "Add Customer"
                        : "Edit Customer"}
                </h2>

                <div style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap"
                }}>

                    <input
                        placeholder="Customer Name"
                        value={name}
                        onChange={(e) =>
                            setName(e.target.value)
                        }
                    />

                    <input
                        placeholder="Phone"
                        value={phone}
                        onChange={(e) =>
                            setPhone(e.target.value)
                        }
                    />

                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                    />

                    <input
                        placeholder="Address"
                        value={address}
                        onChange={(e) =>
                            setAddress(e.target.value)
                        }
                    />

                </div>

                <br />

                <button onClick={saveCustomer}>
                    {editId === null
                        ? "Add Customer"
                        : "Update Customer"}
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

                <h2>Customer List</h2>

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
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Action</th>
                        </tr>

                    </thead>

                    <tbody>

                        {customers.map(customer => (

                            <tr key={customer.id}>

                                <td>{customer.name}</td>

                                <td>{customer.phone}</td>

                                <td>{customer.email}</td>

                                <td>{customer.address}</td>

                                <td>

                                    <button
                                        onClick={() =>
                                            editCustomer(customer)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteCustomer(customer.id)
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

export default Customers;