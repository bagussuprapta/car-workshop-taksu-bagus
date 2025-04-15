import { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import {
    CheckIcon,
    ChevronUpDownIcon,
    PencilIcon,
    TrashIcon,
    PlusIcon,
    UserPlusIcon,
} from "@heroicons/react/20/solid";
import axios from "axios";
import { useAuth } from "../../contexts/AuthProvider";
import { toast } from "react-hot-toast";

export default function Proposals() {
    const [proposals, setProposals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
    const [isAssignMechanicModalOpen, setIsAssignMechanicModalOpen] =
        useState(false);
    const [selectedProposal, setSelectedProposal] = useState(null);
    const [selectedCarForService, setSelectedCarForService] = useState(null);
    const [selectedCarForAssignment, setSelectedCarForAssignment] =
        useState(null);
    const [mechanics, setMechanics] = useState([]);
    const [services, setServices] = useState([]);
    const [formData, setFormData] = useState({
        car_model: "",
        date_brought: "",
        status: "pending",
    });
    const [serviceFormData, setServiceFormData] = useState({
        service_id: "",
        status: "proposed",
    });
    const [assignmentFormData, setAssignmentFormData] = useState({
        mechanic_id: "",
        notes: "",
    });
    const [carOwners, setCarOwners] = useState([]);
    const [selectedCarOwner, setSelectedCarOwner] = useState("");
    const { token } = useAuth();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [proposalToDelete, setProposalToDelete] = useState(null);

    useEffect(() => {
        fetchProposals();
        fetchServices();
        fetchMechanics();
        fetchCarOwners();
    }, []);

    const fetchCarOwners = async () => {
        try {
            const response = await axios.get("/api/users/car-owners", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCarOwners(response.data.data);
        } catch (err) {
            toast.error("Failed to fetch car owners");
        }
    };

    const fetchProposals = async () => {
        try {
            const response = await axios.get("/api/car-repairs", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Proposals data:", response.data.data);
            setProposals(response.data.data);
            setLoading(false);
        } catch (err) {
            toast.error("Failed to fetch proposals");
            setLoading(false);
        }
    };

    const fetchServices = async () => {
        try {
            const response = await axios.get("/api/services", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setServices(response.data.data);
        } catch (err) {
            toast.error("Failed to fetch services");
        }
    };

    const fetchMechanics = async () => {
        try {
            const response = await axios.get("/api/mechanics", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMechanics(response.data.data);
        } catch (err) {
            toast.error("Failed to fetch mechanics");
        }
    };

    const handleStatusChange = async (carRepairId, proposalId, newStatus) => {
        try {
            const response = await axios.put(
                `/api/car-repairs/${carRepairId}/proposals/${proposalId}/status`,
                {
                    status: newStatus,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.status === "success") {
                setProposals((prevProposals) =>
                    prevProposals.map((repair) => {
                        if (repair.id === carRepairId) {
                            return {
                                ...repair,
                                proposals: repair.proposals.map((proposal) => {
                                    if (proposal.id === proposalId) {
                                        return {
                                            ...proposal,
                                            status: newStatus,
                                        };
                                    }
                                    return proposal;
                                }),
                            };
                        }
                        return repair;
                    })
                );
                toast.success("Status updated successfully");
            }
        } catch (err) {
            toast.error("Failed to update status");
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                "/api/car-repairs",
                {
                    ...formData,
                    user_id: selectedCarOwner,
                    proposals: [
                        {
                            service_id: 1,
                            status: "proposed",
                        },
                    ],
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Proposal created successfully");
            setIsModalOpen(false);
            setFormData({
                car_model: "",
                date_brought: "",
                status: "pending",
            });
            setSelectedCarOwner("");
            fetchProposals();
        } catch (err) {
            toast.error("Failed to create proposal");
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `/api/car-repairs/${selectedProposal.id}`,
                {
                    ...formData,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.status === "success") {
                setProposals(
                    proposals.map((p) =>
                        p.id === selectedProposal.id ? response.data.data : p
                    )
                );
                toast.success("Proposal updated successfully");
                setIsModalOpen(false);
                setSelectedProposal(null);
                setFormData({
                    car_model: "",
                    date_brought: "",
                    status: "pending",
                });
            }
        } catch (err) {
            toast.error("Failed to update proposal");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/car-repairs/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setProposals(proposals.filter((p) => p.id !== id));
            toast.success("Proposal deleted successfully");
            setIsDeleteModalOpen(false);
            setProposalToDelete(null);
        } catch (err) {
            toast.error("Failed to delete proposal");
        }
    };

    const handleAddService = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `/api/car-repairs/${selectedCarForService.id}/services`,
                serviceFormData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.status === "success") {
                setProposals(
                    proposals.map((proposal) => {
                        if (proposal.id === selectedCarForService.id) {
                            return {
                                ...proposal,
                                proposals: [
                                    ...proposal.proposals,
                                    response.data.data,
                                ],
                            };
                        }
                        return proposal;
                    })
                );
                toast.success("Service added successfully");
                setIsAddServiceModalOpen(false);
                setSelectedCarForService(null);
                setServiceFormData({
                    service_id: "",
                    status: "proposed",
                });
            }
        } catch (err) {
            toast.error("Failed to add service");
        }
    };

    const handleAssignMechanic = async (e) => {
        e.preventDefault();
        try {
            console.log("Assigning mechanic:", {
                carRepairId: selectedCarForAssignment.car_repair_id,
                proposalId: selectedCarForAssignment.id,
                formData: assignmentFormData,
            });

            const response = await axios.post(
                `/api/car-repairs/${selectedCarForAssignment.car_repair_id}/assign`,
                {
                    mechanic_id: assignmentFormData.mechanic_id,
                    service_proposal_id: selectedCarForAssignment.id,
                    notes: assignmentFormData.notes,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.status === "success") {
                setProposals(
                    proposals.map((proposal) => {
                        if (
                            proposal.id ===
                            selectedCarForAssignment.car_repair_id
                        ) {
                            return {
                                ...proposal,
                                proposals: proposal.proposals.map((p) => {
                                    if (p.id === selectedCarForAssignment.id) {
                                        return {
                                            ...p,
                                            job_assignment: response.data.data,
                                        };
                                    }
                                    return p;
                                }),
                            };
                        }
                        return proposal;
                    })
                );
                toast.success("Mechanic assigned successfully");
                setIsAssignMechanicModalOpen(false);
                setSelectedCarForAssignment(null);
                setAssignmentFormData({
                    mechanic_id: "",
                    notes: "",
                });
            }
        } catch (err) {
            console.error("Error assigning mechanic:", err);
            toast.error(
                err.response?.data?.message || "Failed to assign mechanic"
            );
        }
    };

    const handleDeleteService = async (carRepairId, serviceId) => {
        try {
            await axios.delete(
                `/api/car-repairs/${carRepairId}/services/${serviceId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setProposals(
                proposals.map((proposal) => {
                    if (proposal.id === carRepairId) {
                        return {
                            ...proposal,
                            proposals: proposal.proposals.filter(
                                (p) => p.id !== serviceId
                            ),
                        };
                    }
                    return proposal;
                })
            );
            toast.success("Service berhasil dihapus");
            setIsDeleteModalOpen(false);
            setProposalToDelete(null);
        } catch (err) {
            toast.error("Gagal menghapus service");
        }
    };

    const openEditModal = (proposal) => {
        setSelectedProposal(proposal);
        setFormData({
            car_model: proposal.car_model,
            date_brought: proposal.date_brought,
            status: proposal.status,
        });
        setIsModalOpen(true);
    };

    const openAddServiceModal = (car) => {
        setSelectedCarForService(car);
        setIsAddServiceModalOpen(true);
    };

    const openAssignMechanicModal = (serviceData) => {
        setSelectedCarForAssignment(serviceData);
        setIsAssignMechanicModalOpen(true);
    };

    const openDeleteModal = (proposal) => {
        setProposalToDelete(proposal);
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
        <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold text-gray-900">
                    Proposals
                </h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Proposal
                </button>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Car Model
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Owner
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date Brought
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Services
                                </th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {proposals.map((proposal) => (
                                <tr
                                    key={proposal.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {proposal.car_model}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {proposal.user?.name || "Unknown"}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {proposal.user?.email || ""}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">
                                            {new Date(
                                                proposal.date_brought
                                            ).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="space-y-2">
                                            {proposal.proposals.map(
                                                (service) => (
                                                    <div
                                                        key={service.id}
                                                        className="flex items-center justify-between bg-gray-50 rounded-lg p-2"
                                                    >
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {
                                                                    service
                                                                        .service
                                                                        ?.name
                                                                }
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                Rp{" "}
                                                                {service.service?.price.toLocaleString()}
                                                            </div>
                                                            {service.job_assignment && (
                                                                <div className="mt-1 text-xs text-gray-500">
                                                                    Mechanic:{" "}
                                                                    {
                                                                        service
                                                                            .job_assignment
                                                                            .mechanic
                                                                            ?.name
                                                                    }
                                                                    {service
                                                                        .job_assignment
                                                                        .notes && (
                                                                            <div>
                                                                                Notes:{" "}
                                                                                {
                                                                                    service
                                                                                        .job_assignment
                                                                                        .notes
                                                                                }
                                                                            </div>
                                                                        )}
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <select
                                                                value={
                                                                    service.status
                                                                }
                                                                onChange={(e) =>
                                                                    handleStatusChange(
                                                                        proposal.id,
                                                                        service.id,
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-offset-2 ${getStatusColor(
                                                                    service.status
                                                                )} cursor-pointer transition-colors duration-200 appearance-none`}
                                                            >
                                                                <option
                                                                    value="proposed"
                                                                    className="bg-white py-1"
                                                                >
                                                                    Proposed
                                                                </option>
                                                                <option
                                                                    value="approved"
                                                                    className="bg-white py-1"
                                                                >
                                                                    Approved
                                                                </option>
                                                                <option
                                                                    value="rejected"
                                                                    className="bg-white py-1"
                                                                >
                                                                    Rejected
                                                                </option>
                                                                <option
                                                                    value="completed"
                                                                    className="bg-white py-1"
                                                                >
                                                                    Completed
                                                                </option>
                                                                <option
                                                                    value="complaint"
                                                                    className="bg-white py-1"
                                                                >
                                                                    Complaint
                                                                </option>
                                                            </select>
                                                            {!service.job_assignment && (
                                                                <button
                                                                    onClick={() =>
                                                                        openAssignMechanicModal(
                                                                            {
                                                                                car_repair_id:
                                                                                    proposal.id,
                                                                                id: service.id,
                                                                            }
                                                                        )
                                                                    }
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                >
                                                                    <UserPlusIcon className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() =>
                                                                    openDeleteModal(
                                                                        proposal
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-800"
                                                            >
                                                                <TrashIcon className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                            <button
                                                onClick={() =>
                                                    openAddServiceModal(
                                                        proposal
                                                    )
                                                }
                                                className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                                            >
                                                <PlusIcon className="h-4 w-4 mr-1" />
                                                Add Service
                                            </button>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() =>
                                                openEditModal(proposal)
                                            }
                                            className="text-blue-600 hover:text-blue-800 mr-3"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() =>
                                                openDeleteModal(proposal)
                                            }
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
            </div>

            {/* Add/Edit Proposal Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            {selectedProposal
                                ? "Edit Proposal"
                                : "Add New Proposal"}
                        </h3>
                        <form
                            onSubmit={
                                selectedProposal ? handleUpdate : handleCreate
                            }
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Car Owner
                                </label>
                                <select
                                    value={selectedCarOwner}
                                    onChange={(e) =>
                                        setSelectedCarOwner(e.target.value)
                                    }
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Car Owner</option>
                                    {carOwners.map((owner) => (
                                        <option key={owner.id} value={owner.id}>
                                            {owner.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Car Model
                                </label>
                                <input
                                    type="text"
                                    value={formData.car_model}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            car_model: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date Brought
                                </label>
                                <input
                                    type="date"
                                    value={formData.date_brought}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            date_brought: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    {selectedProposal ? "Update" : "Add"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Service Modal */}
            {isAddServiceModalOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Add Service
                        </h3>
                        <form onSubmit={handleAddService} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Service
                                </label>
                                <select
                                    value={serviceFormData.service_id}
                                    onChange={(e) =>
                                        setServiceFormData({
                                            ...serviceFormData,
                                            service_id: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Service</option>
                                    {services.map((service) => (
                                        <option
                                            key={service.id}
                                            value={service.id}
                                        >
                                            {service.name} - Rp{" "}
                                            {service.price.toLocaleString()}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setIsAddServiceModalOpen(false)
                                    }
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Assign Mechanic Modal */}
            {isAssignMechanicModalOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Assign Mechanic
                        </h3>
                        <form
                            onSubmit={handleAssignMechanic}
                            className="space-y-4"
                        >
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mechanic
                                </label>
                                <select
                                    value={assignmentFormData.mechanic_id}
                                    onChange={(e) =>
                                        setAssignmentFormData({
                                            ...assignmentFormData,
                                            mechanic_id: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Mechanic</option>
                                    {mechanics.map((mechanic) => (
                                        <option
                                            key={mechanic.id}
                                            value={mechanic.id}
                                        >
                                            {mechanic.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Notes
                                </label>
                                <textarea
                                    value={assignmentFormData.notes}
                                    onChange={(e) =>
                                        setAssignmentFormData({
                                            ...assignmentFormData,
                                            notes: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    rows="3"
                                />
                            </div>
                            <div className="flex justify-end space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsAssignMechanicModalOpen(false);
                                        setSelectedCarForAssignment(null);
                                        setAssignmentFormData({
                                            mechanic_id: "",
                                            notes: "",
                                        });
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Assign
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Proposal Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Delete Proposal
                        </h3>
                        <p className="text-sm text-gray-500 mb-6">
                            Are you sure you want to delete this proposal? This
                            action cannot be undone.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setIsDeleteModalOpen(false);
                                    setProposalToDelete(null);
                                }}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() =>
                                    handleDelete(proposalToDelete.id)
                                }
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const getStatusColor = (status) => {
    switch (status) {
        case "proposed":
            return "bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100";
        case "approved":
            return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100";
        case "rejected":
            return "bg-red-50 text-red-700 border-red-200 hover:bg-red-100";
        case "completed":
            return "bg-green-50 text-green-700 border-green-200 hover:bg-green-100";
        case "complaint":
            return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100";
        default:
            return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100";
    }
};

const getStatusText = (status) => {
    switch (status) {
        case "proposed":
            return "Proposed";
        case "approved":
            return "Approved";
        case "rejected":
            return "Rejected";
        case "completed":
            return "Completed";
        case "complaint":
            return "Complaint";
        default:
            return status;
    }
};
