import { Endpoints, Prettify } from '@shared';
import { chainPresets } from 'src/validators/chainPresets';
import { createValidator } from 'src/validators/createValidator';
import { customChains } from 'src/validators/customChains';
import { extendedValidator } from 'src/validators/extendedValidator';



type FileEndpointsSchema = {
    [Endpoints.V1.Helper.GetAvailableTextRoomIds.ActionName]: Prettify<
        Endpoints.V1.Helper.GetAvailableTextRoomIds.RequestBody
    >,
}

const { body } = extendedValidator;

export const HelperValidator = createValidator<FileEndpointsSchema>({
    getAvailableTextRoomIds: (req) => ({
        channelId: (
            body('channelId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._channelExistById()
                .custom(customChains.channelMember(
                    req.auth.id,
                    req.body.channelId,
                ))
        ),
    }),
});