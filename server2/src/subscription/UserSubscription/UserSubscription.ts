import { sockets } from '@root';
import { UserDTO } from '@dto';
import { Entities } from '@shared';
import { EntitySubscription } from '../EntitySubscription';



type EntityType = (
    Entities.User.WithoutCredentials |
    (Entities.User.Preview & Entities.User.WithStatus)
);

export const UserSubscription = new EntitySubscription<EntityType>(
    'User',
    sockets,
    () => Promise.resolve(true),
    (v) => {
        const user = UserDTO.preview(v);
        const withStatus: Entities.User.WithStatus = {
            status: sockets.users.has(user.id) ? 'online' : 'offline',
        };

        return Object.assign(user, withStatus);
    },
);