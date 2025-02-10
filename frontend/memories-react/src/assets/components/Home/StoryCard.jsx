import React from "react";
import { FaHeart } from "react-icons/fa6";
import { GrMapLocation } from "react-icons/gr";
const StoryCard = ({
    imgUrl,
    title,
    story,
    date,
    visitedLocation,
    isFavourite,
    onEdit,
    onClick,
    onFavouriteClick,
}) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md cursor-pointer" onClick={onClick}>
            <img
                src={imgUrl}
                alt={title}
                className="w-full h-55 object-cover rounded-lg"
            />
            <h3 className="text-lg font-semibold mt-2">{title}</h3>
            <p className="text-gray-600 text-sm">{story?.slice(0, 60)}</p>
            <p className="text-gray-500 text-xs mt-1">
                {new Date(date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric"
                })}
            </p>
            <div className="flex items-center gap-1 text-blue-500 text-xs flex-wrap">
                {visitedLocation.map((location, index) => (
                    <span key={index} className="flex items-center gap-1">
                        <GrMapLocation className="text-base" />
                        {location}
                    </span>
                ))}
            </div>

            <div className="flex justify-between mt-3">
                <button
                    className="text-blue-500 text-sm underline"
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering onClick
                        onEdit();
                    }}
                >
                    Edit
                </button>

                <button
                    className={`text-sm ${isFavourite ? "text-red-500" : "text-gray-400"}`}
                    style={
                        {cursor:"pointer"}
                    }
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering parent onClick
                        onFavouriteClick();
                    }}
                >
                    <FaHeart className={`text-lg ${isFavourite ? "fill-red-500" : "fill-gray-400"}`} />
                </button>
            </div>
        </div>
    );
};
export default StoryCard;
