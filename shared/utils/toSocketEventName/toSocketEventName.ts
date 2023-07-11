import { ValueOf } from 'ts-essentials';
import { SOCKET_CLIENT_EVENT_NAMES, SOCKET_SERVER_EVENT_NAMES, SUBSCRIBABLE_ENTITIES } from '../../vars';



export const toSocketEventName = <
    EntityName extends ValueOf<typeof SUBSCRIBABLE_ENTITIES>,
    EventName extends ValueOf<typeof SOCKET_SERVER_EVENT_NAMES & typeof SOCKET_CLIENT_EVENT_NAMES>,
>(entityName: EntityName, event: EventName): `${EntityName}_${EventName}` => {
    return `${entityName}_${event}`;
};