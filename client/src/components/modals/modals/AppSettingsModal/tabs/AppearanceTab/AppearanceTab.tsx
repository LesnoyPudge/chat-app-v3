import { RadioInput, Separator, SliderInput } from '@components';
import { HeadingLevel } from '@libs';
import { FC } from 'react';
import { SectionTitle, SettingsGroupTitle } from '../components';
import { ChatExample } from './components';



export const AppearanceTab: FC = () => {
    return (
        <HeadingLevel>
            <div>
                <SectionTitle className='mb-5'>
                    <>Внешний вид</>
                </SectionTitle>

                <ChatExample/>

                <HeadingLevel>
                    <div className='mt-8'>
                        <SettingsGroupTitle>
                            <>Тема</>
                        </SettingsGroupTitle>
                
                        <div className='grid gap-2'>
                            <RadioInput
                                name='theme'
                                value='dark'
                                description='Тёмная'
                            />

                            <RadioInput
                                name='theme'
                                value='light'
                                description='Светлая'
                            />

                            <RadioInput
                                name='theme'
                                value='auto'
                                description='Синхронизация с компьютером'
                            />
                        </div>
                    </div>
                </HeadingLevel>

                <Separator spacing={40}/>

                <HeadingLevel>
                    <SettingsGroupTitle>
                        <>Отображение сообщений</>
                    </SettingsGroupTitle>

                    <div className='grid gap-2'>
                        <RadioInput
                            name='message-display-type'
                            value='cozy'
                            description='Уютно — современно, красиво и приятно для глаз.'
                        />

                        <RadioInput
                            name='message-display-type'
                            value='compact'
                            description='Компактно — на экране помещается больше сообщений.'
                        />
                    </div>
                </HeadingLevel>

                <Separator spacing={40}/>

                <HeadingLevel>
                    <SettingsGroupTitle>
                        <>Масштабирование текста в чате</>
                    </SettingsGroupTitle>

                    <SliderInput 
                        name='message-font-size'
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
                            name='message-group-gap'
                            start={4}
                            range={[0, 4, 8, 16, 24]}
                        />
                    </div>
                </HeadingLevel>
            </div>
        </HeadingLevel>
    );
};