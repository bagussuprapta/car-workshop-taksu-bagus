import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { useAuth } from "../contexts/AuthProvider";
import Proposals from "./admin/Proposals";
import Users from "./admin/Users";
import Service from "./admin/Service";
import Job from "./mechanic/Job";
import MyCar from "./customer/MyCar";
import ServiceHistory from "./customer/ServiceHistory";

function Navbar() {
    const { authenticatedUser, logout } = useAuth();
    if (!authenticatedUser) return null;

    const { role, name } = authenticatedUser;
    const initial = name?.charAt(0).toUpperCase() || "";

    const formatRoleName = (role) => {
        return role
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const navItemsByRole = {
        admin: [
            { label: "Dashboard", component: <Dashboard /> },
            { label: "Users", component: <Users /> },
            { label: "Proposals", component: <Proposals /> },
            { label: "Service", component: <Service /> },
        ],
        mechanic: [
            { label: "Jobs", component: <Job /> },
            { label: "Schedule", component: <Schedule /> },
            { label: "Parts", component: <Parts /> },
        ],
        car_owner: [
            { label: "Home", component: <Home /> },
            { label: "My Cars", component: <MyCar /> },
            { label: "Service History", component: <ServiceHistory /> },
        ],
    };

    const items = navItemsByRole[role] || [];

    return (
        <TabGroup>
            <div className="w-full px-6 py-4 relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm">
                        {initial}
                    </div>
                    <div className="leading-tight">
                        <p className="text-sm font-medium">{name}</p>
                        <p className="text-xs text-gray-400">
                            {formatRoleName(role)}
                        </p>
                    </div>
                </div>

                <TabList className="absolute left-1/2 transform -translate-x-1/2 flex gap-4 bg-black text-white px-3 py-2 rounded-full shadow-md">
                    {items.map((item, idx) => (
                        <Tab
                            key={idx}
                            className={({ selected }) =>
                                `text-sm px-4 py-1 rounded-full transition focus:outline-none cursor-pointer ${selected
                                    ? "bg-white text-black"
                                    : "hover:bg-white hover:text-black text-white"
                                }`
                            }
                        >
                            {item.label}
                        </Tab>
                    ))}
                </TabList>

                <button
                    onClick={logout}
                    className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded-full transition cursor-pointer"
                >
                    Logout
                </button>
            </div>

            <TabPanels>
                {items.map((item, idx) => (
                    <TabPanel key={idx} className="p-4">
                        {item.component}
                    </TabPanel>
                ))}
            </TabPanels>
        </TabGroup>
    );
}

export default Navbar;

function Dashboard() {
    return (
        <div className="text-center text-sm mt-2">
            <h3 className="text-sm border border-black w-fit px-3 py-1 rounded-full mx-auto">
                Dashboard
            </h3>
            <p className="mt-4 text-gray-500 text-xs">
                If content data does not appear, it is still under development.{" "}
                <br />
                Please check other menus to explore more features. <br />
                Or log in as a different role. <br />
                Or maybe this requirement is not included in the current
                implementation.
            </p>
        </div>
    );
}

function Schedule() {
    return (
        <div className="text-center text-sm mt-2">
            <h3 className="text-sm border border-black w-fit px-3 py-1 rounded-full mx-auto">
                Schedule
            </h3>
            <p className="mt-4 text-gray-500 text-xs">
                If content data does not appear, it is still under development.{" "}
                <br />
                Please check other menus to explore more features. <br />
                Or log in as a different role. <br />
                Or maybe this requirement is not included in the current
                implementation.
            </p>
        </div>
    );
}

function Parts() {
    return (
        <div className="text-center text-sm mt-2">
            <h3 className="text-sm border border-black w-fit px-3 py-1 rounded-full mx-auto">
                Parts
            </h3>
            <p className="mt-4 text-gray-500 text-xs">
                If content data does not appear, it is still under development.{" "}
                <br />
                Please check other menus to explore more features. <br />
                Or log in as a different role. <br />
                Or maybe this requirement is not included in the current
                implementation.
            </p>
        </div>
    );
}

function Home() {
    return (
        <div className="text-center text-sm mt-2">
            <h3 className="text-sm border border-black w-fit px-3 py-1 rounded-full mx-auto">
                Home
            </h3>
            <p className="mt-4 text-gray-500 text-xs">
                If content data does not appear, it is still under development.{" "}
                <br />
                Please check other menus to explore more features. <br />
                Or log in as a different role. <br />
                Or maybe this requirement is not included in the current
                implementation.
            </p>
        </div>
    );
}
