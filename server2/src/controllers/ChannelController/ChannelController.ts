import { ChannelService } from '@services';
import { Endpoints } from '@shared';
import { AuthorizedMiddleware } from '@types';
import HTTP_STATUS_CODES from 'http-status-enum';



interface ChannelController {
    [Endpoints.V1.Channel.Create.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Channel.Create.RequestBody,
        Endpoints.V1.Channel.Create.Response
    >;
    [Endpoints.V1.Channel.GetOne.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Channel.GetOne.RequestBody,
        Endpoints.V1.Channel.GetOne.Response
    >;
    [Endpoints.V1.Channel.Update.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Channel.Update.RequestBody,
        Endpoints.V1.Channel.Update.Response
    >;
    [Endpoints.V1.Channel.Delete.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Channel.Delete.RequestBody,
        Endpoints.V1.Channel.Delete.Response
    >;
    [Endpoints.V1.Channel.CreateInvitation.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Channel.CreateInvitation.RequestBody,
        Endpoints.V1.Channel.CreateInvitation.Response
    >;
    [Endpoints.V1.Channel.DeleteInvitation.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Channel.DeleteInvitation.RequestBody,
        Endpoints.V1.Channel.DeleteInvitation.Response
    >;
    [Endpoints.V1.Channel.AcceptInvitation.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Channel.AcceptInvitation.RequestBody,
        Endpoints.V1.Channel.AcceptInvitation.Response
    >;
    [Endpoints.V1.Channel.Ban.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Channel.Ban.RequestBody,
        Endpoints.V1.Channel.Ban.Response
    >;
    [Endpoints.V1.Channel.Unban.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Channel.Unban.RequestBody,
        Endpoints.V1.Channel.Unban.Response
    >;
    [Endpoints.V1.Channel.Kick.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Channel.Kick.RequestBody,
        Endpoints.V1.Channel.Kick.Response
    >;
    [Endpoints.V1.Channel.Leave.ActionName]: AuthorizedMiddleware<
        Endpoints.V1.Channel.Leave.RequestBody,
        Endpoints.V1.Channel.Leave.Response
    >;
}

export const ChannelController: ChannelController = {
    async create(req, res) {
        const channel = await ChannelService.create(req.auth, req.body);
        res.json(channel);
    },

    async getOne(req, res) {
        const channel = await ChannelService.getOne(req.auth, req.body);
        res.json(channel);
    },

    async update(req, res) {
        const channel = await ChannelService.update(req.auth, req.body);
        res.json(channel);
    },

    async delete(req, res) {
        await ChannelService.delete(req.auth, req.body);
        res.sendStatus(HTTP_STATUS_CODES.OK);
    },

    async leave(req, res) {
        await ChannelService.leave(req.auth, req.body);
        res.sendStatus(HTTP_STATUS_CODES.OK);
    },

    async kick(req, res) {
        const channel = await ChannelService.kick(req.auth, req.body);
        res.json(channel);
    },

    async ban(req, res) {
        const channel = await ChannelService.ban(req.auth, req.body);
        res.json(channel);
    },

    async unban(req, res) {
        const channel = await ChannelService.unban(req.auth, req.body);
        res.json(channel);
    },

    async createInvitation(req, res) {
        const channel = await ChannelService.createInvitation(req.auth, req.body);
        res.json(channel);
    },

    async acceptInvitation(req, res) {
        const channel = await ChannelService.acceptInvitation(req.auth, req.body);
        res.json(channel);
    },

    async deleteInvitation(req, res) {
        const channel = await ChannelService.deleteInvitation(req.auth, req.body);
        res.json(channel);
    },
};