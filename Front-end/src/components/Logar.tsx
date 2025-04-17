import Input from "./InputForm";
import { SetStateAction, useState } from "react";
import { useThema } from "../context/ThemeContext";
import { ViewData } from "../Views/Login";
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from "../services/api";
import { useNavigate } from "react-router";

interface ViewProps {
    setView: React.Dispatch<SetStateAction<ViewData>>;
}

const schema = z.object({
    email: z.string().email('Insira um email valido').nonempty('O campo email é obrigatório'),
    password: z.string().nonempty('O campo senha é obrigatótio')
})

type FormData = z.infer<typeof schema>

function Logar({ setView }: ViewProps) {

    const { thema } = useThema();
    const navigate = useNavigate();
    const [verSenha, setVerSenha] = useState(false);
    const [msgErro, setMsgErro] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
    })

    async function onSubmit(data: FormData) {
        try {
            const resp = await api.post('/login', data);
            const token = resp.data.token;

            localStorage.setItem('token', token);
            localStorage.setItem('id', resp.data.id);

            setMsgErro('');
            navigate('/Home')
        } catch (err) {
            if (err.response.data.message) {
                setMsgErro(err.response.data.message);
            } else {
                setMsgErro("Erro ao fazer login");
            }
        }
    }

    return (
        <div className={`w-full lg:w-1/2 h-screen flex flex-col 
            ${thema == 'dark' ? 'bg-gray-800' : 'bg-zinc-50'}
            `}>

            <div className="flex items-center justify-center mt-10">
                <img src="https://www.computerhope.com/jargon/t/task.png" alt="Livro"
                    className="rounded-full w-60"
                />
            </div>
            <form onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col px-5 lg:px-20 items-center justify-center gap-8 mt-6">
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
                    msgErro && <p className="text-red-600 pl-2">* {msgErro}</p>
                }

                <div className=" mt-4 flex flex-col items-center justify-center gap-4">
                    <span className={`${thema == 'dark' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                        Esqueceu a senha?
                    </span>

                    <button className={`w-full shadow rounded-lg px-4 py-2 bg-blue-950 text-white font-medium hover:bg-blue-900 duration-200 cursor-pointer text-center ${thema == 'dark' ? 'shadow-gray-900' : 'shadow-gray-300'}`}
                    type="submit"
                    >
                        Logar
                    </button>
                    <button
                        onClick={() => setView('cadastrar')}
                        className={`${thema == 'dark' ? 'text-zinc-300' : 'text-zinc-500'} cursor-pointer`}>
                        Não tem conta? Cadastre-se
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Logar