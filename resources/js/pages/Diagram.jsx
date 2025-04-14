import React from "react";
import { useParams } from "react-router-dom";

export default function Diagram() {
    const { type } = useParams();
    const [svgUrl, setSvgUrl] = React.useState("");

    React.useEffect(() => {
        fetch(`/api/diagram/${type}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.url) setSvgUrl(data.url);
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
