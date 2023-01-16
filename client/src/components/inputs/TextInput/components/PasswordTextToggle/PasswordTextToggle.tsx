import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { FC, useState } from 'react';
import { ChildrenAsNodeOrFunction } from '@components';



type FieldType = 'text' | 'password';

interface ChildrenArgs {
    type: FieldType;
    setType: (type: FieldType) => void;
    toggleType: () => void;
}

interface PasswordTextToggle extends PropsWithChildrenAsNodeOrFunction<ChildrenArgs> {
    initialType?: FieldType;
}

export const PasswordTextToggle: FC<PasswordTextToggle> = ({
    initialType = 'password',
    children,
}) => {
    const [type, setType] = useState(initialType);

    const toggleType = () => setType((prev) => prev === 'password' ? 'text' : 'password');

    const childrenArgs: ChildrenArgs = {
        type,
        setType,
        toggleType,
    };

    return (
        <ChildrenAsNodeOrFunction args={childrenArgs}>
            {children}
        </ChildrenAsNodeOrFunction>
    );
};