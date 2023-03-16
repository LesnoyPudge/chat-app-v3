import { PropsWithClassName, Size } from '@types';
import { twClassNames } from '@utils';
import { useFormikContext } from 'formik';
import { FC, useContext, useRef } from 'react';
import { Button, Conditional, Icon, Image, List, RefContextProvider, Scrollable, Tooltip } from '@components';
import { MessageInputBarFormValues } from '../../MessageInputBar';
import { FormikFileUploadContext } from '@libs';
import fileTextImage from '@assets/file-text-image.svg';



const styles = {
    list: 'flex flex-1 gap-6 py-5',
    item: 'flex flex-col gap-2 relative h-[216px] w-[216px] shrink-0 p-2 bg-primary-300',
    buttonWrapper: 'absolute top-0 right-0 translate-x-[25%] -translate-y-[25%] shadow-elevation-low',
    button: 'w-8 h-8 p-1.5 rounded-md bg-primary-400 hover:bg-primary-200 focus-visible:bg-primary-200',
    icon: 'w-full h-full fill-danger',
    imageWrapper: 'flex justify-center items-center flex-1 overflow-hidden',
    image: 'w-auto h-auto max-h-full object-contain m-auto',
    imageAsIcon: 'w-[72px] h-[96px]',
    fileName: 'text-sm truncate',
};

export const Attachments: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const { values } = useFormikContext<MessageInputBarFormValues>();
    const { removeFile } = useContext(FormikFileUploadContext) as FormikFileUploadContext;
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleContentResize = (size: Size) => {
        if (!wrapperRef.current) return;
        wrapperRef.current.style.height = size.height + 'px';
    };

    return (
        <Conditional isRendered={!!values.attachments.length}>
            <div ref={wrapperRef}>
                <Scrollable 
                    className='h-full'
                    direction='horizontal'
                    onContentResize={handleContentResize}
                >
                    <ul className={twClassNames(styles.list, className)}>
                        <List list={values.attachments}>
                            {(file, index) => {
                                const fileIsImage = file.type.includes('image');
                                const imageProps = {
                                    src: fileIsImage ? null : fileTextImage,
                                    file: fileIsImage ? file : null,
                                };

                                return (
                                    <li className={styles.item}>
                                        <div className={styles.buttonWrapper}>
                                            <RefContextProvider>
                                                <Button
                                                    className={styles.button}
                                                    label='Удалить вложение'
                                                    onLeftClick={() => removeFile(index)}
                                                >
                                                    <Icon
                                                        className={styles.icon}
                                                        iconId='garbage-can-icon'
                                                    />
                                                </Button>
                                                <Tooltip preferredAlignment='top'>
                                                    <>Удалить вложение</>
                                                </Tooltip>
                                            </RefContextProvider>
                                        </div>

                                        <div className={styles.imageWrapper}>
                                            <Image
                                                className={twClassNames(
                                                    styles.image,
                                                    { [styles.imageAsIcon]: !fileIsImage },
                                                )}
                                                alt={`Вложение ${file.name}`}
                                                {...imageProps}
                                            />
                                        </div>

                                        <div className={styles.fileName}>
                                            {file.name}
                                        </div>
                                    </li>
                                );
                            }}
                        </List>
                    </ul>
                </Scrollable>
            </div>
        </Conditional>
    );
};