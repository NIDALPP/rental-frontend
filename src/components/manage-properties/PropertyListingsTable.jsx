import React, { useEffect } from 'react';
import { Edit, Trash2 } from 'lucide-react';

const PropertyListingsTable = ({ properties, onEdit }) => {


    // useEffect(() => {
    //     console.log("Properties in table:", properties);
    // }, [properties]);
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
                            <th className="p-4 font-semibold rounded-tl-2xl">Property</th>
                            <th className="p-4 font-semibold">Location</th>
                            <th className="p-4 font-semibold">Price</th>
                            <th className="p-4 font-semibold">Status</th>
                            <th className="p-4 font-semibold text-right rounded-tr-2xl">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {properties.map((property) => (
                            <tr key={property.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex items-center gap-4">
                                        <img src={property.imageUrl} alt={property.title} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                                        <div>
                                            <div className="font-bold text-slate-900 group-hover:text-primary-600 transition-colors">{property.title}</div>
                                            <div className="text-sm text-slate-500">{property.bedrooms} Beds • {property.bathrooms} Baths • {property.sqft} sqft</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4 text-slate-600 font-medium">{property.location}</td>
                                <td className="p-4 font-bold text-slate-900">
                                    ${property.price.toLocaleString()}<span className="text-xs text-slate-500 font-normal">/mo</span>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${property.approvalStatus === 'Pending'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : property.approvalStatus === 'Rejected'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-green-100 text-green-700'
                                        }`}>
                                        {property.approvalStatus === 'Pending' ? 'Pending Approval' : property.approvalStatus === 'Rejected' ? 'Rejected' : 'Active'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-2 text-slate-400">
                                        <button onClick={onEdit} className="p-2 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Edit Property">
                                            <Edit size={18} />
                                        </button>
                                        <button className="p-2 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Property">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PropertyListingsTable;
