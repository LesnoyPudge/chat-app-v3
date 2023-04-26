import { CheckBox, ChildrenAsNodeOrFunction } from '@components';
import { PropsWithChildrenAsNodeOrFunction } from '@types';
import { useField } from 'formik';
import { FC, useId } from 'react';



type OmittedKeys = 'className' | 'onChange' | 'checked' | 'id' | 'children';

type ChildrenArgs = Omit<CheckBox, 'className' | 'children'> & Required<Pick<CheckBox, 'id'>>;

type FormikCheckBox = Omit<CheckBox, OmittedKeys> & PropsWithChildrenAsNodeOrFunction<ChildrenArgs>;

export const FormikCheckBox: FC<FormikCheckBox> = ({
    children,
    ...props
}) => {
    const [{ value: checked, onChange }] = useField(props.name);
    const id = useId();

    const childrenArgs: ChildrenArgs = {
        ...props,
        id,
        checked,
        onChange,
    };

    return (
        <ChildrenAsNodeOrFunction args={childrenArgs}>
            {children}
        </ChildrenAsNodeOrFunction>
    );
};