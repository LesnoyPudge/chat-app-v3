import { FormikFileInput, FormikTextInput } from '@libs';
import { FC, useContext } from 'react';
import { FieldLabel, RequiredWildcard, Separator, TextInput, Image, Button,SpriteImage, ChannelSettingsModalFormValues, TabContext, TabPanel, FileInput, ToDo } from '@components';
import { RoleColor } from './components';
import { useFormikContext } from 'formik';
import { RoleContentTabs } from '../..';
import { KBToBytes } from '@utils';
import { MIME } from '@vars';
import { useMemoSelector } from '@redux/hooks';
import { RoleSelectors } from '@redux/features';



const styles = {
    wrapper: 'pb-[60px]',
    roleColor: 'mb-4',
    roleImageDescription: 'text-sm text-color-secondary mb-4',
    fileInputsArea: 'flex gap-4',
    firstFileInputWrapper: 'grid place-items-center w-[80px] h-[80px] overflow-hidden rounded bg-primary-300',
    firstFileInputImage: 'w-full h-full',
    firstFileInputIcon: 'w-6 h-6 fill-icon-100',
    secondFileInputWrapper: 'relative flex',
};

export const RoleAppearanceTab: FC = () => {
    const { values } = useFormikContext<ChannelSettingsModalFormValues>();
    const { tabPanelProps } = useContext<TabContext<RoleContentTabs>>(TabContext);
    const roleImage = useMemoSelector((state) => RoleSelectors.selectById(values.roleId)(state)?.image, []);

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

            <FormikFileInput
                name='roleImage'
                label='Значок роли'
                options={{
                    accept: MIME.IMAGES,
                    amountLimit: 1,
                    sizeLimit: KBToBytes(256),
                }}
            >
                {({ value, fileInputProps }) => (
                    <div className={styles.fileInputsArea}>
                        <FileInput {...fileInputProps}>
                            <div className={styles.firstFileInputWrapper}>
                                <ToDo text='изменить контекст с ролью, сделать entityprovider.role'>
                                    <If condition={!!roleImage || !!value}>
                                        <Image
                                            className={styles.firstFileInputImage}
                                            src={roleImage || value?.base64}
                                            alt='Значок роли'
                                        />
                                    </If>

                                    <If condition={!(!!roleImage || !!value)}>
                                        <SpriteImage
                                            className={styles.firstFileInputIcon}
                                            name='ADD_IMAGE_ICON'
                                        />
                                    </If>
                                </ToDo>
                            </div>
                        </FileInput>

                        <Button
                            className={styles.secondFileInputWrapper}
                            stylingPreset='brandNeutral'
                            size='medium'
                            hidden
                        >
                            <>Выберите изображение</>

                            <FileInput {...fileInputProps}/>
                        </Button>
                    </div>
                )}
            </FormikFileInput>
        </TabPanel>
    );
};