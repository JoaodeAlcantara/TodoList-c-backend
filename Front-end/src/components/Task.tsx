import { SetStateAction, useState } from "react";
import Menu from "./Modais/Menu";
import { useThema } from "../context/ThemeContext";
import api from "../services/api";
import { useTask } from "../context/taskContext";


interface TaskProps {
    task: {
        id: string,
        title: string,
        description: string,
        status: string,
        dt_limit: string
    }
    setFetch: React.Dispatch<SetStateAction<boolean>>;
    handleDelete: (id: string) => void;
}

function Task({ task, setFetch, handleDelete }: TaskProps) {

    const checked = task.status === 'progresso' || task.status === 'pendente' ? false : true;
    const dateFormated = new Date(task.dt_limit + "T23:59:59").toLocaleDateString('pt-BR')
    const [openMenu, setOpenMenu] = useState(false);
    const { thema } = useThema();
    const { setIdTask } = useTask();

    async function handleChecked(id: string) {
        if (task.status === 'pendente') return;

        const today = new Date();

        if(new Date(task.dt_limit + "T23:59:59") < today && task.status === 'concluida') return;

        setIdTask(id);
        const status = checked ? 'progresso' : 'concluida';
        await api.put(`/tasks/${id}`, { status });

        setFetch(true)
    }

    

    return (
        <>
            <div
                className={`${thema == 'dark' ? 'bg-gray-900' : 'bg-zinc-50  border-zinc-200'} relative border-1 rounded-lg shadow p-4`}
            >

                {
                    openMenu && (
                        <Menu openMenu={openMenu} setOpenMenu={setOpenMenu} handleDelete={handleDelete} task={task} />
                    )
                }
                <div className="flex flex-col sm:flex-row justify-between">
                    <h1 className={`text-2xl font-medium break-all
                    ${thema == 'dark' ? checked ? 'line-through text-zinc-400' : 'text-white' : checked ? 'line-through text-zinc-600' : 'text-black'} 
                    ${task.status === 'pendente' ? 'text-zinc-400' : ''}
                    `}>
                        {task.title}
                    </h1>

                    <div className="flex items-center gap-2 w-full justify-between sm:w-fit">
                        <div className={`flex items-center gap-1
                            ${task.status == 'progresso' ? 'bg-blue-600'
                                : task.status == 'concluida' ? 'bg-green-500'
                                    : 'bg-red-500'
                            }
                            px-2 py-1 rounded-lg cursor-default`}>
                            <span className="text-md font-medium">
                                {
                                    task.status === 'progresso' ?
                                        'em progresso'
                                        : task.status
                                }
                            </span>
                        </div>

                        <button
                            onClick={() => setOpenMenu(!openMenu)}
                            className={`
                            ${thema == 'dark' ?
                                    'hover:bg-gray-800'
                                    :
                                    'hover:bg-zinc-300'} 
                            h-8 w-8 rounded-full cursor-pointer duration-200`}>
                            <i
                                className={`fa-solid fa-ellipsis-vertical text-xl pt-1 
                            ${thema == 'dark' ? 'text-white' : 'text-black'}`}></i>
                        </button>
                    </div>
                </div>
                <div className={`pt-2 w-full text-xl mt-4 sm:mt-2 pr-2 break-words
                    ${thema == 'dark' ? checked ? 'line-through text-zinc-400' : 'text-white' :
                        checked ? 'line-through text-zinc-600' : 'text-black'}
                        ${task.status === 'pendente' ? 'text-zinc-400' : ''}
                    `}>
                    {task.description}
                </div>

                <hr className="my-2 text-zinc-400" />

                <div className="flex justify-between">
                    <p className={`${thema == 'dark' ? 'text-zinc-400' : 'text-zinc-600'}`}>
                        Data limite: <span className={`${task.status == 'pendente' ? 'text-red-600 font-semibold' : ''}`}> {dateFormated} </span>
                    </p>
                    <button
                        className={`${checked ? 'bg-emerald-600' : 'bg-zinc-400 '} px-2 py-1 rounded-lg cursor-pointer`}
                        onClick={() => handleChecked(task.id)}
                    >
                        {
                            checked ? 
                            <i className="fa-solid fa-check-double"></i>
                            : 
                            <i className="fa-solid fa-check opacity-50"></i>
                        }
                    </button>
                </div>
            </div >
        </>
    )
}

export default Task