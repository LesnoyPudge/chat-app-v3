import { EntityId, SocketId, UserId } from '@shared';
import { AuthorizedSocket } from '@types';
import autoBind from 'auto-bind';
import { Server, Socket } from 'socket.io';
import { Entity } from './Entity';



export class Sockets {
    server: Server;
    sockets: Map<SocketId, {
        socket: AuthorizedSocket;
        userId: UserId;
        accessToken: string;
        subscriptions: Map<EntityId, Entity>;
    }>;
    users: Map<UserId, Set<SocketId>>;
    
    constructor(server: Server) {
        this.server = server;
        this.sockets = new Map();
        this.users = new Map();

        autoBind(this);

        this.server.on('connection', (socket) => {
            this.add(socket as unknown as AuthorizedSocket);

            socket.on(
                'disconnect', 
                () => this.remove(socket as unknown as AuthorizedSocket),
            );
        });
    }

    add(socket: AuthorizedSocket) {
        this.sockets.set(socket.id, {
            socket,
            userId: socket.handshake.auth.id,
            accessToken: socket.handshake.auth.accessToken,
            subscriptions: new Map(),
        });
    }

    remove(socket: AuthorizedSocket) {
        const socketItem = this.sockets.get(socket.id);
        if (!socketItem) return;

        socketItem.subscriptions.forEach((entity) => {
            entity.unsubscribe(socket.handshake.auth.id);
        });

        this.sockets.delete(socket.id);
    }

    addSubscription(socketId: SocketId, entity: Entity) {
        const socketItem = this.sockets.get(socketId);
        if (!socketItem) return;

        socketItem.subscriptions.set(entity.data.id, entity);
    }

    removeSubscription(socketId: SocketId, entityId: EntityId) {
        const socketItem = this.sockets.get(socketId);
        if (!socketItem) return;

        socketItem.subscriptions.delete(entityId);
    }

    usersToSockets(users: UserId[]): SocketId[] {
        return users.map((userId) => {
            const sockets = this.users.get(userId);
            if (!sockets) return;
            return Array.from(sockets);
        }).flat().filter(Boolean);
    }
}