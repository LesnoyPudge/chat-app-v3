import { ArrowFocusContextProvider, ArrowFocusItem, Button, ChannelSettingsModalFormValues, FieldLabel, RequiredWildcard } from '@components';
import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FormikContextType, useFormikContext } from 'formik';
import { FC } from 'react';



const colors = [
    'rgb(26, 188, 156)',
    'rgb(46, 204, 113)',
    'rgb(52, 152, 219)',
    'rgb(155, 89, 182)',
    'rgb(233, 30, 99)',
    'rgb(241, 196, 15)',
    'rgb(230, 126, 34)',
    'rgb(231, 76, 60)',
    'rgb(149, 165, 166)',
    'rgb(96, 125, 139)',
    'rgb(17, 128, 106)',
    'rgb(31, 139, 76)',
    'rgb(32, 102, 148)',
    'rgb(113, 54, 138)',
    'rgb(173, 20, 87)',
    'rgb(194, 124, 14)',
    'rgb(168, 67, 0)',
    'rgb(153, 45, 34)',
    'rgb(151, 156, 159)',
    'rgb(84, 110, 122)',
];

const defaultColor = '';

export const RoleColor: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const { setFieldValue, values } = useFormikContext() as FormikContextType<ChannelSettingsModalFormValues>;

    const setColor = (color: string) => setFieldValue('roleColor', color);

    return (
        <div className={twClassNames(className)}>
            <FieldLabel>
                <>Цвет роли</>

                <RequiredWildcard/>
            </FieldLabel>

            <div className='mb-2 text-sm'>
                <>Для участников используется цвет высшей роли, которую они имеют.</>
            </div>
            
            <ArrowFocusContextProvider 
                list={[]} 
                orientation='horizontal'
            >
                <div className='flex gap-2.5'>
                    <Button 
                        className='flex shrink-0 w-[66px] h-[50px] rounded bg-sky-600'
                        onLeftClick={() => setColor(defaultColor)}
                    >
                        <>default</>
                    </Button>

                    <Button className='flex shrink-0 w-[66px] h-[50px] rounded bg-rose-600'>
                        <>custom</>
                    </Button>

                    <div className='flex gap-2.5 flex-wrap'>
                        {colors.map((color) => (
                            <ArrowFocusItem 
                                className='text-0' 
                                id={color} 
                                key={color}
                            >
                                {({ tabIndex }) => (
                                    <Button
                                        className='w-5 h-5 rounded'
                                        style={{
                                            backgroundColor: color,
                                        }}
                                        tabIndex={tabIndex}
                                        label={`Выбрать цвет ${color}`}
                                        onLeftClick={() => setColor(color)}
                                    ></Button>
                                )}
                            </ArrowFocusItem>
                        ))}
                    </div>
                </div>
            </ArrowFocusContextProvider>
        </div>
    );
};