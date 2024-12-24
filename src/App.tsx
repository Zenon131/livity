import { Routes, Route} from 'react-router-dom'
import './globals.css'
import LoginForm from './_auth/forms/LoginForm'
import { Community, CreateCommunity, CreatePost, Explore, Home, Profile, UpdateProfile} from './_root/pages'
import RegForm from './_auth/forms/RegForm'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'
import { Toaster } from './components/ui/toaster'
import PostDetails from './_root/pages/PostDetails'
import Vibes from './_root/pages/Harmony'
import Communities from './_root/pages/Topics'



function App() {
  return (
    <main className='flex h-screen'>
      <Routes>

        {/* Public Routes */}
        <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegForm />} />
        </Route>


        {/* Private Routes */}
        <Route element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/create-community" element={<CreateCommunity />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/community/:id" element={<Community />} />
            <Route path="/post/:id" element={<PostDetails />} />
            <Route path="/profile/:id/*" element={<Profile />} />
            <Route path="/update-profile/:id/" element={<UpdateProfile />} />
            <Route path="/harmony" element={<Vibes />} />
            <Route path="/topics" element={<Communities />} />

        </Route>
        
        {/* Catch-all route for handling 404 errors */}
        <Route path="*" element={<div>404 Not Found</div>} />
        

      </Routes>

      <Toaster />
    </main>
  )
}

export default App