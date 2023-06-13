import useLocalStorage from "./useLocalStorage";

export const useStoredAddressValue = () => {
    const [address, setAddress] = useLocalStorage<string | null>("address", null, 86400); // 24h
    
    return {address, setAddress };
}