import Cadastrar from "../components/Cadastrar";
import Logar from "../components/Logar"
import { useState } from "react"

export type ViewData = 'login' | 'cadastrar' | 'trocar'

function Login() {

    const [view, setView] = useState<ViewData>('login');

    return (
        <>
            <div className="flex">
                <div className="hidden lg:flex flex-col gap-4 md:w-1/2 h-screen bg-blue-950 items-center justify-center relative">
                    <div className="maskBottomGradient w-full absolute top-0">
                        <img
                            src="https://www.highgear.com/wp-content/uploads/2022/12/why-is-task-management-important-1.jpg" alt=""
                            className=" w-full"
                        />
                    </div>

                    <h1 className="mt-10 text-center md:text-5xl lg:text-5xl text-zinc-200 font-bold absolute z-10 bottom-30">
                        Bem-Vindo
                    </h1>
                </div>

                {
                    view==='login' ? 
                    <Logar setView={setView}/>
                    : 
                    view==='cadastrar' ?
                    <Cadastrar setView={setView}/>
                    : 
                    ''
                }

                
            </div>
        </>
    )
}

export default Login
