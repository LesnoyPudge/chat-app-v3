import { RoleService } from '@services';
import { AuthorizedControllerType, ICreateRoleRequest, IDeleteRoleRequest, IGetManyRolesRequest, IGetOneRoleRequest, IRole, IUpdateRoleRequest } from '@types';



interface IRoleController {
    create: AuthorizedControllerType<ICreateRoleRequest, never, IRole>;
    getOne: AuthorizedControllerType<IGetOneRoleRequest, never, IRole>;
    getMany: AuthorizedControllerType<IGetManyRolesRequest, never, IRole[]>;
    update: AuthorizedControllerType<IUpdateRoleRequest, never, IRole>;
    delete: AuthorizedControllerType<IDeleteRoleRequest, never, IRole>;
}

export const RoleController: IRoleController = {
    async create(req, res) {
        const { channelId, name } = req.body;
        const { id } = req.auth.user;
        
        const role = await RoleService.create({ userId: id, channelId, name });

        res.json(role);
    },
    
    async getOne(req, res) {
        const { roleId } = req.body;
        const { id } = req.auth.user;

        const Role = await RoleService.getOne({ userId: id, roleId });

        res.json(Role);
    },

    async getMany(req, res) {
        const { roleIds } = req.body;
        const { id } = req.auth.user;

        const roles = await RoleService.getMany({ userId: id, roleIds });

        res.json(roles);
    },

    async update(req, res) {
        const { roleId, newValues } = req.body;
        const { id } = req.auth.user;
        
        const updatedRole = await RoleService.update({ userId: id, roleId, newValues });

        res.json(updatedRole);
    },

    async delete(req, res) {
        const { roleId } = req.body;
        const { id } = req.auth.user;
        
        const deletedRole = await RoleService.delete({ userId: id, roleId });

        res.json(deletedRole);
    },
};