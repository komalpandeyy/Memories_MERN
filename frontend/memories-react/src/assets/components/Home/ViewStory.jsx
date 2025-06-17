import React from 'react';
import { MdDeleteOutline, MdDateRange, MdUpdate, MdClose, MdLocationOn } from "react-icons/md";
import moment from "moment";

const ViewStory = ({ onClose, storyInfo,onEditClick,onDeleteStory }) => {
    if (!storyInfo) return null; // Ensure storyInfo is available

    const handleDeleteClick = () => {
        console.log("Deleting Story:", storyInfo);  // Debugging Log
        if (!storyInfo?._id) {
            console.error("Story ID is missing!");
            return;
        }
        if (window.confirm("Are you sure you want to delete this story?")) {
            onDeleteStory(storyInfo._id);
        }
    };
    

    return (
        <div className="relative bg-white p-6 rounded-lg shadow-lg max-w-lg mx-auto">
            {/* Top Buttons */}
            <div className="flex items-center justify-between mb-4">
                <h5 className="text-xl font-medium text-slate-700 px-8">View Story</h5>
                <div className="flex space-x-2">
                    <button className="px-2 w-40 btn-small flex items-center justify-center" onClick={onEditClick}>
                        <MdUpdate className="text-lg" /> UPDATE STORY
                    </button>
                    <button className="px-2 w-40 btn-small flex items-center justify-center" onClick={handleDeleteClick}>
                        <MdDeleteOutline className="text-lg" /> DELETE STORY
                    </button>
                    <button className="flex items-center justify-center" onClick={onClose}>
                        <MdClose className="text-xl text-slate-400" />
                    </button>
                </div>
            </div>



            {/* Visited Locations */}
            <h2 className="text-2xl font-bold text-gray-900">{storyInfo.title}</h2>

            <div className="mt-4 flex items-center">
                <MdDateRange className="text-blue-500 text-lg mr-2" />
                <span className="text-gray-700 text-sm">
                    {storyInfo.visitedDate ? moment(storyInfo.visitedDate).format("MMMM Do, YYYY") : "No date provided"}
                </span>
            </div>

            {/* Story Image */}
            {storyInfo.imageUrl && (
                <div className="mt-4">
                    <img src={storyInfo.imageUrl} alt="Story" className="w-full rounded-lg shadow-md" />
                </div>
            )}

            {/* Story Content */}
            <div>
                
                <p className="mt-2 text-gray-700">{storyInfo.story}</p>
            </div>

            <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-800">Visited Locations</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                    {storyInfo.visitedLocation?.map((location, index) => (
                        <span key={index} className="flex items-center bg-blue-100 px-3 py-1 rounded-full text-sm text-blue-800">
                            <MdLocationOn className="mr-1" /> {location}
                        </span>
                    ))}
                </div>
            </div>

            
        </div>
    );
};

export default ViewStory;
