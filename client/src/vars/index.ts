


export const VALIDATION_MESSAGES = {
    REQUIRED: 'Значение не указано',
    INVALID_EMAIL: 'Некорректный email',
};

export const focusableSelector = [
    'a:not([tabindex="-1"])',
    'button:not([tabindex="-1"])',
    'input:not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"])',
].join(', ');