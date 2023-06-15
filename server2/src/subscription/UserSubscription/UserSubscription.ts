import { sockets } from '@root';
import { UserDTO } from '@dto';
import { Entities } from '@shared';
import { EntitySubscription } from '../EntitySubscription';



export const UserSubscription = new EntitySubscription<
    Entities.User.WithoutCredentials
>(
    'User',
    sockets,
    () => Promise.resolve(true),
    UserDTO.preview,
);