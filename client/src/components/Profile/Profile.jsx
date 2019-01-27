import React from 'react'
import Userinfo from './Userinfo';
import UserRecipes from './UserRecipes';

import withAuth from '../withAuth';

const Profile = ({ session }) => {
  return (
    <div className="App">
      <Userinfo session={session} />
      <UserRecipes username={session.getCurrentUser.username} />
    </div>
  )
}

export default withAuth(session => session && session.getCurrentUser)(Profile)
