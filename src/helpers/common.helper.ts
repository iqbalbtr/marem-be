

export default class CommonHelper {

    /**
     * get last element from array or null if array is empty
     * @param data T[]
     * @returns T | null
     */
    static getLastData<T>(data: T[]): T | null {
        if (data.length === 0) {
            return null;
        }
        return data[data.length - 1];
    }
}