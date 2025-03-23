import React from 'react'
import ProfileInfo from './ProfileInfo'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../input/SearchBar'

const Navbar = ({userInfo,searchQuery,setSearchQuery,onSearchNote,handleClearSearch}) => {
    const isToken = localStorage.getItem("token");
    const navigate = useNavigate();
    const onLogout = ()=>{
        localStorage.clear();
        navigate("/login");
    }

    const handleSearch = ()=>{
        if(searchQuery){
            onSearchNote(searchQuery);
        }
    }

    const onClearSearch=()=>{
        handleClearSearch();
        setSearchQuery("");
    }
    return (
        <div className = "bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10">
            <img
                src="https://www.freelogovector.com/wp-content/uploads/2017/06/44%20-%20PNG%20memories%20copy.jpg"
                alt="logo"
                className=" top-4 left-4 h-14 w-auto"
            />

            {/* <p>{userInfo.fullName}</p> */}
            {isToken &&(
                <>
                    <SearchBar value = {searchQuery} onChange={
                        ({target})=>{
                            setSearchQuery(target.value);
                        }
                    }
                    handleSearch={handleSearch}
                    onClearSearch={onClearSearch}
                    />
                    <ProfileInfo userInfo = {userInfo} onLogout = {onLogout}/>
                </>
            )}
            
        </div>
    )
}

export default Navbar