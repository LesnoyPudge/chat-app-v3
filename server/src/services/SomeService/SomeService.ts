


interface IMessage {
    message: string;
}

interface ISomeService {
    message: ({ message }: IMessage) => Promise<string>;
}

export const SomeService: ISomeService = {
    async message({ message }) {
        throw new Error('error in message service');
        
        return message;
    },
};