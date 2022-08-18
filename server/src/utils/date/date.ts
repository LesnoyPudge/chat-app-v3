


export const date = {
    isExpired(expiryDate: Date | number) {
        const isNumber = typeof expiryDate === 'number';
        const expiryDateInMs = isNumber ? expiryDate : expiryDate.getMilliseconds();
        const currentDate = Date.now();
        return expiryDateInMs > currentDate;
    },
};