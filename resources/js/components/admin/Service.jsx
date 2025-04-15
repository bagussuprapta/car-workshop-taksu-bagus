import { useState, useEffect } from "react";
import { Dialog } from "@headlessui/react";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Service() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [serviceToDelete, setServiceToDelete] = useState(null);
    const [editingService, setEditingService] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        price: "",
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const response = await axios.get("/api/services", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setServices(response.data.data);
            setLoading(false);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            const url = editingService
                ? `/api/services/${editingService.id}`
                : "/api/services";
            const method = editingService ? "put" : "post";

            await axios[method](url, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success(
                `Service ${editingService ? "updated" : "added"} successfully`
            );
            await fetchServices();
            handleCloseModal();
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            await axios.delete(`/api/services/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            toast.success("Service deleted successfully");
            await fetchServices();
            setIsDeleteModalOpen(false);
            setServiceToDelete(null);
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    const handleOpenModal = (service = null) => {
        if (service) {
            setEditingService(service);
            setFormData({
                name: service.name,
                price: service.price,
            });
        } else {
            setEditingService(null);
            setFormData({
                name: "",
                price: "",
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingService(null);
        setFormData({
            name: "",
            price: "",
        });
    };

    const openDeleteModal = (service) => {
        setServiceToDelete(service);
        setIsDeleteModalOpen(true);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold text-gray-900">
                    Services
                </h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Service
                </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Price
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {services.map((service) => (
                            <tr key={service.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {service.name}
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        Rp {service.price.toLocaleString()}
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleOpenModal(service)}
                                        className="text-blue-600 hover:text-blue-800 mr-3"
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={() => openDeleteModal(service)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Dialog
                open={isModalOpen}
                onClose={handleCloseModal}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 w-full">
                        <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                            {editingService
                                ? "Edit Service"
                                : "Add New Service"}
                        </Dialog.Title>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price
                                </label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            price: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                    min="0"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    {editingService ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </Dialog.Panel>
                </div>
            </Dialog>

            <Dialog
                open={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setServiceToDelete(null);
                }}
                className="relative z-50"
            >
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-white p-6 w-full">
                        <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
                            Delete Service
                        </Dialog.Title>
                        <p className="text-sm text-gray-500 mb-6">
                            Are you sure you want to delete this service? This
                            action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setServiceToDelete(null);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(serviceToDelete.id)}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </div>
    );
}
