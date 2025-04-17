import { useThema } from "../context/ThemeContext";
import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputProps {
    type: string;
    name: string;
    placeholder: string;
    register: UseFormRegister<any>;
    error?: string;
    rules?: RegisterOptions
}

function Input({ name, type, placeholder, register, rules, error }: InputProps) {
    const { thema } = useThema();

    return (
        <>
            <input
                className={`${thema == 'dark' ? 'bg-gray-900 text-white border-gray-950' : 'bg-white border-gray-300'} w-full h-10 border-1 rounded-lg shadow px-2 py-4 outline-0 text-lg`}
                placeholder={placeholder}
                type={type}
                {...register(name, rules)} 
                id={name}
            />
            {error && <p className="text-red-600 pl-2 my-1"> * {error}</p>}
        </>
    );
}

export default Input;