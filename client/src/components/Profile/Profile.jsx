import React from 'react'
import Userinfo from './Userinfo';

const Profile = ({ session }) => {
  return (
    <div className="App">
      <Userinfo session={session} />
    </div>
  )
}

export default Profile
