
import { Outlet, Navigate } from 'react-router-dom'

function AuthLayout() {
  const isAuthenticated = false
  return (
    <>
      {
        !isAuthenticated ? (
          <>
          
          <section className='flex flex-1 justify-center items-center flex-col py-10 px-10'>
            <Outlet />
          </section>

          <img 
          alt="side-image" 
          src="/assets/icons/livity.svg" 
          className='hidden xl:block h-screen w-1/2 object-cover bg-no-repeat'
          />

          </>
          
        ) : (
          <Navigate to='/' />
        )
      }
    </>
  )
}

export default AuthLayout