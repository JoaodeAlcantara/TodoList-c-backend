import { useEffect } from "react";
import { useThema } from "../context/ThemeContext";
import Option from "./Option";
import { useTask } from "../context/taskContext";

function FilterTask() {
    const { thema } = useThema();
    const { 
        updatedTask, 
        fetching, 
        searchFilter, 
        statusFilter, 
        orderFilter, 
        dispath 
    } = useTask();

    useEffect(() => {
        const delay = setTimeout(() => {
            dispath({ type: 'setSearchFilter', payload: searchFilter });
            fetching({ title: searchFilter });
        }, 500);

        return () => clearTimeout(delay);
    }, [searchFilter]);

    useEffect(() => {
        fetching({ status: statusFilter, order: orderFilter });
    }, [statusFilter, orderFilter, updatedTask]);

    return (
        <div className={`w-full flex flex-col sm:flex-row sm:px-20 gap-2 sticky inset-0 z-50 p-2 border-b-1 ${thema == 'dark' ? 'bg-gray-900' : 'border-gray-300 bg-white'} `}>
            <div className={`border-1 rounded-lg flex items-center w-full sm:w-1/2 h-10 text-lg px-2 py-4
                ${thema == 'dark' ? ' text-white' : 'border-gray-300'}`}>
                <i className="fa-brands fa-sistrix text-gray-400"></i>
                <input 
                    type="text"
                    placeholder='Pesquise suas tarefas'
                    className='outline-0 px-1 w-full'
                    value={searchFilter}
                    onChange={(e) => dispath({ type: 'setSearchFilter', payload: e.target.value })}
                />
            </div>

            <select 
                name="filter"
                className={`border-1 rounded-lg px-4 py-1 w-full sm:w-[25%] text-lg 
                ${thema == 'dark' ? 'text-white' : 'border-gray-300'}`}
                value={statusFilter}
                onChange={(e) => dispath({ type: 'setStatusFilter', payload: e.target.value })}
            >
                <Option value={'todas'} name={'Todas'} />
                <Option value={'concluida'} name={'concluidas'} />
                <Option value={'progresso'} name={'Em progresso'} />
                <Option value={'pendente'} name={'Pendente'} />
            </select>

            <select 
                name="filter"
                className={`border-1 rounded-lg px-4 py-1 w-full sm:w-[25%] text-lg 
                ${thema == 'dark' ? 'text-white' : 'border-gray-300'}`}
                value={orderFilter}
                onChange={(e) => dispath({ type: 'setOrderFilter', payload: e.target.value })}
            >
                <Option value={'recentes'} name={'Mais Recentes'} />
                <Option value={'asc'} name={'A-Z'} />
                <Option value={'desc'} name={'Z-A'} />
            </select>
        </div>
    )
}

export default FilterTask