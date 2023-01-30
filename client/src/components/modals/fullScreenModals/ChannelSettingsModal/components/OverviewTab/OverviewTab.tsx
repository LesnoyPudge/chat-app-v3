import { Button, ChannelSettingsModalTabs, Image, CheckBoxIndicator, FieldLabel, Separator, TabContext, TabPanel, TextInput, Icon } from '@components';
import { FormikCheckBox, FormikFileInput, FormikTextInput } from '@libs';
import { FC, useContext } from 'react';
import { TabTitle } from '../../../components';



const styles = {
    firstSection: 'grid grid-cols-2 gap-5',
    sectionSide: 'flex gap-5',
    removeFile: 'w-full mt-1.5',
    firstFileInput: 'w-[100px] h-[100px] rounded-full relative group',
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
    const { tabs } = useContext(TabContext) as TabContext<ChannelSettingsModalTabs>;
    
    return (
        <TabPanel
            label='Обзор канала' 
            controls={tabs.overviewTab.identifier}
        >
            <TabTitle>
                <>Обзор канала</>
            </TabTitle>

            <div className={styles.firstSection}>
                <div className={styles.sectionSide}>
                    <div>
                        <FormikFileInput 
                            className={styles.firstFileInput}
                            name='channelImage'
                            label='Сменить значок канала'
                            accept='image/*'
                        >
                            {({ value }) => (
                                <>
                                    <Image
                                        className={styles.channelImage}
                                        src='https://via.placeholder.com/150'
                                        file={value}
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
                            onLeftClick={() => console.log('delete')}
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

                            <FormikFileInput
                                className={styles.secondFileInput}
                                name='channelImage'
                                label=''
                                accept='image/*'
                                tabIndex={-1}
                            />
                        </Button>
                    </div>
                </div>

                <FormikTextInput
                    name='name'
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
                className={styles.checkBox}
                label='Приватность канала' 
                name='isPrivate'
            >
                {({ checked }) => (
                    <>
                        <div className={styles.checkBoxText}>
                            <>Не отображать канал в поиске, вход только по приглашениям.</>
                        </div>

                        <CheckBoxIndicator checked={checked}/>
                    </>
                )}
            </FormikCheckBox>
        </TabPanel>
    );
};