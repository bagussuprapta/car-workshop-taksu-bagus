import { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No authentication token found");
                }

                const response = await axios.get("/api/users", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUsers(response.data.data);
                setLoading(false);
            } catch (err) {
                toast.error(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const handleRoleChange = async (userId, newRole) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No authentication token found");
            }

            await axios.put(
                `/api/users/${userId}/role`,
                { role: newRole },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Update local state
            setUsers(
                users.map((user) =>
                    user.id === userId ? { ...user, role: newRole } : user
                )
            );
            toast.success("User role updated successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        }
    };

    const roleOptions = [
        { id: "admin", name: "Admin" },
        { id: "mechanic", name: "Mechanic" },
        { id: "car_owner", name: "Car Owner" },
    ];

    const getRoleColor = (role) => {
        switch (role) {
            case "admin":
                return "bg-purple-50 text-purple-700 border-purple-200";
            case "mechanic":
                return "bg-blue-50 text-blue-700 border-blue-200";
            case "car_owner":
                return "bg-green-50 text-green-700 border-green-200";
            default:
                return "bg-gray-50 text-gray-700 border-gray-200";
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
        <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold text-gray-900">Users</h1>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Role
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {user.name}
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">
                                        {user.email}
                                    </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                    <Listbox
                                        value={user.role}
                                        onChange={(value) =>
                                            handleRoleChange(user.id, value)
                                        }
                                    >
                                        <div className="relative">
                                            <Listbox.Button
                                                className={`relative w-full py-1.5 pl-3 pr-10 text-left rounded-lg cursor-default focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm border ${getRoleColor(
                                                    user.role
                                                )}`}
                                            >
                                                <span className="block truncate">
                                                    {roleOptions.find(
                                                        (option) =>
                                                            option.id ===
                                                            user.role
                                                    )?.name || user.role}
                                                </span>
                                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                                    <ChevronUpDownIcon
                                                        className="h-4 w-4 text-gray-400"
                                                        aria-hidden="true"
                                                    />
                                                </span>
                                            </Listbox.Button>
                                            <Listbox.Options className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-lg py-1 text-sm ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                                                {roleOptions.map((option) => (
                                                    <Listbox.Option
                                                        key={option.id}
                                                        value={option.id}
                                                        className={({
                                                            active,
                                                        }) =>
                                                            `${active
                                                                ? "text-white bg-blue-600"
                                                                : "text-gray-900"
                                                            }
                                                            cursor-default select-none relative py-2 pl-10 pr-4`
                                                        }
                                                    >
                                                        {({
                                                            selected,
                                                            active,
                                                        }) => (
                                                            <>
                                                                <span
                                                                    className={`${selected
                                                                        ? "font-medium"
                                                                        : "font-normal"
                                                                        } block truncate`}
                                                                >
                                                                    {
                                                                        option.name
                                                                    }
                                                                </span>
                                                                {selected ? (
                                                                    <span
                                                                        className={`${active
                                                                            ? "text-white"
                                                                            : "text-blue-600"
                                                                            }
                                                                        absolute inset-y-0 left-0 flex items-center pl-3`}
                                                                    >
                                                                        <CheckIcon
                                                                            className="h-4 w-4"
                                                                            aria-hidden="true"
                                                                        />
                                                                    </span>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </Listbox.Option>
                                                ))}
                                            </Listbox.Options>
                                        </div>
                                    </Listbox>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
