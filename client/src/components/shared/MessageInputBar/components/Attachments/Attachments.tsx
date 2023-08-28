import { PropsWithClassName, Size } from '@types';
import { twClassNames } from '@utils';
import { useFormikContext } from 'formik';
import { FC, useRef } from 'react';
import { Button,SpriteImage, Image, List, Ref, Scrollable, Tooltip } from '@components';
import { MessageInputBarFormValues } from '../../MessageInputBar';
import { FormikFileInputChildrenArgs } from '@libs';
import fileTextImage from '@assets/file-text-image.svg';



type Attachments = PropsWithClassName & Pick<FormikFileInputChildrenArgs<true>, 'removeFile'>;

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

export const Attachments: FC<Attachments> = ({
    removeFile,
    className = '',
}) => {
    const { values } = useFormikContext<MessageInputBarFormValues>();
    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleContentResize = (size: Size) => {
        if (!wrapperRef.current) return;
        wrapperRef.current.style.height = size.height + 'px';
    };

    return (
        <If condition={!!values.attachments.length}>
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
                                            <Ref<HTMLButtonElement>>
                                                {(ref) => (
                                                    <>
                                                        <Button
                                                            className={styles.button}
                                                            label='Удалить вложение'
                                                            innerRef={ref}
                                                            onLeftClick={() => removeFile(index)}
                                                        >
                                                            <SpriteImage
                                                                className={styles.icon}
                                                                name='GARBAGE_CAN_ICON'
                                                            />
                                                        </Button>

                                                        <Tooltip
                                                            preferredAlignment='top'
                                                            leaderElementRef={ref}
                                                        >
                                                            <>Удалить вложение</>
                                                        </Tooltip>
                                                    </>
                                                )}
                                            </Ref>
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
        </If>
    );
};