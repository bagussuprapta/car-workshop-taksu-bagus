import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Job = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);

    const getAuthToken = () => {
        return localStorage.getItem("token");
    };

    const fetchJobs = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error("Please login first");
            }

            const response = await axios.get("/api/mechanic/jobs", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setJobs(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleStatusChange = async (jobId, newStatus) => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error("Please login first");
            }

            await axios.put(
                `/api/mechanic/jobs/${jobId}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            toast.success("Status updated successfully");
            fetchJobs();
            setShowStatusModal(false);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "proposed":
                return "bg-yellow-50 text-yellow-700 border-yellow-200";
            case "approved":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "rejected":
                return "bg-red-50 text-red-700 border-red-200";
            case "completed":
                return "bg-green-50 text-green-700 border-green-200";
            case "complaint":
                return "bg-purple-50 text-purple-700 border-purple-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
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

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-6">
            <h1 className="text-xl font-semibold mb-4">Job List</h1>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Service
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Car Model
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Car Owner
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Notes
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {jobs.map((job) => (
                                <tr key={job.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                        {job.service?.name || "N/A"}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                        {job.carRepair?.car_model || "N/A"}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                                        {job.carRepair?.user?.name || "N/A"}
                                    </td>
                                    <td className="px-4 py-3 text-sm">
                                        {job.notes || "N/A"}
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                job.status
                                            )}`}
                                        >
                                            {getStatusText(job.status)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 whitespace-nowrap">
                                        <button
                                            onClick={() => {
                                                setSelectedJob(job);
                                                setShowStatusModal(true);
                                            }}
                                            className="text-sm text-blue-600 hover:text-blue-800"
                                        >
                                            Update Status
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusModal && selectedJob && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-medium mb-4">
                            Update Job Status
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                            Select new status for this job:
                        </p>

                        <div className="space-y-2">
                            {[
                                "proposed",
                                "approved",
                                "rejected",
                                "completed",
                                "complaint",
                            ].map((status) => (
                                <button
                                    key={status}
                                    onClick={() =>
                                        handleStatusChange(
                                            selectedJob.id,
                                            status
                                        )
                                    }
                                    className={`w-full text-left px-4 py-2 rounded text-sm ${selectedJob.status === status
                                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                                        : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                                        }`}
                                >
                                    {getStatusText(status)}
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowStatusModal(false)}
                                className="text-sm text-gray-600 hover:text-gray-800"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Job;
