import React, { createContext, useContext, useEffect, useState, } from "react";

type ThemaType = 'light' | 'dark';

interface ThemaProps {
    thema: ThemaType,
    setThema: React.Dispatch<ThemaType>
}

const initialState = localStorage.getItem('thema') ?
    (localStorage.getItem('thema') as ThemaType) : 'light';

const ThemeContext = createContext<ThemaProps>({
    thema: initialState,
    setThema: () => {}
});

export function ThemaProvider({ children }: { children: React.ReactElement }) {

    const [thema, setThema] = useState<ThemaType>(initialState);

    useEffect(()=> {
        localStorage.setItem('thema', thema);
    }, [thema])

    return (
        <ThemeContext.Provider value={{ thema, setThema }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useThema() {
    return useContext(ThemeContext);
}

