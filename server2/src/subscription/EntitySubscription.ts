import { MODEL_NAME } from '@database';
import { ChannelServiceHelpers, ChatServiceHelpers, MessageServiceHelpers, PrivateChannelServiceHelpers, RoleServiceHelpers, RoomServiceHelpers, UserServiceHelpers } from '@services';
import { EntityId, StrictOmit, UserId, ValueOf, WithId } from '@shared';
import { AuthorizedSocket } from '@types';
import autoBind from 'auto-bind';
import { isDeepStrictEqual } from 'util';
import { Entity } from './Entity';
import { Sockets } from './Sockets';



type PartialNames = StrictOmit<typeof MODEL_NAME, 'FILE'>;

type EntityNames = {
    [K in keyof PartialNames]: PartialNames[K]
}[keyof PartialNames];

const SOCKET_EVENTS = {
    SUBSCRIBE: 'subscribe',
    UNSUBSCRIBE: 'unsubscribe',
    ERROR: 'error',
    DATA: 'data',
    DELETE: 'delete',
} as const;

type Validator = (userId: UserId, entityId: EntityId) => Promise<boolean>;

type DTO<T> = (entity: T) => Partial<T>;

const ServiceHelpers = {
    [MODEL_NAME.CHANNEL]: ChannelServiceHelpers?.getOne,
    [MODEL_NAME.MESSAGE]: MessageServiceHelpers?.getOne,
    [MODEL_NAME.PRIVATE_CHANNEL]: PrivateChannelServiceHelpers?.getOne,
    [MODEL_NAME.ROLE]: RoleServiceHelpers?.getOne,
    [MODEL_NAME.ROOM]: RoomServiceHelpers?.getOne,
    [MODEL_NAME.USER]: UserServiceHelpers?.getOne,
    [MODEL_NAME.CHAT]: ChatServiceHelpers?.getOne,
};

export class EntitySubscription<T extends WithId> {
    private entities: Map<EntityId, Entity<T>>;
    private sockets: Sockets;
    private name: EntityNames;
    private validator: Validator;
    private defaultDTO: DTO<T>;

    constructor(
        name: EntityNames, 
        sockets: Sockets,
        validator: Validator = () => Promise.resolve(true),
        defaultDTO: DTO<T> = (value) => value,
    ) {
        this.entities = new Map();
        this.sockets = sockets;
        this.name = name;
        this.validator = validator,
        this.defaultDTO = defaultDTO,

        autoBind(this);

        this.sockets.server.on('connection', (socket) => {
            socket.on(
                this.toName(SOCKET_EVENTS.SUBSCRIBE), 
                (entityId) => this.subscribe(
                    socket as unknown as AuthorizedSocket, 
                    entityId,
                ),
            );
            socket.on(
                this.toName(SOCKET_EVENTS.UNSUBSCRIBE), 
                (entityId) => this.unsubscribe(
                    socket as unknown as AuthorizedSocket, 
                    entityId,
                ),
            );
        });
    }

    private toName(event: ValueOf<typeof SOCKET_EVENTS>) {
        return `${this.name}_${event}`;
    }

    private async getEntity(entityId: EntityId) {
        let entity = this.entities.get(entityId);
    
        if (!entity) {
            const data = await ServiceHelpers[this.name]({
                id: entityId, 
            }) as T | null;

            if (!data) return undefined;

            const newEntity = new Entity(data);
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
            this.toName(SOCKET_EVENTS.ERROR),
            entityId,
        );

        const entity = await this.getEntity(entityId);
        if (!entity) return this.sockets.server.to(socket.id).emit(
            this.toName(SOCKET_EVENTS.ERROR),
            entityId,
        );
            
        entity.subscribe(socket.id);
        this.sockets.addSubscription(socket.id, entity);

        this.sockets.server.to(socket.id).emit(
            this.toName(SOCKET_EVENTS.DATA),
            this.defaultDTO(entity.data),
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
        providedDTO = this.defaultDTO,
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
            this.toName('data'),
            providedDTO(entity.data),
        );
    }

    delete(entityId: EntityId) {
        const entity = this.entities.get(entityId);
        if (!entity) return;

        this.sockets.server.to(entity.getSubscribers()).emit(
            this.toName(SOCKET_EVENTS.DELETE),
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