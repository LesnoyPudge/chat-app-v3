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
                    start={0}
                    range={{
                        min: [12, 12],
                        '16.6667%': [14, 14],
                        '25%': [15, 15],
                        '33.3333%': [16, 16],
                        '50%': [18, 18],
                        '66.6667%': [20, 20],
                        max: [24, 24],
                    }}
                />
            </SettingsGroup>

            <SettingsGroup className='mt-5'>
                <SettingsGroupName>
                    <>Расстояние между группами сообщений</>
                </SettingsGroupName>

                <SliderInput 
                    name='messageGroupSpacing'
                    start={0}
                    range={{
                        min: [0, 0],
                        '16.6667%': [4, 4],
                        '33.3333%': [8, 8],
                        '66.6667%': [16, 16],
                        max: [24, 24],
                    }}
                />
            </SettingsGroup>
        </Section>
    );
};