import cors from 'cors';



export const SomeController = {
    async getSome(params: any) {
        console.log(cors.arguments);
        
        return '';
    },
};