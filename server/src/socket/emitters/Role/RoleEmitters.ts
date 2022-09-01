import { io } from '@server';
import { IRole } from '@types';



export const roleEmitters = {
    sendRoleSubscription({ to, role }: {to: string | string[], role: IRole}) {
        io.to(to).emit('sendRoleSubscription', role);
    },

    removeRoleSubscription({ to, roleId }: {to: string | string[], roleId: string}) {
        io.to(to).emit('removeRoleSubscription', roleId);
    },
};