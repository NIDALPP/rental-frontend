import { properties as initialMockProperties } from '../data/mockData';
import axios from 'axios';

// Initialize store with mock data, treating them all as 'approved' by default so they show up.
let store = [...initialMockProperties.map(p => ({ ...p, status: 'approved' }))];

export const getAllProperties = async () => {
    try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_SERVICE}/houses/list`)
        if (response.data.status == 1) {
            return ({
                status: true,
                data: response.data.data,
                message: response.data.message || "Properties fetched successfully"
            })
        }
        return ({
            status: false,
            data: [],
            message: response.data.message || "Failed to fetch properties"
        })
    }
    catch (error) {
        console.error("Error fetching properties:", error);
        return ({
            status: false,
            data: [],
            message: error.message || "Error fetching properties"
        })
    }
};

export const getApprovedProperties = () => {
    return store.filter(p => p.status === 'approved');
};

// export const addProperty = (propertyData) => {
//     const newProperty = {
//         ...propertyData,
//         id: Date.now(), // simple unique id
//         featured: false,
//         status: 'pending' // new properties need admin approval
//     };
//     store = [newProperty, ...store];
//     return newProperty;
// };

export const updatePropertyStatus = (id, newStatus) => {
    store = store.map(p =>
        p.id === id ? { ...p, status: newStatus } : p
    );
};



export const addProperty = async (propertyData) => {

    try {
        const response = await axios.post(`${import.meta.env.VITE_BACKEND_SERVICE}/houses/add`, propertyData,)
        if (response.data.status === 1 || response.data.status === true) {
            return ({
                status: true,
                data: response.data.data,
                message: response.data.message || "Property added successfully"
            })

        }
        else {
            return ({
                status: false,
                message: response.data.message || "Failed to add property"
            })

        }
    } catch (error) {
        console.error("Error adding property:", error);
        throw error;
    }
}