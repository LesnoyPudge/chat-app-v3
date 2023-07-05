import { Button, ChannelSettingsModalTabs, Image, CheckBoxIndicatorSlide, FieldLabel, Separator, TabContext, TabPanel, TextInput, Icon, CheckBox } from '@components';
import { FormikCheckBox, FormikFileInput, FormikFileUploadContextProvider, FormikTextInput } from '@libs';
import { MBToBytes } from '@utils';
import { FC, useContext } from 'react';
import { TabTitle } from '../../../components';



const styles = {
    wrapper: 'pt-[60px] pl-10',
    firstSection: 'grid grid-cols-2 gap-5',
    sectionSide: 'flex gap-5',
    removeFile: 'w-full mt-1.5',
    firstFileInput: 'w-[100px] h-[100px] rounded-full relative group bg-primary-300',
    channelImage: 'h-full w-full rounded-full',
    channelImageOverlay: `grid place-items-center absolute inset-0 
    rounded-full opacity-0 bg-black bg-opacity-40 pointer-events-none 
    group-focus-within:opacity-100 group-hover:opacity-100 transition-all`,
    overlayText: 'uppercase font-bold text-2xs text-white text-center',
    addFileIconWrapper: `absolute top-0 right-0 translate-x-1/3 w-7 h-7 
    p-1 rounded-full bg-primary-600 pointer-events-none shadow-elevation-high`,
    addFileIcon: 'w-full h-full fill-icon-200',
    fileRecommendation: 'text-sm text-color-secondary mb-4',
    secondFileInputWrapper: 'w-full relative',
    secondFileInput: 'absolute inset-0',
    checkBox: 'flex gap-2',
    checkBoxText: 'font-medium mr-auto',
};

export const OverviewTab: FC = () => {
    const { tabPanelProps } = useContext(TabContext) as TabContext<ChannelSettingsModalTabs>;
    
    return (
        <TabPanel 
            className={styles.wrapper}
            {...tabPanelProps.overviewTab}
        >
            <TabTitle>
                <>Обзор канала</>
            </TabTitle>

            <div className={styles.firstSection}>
                <FormikFileUploadContextProvider 
                    name='channelImage' 
                    label='Сменить значок канала' 
                    options={{
                        accept: 'image/*',
                        amountLimit: 1,
                        sizeLimit: MBToBytes(1),
                    }}
                >
                    {({ removeFiles }) => (
                        <div className={styles.sectionSide}>
                            <div>
                                <FormikFileInput className={styles.firstFileInput}>
                                    {({ value }) => (
                                        <>
                                            <Image
                                                className={styles.channelImage}
                                                src='https://i.pravatar.cc/150'
                                                file={value[0]}
                                                alt='Значок канала'
                                            />

                                            <div className={styles.channelImageOverlay}>
                                                <div className={styles.overlayText}>
                                                    <>Сменить <br/> значок</>
                                                </div>
                                            </div>

                                            <div className={styles.addFileIconWrapper}>
                                                <Icon
                                                    className={styles.addFileIcon}
                                                    iconId='add-file-icon'
                                                />
                                            </div>
                                        </>
                                    )}
                                </FormikFileInput>

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

                                    <FormikFileInput className={styles.secondFileInput}/>
                                </Button>
                            </div>
                        </div>
                    )}
                </FormikFileUploadContextProvider>

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