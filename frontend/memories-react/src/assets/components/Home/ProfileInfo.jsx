import React from 'react'
import { getInitials } from '../utils/helper'
const ProfileInfo = ({userInfo,onLogout}) => {
  return (
    userInfo&&
    <div className='flex items-center gap-3 '>
        <div className='w-13 h-13 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100'>
           {getInitials(userInfo?userInfo.fullName:"")}
        </div>
        <div>
            <p className='text-sm font-medium '>{userInfo.fullName||""}</p>
            <button  className='text-sm text-slate-750 underline' onClick={onLogout}>Logout</button>
        </div>
    </div>
  )
}

export default ProfileInfo