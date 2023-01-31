import { FormikTextInput } from '@libs';
import { FC } from 'react';
import { FieldLabel, RequiredWildcard, Separator, TextInput } from '@components';
import { RoleColor } from './components';



export const RoleAppearanceTab: FC = () => {
    return (
        <>
            <FormikTextInput 
                name='roleName'
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

            <RoleColor/>
        </>
    );
};