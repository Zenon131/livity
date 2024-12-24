// import { useEffect } from 'react';
import { Link } from 'react-router-dom';
// import { Button } from '../ui/button';
// import { useLogoutAccMutation } from '@/lib/react-query/queriesAndMutations';
import { useUserContext } from '@/context/authContext';


const Topbar = () => {
    // const { mutate: logout, isSuccess } = useLogoutAccMutation();
    const { user } = useUserContext();
    // const navigate = useNavigate();
    
    // const [currentUser, setCurrentUser] = useState(null);

    // useEffect(() => {
    //     const fetchCurrentUser = async () => {
    //         const user = await getCurrentUser();
    //         setCurrentUser(user);
    //     };
    //     fetchCurrentUser();
    // }, []);

    // useEffect(() => {
    //     if (isSuccess) {
    //         navigate('/login'); // Navigate to login page or another route after logout
    //     }
    // }, [isSuccess, navigate]);

    return (
        <section className="topbar">
            <div className="flex-between py-4 px-5">
                <Link to="/" className="flex gap-3 items-center" title="Go to Home">
                    <img src="/assets/images/bashmnt2.svg" alt="Bashmnt Logo" width={120} height={220} />
                </Link>
                <div className="flex gap-4">
                    {/* <Button variant="ghost" className="shad-button_ghost" onClick={() => logout()}>
                        <img src="/assets/icons/box-arrow-left.svg" className="invert-white" width={24} alt="logout" />
                    </Button> */}
                    {user && (
                        <Link to={`/profile/${user.id}`} className="flex-center gap-3">
                            <img
                                src={user.imgurl || '/assets/icons/profile-placeholder.svg'}
                                alt="profile"
                                className="h-8 w-8 rounded-full"
                            />
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
};

export default Topbar;
