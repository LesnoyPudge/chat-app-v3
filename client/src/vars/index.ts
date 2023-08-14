import { Entities, Status } from '@shared';



export const VALIDATION_MESSAGES = {
    REQUIRED: 'Значение не указано',
    INVALID_EMAIL: 'Некорректный email',
};

export const FOCUSABLE_SELECTOR = [
    'a:not([tabindex="-1"])',
    'button:not([tabindex="-1"])',
    'input:not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"])',
].join(', ');

export const STATUS_LABEL = {
    online: 'В сети',
    offline: 'Не в сети',
    default: 'В сети',
    invisible: 'Не в сети',
    afk: 'Неактивен',
    dnd: 'Не беспокоить',
} satisfies Record<Entities.User.Default['extraStatus'] | Status, string>;

export const MIME = {
    ALL: '*',
    IMAGES: 'image',
} as const;