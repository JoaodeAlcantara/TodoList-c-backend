import React from 'react';
import { useNavigate } from "react-router-dom"
import { useThema } from '../context/ThemeContext';
import { toast } from 'react-toastify';

type StateProps = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function Header({ isOpen, setIsOpen }: StateProps) {

    const { thema, setThema } = useThema();
    const navigate = useNavigate()

    function logout() {
        const undoToast = toast.info(
            <div className="flex items-center justify-between gap-5">
                <span className="cursor-default">Deseja sair conta?</span>
                <button className="font-bold border-l-2 pl-4 cursor-pointer"
                    onClick={() => {
                        toast.dismiss(undoToast);
                        localStorage.removeItem('token');
                        localStorage.removeItem('id');
                        navigate('/')
                    }}
                >
                    Sim
                </button>
            </div>,
            {
                containerId: 'logout',
                position: "top-center",
                autoClose: 4000,
                pauseOnHover: false,
                theme: thema === 'dark' ? 'dark' : 'light',
                style: {
                    color: thema === 'dark' ? '#FFF' : '#121212'
                }
            }
        );
    }
    return (
        <div className={`w-full border-b-1 
        ${thema == 'dark' ?
                'bg-gray-900 border-black' :
                'border-gray-300 bg-zinc-50'
            }
        `}>

            <header className="flex flex-col w-full sm:px-30 sm:flex-row justify-between py-4 px-2 gap-2">
                <h1 className={`text-3xl font-semibold text-center ${thema == 'dark' ? 'text-white' : 'text-black'}`}>
                    Minhas Atividades
                </h1>

                <div className=' flex gap-4 w-full sm:w-fit justify-between'>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`flex w-fit items-center gap-2 font-medium rounded-lg py-2 px-2 cursor-pointer hover:scale-105 duration-200 
                        ${thema == 'dark' ? 'bg-gray-950 text-white'
                                : 'bg-zinc-200'}`}>
                        <i className="fa-solid fa-plus"></i>
                        Nova terefa
                    </button>

                    <button onClick={logout}
                        className={`flex w-fit items-center gap-2 font-medium rounded-lg py-2 px-2 cursor-pointer hover:scale-105 duration-200 
                            ${thema == 'dark' ? 'bg-gray-950 text-white'
                                : 'bg-zinc-200'}`}>
                        <i className="fa-solid fa-right-from-bracket px-2"></i>
                        Logout
                    </button>

                    <button onClick={() =>
                        setThema(thema === 'dark' ? 'light' : 'dark')
                    }
                        className='text-2xl pl-2 -rotate-10 hover:scale-110 duration-300'
                    >
                        {
                            thema == 'dark' ?
                                <i className={`fa-solid fa-sun hover:rotate-180 duration-300 ${thema == 'dark' ? 'text-white' : 'text-black'}`}></i>
                                :
                                <i className="fa-solid fa-moon hover:-rotate-40 duration-300"></i>
                        }
                    </button>
                </div>
            </header>
        </div>
    )
}

export default Header