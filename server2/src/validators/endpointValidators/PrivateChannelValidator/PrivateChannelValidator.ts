import { Endpoints, Prettify } from '@shared';
import { chainPresets } from 'src/validators/chainPresets';
import { createValidator } from 'src/validators/createValidator';
import { customChains } from 'src/validators/customChains';
import { extendedValidator } from 'src/validators/extendedValidator';



type PrivateChannelEndpointsSchema = {
    [Endpoints.V1.PrivateChannel.Create.ActionName]: Prettify<
        Endpoints.V1.PrivateChannel.Create.RequestBody
    >,
    [Endpoints.V1.PrivateChannel.GetOne.ActionName]: Prettify<
        Endpoints.V1.PrivateChannel.GetOne.RequestBody
    >,
}

const { body } = extendedValidator;

export const PrivateChannelValidator = createValidator<PrivateChannelEndpointsSchema>({
    create: (req) => ({
        targetId: (
            body('targetId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.inBanList(
                    req.auth.id,
                    req.body.targetId,
                ))
                .custom(customChains.inBanList(
                    req.body.targetId,
                    req.auth.id,
                ))
                .not()
                .custom(customChains.privateChannelAlreadyExists(
                    req.auth.id,
                    req.body.targetId,
                ))
        ),
    }),

    getOne: (req) => ({
        privateChannelId: (
            body('privateChannelId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                .custom(customChains.privateChannelMember(
                    req.auth.id,
                    req.body.privateChannelId,
                ))
        ),
    }),
});