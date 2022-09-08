


export const debounce = <F extends (...args: never[]) => unknown>(callback: F, delay: number) => {
    let timeout = 0;

    const debounced = (...args: Parameters<F>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => callback(...args), delay);
    };

    return debounced as (...args: Parameters<F>) => ReturnType<F>;
};