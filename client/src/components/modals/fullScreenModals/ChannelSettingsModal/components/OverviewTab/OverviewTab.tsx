import { Button, ChannelSettingsModalTabs, CheckBoxIndicatorSlide, FieldLabel, Separator, TabContext, TabPanel, TextInput,SpriteImage, CheckBox, FileInput, ChannelAvatar, LoadedEntityContext } from '@components';
import { FormikCheckBox, FormikFileInput, FormikTextInput } from '@libs';
import { MBToBytes } from '@utils';
import { FC, useContext } from 'react';
import { TabTitle } from '../../../components';
import { MIME } from '@vars';



const styles = {
    wrapper: 'pt-[60px] pl-10',
    firstSection: 'grid grid-cols-2 gap-5',
    sectionSide: 'flex gap-5',
    avatarSide: 'flex-shrink-0',
    removeFile: 'w-full mt-1.5',
    firstFileInput: 'w-[100px] h-[100px] rounded-full relative group bg-primary-300',
    channelImage: 'h-full w-full rounded-full',
    channelImageOverlay: `grid place-items-center absolute inset-0 
    rounded-full opacity-0 bg-black/80 pointer-events-none 
    group-focus-within:opacity-100 group-hover:opacity-100 transition-all`,
    overlayText: 'uppercase font-bold text-2xs text-white text-center',
    addFileIconWrapper: `absolute top-0 right-0  w-7 h-7 
    p-1 rounded-full bg-primary-600 pointer-events-none shadow-elevation-high`,
    addFileIcon: 'w-full h-full fill-icon-200',
    fileRecommendation: 'text-sm text-color-secondary mb-4',
    secondFileInputWrapper: 'w-full relative',
    secondFileInput: 'absolute inset-0',
    checkBox: 'flex gap-2',
    checkBoxText: 'font-medium mr-auto',
};

export const OverviewTab: FC = () => {
    const { tabPanelProps } = useContext<TabContext<ChannelSettingsModalTabs>>(TabContext);
    const [channel] = useContext(LoadedEntityContext.Channel);

    return (
        <TabPanel
            className={styles.wrapper}
            {...tabPanelProps.overviewTab}
        >
            <TabTitle>
                <>Обзор канала</>
            </TabTitle>

            <div className={styles.firstSection}>
                <FormikFileInput
                    label='Сменить значок канала'
                    name='channelImage'
                    options={{
                        accept: MIME.IMAGES,
                        amountLimit: 1,
                        sizeLimit: MBToBytes(1),
                    }}
                >
                    {({ value, fileInputProps, removeFiles }) => (
                        <div className={styles.sectionSide}>
                            <div className={styles.avatarSide}>
                                <FileInput
                                    className={styles.firstFileInput}
                                    {...fileInputProps}
                                >
                                    <ChannelAvatar
                                        className={styles.channelImage}
                                        avatar={value?.base64}
                                        name={channel.name}
                                    />

                                    <div className={styles.channelImageOverlay}>
                                        <div className={styles.overlayText}>
                                            <>Сменить <br/> значок</>
                                        </div>
                                    </div>

                                    <div className={styles.addFileIconWrapper}>
                                        <SpriteImage
                                            className={styles.addFileIcon}
                                            name='ADD_FILE_ICON'
                                        />
                                    </div>
                                </FileInput>

                                <Button
                                    className={styles.removeFile}
                                    stylingPreset='lite'
                                    size='small'
                                    label='Удалить изображение'
                                    onLeftClick={removeFiles}
                                >
                                    <>Удалить</>
                                </Button>
                            </div>

                            <div>
                                <div className={styles.fileRecommendation}>
                                    <>Мы рекомендуем для вашего сервера </>
                                    <>изображение размером не менее 512х512 пикселей.</>
                                </div>

                                <Button
                                    className={styles.secondFileInputWrapper}
                                    stylingPreset='brandNeutral'
                                    size='medium'
                                    hidden
                                >
                                    <>Загрузить изображение</>

                                    <FileInput
                                        className={styles.secondFileInput}
                                        {...fileInputProps}
                                    />
                                </Button>
                            </div>
                        </div>
                    )}
                </FormikFileInput>

                <FormikTextInput
                    name='channelName'
                    label='Название сервера'
                    required
                >
                    {(props) => (
                        <div>
                            <FieldLabel htmlFor={props.id}>
                                {props.label}
                            </FieldLabel>

                            <TextInput {...props}/>
                        </div>
                    )}
                </FormikTextInput>
            </div>

            <Separator spacing={40}/>

            <FormikCheckBox
                label='Приватность канала'
                name='channelIsPrivate'
            >
                {(props) => (
                    <CheckBox
                        className={styles.checkBox}
                        {...props}
                    >
                        <div className={styles.checkBoxText}>
                            <>Не отображать канал в поиске, вход только по приглашениям.</>
                        </div>

                        <CheckBoxIndicatorSlide checked={props.checked}/>
                    </CheckBox>
                )}
            </FormikCheckBox>
        </TabPanel>
    );
};