import { getRandomNumber } from '@utils';



export interface PlaceholderVariation {
    username: {
        width: number;
    };
    lines: {
        width: number;
    }[][];
    withAttachment: boolean;
    attachment: {
        width: number;
        height: number;
    };
}

const CONFIG = {
    AMOUNT: 10,
    USERNAME_WIDTH_MIN: 50,
    USERNAME_WIDTH_MAX: 150,
    LINES_MIN: 1,
    LINES_MAX: 3,
    WORDS_MIN: 3,
    WORDS_MAX: 15,
    WORDS_WIDTH_MIN: 20,
    WORDS_WIDTH_MAX: 120,
    ATTACHMENT_WIDTH_MIN: 150,
    ATTACHMENT_WIDTH_MAX: 300,
    ATTACHMENT_HEIGHT_MIN: 150,
    ATTACHMENT_HEIGHT_MAX: 300,
};

export const createPlaceholderVariation = (): PlaceholderVariation => ({
    username: {
        width: getRandomNumber(CONFIG.USERNAME_WIDTH_MIN, CONFIG.USERNAME_WIDTH_MAX),
    },
    lines: (
        Array(getRandomNumber(CONFIG.LINES_MIN, CONFIG.LINES_MAX)).fill(null).map(() => 
            Array(getRandomNumber(CONFIG.WORDS_MIN, CONFIG.WORDS_MAX)).fill(null).map(() => ({
                width: getRandomNumber(CONFIG.WORDS_WIDTH_MIN, CONFIG.WORDS_WIDTH_MAX),
            })),
        )
    ),
    withAttachment: !!getRandomNumber(0, 1),
    attachment: {
        width: getRandomNumber(CONFIG.ATTACHMENT_WIDTH_MIN, CONFIG.ATTACHMENT_WIDTH_MAX),
        height: getRandomNumber(CONFIG.ATTACHMENT_HEIGHT_MIN, CONFIG.ATTACHMENT_HEIGHT_MAX),
    },
});