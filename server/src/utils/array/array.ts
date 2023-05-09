


export const array = {
    moveElement<T extends unknown[]>(array: T, oldIndex: number, newIndex: number): T {
        if (newIndex === oldIndex) return array;
                      
        if (newIndex > oldIndex) {
            return [
                ...array.slice(0, oldIndex),
                ...array.slice(oldIndex + 1, newIndex + 1),
                array[oldIndex],
                ...array.slice(newIndex + 1),
            ] as T;
        }
                      
        if (newIndex < oldIndex) {
            return [
                ...array.slice(0, newIndex), 
                array[oldIndex],
                ...array.slice(newIndex, oldIndex),
                ...array.slice(oldIndex + 1),
            ] as T;
        }

        return array;
    },
};