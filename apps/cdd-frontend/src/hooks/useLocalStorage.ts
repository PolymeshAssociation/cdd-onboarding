import { useState, useEffect } from 'react';

/**
 * @param {string} key - A key to identify the value.
 * @param {any} value - A value associated with the key.
 * @param {number} ttl- Time to live in seconds.
 */
const setData = <T>(key: string, value: T, ttl?: number) => {
        const data = {
            value,
            ...(ttl && { ttl: Date.now() + (ttl * 1000) } ),
        }
     
        // store data in LocalStorage 
        localStorage.setItem(key, JSON.stringify(data));
}

/**
 * @param {string} key - A key to identify the data.
 * @returns {any|null} returns the value associated with the key if its exists and is not expired. Returns `null` otherwise
 */
const getData = <T>(key: string)=> {
    const data = localStorage.getItem(key);
    if (!data) {     // if no value exists associated with the key, return null
        return null;
    }
 
    const item = JSON.parse(data);
 
    // If TTL has expired, remove the item from localStorage and return null
    if (item?.ttl < Date.now()) {
        localStorage.removeItem(key);
        return null;
    }
 
    // return data if not expired
    return item.value as T;
};

/**
 * @param {string} key - A key to identify the value.
 * @param {any} value - A value associated with the key.
 * @param {number} ttl- Time to live in seconds.
 */
const useLocalStorage = <T>(key: string, defaultValue: T, ttl?: number) => {
    const [value, setValue] = useState<T>(() => {
      let currentValue: T;
  
      try {
        currentValue = getData(key) || defaultValue;
      } catch (error) {
        currentValue = defaultValue;
      }
  
      return currentValue;
    });
  
    useEffect(() => {
      setData<T>(key, value, ttl)
    }, [value, key, ttl]);
  
    return [value, setValue] as [T, React.Dispatch<React.SetStateAction<T>>]
  };
  
  export default useLocalStorage;