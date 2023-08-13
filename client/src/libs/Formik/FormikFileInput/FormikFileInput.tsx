import { ChildrenAsNodeOrFunction, FileInput } from '@components';
import { EncodedFile, PropsWithChildrenAsNodeOrFunction, PropsWithClassName } from '@types';
import { FC, useContext } from 'react';
import { FormikFileUploadContext } from '@libs';



interface ChildrenArgs {
    value: EncodedFile[];
}

interface FormikFileInput extends
PropsWithClassName,
PropsWithChildrenAsNodeOrFunction<ChildrenArgs> {
    hidden?: boolean;
}

export const FormikFileInput: FC<FormikFileInput> = ({
    className = '',
    hidden = false,
    children,
}) => {
    const { fileInputProps, value } = useContext(FormikFileUploadContext);

    const childrenArgs: ChildrenArgs = {
        value,
    };

    return (
        <FileInput
            className={className}
            hidden={hidden}
            {...fileInputProps}
        >
            <ChildrenAsNodeOrFunction args={childrenArgs}>
                {children}
            </ChildrenAsNodeOrFunction>
        </FileInput>
    );
};