import { ColorPicker } from '@components';
import { useField } from 'formik';
import { FC } from 'react';



type OmitedKeys = 'color' | 'onChange';

interface FormikColorPicker extends Omit<ColorPicker, OmitedKeys> {
    name: string;
}

export const FormikColorPicker: FC<FormikColorPicker> = ({
    className = '',
    colorPresets,
    name,
}) => {
    const [{ value }, _, { setValue }] = useField(name);

    return (
        <ColorPicker
            className={className}
            color={value}
            colorPresets={colorPresets}
            onChange={setValue}
        />
    );
};