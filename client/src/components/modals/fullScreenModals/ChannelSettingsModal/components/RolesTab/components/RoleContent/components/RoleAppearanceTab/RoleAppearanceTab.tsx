import { FormikTextInput } from '@libs';
import { FC } from 'react';
import { FieldLabel, RequiredWildcard, Separator, TextInput } from '@components';



export const RoleAppearanceTab: FC = () => {
    return (
        <>
            <FormikTextInput 
                name='name'
                label='Название роли'
                required
            >
                {(props) => (
                    <>
                        <FieldLabel htmlFor={props.id}>
                            {props.label}

                            <RequiredWildcard/>
                        </FieldLabel>    
                
                    
                        <TextInput {...props}/>
                    </>
                )}
            </FormikTextInput>
                
            <Separator spacing={24}/>

            <FieldLabel>
                <>Цвет роли</>

                <RequiredWildcard/>
            </FieldLabel>

            <div className='mb-2 text-sm'>
                <>Для участников используется цвет высшей роли, которую они имеют.</>
            </div>
        </>
    );
};