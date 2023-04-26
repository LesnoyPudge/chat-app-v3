import { FC, useId } from 'react';
import { useField } from 'formik';
import { ChildrenAsNodeOrFunction, TextInput } from '@components';
import { conditional } from '@utils';
import { PropsWithChildrenAsNodeOrFunction } from '@types';



type OmittedKeys = 'className' | 'onChange' | 'value' | 'error' | 'children' | 'id';

type ChildrenArgs = Omit<TextInput, 'className'> & Required<Pick<TextInput, 'id'>>;

type FormikTextInput = Omit<TextInput, OmittedKeys> & PropsWithChildrenAsNodeOrFunction<ChildrenArgs>;

export const FormikTextInput: FC<FormikTextInput> = ({
    children,
    ...props
}) => {
    const [{ value, onChange }, meta] = useField(props.name);
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