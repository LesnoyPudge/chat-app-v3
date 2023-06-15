import { RoleService } from '@services';
import { Endpoints } from '@shared';
import { AuthorizedMiddleware } from '@types';


interface RoleController {
    [Endpoints.V1.Role.Create.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Role.Create.RequestBody,
        Endpoints.V1.Role.Create.Response
    >;
    [Endpoints.V1.Role.GetOne.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Role.GetOne.RequestBody,
        Endpoints.V1.Role.GetOne.Response
    >;
    [Endpoints.V1.Role.Update.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Role.Update.RequestBody,
        Endpoints.V1.Role.Update.Response
    >;
    [Endpoints.V1.Role.Delete.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Role.Delete.RequestBody,
        Endpoints.V1.Role.Delete.Response
    >;
    [Endpoints.V1.Role.RemoveMember.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Role.RemoveMember.RequestBody,
        Endpoints.V1.Role.RemoveMember.Response
    >;
    [Endpoints.V1.Role.AddMember.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Role.AddMember.RequestBody,
        Endpoints.V1.Role.AddMember.Response
    >;
}

export const RoleController: RoleController = {
    async create(req, res) {
        const role = await RoleService.create(req.auth, req.body);
        res.json(role);
    },
    
    async getOne(req, res) {
        const role = await RoleService.getOne(req.auth, req.body);
        res.json(role);
    },

    async update(req, res) {
        const role = await RoleService.update(req.auth, req.body);
        res.json(role);
    },

    async delete(req, res) {
        const role = await RoleService.delete(req.auth, req.body);
        res.json(role);
    },

    async addMember(req, res) {
        const role = await RoleService.addMember(req.auth, req.body);
        res.json(role);
    },

    async removeMember(req, res) {
        const role = await RoleService.removeMember(req.auth, req.body);
        res.json(role);
    },
};