import { FormikFileInput, FormikTextInput } from '@libs';
import { FC, useContext } from 'react';
import { FieldLabel, RequiredWildcard, Separator, TextInput, Image, Button, Conditional, Icon, ChannelSettingsModalFormValues, TabContext, TabPanel } from '@components';
import { RoleColor } from './components';
import { FormikContextType, useFormikContext } from 'formik';
import { RoleContentTabs } from '../..';
import { KBToBytes } from '@utils';



const styles = {
    wrapper: 'pb-[60px]',
    roleColor: 'mb-4',
    roleImageDescription: 'text-sm text-color-secondary mb-4',
    fileInputsArea: 'flex gap-4',
    firstFileInputWrapper: 'grid place-items-center w-[80px] h-[80px] overflow-hidden rounded bg-primary-300',
    firstFileInputImage: 'w-full h-full',
    firstFileInputIcon: 'w-6 h-6 fill-icon-100',
    secondFileInputWrapper: 'relative flex',
    secondFileInput: 'absolute inset-0',
};

export const RoleAppearanceTab: FC = () => {
    const { values } = useFormikContext() as FormikContextType<ChannelSettingsModalFormValues>;
    const { tabPanelProps } = useContext(TabContext) as TabContext<RoleContentTabs>;
    
    return (
        <TabPanel 
            className={styles.wrapper}
            {...tabPanelProps.appearance}
        >
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

            <RoleColor className={styles.roleColor}/>

            <FieldLabel>
                <>Значок роли</>
            </FieldLabel>

            <div className={styles.roleImageDescription}>
                <>Загрузите изображение размером менее 256 Кб</>
                <>Мы советуем использовать разрешение не менее </>
                <>64 х 64 пикселя. Если у участников есть несколько </>
                <>ролей, они будут видеть значок высшей из них.</>
            </div>
            
            <div className={styles.fileInputsArea}>
                <FormikFileInput 
                    name='roleImage' 
                    label='Значок роли'
                    accept='image/*'
                    multiple={false}
                    sizeLimit={KBToBytes(256)}
                >
                    {({ value }) => (
                        <div className={styles.firstFileInputWrapper}>
                            <Conditional isRendered={!!values.roleImage || !!value.length}>
                                <Image
                                    className={styles.firstFileInputImage}
                                    src={values.roleImage}
                                    file={value[0]}
                                    alt='Значок роли'
                                />
                            </Conditional>

                            <Conditional isRendered={!values.roleImage && !value}>
                                <Icon
                                    className={styles.firstFileInputIcon}
                                    iconId='add-image-icon'
                                />
                            </Conditional>
                        </div>
                    )}
                </FormikFileInput>

                <Button
                    className={styles.secondFileInputWrapper}
                    stylingPreset='brandNeutral'
                    size='medium'
                    hidden   
                >
                    <>Выберите изображение</>

                    <FormikFileInput
                        className={styles.secondFileInput}
                        name='roleImage' 
                        label='Значок роли'
                        accept='image/*'
                        hidden
                    ></FormikFileInput>
                </Button>
            </div>
        </TabPanel>
    );
};