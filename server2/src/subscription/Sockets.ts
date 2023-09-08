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

        const user = this.users.get(socket.data.id);

        if (user) {
            user.add(socket.id);
        }

        if (!user) {
            this.users.set(socket.data.id, new Set([socket.id]));
        }
    }

    remove(socket: AuthorizedSocket) {
        const socketItem = this.sockets.get(socket.id);
        if (!socketItem) return;

        socketItem.subscriptions.forEach((entity) => {
            entity.unsubscribe(socket.id);
        });

        this.sockets.delete(socket.id);

        const user = this.users.get(socketItem.userId);
        if (!user) return;

        user.delete(socket.id);

        if (user.size === 0) this.users.delete(socketItem.userId);
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