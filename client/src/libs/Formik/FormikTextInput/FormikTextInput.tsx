import { FC } from 'react';
import { useField } from 'formik';
import { TextInput } from '@components';
import { conditional } from '@utils';



type OmitedKeys = 'onChange' | 'value' | 'error';

type FormikTextInput = Omit<TextInput, OmitedKeys>

export const FormikTextInput: FC<FormikTextInput> = ({
    name,
    ...rest
}) => {
    const [field, meta] = useField(name);
    
    const error = conditional(meta.error, '', !!(meta.error && meta.touched));

    return (
        <TextInput
            error={error}
            {...rest}
            {...field}
        />
    );
};