


interface IMessage {
    message: string;
}

interface ISomeService {
    message: ({message}: IMessage) => Promise<string>;
}

export const SomeService: ISomeService = {
    async message({message}) {
        console.log('got message in service');
        throw new Error('error in message service');
        
        return message;
    },
};