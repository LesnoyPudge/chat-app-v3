import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { useFormikContext } from 'formik';
import { FC, useContext } from 'react';
import { Button, Conditional, List } from '@components';
import { MessageInputBarFormValues } from '../../MessageInputBar';
import { FormikFileUploadContext } from '@libs';



const styles = {
    wrapper: 'flex flex-col px-2.5 py-5',
};

export const Attachments: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const { values } = useFormikContext<MessageInputBarFormValues>();
    const { removeFile } = useContext(FormikFileUploadContext) as FormikFileUploadContext;
    

    return (
        <Conditional isRendered={!!values.attachments.length}>
            <div className={twClassNames(styles.wrapper, className)}>
                <List list={values.attachments}>
                    {(file, index) => (
                        <div className='flex gap-2'>
                            <div>attachment: {file.name}</div>

                            <Button onLeftClick={() => removeFile(index)}>
                                <>X</>
                            </Button>
                        </div>
                    )}
                </List>
            </div>
        </Conditional>
    );
};