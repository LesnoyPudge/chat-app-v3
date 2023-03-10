import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { useFormikContext } from 'formik';
import { FC } from 'react';
import { Conditional, List } from '@components';
import { MessageInputBarFormValues } from '../../MessageInputBar';



const styles = {
    wrapper: 'px-2.5 py-5',
};

export const Attachments: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const { values } = useFormikContext<MessageInputBarFormValues>();

    return (
        <Conditional isRendered={!!values.attachments.length}>
            <div className={twClassNames(styles.wrapper, className)}>
                <List list={values.attachments}>
                    {(file) => (
                        <>attachment: {file.name}</>
                    )}
                </List>
            </div>
        </Conditional>
    );
};