import { bottombarLinks } from '@/constants'
import { INavLink } from '@/types'
import { Link, useLocation }from 'react-router-dom'

const Bottombar = () => {
  const { pathname } = useLocation()
  return (
    <section className='bottom-bar fixed bottom-0 z-50 w-full bg-dark-2 md:hidden'>
      {bottombarLinks.map((link: INavLink) => {
                        const isActive = pathname === link.route
                        return (
                            <Link to={link.route} className={`${isActive && 'bg-primary-500 rounded-[10px]'} flex-center flex-col gap-1 p-2 transition`}>
                                <img className={`${isActive ? 'invert-white' : ''}`} src={link.imgURL} alt={link.label} width={16} height={16}/>
                                <p className='tiny-medium text-light-2'>{link.label}</p>
                            </Link>
                    )
                    })}
    </section>
  )
}

export default Bottombar