import { ControllerType } from '../../../types';
import { SomeService } from '../../services';



interface IMessage {
    message: string;
}

interface ISomeController {
    message: ControllerType<IMessage, any, IMessage>;
    getSome: ControllerType<any, any, any>;
    getSomething: ControllerType<any, any, any>;
    qwe: ControllerType<any, any, any>;
}

export const SomeController: ISomeController = {
    async message(req, res) {
        const {message} = req.body;
        
        const data = await SomeService.message({message});

        res.json({message: data});
    },

    async getSome(req, res) {
        console.log(req.body);
        
        res.send('qwe');
    },

    async getSomething(req, res) {
        console.log(req.body);
        
        res.send('qwe');
    },

    qwe: async(req, res) => {
        res.send('qwe');
    },
};