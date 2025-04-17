import { useThema } from "../context/ThemeContext";

interface OptionProps extends React.OptionHTMLAttributes<HTMLOptionElement>{
    name: string
}

function Option({name, value, ...props} : OptionProps) {

    const { thema } = useThema()

    return (
        <option value={value}
            className={`${thema == 'dark' ? 'bg-gray-800' : 'bg-white'}`}
            {...props}
        >
            {name}
        </option>
    )
}

export default Option