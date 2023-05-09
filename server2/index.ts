import * as http from 'http';
import { nanoid } from 'nanoid';



const server = http.createServer();

const main = async() => {
    server.listen({ host: 'localhost', port: 3000 }, () => {
        console.log('started', nanoid(5));
    });
};

main();