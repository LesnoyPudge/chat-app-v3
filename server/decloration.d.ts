declare module 'nanoid/async' {
    const customAlphabet: (alphabet: string, size: number) => () => Promise<string>;
}