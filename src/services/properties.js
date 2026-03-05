// import axios from 'axios';




// export const fetchProperties = async () => {
//     const response = await axios.get(`${import.meta.env.VITE_BACKEND_SERVICE}/houses`);
    
//     if (response.status >= 400) {
//         throw new Error(response.data?.message || response.data?.error || 'Failed to fetch properties.');
//     }
//     return response.data;
// }

import axios from "axios";

const API = import.meta.env.VITE_BACKEND_SERVICE;

// Add new property
export const createProperty = async (propertyData) => {
    const token = localStorage.getItem("token");

    const response = await axios.post(
        `${API}/properties`,
        propertyData,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    return response.data;
};

// Get all properties
export const getProperties = async () => {
    const response = await axios.get(`${API}/properties`);
    return response.data;
};