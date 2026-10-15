const API_URL = "http://localhost:8080";

export const apiFetch = async (url, options = {}) => {

    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...options.headers
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${url}`, {
        ...options,
        headers
    });

    if (response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return;
    }

    return response;
};