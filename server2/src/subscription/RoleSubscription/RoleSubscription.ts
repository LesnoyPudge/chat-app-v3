import { sockets } from '@root';
import { RoleServiceHelpers } from '@services';
import { Entities, promiseToBoolean } from '@shared';
import { customChains } from '@validators';
import { EntitySubscription } from '../EntitySubscription';



export const RoleSubscription = new EntitySubscription<
    Entities.Role.Default
>(
    'Role',
    sockets,
    async(userId, roleId) => {
        const role = await RoleServiceHelpers.getOne({ id: roleId });
        if (!role) return Promise.resolve(false);

        return promiseToBoolean(customChains.channelMember(userId, role.channel)());
    },
);