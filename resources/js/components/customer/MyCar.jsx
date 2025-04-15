import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../contexts/AuthProvider";
import { toast } from "react-hot-toast";

export default function MyCar() {
    const [carRepairs, setCarRepairs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();

    useEffect(() => {
        fetchCarRepairs();
    }, []);

    const fetchCarRepairs = async () => {
        try {
            const response = await axios.get("/api/car-repairs/my-cars", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Filter out completed services and cars with no active services
            const filteredRepairs = response.data.data
                .map((repair) => ({
                    ...repair,
                    proposals: repair.proposals.filter(
                        (service) => service.status !== "completed"
                    ),
                }))
                .filter((repair) => repair.proposals.length > 0);

            setCarRepairs(filteredRepairs);
            setLoading(false);
        } catch (err) {
            toast.error("Failed to fetch car repairs");
            setLoading(false);
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
            case "complaint":
                return "bg-purple-50 text-purple-700 border-purple-200";
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
                My Cars in Service
            </h1>

            {carRepairs.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500">
                        No cars currently in service
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
                                                {service.status
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                    service.status.slice(1)}
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
