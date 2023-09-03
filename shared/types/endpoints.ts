import { capitalize } from '../utils';
import { ENTITY_NAMES } from '../vars';
import { METHOD, Override, Prettify, WithChannelId, WithChatId, WithFileId, WithMessageId, WithPrivateChannelId, WithRoleId, WithRoomId, WithTargetId } from './common';
import { Entities } from './entities';



const v1 = <T extends string>(path: T): `/api/v1${T}` => `/api/v1${path}`;

const actionNameWithEntity = <EntityName extends keyof typeof Endpoints.V1, Action extends string>(
    entity: EntityName,
    action: Action,
): `${EntityName}${Capitalize<Action>}` => {
    return `${entity}${capitalize(action)}`;
};

export module Endpoints {
    export module V1 {
        export module User {
            export module Registration {
                export const Path = v1('/user/registration');

                export const ActionName = 'registration';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.USER, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = {
                    login: string;
                    username: string;
                    password: string;
                    email?: string;
                }

                export type Response = Entities.User.WithoutCredentials;
            }

            export module Login {
                export const Path = v1('/user/login');

                export const ActionName = 'login';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.USER, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = {
                    login: string;
                    password: string;
                }

                export type Response = Entities.User.WithoutCredentials;
            }

            export module Logout {
                export const Path = v1('/user/logout');

                export const ActionName = 'logout';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.USER, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = void;

                export type Response = void;
            }

            export module Refresh {
                export const Path = v1('/user/refresh');

                export const ActionName = 'refresh';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.USER, ActionName);

                export const Method = METHOD.GET;

                export type RequestBody = void;

                export type Response = Entities.User.WithoutCredentials;
            }

            export module GetOne {
                export const Path = v1('/user');

                export const ActionName = 'getOne';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.USER, ActionName);

                export const Method = METHOD.GET;

                export type RequestBody = WithTargetId;

                export type Response = Entities.User.WithoutCredentials;
            }

            export module ProfileUpdate {
                export const Path = v1('/user/profile/update');

                export const ActionName = 'profileUpdate';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.USER, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = Prettify<Partial<Pick<
                    Entities.User.Default,
                    'username' | 'settings' | 'extraStatus'
                > & Override<
                    Entities.User.Default,
                    'avatarId',
                    Entities.File.Encoded | null
                >>>;

                export type Response = Entities.User.WithoutCredentials;
            }

            export module CredentialsUpdate {
                export const Path = v1('/user/credentials/update');

                export const ActionName = 'credentialsUpdate';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.USER, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = Prettify<Pick<
                    Entities.User.Default,
                    'password'
                > & Override<Entities.User.Default, 'accessCode', string> & {
                    newPassword?: string;
                    newEmail?: string;
                    newLogin?: string;
                }>;

                export type Response = Entities.User.WithoutCredentials;
            }

            export module Delete {
                export const Path = v1('/user/delete');

                export const ActionName = 'delete';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.USER, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = void;

                export type Response = void;
            }

            export module Block {
                export const Path = v1('/user/block');

                export const ActionName = 'block';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.USER, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithTargetId;

                export type Response = Entities.User.WithoutCredentials;
            }

            export module Unblock {
                export const Path = v1('/user/unblock');

                export const ActionName = 'unblock';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.USER, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithTargetId;

                export type Response = Entities.User.WithoutCredentials;
            }

            export module RequestAccessCode {
                export const Path = v1('/user/access-code/request');

                export const ActionName = 'requestAccessCode';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.USER, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = void;

                export type Response = void;
            }

            export module VerifyAccessCode {
                export const Path = v1('/user/access-code/verify');

                export const ActionName = 'verifyAccessCode';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.USER, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = Override<Entities.User.Default, 'accessCode', string>;

                export type Response = void;
            }

            export module SendFriendRequest {
                export const Path = v1('/user/friend-request/send');

                export const ActionName = 'sendFriendRequest';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.USER, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithTargetId;

                export type Response = Entities.User.WithoutCredentials;
            }

            export module AcceptFriendRequest {
                export const Path = v1('/user/friend-request/accept');

                export const ActionName = 'acceptFriendRequest';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.USER, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithTargetId;

                export type Response = Entities.User.WithoutCredentials;
            }

            export module DeclineFriendRequest {
                export const Path = v1('/user/friend-request/decline');

                export const ActionName = 'declineFriendRequest';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.USER, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithTargetId;

                export type Response = Entities.User.WithoutCredentials;
            }

            export module RevokeFriendRequest {
                export const Path = v1('/user/friend-request/revoke');

                export const ActionName = 'revokeFriendRequest';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.USER, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithTargetId;

                export type Response = Entities.User.WithoutCredentials;
            }

            export module DeleteFriend {
                export const Path = v1('/user/friend/delete');

                export const ActionName = 'deleteFriend';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.USER, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithTargetId;

                export type Response = Entities.User.WithoutCredentials;
            }

            export module HidePrivateChannel {
                export const Path = v1('/user/hide-private-channel');

                export const ActionName = 'hidePrivateChannel';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.USER, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithPrivateChannelId;

                export type Response = Entities.User.WithoutCredentials;
            }
        }

        export module Channel {
            export module Create {
                export const Path = v1('/channel/create');

                export const ActionName = 'create';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.CHANNEL, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = Prettify<Pick<
                    Entities.Channel.Default,
                    'name' | 'identifier'
                > & Partial<Override<
                    Entities.Channel.Default,
                    'avatar',
                    Entities.File.Encoded
                >>>;

                export type Response = Entities.Channel.Default;
            }

            export module GetOne {
                export const Path = v1('/channel');

                export const ActionName = 'getOne';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.CHANNEL, ActionName);

                export const Method = METHOD.GET;

                export type RequestBody = WithChannelId;

                export type Response = Entities.Channel.Default;
            }

            export module Update {
                export const Path = v1('/channel/update');

                export const ActionName = 'update';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.CHANNEL, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = Prettify<WithChannelId & Partial<Pick<
                    Entities.Channel.Default,
                    'name'
                > & Override<
                    Entities.Channel.Default,
                    'avatar',
                    Entities.File.Encoded | null
                >>>;

                export type Response = Entities.Channel.Default;
            }

            export module Delete {
                export const Path = v1('/channel/delete');

                export const ActionName = 'delete';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.CHANNEL, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithChannelId;

                export type Response = void;
            }

            export module Leave {
                export const Path = v1('/channel/leave');

                export const ActionName = 'leave';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.CHANNEL, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithChannelId;

                export type Response = void;
            }

            export module Kick {
                export const Path = v1('/channel/kick');

                export const ActionName = 'kick';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.CHANNEL, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithChannelId & WithTargetId;

                export type Response = Entities.Channel.Default;
            }

            export module Ban {
                export const Path = v1('/channel/ban');

                export const ActionName = 'ban';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.CHANNEL, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = Prettify<WithChannelId & WithTargetId & Pick<
                    Entities.Channel.Default['banned'][number],
                    'reason'
                >>;

                export type Response = Entities.Channel.Default;
            }

            export module Unban {
                export const Path = v1('/channel/unban');

                export const ActionName = 'unban';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.CHANNEL, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithTargetId & WithChannelId;

                export type Response = Entities.Channel.Default;
            }

            export module CreateInvitation {
                export const Path = v1('/channel/invitation/create');

                export const ActionName = 'createInvitation';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.CHANNEL, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = Prettify<WithChannelId & Pick<
                    Entities.Channel.Default['invitations'][number],
                    'expiresAt'
                >>;

                export type Response = Entities.Channel.Default;
            }

            export module AcceptInvitation {
                export const Path = v1('/channel/invitation/accept');

                export const ActionName = 'acceptInvitation';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.CHANNEL, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = Prettify<Pick<
                    Entities.Channel.Default['invitations'][number],
                    'code'
                >>;

                export type Response = Entities.Channel.Default;
            }

            export module DeleteInvitation {
                export const Path = v1('/channel/invitation/delete');

                export const ActionName = 'deleteInvitation';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.CHANNEL, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = Prettify<WithChannelId & Pick<
                    Entities.Channel.Default['invitations'][number],
                    'code'
                >>;

                export type Response = Entities.Channel.Default;
            }
        }

        export module Room {
            export module Create {
                export const Path = v1('/room/create');

                export const ActionName = 'create';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.ROOM, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = Prettify<WithChannelId & Pick<
                    Entities.Room.Default,
                    'name' | 'type' | 'isPrivate' | 'whiteList'
                >>;

                export type Response = Entities.Room.Default;
            }

            export module GetOne {
                export const Path = v1('/room');

                export const ActionName = 'getOne';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.ROOM, ActionName);

                export const Method = METHOD.GET;

                export type RequestBody = WithChannelId & WithRoomId;

                export type Response = Entities.Room.Default;
            }

            export module Update {
                export const Path = v1('/room/update');

                export const ActionName = 'update';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.ROOM, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = Prettify<WithChannelId & WithRoomId & Partial<Pick<
                    Entities.Room.Default,
                    'name' | 'type' | 'isPrivate' | 'whiteList'
                >>>;

                export type Response = Entities.Room.Default;
            }

            export module Delete {
                export const Path = v1('/room/delete');

                export const ActionName = 'delete';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.ROOM, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithChannelId & WithRoomId;

                export type Response = void;
            }
        }

        export module Role {
            export module Create {
                export const Path = v1('/role/create');

                export const ActionName = 'create';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.ROLE, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithChannelId & Pick<
                    Entities.Role.Default,
                    'name'
                >;

                export type Response = Entities.Role.Default;
            }

            export module GetOne {
                export const Path = v1('/role');

                export const ActionName = 'getOne';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.ROLE, ActionName);

                export const Method = METHOD.GET;

                export type RequestBody = WithChannelId & WithRoleId;

                export type Response = Entities.Role.Default;
            }

            export module Update {
                export const Path = v1('/role/update');

                export const ActionName = 'update';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.ROLE, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = Prettify<WithChannelId & WithRoleId & Partial<Pick<
                    Entities.Role.Default,
                    'color' | 'isDefault' | 'name' | 'permissions'
                >> & Partial<Override<
                    Entities.Role.Default,
                    'image',
                    Entities.File.Encoded | null
                >>>;

                export type Response = Entities.Role.Default;
            }

            export module Delete {
                export const Path = v1('/role/delete');

                export const ActionName = 'delete';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.ROLE, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithChannelId & WithRoleId;

                export type Response = void;
            }

            export module AddMember {
                export const Path = v1('/role/member/add');

                export const ActionName = 'addMember';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.ROLE, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithChannelId & WithRoleId & WithTargetId;

                export type Response = Entities.Role.Default;
            }

            export module RemoveMember {
                export const Path = v1('/role/member/remove');

                export const ActionName = 'removeMember';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.ROLE, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithChannelId & WithRoleId & WithTargetId;

                export type Response = Entities.Role.Default;
            }
        }

        export module PrivateChannel {
            export module Create {
                export const Path = v1('/private-channel/create');

                export const ActionName = 'create';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.PRIVATE_CHANNEL, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithTargetId;

                export type Response = Entities.PrivateChannel.Default;
            }

            export module GetOne {
                export const Path = v1('/private-channel');

                export const ActionName = 'getOne';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.PRIVATE_CHANNEL, ActionName);

                export const Method = METHOD.GET;

                export type RequestBody = WithPrivateChannelId;

                export type Response = Entities.PrivateChannel.Default;
            }
        }

        export module Message {
            export module Create {
                export const Path = v1('/message/create');

                export const ActionName = 'create';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.MESSAGE, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithChatId & Partial<Pick<
                    Entities.Message.Default,
                    'content'
                > & Override<
                    Entities.Message.Default,
                    'attachments',
                    Entities.File.Encoded[]
                >>;

                export type Response = Entities.Message.Default;
            }

            export module GetOne {
                export const Path = v1('/message');

                export const ActionName = 'getOne';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.MESSAGE, ActionName);

                export const Method = METHOD.GET;

                export type RequestBody = WithMessageId;

                export type Response = Entities.Message.Default;
            }

            export module Update {
                export const Path = v1('/message/update');

                export const ActionName = 'update';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.MESSAGE, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = Prettify<WithMessageId & Pick<
                    Entities.Message.Default,
                    'content'
                >>;

                export type Response = Entities.Message.Default;
            }

            export module Delete {
                export const Path = v1('/message/delete');

                export const ActionName = 'delete';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.MESSAGE, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithMessageId;

                export type Response = Entities.Message.Default;
            }

            export module Restore {
                export const Path = v1('/message/restore');

                export const ActionName = 'restore';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.MESSAGE, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithMessageId;

                export type Response = Entities.Message.Default;
            }

            export module DeleteAttachment {
                export const Path = v1('/message/attachment/delete');

                export const ActionName = 'deleteAttachment';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.MESSAGE, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithMessageId & WithFileId;

                export type Response = Entities.Message.Default;
            }
        }

        export module File {
            export module Read {
                export const Path = v1('/file/read');

                export const ActionName = 'read';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.FILE, ActionName);

                export const Method = METHOD.GET;

                export type RequestBody = WithFileId;

                export type Response = void;
            }

            export module Download {
                export const Path = v1('/file/download');

                export const ActionName = 'download';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.FILE, ActionName);

                export const Method = METHOD.GET;

                export type RequestBody = WithFileId;

                export type Response = void;
            }
        }

        export module Chat {
            export module GetOne {
                export const Path = v1('/chat');

                export const ActionName = 'getOne';

                export const ActionNameWithEntity = actionNameWithEntity(ENTITY_NAMES.CHAT, ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithChatId;

                export type Response = Entities.Chat.Default;
            }
        }

        export module Helper {
            export module GetAvailableTextRoomIds {
                export const Path = v1('/helper/getAvailableTextRoomIds');

                export const ActionName = 'getAvailableTextRoomIds';

                export const ActionNameWithEntity = actionNameWithEntity('Helper', ActionName);

                export const Method = METHOD.POST;

                export type RequestBody = WithChannelId;

                export type Response = Entities.Room.Default['id'][];
            }
        }
    }
}