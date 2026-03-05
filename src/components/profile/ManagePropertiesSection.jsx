import React, { useState, useEffect } from 'react';
import { getAllProperties } from '../../services/propertyStore';
import { uploadImageToCloudinary } from '../../services/cloudinary';
import ManagePropertiesHeader from '../manage-properties/ManagePropertiesHeader';
import PropertyListingsTable from '../manage-properties/PropertyListingsTable';
import AddPropertyForm from '../manage-properties/AddPropertyForm';

const ManagePropertiesSection = () => {
    const [activeTab, setActiveTab] = useState('list');
    const [images, setImages] = useState([]);
    const [isUploadingImage, setIsUploadingImage] = useState(false);
    const [imageUploadError, setImageUploadError] = useState('');
    const [activeProperties, setActiveProperties] = useState([]);

    useEffect(() => {
        if (activeTab === 'list') {
            fetchProperties()
            
        }
    }, [activeTab]);


    const fetchProperties=async()=>{
        let response=await getAllProperties()
        console.log(response.data,"dataaa");
        setActiveProperties(response.data)
        
        
    }

    const handleImageSelect = async (event) => {
        const files = Array.from(event.target.files || []);
        if (!files.length) return;
        if (images.length + files.length > 6) {
            window.toast && window.toast.error
                ? window.toast.error('You can only upload up to 6 images.')
                : alert('You can only upload up to 6 images.');
            return;
        }
        setIsUploadingImage(true);
        setImageUploadError('');
        try {
            const uploadPromises = files.map(file => uploadImageToCloudinary(file));
            const urls = await Promise.all(uploadPromises);
            setImages(prev => [...prev, ...urls]);
        } catch (error) {
            setImageUploadError(error.message || 'Failed to upload image(s).');
        } finally {
            setIsUploadingImage(false);
        }
    };

    const handleImageRemove = (url) => {
        setImages(prev => prev.filter(img => img !== url));
    };


    

    return (
        <>
            <ManagePropertiesHeader activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'list' ? (
                <PropertyListingsTable properties={activeProperties} onEdit={() => setActiveTab('add')} />
            ) : (
                <AddPropertyForm
                    images={images}
                    isUploadingImage={isUploadingImage}
                    imageUploadError={imageUploadError}
                    onCancel={() => setActiveTab('list')}
                    onImageSelect={handleImageSelect}
                    onImageRemove={handleImageRemove}
                />
            )}
        </>
    );
};

export default ManagePropertiesSection;
