import { sockets } from '@root';
import { UserDTO } from '@dto';
import { Entities, StrictOmit } from '@shared';
import { EntitySubscription } from '../EntitySubscription';



type EntityType = (
    StrictOmit<Entities.User.WithoutCredentials, 'status'> |
    StrictOmit<Entities.User.Preview, 'status'>
);

export const UserSubscription = new EntitySubscription<EntityType>(
    'User',
    sockets,
    () => Promise.resolve(true),
    UserDTO.preview,
);