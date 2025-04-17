import { useState, useEffect } from "react";
import { useThema } from "../context/ThemeContext";
import Option from "./Option";
import api from "../services/api";
import { useTask } from "../context/taskContext";

interface paramsType {
    title: string | null;
    status: string | null;
    order: string | null;
}

function FilterTask() {

    const { thema } = useThema();
    const { setTasks, tasks, idTask } = useTask();
    const [search, setSearch] = useState('');
    const [status, setStatus] = useState('todas');
    const [order, setOrder] = useState('recentes');
    const task = tasks.find(item => item.id === idTask);

    useEffect(() => {
        const delay = setTimeout(() => {
            fetching()
        }, 500)

        return () => clearTimeout(delay);
    }, [search]);

    useEffect(() => {
        fetching()
    }, [status, order, task]);

    async function fetching() {
        const userId = localStorage.getItem('id');
        const token = localStorage.getItem('token');

        const params: paramsType = { title: null, status: null, order: null };

        if (search) params.title = search.toLowerCase();
        if (status && status !== 'todas') params.status = status;
        if (order && order !== 'recentes') params.order = order;

        const resp = await api.get(`/tasks/user/${userId}/filter`, {
            params,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        setTasks(resp.data);
    }

    return (
        <>
            <div className={`w-full flex flex-col sm:flex-row sm:px-20 gap-2 sticky inset-0 z-50 p-2 border-b-1 ${thema == 'dark' ? 'bg-gray-900' : 'border-gray-300 bg-white'} `}>

                <div className={`border-1 rounded-lg flex items-center w-full sm:w-1/2 h-10 text-lg px-2 py-4
                    ${thema == 'dark' ? ' text-white' : 'border-gray-300'}`}>
                    <i className="fa-brands fa-sistrix text-gray-400"></i>
                    <input type="text"
                        placeholder='Pesquise suas tarefas'
                        className='outline-0 px-1 w-full'
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <select name="filter"
                    className={`border-1 rounded-lg px-4 py-1 w-full sm:w-[25%] text-lg 
                    ${thema == 'dark' ? 'text-white' : 'border-gray-300'}`}
                    onChange={(e) => setStatus(e.target.value)}
                >

                    <Option value={'todas'} name={'Todas'} />
                    <Option value={'concluida'} name={'concluidas'} />
                    <Option value={'progresso'} name={'Em progresso'} />
                    <Option value={'pendente'} name={'Pendente'} />
                </select>

                <select name="filter"
                    className={`border-1 rounded-lg px-4 py-1 w-full sm:w-[25%] text-lg ${thema == 'dark' ? 'text-white' : 'border-gray-300'}`}
                    onChange={(e) => setOrder(e.target.value)}
                >
                    <Option value={'recentes'} name={'Mais Recentes'} />
                    <Option value={'asc'} name={'A-Z'} />
                    <Option value={'desc'} name={'Z-A'} />
                </select>
            </div>
        </>
    )
}

export default FilterTask