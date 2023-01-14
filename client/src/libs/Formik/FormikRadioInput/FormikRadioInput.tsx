import { ChildrenAsNodeOrFunction, RadioInput } from '@components';
import { PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from '@types';
import { useField } from 'formik';
import { FC } from 'react';



interface ChildrenArgs {
    checked: boolean;
}

interface FormikRadioInput extends
PropsWithChildrenAsNodeOrFunction<ChildrenArgs>,
PropsWithClassName {
    name: string;
    label: string;
    value: string | number;
}

export const FormikRadioInput: FC<FormikRadioInput> = ({
    className = '',
    name,
    label,
    value,
    children,
}) => {
    const [{ value: radioGroupValue, onChange }] = useField(name);
    const checked = radioGroupValue === value;

    return (
        <RadioInput
            className={className}
            name={name}
            checked={checked}
            label={label}
            value={value}
            onChange={onChange}
        >
            <ChildrenAsNodeOrFunction args={{ checked }}>
                {children}
            </ChildrenAsNodeOrFunction>
        </RadioInput>
    );
};