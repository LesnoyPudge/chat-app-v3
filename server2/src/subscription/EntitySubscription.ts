import { ChannelServiceHelpers, ChatServiceHelpers, MessageServiceHelpers, PrivateChannelServiceHelpers, RoleServiceHelpers, RoomServiceHelpers, UserServiceHelpers } from '@services';
import { EntityId, UserId, ValueOf, WithId, ENTITY_NAMES, SOCKET_SERVER_EVENT_NAMES, SOCKET_CLIENT_EVENT_NAMES, StrictOmit } from '@shared';
import { AuthorizedSocket } from '@types';
import autoBind from 'auto-bind';
import { isDeepStrictEqual } from 'util';
import { Entity } from './Entity';
import { Sockets } from './Sockets';



type Names = StrictOmit<typeof ENTITY_NAMES, 'FILE'>;

type Validator = (userId: UserId, entityId: EntityId) => Promise<boolean>;

type DTO<T> = (entity: T) => Partial<T>;

const ServiceHelpers = {
    [ENTITY_NAMES.CHANNEL]: ChannelServiceHelpers?.getOne,
    [ENTITY_NAMES.MESSAGE]: MessageServiceHelpers?.getOne,
    [ENTITY_NAMES.PRIVATE_CHANNEL]: PrivateChannelServiceHelpers?.getOne,
    [ENTITY_NAMES.ROLE]: RoleServiceHelpers?.getOne,
    [ENTITY_NAMES.ROOM]: RoomServiceHelpers?.getOne,
    [ENTITY_NAMES.USER]: UserServiceHelpers?.getOne,
    [ENTITY_NAMES.CHAT]: ChatServiceHelpers?.getOne,
};

export class EntitySubscription<T extends WithId> {
    private entities: Map<EntityId, Entity<T>>;
    private sockets: Sockets;
    private name: ValueOf<Names>;
    private validator: Validator;
    private defaultDTO: DTO<T>;

    constructor(
        name: ValueOf<Names>, 
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
        const qwe = this.toName(SOCKET_CLIENT_EVENT_NAMES.UNSUBSCRIBE);
        this.sockets.server.on('connection', (socket) => {
            socket.on(
                this.toName(SOCKET_CLIENT_EVENT_NAMES.SUBSCRIBE), 
                (entityId) => this.subscribe(
                    socket, 
                    entityId,
                ),
            );
            socket.on(
                this.toName(SOCKET_CLIENT_EVENT_NAMES.UNSUBSCRIBE), 
                (entityId) => this.unsubscribe(
                    socket, 
                    entityId,
                ),
            );
        });
    }

    private toName<
        T extends ValueOf<
            typeof SOCKET_SERVER_EVENT_NAMES & 
            typeof SOCKET_CLIENT_EVENT_NAMES
        >
    >(event: T) {
        return `${this.name}_${event}` as const;
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
            this.toName(SOCKET_SERVER_EVENT_NAMES.ERROR),
            entityId,
        );

        const entity = await this.getEntity(entityId);
        if (!entity) return this.sockets.server.to(socket.id).emit(
            this.toName(SOCKET_SERVER_EVENT_NAMES.ERROR),
            entityId,
        );
            
        entity.subscribe(socket.id);
        this.sockets.addSubscription(socket.id, entity);

        this.sockets.server.to(socket.id).emit(
            this.toName(SOCKET_SERVER_EVENT_NAMES.DATA),
            entity.data.id,
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
            this.toName(SOCKET_SERVER_EVENT_NAMES.DATA),
            entity.data.id,
            providedDTO(entity.data),
        );
    }

    delete(entityId: EntityId) {
        const entity = this.entities.get(entityId);
        if (!entity) return;

        this.sockets.server.to(entity.getSubscribers()).emit(
            this.toName(SOCKET_SERVER_EVENT_NAMES.DELETE),
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