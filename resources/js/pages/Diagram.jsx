import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function Diagram() {
    const { type } = useParams();
    const [svgUrl, setSvgUrl] = React.useState("");

    React.useEffect(() => {
        axios
            .get(`/api/diagram/${type}`)
            .then((response) => {
                if (response.data.url) setSvgUrl(response.data.url);
            })
            .catch((error) => {
                console.error("Error fetching diagram:", error);
            });
    }, [type]);

    if (!svgUrl) return <p>Loading...</p>;

    return (
        <div className="p-4 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-4 text-center">
                Diagram: {type.toUpperCase()}
            </h1>
            <div className="max-w-[600px] w-full">
                <img
                    src={svgUrl}
                    alt={`${type} diagram`}
                    className="mx-auto w-full h-auto"
                />
            </div>
        </div>
    );
}
