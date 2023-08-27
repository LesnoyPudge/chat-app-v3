import { EntityId, SocketId, UserId } from '@shared';
import { AuthorizedServer, AuthorizedSocket } from '@types';
import autoBind from 'auto-bind';
import { Entity } from './Entity';



export class Sockets {
    server: AuthorizedServer;
    sockets: Map<SocketId, {
        socket: AuthorizedSocket;
        userId: UserId;
        accessToken: string;
        subscriptions: Map<EntityId, Entity>;
    }>;
    users: Map<UserId, Set<SocketId>>;

    constructor(server: AuthorizedServer) {
        this.server = server;
        this.sockets = new Map();
        this.users = new Map();

        autoBind(this);

        this.server.on('connection', (socket) => {
            this.add(socket);

            socket.on('disconnect', () => this.remove(socket));
        });
    }

    add(socket: AuthorizedSocket) {
        if (!socket.data.id || !socket.data.accessToken) return;

        this.sockets.set(socket.id, {
            socket,
            userId: socket.data.id,
            accessToken: socket.data.accessToken,
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