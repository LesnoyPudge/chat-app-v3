import { CheckBox, ChildrenAsNodeOrFunction } from '@components';
import { PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from '@types';
import { useField } from 'formik';
import { FC } from 'react';



interface ChildrenArgs {
    checked: boolean;
}

interface FormikCheckBox extends
PropsWithChildrenAsNodeOrFunction<ChildrenArgs>,
PropsWithClassName {
    name: string;
    label: string;
}

export const FormikCheckBox: FC<FormikCheckBox> = ({
    className = '',
    name,
    label,
    children,
}) => {
    const [{ value: checked, onChange }] = useField(name);

    return (
        <CheckBox
            className={className}
            name={name}
            checked={checked}
            label={label}
            onChange={onChange}
        >
            <ChildrenAsNodeOrFunction args={{ checked }}>
                {children}
            </ChildrenAsNodeOrFunction>
        </CheckBox>
    );
};