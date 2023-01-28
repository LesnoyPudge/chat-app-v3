import { Button, ChannelSettingsModalTabs, Image, CheckBoxIndicator, FieldLabel, Separator, TabContext, TabPanel, TextInput, Icon } from '@components';
import { FormikCheckBox, FormikFileInput, FormikTextInput } from '@libs';
import { FC, useContext } from 'react';
import { TabTitle } from '../../../components';



const styles = {
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

            <div className='grid grid-cols-2 gap-5'>
                <div className='flex gap-5'>
                    <div className='shrink-0'>
                        <FormikFileInput 
                            className='w-[100px] h-[100px] rounded-full relative group'
                            name='channelImage'
                            label='Сменить значок канала'
                        >
                            <Image
                                className='h-full w-full rounded-full'
                                src='https://via.placeholder.com/150'
                                alt='Значок канала'
                            />

                            <div className='grid place-items-center absolute inset-0 rounded-full opacity-0 bg-black bg-opacity-40 pointer-events-none group-focus-within:opacity-100 group-hover:opacity-100 transition-all'>
                                <div className='uppercase font-bold text-xxs text-white text-center'>
                                    <>Сменить <br/> значок</>
                                </div>
                            </div>

                            <div className='absolute top-0 right-0 w-7 h-7 p-1 rounded-full bg-primary-inverted-500 pointer-events-none'>
                                <Icon
                                    className='w-full h-full fill-primary-500'
                                    iconId='add-file-icon'
                                />
                            </div>
                        </FormikFileInput>

                        <Button
                            className='w-full mt-1.5'
                            stylingPreset='lite'
                            size='small'
                            label='Удалить изображение'
                            onLeftClick={() => console.log('delete')}
                        >
                            <>Удалить</>
                        </Button>
                    </div>

                    <div>
                        <div className='text-sm text-secondary mb-4'>
                            <>Мы рекомендуем для вашего сервера </>
                            <>изображение размером не менее 512х512 пикселей.</>
                        </div>


                        <Button
                            className='w-full relative'
                            stylingPreset='brandNeutral'
                            size='medium'
                            hidden
                        >
                            <>Загрузить изображение</>

                            <FormikFileInput
                                className='absolute inset-0'
                                name='channelImage' 
                                label='Сменить значок канала'
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