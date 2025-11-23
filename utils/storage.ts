import AsyncStorage from "@react-native-async-storage/async-storage";

// saveData<T>: voit tallentaa esim. Item[], string, number, tms.
// loadData<T>: kun kutsut loadData<Item[]>, TypeScript tietää että palautus on Item[] | null.


// Tallentaa_minkä_tahansa_arvon (T) JSON-muodossa
export async function saveData<T>(key: string, value: T): Promise<void> {
    try {
        const json = JSON.stringify(value);
        await AsyncStorage.setItem(key, json);
    } catch (error) {
        console.warn(`virhe datan tallennuksessa "${key}"`, error);
    }
}

// Lataa _minkä tahansa_ arvon (T) JSON-muodosta
export async function loadData<T>(key: string): Promise<T | null> {
    try {
        const json = await AsyncStorage.getItem(key);
        if (!json) return null;
        return JSON.parse(json) as T;
    } catch (error) {
        console.warn(`Virhe datan lataamisessa "${key}"`, error);
        return null;
    }
}

// Poistaa tallennetun datan avaimella
export async function removeData(key: string): Promise<void> {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.warn(`Virhe datan poistossa "${key}"`, error);
    }
}