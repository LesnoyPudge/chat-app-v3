import { SocketId, WithId } from '@shared';



export class Entity<T extends WithId = WithId> {
    data: T;
    private subscribers: Set<SocketId>;

    constructor(data: T) {
        this.data = data;
        this.subscribers = new Set();
    }

    update(data: Partial<T>) {
        Object.assign<T, Partial<T>>(this.data, data);
    }

    subscribe(socketId: SocketId) {
        this.subscribers.add(socketId);
    }

    unsubscribe(socketId: SocketId) {
        this.subscribers.delete(socketId);
    }

    getSubscribers(): SocketId[] {
        return Array.from(this.subscribers);
    }
}