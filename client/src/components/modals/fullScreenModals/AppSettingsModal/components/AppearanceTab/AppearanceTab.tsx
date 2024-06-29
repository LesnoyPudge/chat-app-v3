import { AppSettingsModalTabs, RadioInputIndicator, Separator, SliderInput, TabContext, TabPanel } from '@components';
import { FormikRadioInput, HeadingLevel } from '@libs';
import { FC, useContext } from 'react';
import { SettingsGroupTitle } from '..';
import { TabTitle } from '../../../components';
import { ChatExample } from './components';



export const AppearanceTab: FC = () => {
    const { tabPanelProps } = useContext<TabContext<AppSettingsModalTabs>>(TabContext);

    return (
        <HeadingLevel>
            <TabPanel {...tabPanelProps.appearanceTab}>
                <TabTitle>
                    <>Внешний вид</>
                </TabTitle>

                <ChatExample/>

                <HeadingLevel>
                    <div className='mt-8'>
                        <SettingsGroupTitle>
                            <>Тема</>
                        </SettingsGroupTitle>

                        <div className='grid gap-2'>
                            <FormikRadioInput
                                name='theme'
                                label='Тёмная тема'
                                value='dark'
                            >
                                {({ checked }) => (
                                    <>
                                        <RadioInputIndicator checked={checked}/>

                                        <strong>Тёмная</strong>
                                    </>
                                )}
                            </FormikRadioInput>

                            <FormikRadioInput
                                name='theme'
                                label='Светлая тема'
                                value='light'
                            >
                                {({ checked }) => (
                                    <>
                                        <RadioInputIndicator checked={checked}/>

                                        <strong>Светлая</strong>
                                    </>
                                )}
                            </FormikRadioInput>

                            <FormikRadioInput
                                name='theme'
                                label='Автоматически'
                                value='auto'
                            >
                                {({ checked }) => (
                                    <>
                                        <RadioInputIndicator checked={checked}/>

                                        <strong>Синхронизация с компьютером</strong>
                                    </>
                                )}
                            </FormikRadioInput>
                        </div>
                    </div>
                </HeadingLevel>

                <Separator spacing={40}/>

                <HeadingLevel>
                    <SettingsGroupTitle>
                        <>Отображение сообщений</>
                    </SettingsGroupTitle>

                    <div className='grid gap-2'>
                        <FormikRadioInput
                            name='messageDisplayMode'
                            label='Стандартное отображение'
                            value='cozy'
                        >
                            {({ checked }) => (
                                <>
                                    <RadioInputIndicator checked={checked}/>

                                    <span>
                                        <strong>Уютно</strong>
                                        <> — современно, красиво и приятно для глаз.</>
                                    </span>
                                </>
                            )}
                        </FormikRadioInput>

                        <FormikRadioInput
                            name='messageDisplayMode'
                            label='Компактное отображение'
                            value='compact'
                        >
                            {({ checked }) => (
                                <>
                                    <RadioInputIndicator checked={checked}/>

                                    <span>
                                        <strong>Компактно</strong>
                                        <> — на экране помещается больше сообщений.</>
                                    </span>
                                </>
                            )}
                        </FormikRadioInput>
                    </div>
                </HeadingLevel>

                <Separator spacing={40}/>

                <HeadingLevel>
                    <SettingsGroupTitle>
                        <>Масштабирование текста в чате</>
                    </SettingsGroupTitle>

                    <SliderInput
                        // name='message-font-size'
                        start={14}
                        range={[12, 14, 15, 16, 18, 20]}
                    />
                </HeadingLevel>

                <HeadingLevel>
                    <div className='mt-5'>
                        <SettingsGroupTitle>
                            <>Расстояние между группами сообщений</>
                        </SettingsGroupTitle>

                        <SliderInput
                            // name='message-group-gap'
                            start={4}
                            range={[0, 4, 8, 16, 24]}
                        />
                    </div>
                </HeadingLevel>
            </TabPanel>
        </HeadingLevel>
    );
};