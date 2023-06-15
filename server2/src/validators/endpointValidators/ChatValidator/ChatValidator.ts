import { Endpoints, Prettify } from '@shared';
import { chainPresets } from 'src/validators/chainPresets';
import { createValidator } from 'src/validators/createValidator';
import { customChains } from 'src/validators/customChains';
import { extendedValidator } from 'src/validators/extendedValidator';



type ChatEndpointsSchema = {
    [Endpoints.V1.Chat.GetOne.ActionName]: Prettify<
        Endpoints.V1.Chat.GetOne.RequestBody
    >,
}

const { body } = extendedValidator;

export const ChatValidator = createValidator<ChatEndpointsSchema>({    
    getOne: (req) => ({
        chatId: (
            body('chatId')
                .exists()
                .isString()
                ._sanitize()
                .notEmpty()
                ._chatExistById()
                .custom(customChains.ableToGetChat(
                    req.auth.id,
                    req.body.chatId,
                ))
        ),
    }),
});