import Task from "./Task";
import { useEffect } from "react";
import { useThema } from "../context/ThemeContext";
import { useTask } from "../context/taskContext";
import api from "../services/api";
import { toast } from 'react-toastify';

function TodoList() {
    const { tasks, fetch, loader, dispath, fetching } = useTask();
    const { thema } = useThema();

    useEffect(() => {
        fetching();
    }, []);

    useEffect(() => {
        if (fetch) {
            fetching();
        }
        dispath({ type: 'setFetch', payload: false });
    }, [fetch]);

    async function handleDelete(id: string) {
        const deleteTask = tasks.find(item => item.id === id);
        const userId = localStorage.getItem('id');

        if (!deleteTask) return console.log('falha');

        const task = {
            id: deleteTask.id,
            title: deleteTask.title,
            description: deleteTask.description,
            dt_limit: deleteTask.dt_limit,
            status: deleteTask.status,
            user: userId
        }

        await api.delete(`tasks/${id}`);
        dispath({ type: 'setFetch', payload: true });

        const undoToast = toast.info(
            <div className="flex items-center gap-4">
                <span className="cursor-default">Tarefa deletada!</span>
                <button className="font-bold border-l-2 px-2 cursor-pointer"
                    onClick={async () => {
                        console.log(task)
                        await api.post('/tasks', task);
                        dispath({ type: 'setFetch', payload: true });
                        toast.dismiss(undoToast);
                    }}
                >
                    Desfazer
                </button>
            </div>,
            {
                containerId: 'desfazer',
                position: "bottom-center",
                autoClose: 4000,
                pauseOnHover: false,
                theme: thema === 'dark' ? 'dark' : 'light',
                style: {
                    color: thema === 'dark' ? '#FFF' : '#121212'
                }
            }
        );
    };

    return (
        <section className='flex flex-col gap-4 w-full my-5 sm:px-30 px-5'>
            {loader ?
                <div className="w-full">
                    <img src="https://www.camarasti.pr.gov.br/templates/site/img/loaders/loader-blue.png" alt="loading"
                        className="animate-spin mx-auto w-30"
                    />
                </div>
                :
                tasks && tasks.length > 0 ?
                    tasks.map(task =>
                        <Task key={task.id} task={task} handleDelete={handleDelete} />
                    )
                    :
                    <p className={`${thema === 'dark' ? 'text-white' : 'text-black'} 
                    mt-10 text-center text-xl font-semibold`}>
                        Você ainda não adicionou nenhuma parefa.
                    </p>
            }
        </section>
    )
}

export default TodoList