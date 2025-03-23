import React, { useState } from 'react'
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md"
import DateSelector from '../input/DateSelector'
import ImageSelector from '../input/ImageSelector';
import TagInput from '../input/TagInput';
import uploadImage from '../utils/uploadImage';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import moment from "moment";

const AddOrEditStory = ({ storyInfo, type, onClose, setAllStories ,onDeleteStory}) => {
  const [visitedDate, setVisitedDate] = useState(storyInfo && storyInfo.visitedDate ? new Date(storyInfo.visitedDate) : null);
  const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [story, setStory] = useState(storyInfo?.story || "");
  const [title, setTitle] = useState(storyInfo?.title || "");
  const [error, setError] = useState("");
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
  const updateStory = async () => {
    const storyId = storyInfo._id;



    try {
      let imageUrl = "";
      let postData = {
        title,
        story,
        imageUrl: storyInfo.imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      }
      if (typeof storyImg === "object") {
        const imgUploadRes = await uploadImage(storyImg);
        // Get image URL
        imageUrl = imgUploadRes.imageUrl || "";
        postData = {
          ...postData,
          imageUrl: imageUrl
        };
      }



      const response = await axiosInstance.put("/edit-story/" + storyId, postData);

      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully");
        setAllStories((prevStories) =>
          prevStories.map((s) =>
              s._id === storyId ? response.data.story : s
          )
      );
        

        // ✅ Close modal after 2 seconds
        setTimeout(() => {
            onClose();
        }, 2000);

        getAllStories();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
      else {
        setError("");
      }
    }
  }

  const addNewStory = async () => {
    try {
        let imageUrl = "";

        console.log("Uploading image..."); // ✅ Debugging
        if (storyImg && typeof storyImg === "object") {
            const imgUploadRes = await uploadImage(storyImg);
            imageUrl = imgUploadRes.imageUrl || "";
        } else {
            imageUrl = storyImg;  // Keep existing URL if editing
        }

        console.log("Sending request to add story..."); // ✅ Debugging
        const response = await axiosInstance.post("/add-story", {
            title,
            story,
            imageUrl,
            visitedLocation,
            visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
        });
        console.log("Full API Response:", response.data); 
        if (response.data && response.data.story) {
            console.log("Story added successfully:", response.data.story); // ✅ Debugging

            // ✅ Show toast notification before closing
            toast.success("Story Added Successfully", { autoClose: 2000 });

            // ✅ Update stories instantly without refresh
            setAllStories((prevStories) => [response.data.story, ...prevStories]);

            // ✅ Close modal after 2 seconds
            setTimeout(() => {
                onClose();
            }, 2000);
        }
    } catch (error) {
        console.error("Error adding story:", error);
        console.error("Error details:", error.response?.data || error.message);
        setError(error.response?.data?.message || "An unexpected error occurred");
        setTimeout(() => {
          onClose();
      }, 2000);
    }
};


  const handleAddOrUpdateClick = async () => {
    console.log("Input Data:", { title, storyImg, story, visitedLocation, visitedDate });
    
    if (!title) {
        setError("Please enter the title");
        return;
    }
    if (!story) {
        setError("Please enter the story");
        return;
    }

    setError("");

    if (type === "edit") {
        await updateStory();  // Ensure it's awaited
    } else {
        await addNewStory();  // Ensure it's awaited
    }
};


const handleDeleteStoryImg = async () => {
  try {
      if (!storyInfo?.imageUrl) {
          toast.error("No image found to delete.");
          return;
      }
      console.log("Deleting image:", storyInfo.imageUrl);
      const deleteImgRes = await axiosInstance.delete("/delete-image", {
          params: { imageUrl: storyInfo.imageUrl },
      });
      console.log("Deleting image:", deleteImgRes);
      if (deleteImgRes.status !== 200) {
          toast.error("Failed to delete image");
          return;
      }

      // Update story with no image
      const storyId = storyInfo._id;
      const updatedStoryData = {
          title,
          story,
          visitedLocation,
          visitedDate: moment().valueOf(),
          imageUrl: "",
      };

      const response = await axiosInstance.put(`/edit-story/${storyId}`, updatedStoryData);

      if (response.status === 200) {
          setStoryImg(null); 
          toast.success("Image deleted successfully");
      } else {
          toast.error("Failed to update story");
      }
  } catch (error) {
      toast.error("Error deleting image");
      console.error("Error in handleDeleteStoryImg:", error);
  }
};

  
  return (
    <div className='relative'>
      <div className='flex items-center justify-between '>
        <h5 className='text-xl font-medium text-slate-700'>
          {type === "add" ? "Add Story" : "Update Story"}
        </h5>
      </div>

      <div>
        <div className='w-200 mx-73 flex items-center gap-2 p-3 text-sm font-bold rounded-l-lg'>
          {type === 'add' ?
            <button className="w-40 btn-small flex items-center justify-center" onClick={handleAddOrUpdateClick}>
              <MdAdd className="text-lg" /> ADD STORY
            </button> :
            <div className="flex items-center mx-0">
              <button className="w-40 btn-small flex items-center justify-center" onClick={handleAddOrUpdateClick}>
                <MdUpdate className="text-lg" /> UPDATE STORY
              </button>
              <button className="w-40 btn-small flex items-center justify-center" onClick={handleDeleteClick}>
                <MdDeleteOutline className="text-lg" /> DELETE STORY
              </button>
            </div>}

          <button className="flex items-center justify-center" onClick={onClose}>
            <MdClose className="text-xl text-slate-400 " />
          </button>
        </div>
        {error && (
          <p className='text-red-500 text-xs pt-2 text-right'>{error}</p>
        )}
      </div>

      <div className="">
        <div className="flex-1 flex flex-col gap-2 pt-4">
          <label className='input-label'>Title</label>
          <input type="text" className='text-2xl text-slate-950 outline-none' placeholder='Story of my life' value={title}
            onChange={({ target }) => {
              setTitle(target.value);
            }} />

        </div>
        <div className="my-3">
          <DateSelector date={visitedDate} setDate={setVisitedDate} />
        </div>

        <ImageSelector image={storyImg} setImage={setStoryImg} handleDeleteImg={handleDeleteStoryImg} />
        <div className="flex flex-col mt-4 gap-2">
          <label className="input-label">STORY</label>
          <textarea type="text" className="text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded"
            placeholder='Your Story'
            rows={10}
            value={story}
            onChange={
              ({ target }) => {
                setStory(target.value);
              }
            } />



        </div>
        <div className="pt-3">
          <label className='input-label'>VISITED LOCATIONS</label>
          <TagInput tags={visitedLocation} setTags={setVisitedLocation} />

        </div>
      </div>

    </div>
  )
}

export default AddOrEditStory;