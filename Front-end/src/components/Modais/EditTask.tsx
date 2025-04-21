import { useState } from 'react';
import { useThema } from '../../context/ThemeContext';
import Input from '../InputForm';
import { useForm } from "react-hook-form";
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import api from "../../services/api";
import { useTask } from '../../context/taskContext';
import { toast } from 'react-toastify';

const schema = z.object({
    title: z.string().nonempty('O campo titulo é obrigatótio'),
    description: z.string().nonempty('O campo descrição é obrigatório'),
    dt_limit: z.string().nonempty('O campo data é obrigatótio')
})

type FormData = z.infer<typeof schema>;

function EditTask() {

    const { thema } = useThema();
    const { dispath, editTask, setEditTaskIsOpen, editTaskIsOpen } = useTask();

    const [msgErro, setMsgErro] = useState('');

    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
        defaultValues: {
            title: editTask?.title,
            description: editTask?.description,
            dt_limit: editTask?.dt_limit
        }
    });

    async function onSubmit(data: FormData) {
        try {
            const dataAtual = new Date();
            const dataLimite = new Date(data.dt_limit + "T23:59:59");

            if (dataLimite < dataAtual) {
                setMsgErro('Data não permitida, adicione uma data futura')
                console.log(msgErro)
                return
            }

            if (editTask?.status === 'pendente' && dataLimite > dataAtual && dataLimite != new Date(editTask.dt_limit)) {
                await api.put(`/tasks/${editTask?.id}`, { ...data, status: 'progresso' });
            } else {
                await api.put(`/tasks/${editTask?.id}`, data);
            }

            setMsgErro('');
            setEditTaskIsOpen(false);

            toast.success('Tarefa editada com sucesso!', {
                containerId: 'edit',
                autoClose: 1500,
                position: "bottom-center",
                hideProgressBar: true,
                theme: thema === 'dark' ? 'dark' : 'light',
                style: {
                    color: thema === 'dark' ? '#FFF' : '#121212'
                }
            });
        } catch (err) {
            if (err.response.message) {
                setMsgErro(err.response.message);
            }
        }
        dispath({type: 'setFetch', payload: true})
        if(editTask) dispath({type: 'setUpdatedTask', payload: editTask})
    }

    return (
        <>
            {editTaskIsOpen &&
                <div
                    className="fixed inset-0 bg-black/30 z-60"
                    onClick={() => setEditTaskIsOpen(false)}
                ></div>
            }

            <div className={`w-full flex flex-col sm:w-2/3 lg:w-1/3 h-screen fixed z-60 right-0 top-0 p-2 sm:p-10 shadow-2xl
            border-l-1 transition-all duration-300 ${thema == 'dark' ? 'bg-gray-950' : 'border-zinc-50 bg-zinc-50'}
            ${editTaskIsOpen ? 'translate-x-0' : 'translate-x-full'}
            `}>
                <i
                    onClick={() => setEditTaskIsOpen(false)}
                    className={`fa-solid fa-x cursor-pointer ${thema == 'dark' ? 'text-white' : 'text-black'}`}>
                </i>
                <h1 className={`${thema == 'dark' ? 'text-white' : 'text-black'} text-2xl text-center font-medium`}>
                    Edição de tarefas
                </h1>

                <form className='w-full flex flex-col gap-4'
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <span className={`${thema == 'dark' ? 'text-white' : 'text-black'}`}>*Titulo:</span>

                    <Input
                        type='text'
                        placeholder='Digite o titulo...'
                        name="title"
                        error={errors.title?.message}
                        register={register}
                    />

                    <span className={`${thema == 'dark' ? 'text-white' : 'text-black'}`}>*Descrição:</span>
                    <textarea
                        className={`${thema == 'dark' ? 'bg-gray-900 text-white border-gray-950' : 'bg-white border-gray-300 shadow'} w-full h-30 border-1 border-gray-300 rounded-lg px-2 py-4 outline-0 text-lg resize-none`}
                        placeholder="Adicionar descrição..."
                        {...register('description')}
                    ></textarea>
                    {
                        errors.description && <p className="text-red-600 pl-2 my-1"> * {errors.description?.message}</p>
                    }

                    <span className={`${thema == 'dark' ? 'text-white' : 'text-black'}`}>Data limite para conclusão:</span>

                    <input type='date'
                        className={`${thema == 'dark' ? 'bg-gray-900 text-white border-gray-950' : 'bg-white border-gray-300'} w-full h-10 border-1 rounded-lg shadow px-2 py-4 outline-0 text-lg`}
                        {...register('dt_limit')}
                    />
                    {
                        errors.dt_limit && <p className="text-red-600 pl-2 my-1"> *
                            {errors.dt_limit?.message}</p>
                    }
                    {
                        msgErro && <p className="text-red-600 pl-2 my-1"> *
                            {msgErro}</p>
                    }

                    <button className={`${thema == 'dark' ? 'shadow-gray-950' : 'shadow-gray-300'} shadow rounded-lg px-4 py-2 bg-blue-950 text-white font-medium hover:bg-blue-900 duration-200 cursor-pointer mt-5`}>
                        salvar tarefa
                    </button>
                </form>
            </div>
        </>
    )
}

export default EditTask