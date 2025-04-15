import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthProvider";
import { toast } from "react-hot-toast";

export default function ServiceHistory() {
    const [carRepairs, setCarRepairs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        fetchServiceHistory();
    }, []);

    const fetchServiceHistory = async () => {
        try {
            const response = await axios.get(
                "/api/car-repairs/service-history",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setCarRepairs(response.data.data);
            setLoading(false);
        } catch (err) {
            toast.error("Failed to fetch service history");
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "completed":
                return "bg-green-50 text-green-700 border-green-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
        }).format(amount);
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
            <h1 className="text-xl font-semibold text-gray-900 mb-4">
                Service History
            </h1>

            {carRepairs.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">
                        No service history available
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {carRepairs.map((repair) => (
                        <div
                            key={repair.id}
                            className="bg-white rounded-lg border border-gray-200 p-4"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-lg font-medium text-gray-900">
                                        {repair.car_model}
                                    </h2>
                                    <p className="text-sm text-gray-500">
                                        Service Date:{" "}
                                        {new Date(
                                            repair.date_brought
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {repair.proposals.map((service) => (
                                    <div
                                        key={service.id}
                                        className="border border-gray-200 rounded-lg p-3"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-medium text-gray-900">
                                                    {service.service.name}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {formatCurrency(
                                                        service.service.price
                                                    )}
                                                </p>
                                                {service.job_assignment && (
                                                    <div className="mt-2">
                                                        <p className="text-sm text-gray-600">
                                                            Mechanic:{" "}
                                                            {
                                                                service
                                                                    .job_assignment
                                                                    .mechanic
                                                                    .name
                                                            }
                                                        </p>
                                                        {service.job_assignment
                                                            .notes && (
                                                                <p className="text-sm text-gray-500 mt-1">
                                                                    Notes:{" "}
                                                                    {
                                                                        service
                                                                            .job_assignment
                                                                            .notes
                                                                    }
                                                                </p>
                                                            )}
                                                    </div>
                                                )}
                                            </div>
                                            <span
                                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                                                    service.status
                                                )}`}
                                            >
                                                Completed
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
