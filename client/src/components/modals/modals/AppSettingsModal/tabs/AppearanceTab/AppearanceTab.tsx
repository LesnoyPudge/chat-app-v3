import { RadioInput, Separator, SliderInput } from '@components';
import { FC } from 'react';
import { Section, SectionTitle, SettingsGroup, SettingsGroupName } from '../components';
import { ChatExample } from './components';



export const AppearanceTab: FC = () => {
    return (
        <Section>
            <SectionTitle>
                <>Внешний вид</>
            </SectionTitle>

            <ChatExample/>

            <SettingsGroup className='mt-8'>
                <SettingsGroupName>
                    <>Тема</>
                </SettingsGroupName>
                
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
            </SettingsGroup>

            <Separator spacing={15}/>

            <SettingsGroup>
                <SettingsGroupName>
                    <>Отображение сообщений</>
                </SettingsGroupName>

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
            </SettingsGroup>

            <Separator spacing={15}/>

            <SettingsGroup>
                <SettingsGroupName>
                    <>Масштабирование текста в чате</>
                </SettingsGroupName>

                <SliderInput 
                    name='messageGroupSpacing'
                    start={14}
                    range={[12, 14, 15, 16, 18, 20]}
                />
            </SettingsGroup>

            <SettingsGroup className='mt-5'>
                <SettingsGroupName>
                    <>Расстояние между группами сообщений</>
                </SettingsGroupName>

                <SliderInput 
                    name='messageGroupSpacing'
                    start={4}
                    range={[0, 4, 8, 16, 24]}
                />
            </SettingsGroup>
        </Section>
    );
};