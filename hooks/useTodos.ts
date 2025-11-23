import { useState, useEffect } from "react";
import { loadData, saveData, removeData } from "../utils/storage";



export interface Item {
    id: string
    name: string
    done: boolean
}

const STORAGE_KEY = '@todos_item'

export function useTodos() {
    const [items, setItems] = useState<Item[]>([]);
    const [input, setInput] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true)


    // 1) Ladataan tallennetut todos käynnistyksessä
    useEffect(() => {
        const loadTodos = async () => {
            const saved = await loadData<Item[]>(STORAGE_KEY)
            if (saved) {
                setItems(saved)
            }
            setIsLoading(false)
        }

        loadTodos()
    }, [])


    // 2) Tallennetaan todos aina kun items muuttuu (kun lataus on valmis)
    useEffect(() => {
        if (isLoading) return // ei tallenneta ihan ensimmäisellä renderillä

        const saveTodos = async () => {
            await saveData(STORAGE_KEY, items)
        }
        saveTodos()
    }, [items, isLoading])



    // Lisää uusi task
    const addItem = () => {
        if (input.trim()) {
            setItems(prev => [
                ...prev,
                { id: Date.now().toString(), name: input.trim(), done: false },
            ]);
            setInput('');
        }
    };

    // Done / undone
    const toggleDone = (id: string) => {
        setItems(prev =>
            prev.map(item =>
                item.id === id ? { ...item, done: !item.done } : item
            )
        );
    };

    // Poisto
    const deleteItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    // Tyhjennetään kaikki tehtävät + poistetaan AsyncStoragesta
    const clearAllTasks = () => {
        setItems([])                    // Tyhjennetään lista ui:sta
        removeData(STORAGE_KEY)
    }


    // Palautetaan kaikki, mitä App tarvitsee

    return {
        items,
        input,
        setInput,
        addItem,
        toggleDone,
        deleteItem,
        clearAllTasks,
        isLoading
    }
}

