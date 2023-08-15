import { FC, createContext } from 'react';
import { Entities, WithId } from '@shared';
import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { ChildrenAsNodeOrFunction } from '@components';
import { useMemoSelector } from '@redux/hooks';
import { UserSelectors } from '@redux/features';



const UserContext = createContext(undefined as unknown as Entities.User.Preview);

const ChannelContext = createContext(undefined as unknown as Entities.Channel.Default);



const UserContextProvider: FC<WithId & PropsWithChildrenAsNodeOrFunction<Entities.User.Preview>> = ({
    id,
    children,
}) => {
    const user = useMemoSelector(UserSelectors.selectById(id));
    const contextArgs = {} as Entities.User.Preview;

    return (
        <UserContext.Provider value={contextArgs}>
            <ChildrenAsNodeOrFunction args={contextArgs}>
                {children}
            </ChildrenAsNodeOrFunction>
        </UserContext.Provider>
    );
};

export const EntityContext = {
    User: UserContext,
    Channel: ChannelContext,
};

export const EntityContextProvider = {
    User: UserContextProvider,
    Channel: ChannelContext,
};

// const Test: FC = () => {
//     return (
//         <>
//             <EntityContext.ChannelContext.Provider value={{}}>

//             </EntityContext.ChannelContext.Provider>
//         </>
//     );
// };