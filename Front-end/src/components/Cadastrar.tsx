import Input from "./InputForm";
import { useState, SetStateAction } from "react";
import { useThema } from "../context/ThemeContext";
import { ViewData } from "../Views/Login";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from "../services/api";

interface ViewProps {
    setView: React.Dispatch<SetStateAction<ViewData>>;
}

const schema = z.object({
    name: z.string().nonempty('O campo nome é obrigatótio'),
    email: z.string().email('Insira um email valido').nonempty('O campo email é obrigatório'),
    password: z.string().min(6, 'A senha precisa conter pelo menos 6 caracteres').nonempty('O campo senha é obrigatótio')
})

type FormData = z.infer<typeof schema>

interface ViewProps {
    setView: React.Dispatch<SetStateAction<ViewData>>;
}

function Cadastrar({ setView }: ViewProps) {

    const { thema } = useThema();
    const [verSenha, setVerSenha] = useState(false);
    const [msgErro, setMsgErro] = useState('')
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
    })

    async function onSubmit(data: FormData) {
        try{
            await api.post('/cadastrar', data);

            setMsgErro('');
            setView('login')
        } catch (err) {
            if (err.response.data.message) {
                setMsgErro(err.response.data.message);
            } else {
                setMsgErro("Erro ao fazer login");
            }
        }
    }

    return (
        <div className={`w-full lg:w-1/2 h-screen flex flex-col justify-center
            ${thema == 'dark' ? 'bg-gray-800' : 'bg-zinc-50'}
            `}>

            <form onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col px-5 lg:px-20 items-center justify-center gap-8 mt-6">
                <div className="w-full relative group">
                    <label className={` px-2 text-xl ${thema == 'dark' ? 'text-white' : 'text-black'}`}>Nome:</label>

                    <Input
                        placeholder="Digite seu nome..."
                        type="text"
                        name="name"
                        error={errors.name?.message}
                        register={register}
                    />
                </div>
                <div className="w-full relative group">
                    <label className={` px-2 text-xl ${thema == 'dark' ? 'text-white' : 'text-black'}`}>Email:</label>

                    <Input
                        placeholder="Digite seu email..."
                        type="email"
                        name="email"
                        error={errors.email?.message}
                        register={register}
                    />
                </div>
                <div className="w-full relative group">
                    <label className={` px-2 text-xl ${thema == 'dark' ? 'text-white' : 'text-black'}`}>Senha:</label>

                    <div className="relative w-full flex flex-col">
                        <Input
                            placeholder="********"
                            type={verSenha ? 'text' : 'password'}
                            name="password"
                            error={errors.password?.message}
                            register={register}
                        />

                        <button className="absolute z-20 right-2 top-2 text-white"
                        type="button"
                            onClick={() => setVerSenha(!verSenha)}
                        >
                            {verSenha ?
                                <i className={`fa-solid fa-eye-slash 
                                ${thema == 'dark' ? 'text-white' : 'text-black'}`}
                                ></i>
                                :
                                <i className={`fa-solid fa-eye 
                                ${thema == 'dark' ? 'text-white' : 'text-black'}`}
                                ></i>}
                        </button>
                    </div>
                </div>

                {
                    msgErro && <p className="text-red-600 pl-2 my-1">* {msgErro}</p>
                }

                <div className=" mt-4 flex flex-col items-center justify-center gap-2">

                    <button className={`w-full shadow rounded-lg px-8 py-2 bg-blue-950 text-white font-medium hover:bg-blue-900 duration-200 cursor-pointer text-center ${thema == 'dark' ? 'shadow-gray-900' : 'shadow-gray-300'}`}
                    type="submit"
                    >
                        Cadastrar
                    </button>

                    <button
                        onClick={() => setView('login')}
                        className={`${thema == 'dark' ? 'text-zinc-300' : 'text-zinc-500'} cursor-pointer`}>
                        Já tem conta? Faça login
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Cadastrar