import ms from 'ms';



export const date = {
    isExpired(expiryDate: Date | number) {
        const isNumber = typeof expiryDate === 'number';
        const expiryDateInMs = isNumber ? expiryDate : expiryDate.getMilliseconds();
        const currentDate = Date.now();
        return expiryDateInMs > currentDate;
    },

    setExpiyDate(expiresIn: number | string) {
        if (typeof expiresIn === 'string') {
            expiresIn = ms(expiresIn);
        }

        const expiryDate = Date.now() + expiresIn;

        return expiryDate;
    },
};