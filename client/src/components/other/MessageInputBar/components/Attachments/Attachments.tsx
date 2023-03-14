import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { useFormikContext } from 'formik';
import { FC, useContext } from 'react';
import { Button, Conditional, Icon, Image, List, RefContextProvider, Scrollable, Tooltip } from '@components';
import { MessageInputBarFormValues } from '../../MessageInputBar';
import { FormikFileUploadContext } from '@libs';
import fileTextImage from '@assets/file-text-image.svg';



const styles = {
    list: 'flex flex-1 gap-6 px-2.5 py-4',
};

export const Attachments: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const { values } = useFormikContext<MessageInputBarFormValues>();
    const { removeFile } = useContext(FormikFileUploadContext) as FormikFileUploadContext;

    return (
        <Conditional isRendered={!!values.attachments.length}>
            <div 
                className='h-[248px]'
            >
                <Scrollable 
                    className='h-full'
                    direction='horizontal'
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
                                    <li className='flex flex-col gap-2 relative h-[216px] w-[216px] shrink-0 p-2 bg-primary-300'>
                                        <div className='absolute top-0 right-0 translate-x-[25%] shadow-elevation-low'>
                                            <RefContextProvider>
                                                <Button 
                                                    className={'w-8 h-8 p-1.5 rounded-md bg-primary-400 hover:bg-primary-200 focus-visible:bg-primary-200'}
                                                    label='Удалить вложение'
                                                    onLeftClick={() => removeFile(index)}
                                                >
                                                    <Icon
                                                        className='w-full h-full fill-danger'
                                                        iconId='garbage-can-icon'
                                                    />
                                                </Button>

                                                <Tooltip preferredAlignment='top'>
                                                    <>Удалить вложение</>
                                                </Tooltip>
                                            </RefContextProvider>
                                        </div>
                                
                                        <div className='flex justify-center items-center flex-1 overflow-hidden'>
                                            <Image
                                                className={twClassNames(
                                                    'w-auto h-auto max-h-full object-contain m-auto',
                                                    { 'w-[72px] h-[96px]': !fileIsImage },
                                                )}
                                                alt={`Вложение ${file.name}`}
                                                {...imageProps}
                                            />
                                        </div>

                                        <div className='text-sm truncate'>
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