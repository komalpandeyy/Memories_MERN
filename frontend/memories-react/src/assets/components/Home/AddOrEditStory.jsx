import React, { useState } from 'react'
import { MdAdd, MdDeleteOutline, MdUpdate, MdClose } from "react-icons/md"
import DateSelector from '../input/DateSelector'
import ImageSelector from '../input/ImageSelector';
import TagInput from '../input/TagInput';
import uploadImage from '../utils/uploadImage';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import moment from "moment";

const AddOrEditStory = ({ storyInfo, type, onClose, getAllStories }) => {
  const [visitedDate, setVisitedDate] = useState(storyInfo && storyInfo.visitedDate ? new Date(storyInfo.visitedDate) : null);
  const [visitedLocation, setVisitedLocation] = useState(storyInfo?.visitedLocation || []);
  const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);
  const [story, setStory] = useState(storyInfo?.story || null);
  const [title, setTitle] = useState(storyInfo?.title || null);
  const [error, setError] = useState("");

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

        // Refresh stories
        getAllStories();

        // Close modal or form
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
      else {
        setError("an unexpected error occurred");
      }
    }
  }

  const addNewStory = async () => {
    try {
      let imageUrl = "";
      if (storyImg) {
        const imgUploadRes = await uploadImage(storyImg);
        // Get image URL
        imageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post("/add-story", {
        title,
        story,
        imageUrl: imageUrl || "",
        visitedLocation,
        visitedDate: visitedDate
          ? moment(visitedDate).valueOf()
          : moment().valueOf(),
      });

      if (response.data && response.data.story) {
        toast.success("Story Added Successfully");

        // Refresh stories
        getAllStories();

        // Close modal or form
        onClose();
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      }
      else {
        setError("an unexpected error occurred");
      }
    }
  }

  const handleAddOrUpdateClick = async () => {
    console.log("Input Data : ", { title, storyImg, story, visitedLocation, visitedDate });
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
      updateStory();
    }
    else {
      addNewStory();
    }
  }

  const handleDeleteStoryImg = () => {
    setStoryImg(null);
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
              <button className="w-40 btn-small flex items-center justify-center" onClick={handleAddOrUpdateClick}>
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