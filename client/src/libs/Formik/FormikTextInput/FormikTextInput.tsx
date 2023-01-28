import { FC, useId } from 'react';
import { useField } from 'formik';
import { ChildrenAsNodeOrFunction, TextInput } from '@components';
import { conditional } from '@utils';
import { PropsWithChildrenAsNodeOrFunction } from '@types';



type OmitedKeys = 'className' | 'onChange' | 'value' | 'error' | 'children';

type ChildrenArgs = TextInput & {
    id: string;
};

type FormikTextInput = Omit<TextInput, OmitedKeys> & PropsWithChildrenAsNodeOrFunction<ChildrenArgs>;

export const FormikTextInput: FC<FormikTextInput> = ({
    children,
    ...props
}) => {
    const { name } = props;

    const [{ value, onChange }, meta] = useField(name);
    const id = useId();
    const error = conditional(meta.error!, '', !!meta.error && meta.touched);

    const childrenArgs: ChildrenArgs = {
        ...props,
        id,
        error,
        value,
        onChange,
    };

    return (
        <ChildrenAsNodeOrFunction args={childrenArgs}>
            {children}
        </ChildrenAsNodeOrFunction>
    );
};