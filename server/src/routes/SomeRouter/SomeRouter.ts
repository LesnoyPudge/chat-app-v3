import { Router } from 'express';
import { socket } from '../../server';



export const SomeRouter = Router();

SomeRouter.get('/user', (req, res) => {
    console.log('user reached');
    res.json('user???');
});

SomeRouter.post('/message', (req, res) => {
    const {message}: {message: string} = req.body;
    
    socket.events.sendMessage(message);
    res.json({message});
});