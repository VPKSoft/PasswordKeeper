import secureLocalStorage from "react-secure-storage";

/**
 * A custom hook to get, set and clear a secure value from the secureLocalStorage.
 * @param valueName The value name in question.
 * @returns Functions to set, get and clear the value in question.
 */
const useSecureStorage = <T extends string | number | boolean | object>(valueName: string): [(value: T) => void, () => T, () => void] => {
    const setValue = (value: T) => {
        secureLocalStorage.setItem(valueName, value);
    };

    const getValue = () => {
        return secureLocalStorage.getItem(valueName) as T;
    };

    const clear = () => {
        secureLocalStorage.removeItem(valueName);
    };

    return [setValue, getValue, clear];
};

export { useSecureStorage };
