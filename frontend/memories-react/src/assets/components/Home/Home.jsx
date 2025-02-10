import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
import StoryCard from "./StoryCard";
import { ToastContainer, toast } from 'react-toastify';
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import AddOrEditStory from "./AddOrEditStory";
import ViewStory from "./ViewStory"
Modal.setAppElement("#root");
const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShown: false,
    data: null,
  });
  // Get User Info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        localStorage.clear();
        navigate("/login"); // Redirect to login
      } else {
        console.error("Error fetching user info:", error);
      }
    }
  };

  //get all stories
  const getAllStories = async () => {
    try {
      const response = await axiosInstance.get("/get-all-stories");
      if (response.data && response.data.stories) {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.error("An unexpected error occurred");
    }
  }

  const handleEdit = (data) => {
    setOpenAddEditModal({
      isShown:true,
      type:"edit",
      data:data
    });
  }

  const handleViewStory = (data) => {
    setOpenViewModal({
      isShown:true,
      data
    })
  };

  const updateIsFavourite = async (storyData) => {
    try {
      console.log(storyData.isFavourite);
      const response = await axiosInstance.patch("/update-is-favourite/" + storyData._id, {
        isFavourite: !storyData.isFavourite
      });

      if (response.data && response.data.story) {
        toast.success("Story updated successfully");
        getAllStories();
      }
    } catch (error) {
      console.error("Error updating favourite status:", error);
    }
  };
  // Fetch user info when component mounts
  useEffect(() => {
    getAllStories();
    getUserInfo();
  }, []);

  return (
    <div>
      <Navbar userInfo={userInfo} />
      {/* <h1>Welcome, {userInfo ? userInfo.fullName : "Guest"}!</h1> */}
      <div className="container mx-auto py-10">
        <div className="flex gap-7">
          <div className="flex-1">
            {allStories.length > 0 ? (
              <div className="grid grid-cols-4 gap-4">
                {allStories.map((item) => (
                  <StoryCard key={item._id}
                    imgUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitedDate}
                    visitedLocation={item.visitedLocation}
                    isFavourite={item.isFavourite}
                    onEdit={() => handleEdit(item)}
                    onClick={() => handleViewStory(item)}
                    onFavouriteClick={() => updateIsFavourite(item)} />
                ))}
              </div>
            ) : (
              <p>No Card here</p>
            )}
          </div>
        </div>
      </div>
      <div className="w-[320px]">{/* Sidebar or Additional Content */}</div>


      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
       
        className="model-box"
      >
        <AddOrEditStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => setOpenAddEditModal({ isShown: false, type: "add", data: null })}
          getAllStories={getAllStories}
        />

      </Modal>

      <Modal
        isOpen={openViewModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999,
          },
        }}
       
        className="model-box"
      >
        
        <ViewStory
          type={openViewModal.type}
          storyInfo={openViewModal.data||null}
          onClose={() => setOpenViewModal({ isShown: false, data: null })}
          // getAllStories={getAllStories}
          onEditClick={()=>{
            setOpenViewModal((prevState)=>({...prevState,isShown:false}));
            handleEdit(openViewModal.data||null);
          }}
        />

      </Modal>


      <button onClick={() => {
        setOpenAddEditModal({ isShown: true, type: "add", data: null });
      }}
        className="w-16 h-16 flex items-center justify-center rounded-full bg-blue-500 hover:bg-cyan-400 fixed right-10 bottom-20">
        <MdAdd className="text-[32px] text-white" />
      </button>
      <ToastContainer />
    </div>
  );
};

export default Home;
