import { EntityId, UserId, ValueOf, WithId, SOCKET_SERVER_EVENT_NAMES, SOCKET_CLIENT_EVENT_NAMES, toSocketEventName, SUBSCRIBABLE_ENTITIES } from '@shared';
import { AuthorizedSocket } from '@types';
import autoBind from 'auto-bind';
import { isDeepStrictEqual } from 'util';
import { Entity } from './Entity';
import { Sockets } from './Sockets';
import { ChannelModel, ChatModel, MessageModel, PrivateChannelModel, RoleModel, RoomModel, UserModel } from '@database';
import { Document, Model } from 'mongoose';



type Names = ValueOf<typeof SUBSCRIBABLE_ENTITIES>;

type Validator = (userId: UserId, entityId: EntityId) => Promise<boolean>;

const models = {
    [SUBSCRIBABLE_ENTITIES.CHANNEL]: ChannelModel,
    [SUBSCRIBABLE_ENTITIES.MESSAGE]: MessageModel,
    [SUBSCRIBABLE_ENTITIES.PRIVATE_CHANNEL]: PrivateChannelModel,
    [SUBSCRIBABLE_ENTITIES.ROLE]: RoleModel,
    [SUBSCRIBABLE_ENTITIES.ROOM]: RoomModel,
    [SUBSCRIBABLE_ENTITIES.USER]: UserModel,
    [SUBSCRIBABLE_ENTITIES.CHAT]: ChatModel,
};

export class EntitySubscription<T extends WithId> {
    private entities: Map<EntityId, Entity<T>>;
    private sockets: Sockets;
    private name: Names;
    private validator: Validator;
    private defaultDTO: (v: T) => T;

    constructor(
        name: Names,
        sockets: Sockets,
        validator: Validator = () => Promise.resolve(true),
        defaultDTO: (v: T) => T = (v) => v,
    ) {
        this.entities = new Map();
        this.sockets = sockets;
        this.name = name;
        this.validator = validator,
        this.defaultDTO = defaultDTO,

        autoBind(this);

        this.sockets.server.on('connection', (socket) => {
            socket.on(
                toSocketEventName(this.name, SOCKET_CLIENT_EVENT_NAMES.SUBSCRIBE),
                (entityId) => this.subscribe(
                    socket,
                    entityId,
                ),
            );
            socket.on(
                toSocketEventName(this.name, SOCKET_CLIENT_EVENT_NAMES.UNSUBSCRIBE),
                (entityId) => this.unsubscribe(
                    socket,
                    entityId,
                ),
            );
        });
    }

    private async getEntity(entityId: EntityId) {
        let entity = this.entities.get(entityId);

        if (!entity) {
            const model = models[this.name] as unknown as Model<Document & T>;
            const data = await model.findOne({ id: entityId }).lean();

            let parsedData: T | null = null;

            try {
                parsedData = JSON.parse(JSON.stringify(data)) as T | null;
            } catch (error) {
                return undefined;
            }

            if (!parsedData) return undefined;

            const newEntity = new Entity(parsedData);
            this.entities.set(entityId, newEntity);
            entity = newEntity;
        }

        return entity;
    }

    private async subscribe(socket: AuthorizedSocket, entityId: EntityId) {
        const userId = this.sockets.sockets.get(socket.id)?.userId;
        if (!userId) return;

        const isAvailable = await this.validator(userId, entityId);
        if (!isAvailable) return this.sockets.server.to(socket.id).emit(
            toSocketEventName(this.name, SOCKET_SERVER_EVENT_NAMES.ERROR),
            entityId,
        );

        const entity = await this.getEntity(entityId);
        if (!entity) return this.sockets.server.to(socket.id).emit(
            toSocketEventName(this.name, SOCKET_SERVER_EVENT_NAMES.ERROR),
            entityId,
        );

        entity.subscribe(socket.id);
        this.sockets.addSubscription(socket.id, entity);

        this.sockets.server.to(socket.id).emit(
            toSocketEventName(this.name, SOCKET_SERVER_EVENT_NAMES.DATA),
            entity.data.id,
            this.defaultDTO(entity.data) as any,
        );
    }

    private unsubscribe(socket: AuthorizedSocket, entityId: EntityId) {
        const entity = this.entities.get(entityId);
        if (!entity) return;

        entity.unsubscribe(socket.id);
        this.sockets.removeSubscription(socket.id, entityId);
    }

    update(
        data: T,
        users: UserId[] | null = null,
        providedDTO: (v: any) => T = this.defaultDTO,
    ) {
        const entity = this.entities.get(data.id);
        if (!entity) return;

        if (!entity.getSubscribers().length) return;

        const isEqual = isDeepStrictEqual(
            entity.data,
            Object.assign({}, entity.data, data),
        );
        if (isEqual) return;

        entity.update(data);

        const sockets = (
            users
                ? this.sockets.usersToSockets(users)
                : entity.getSubscribers()
        );

        this.sockets.server.to(sockets).emit(
            toSocketEventName(this.name, SOCKET_SERVER_EVENT_NAMES.DATA),
            entity.data.id,
            providedDTO(entity.data) as any,
        );
    }

    delete(entityId: EntityId) {
        const entity = this.entities.get(entityId);
        if (!entity) return;

        this.sockets.server.to(entity.getSubscribers()).emit(
            toSocketEventName(this.name, SOCKET_SERVER_EVENT_NAMES.DELETE),
            entityId,
        );

        this.entities.delete(entityId);
    }

    async revalidateSubscribers(
        entityId: EntityId,
        users: UserId[] | null = null,
    ) {
        const entity = this.entities.get(entityId);
        if (!entity) return;

        const subscribers = (
            users
                ? this.sockets.usersToSockets(users)
                : entity.getSubscribers()
        );

        for (const socketId of subscribers) {
            const userId = this.sockets.sockets.get(socketId)?.userId;
            if (!userId) return;

            const isAvailable = await this.validator(userId, entityId);
            if (isAvailable) return;

            entity.unsubscribe(socketId);
            this.sockets.removeSubscription(socketId, entityId);
        }
    }
}



const qwe = <Name extends Names,>(name: Name) => {

};