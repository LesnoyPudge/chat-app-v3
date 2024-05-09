// import { ChildrenAsNodeOrFunction } from '@components';
// import { UseFileUploadErrorHandlers, UseFileUploadListener, FileUploadHandler, useFileUpload } from '@hooks';
// import { EncodedFile, PropsWithChildrenAsNodeOrFunction } from '@types';
// import { EncodeFilesOptions, noop } from '@utils';
// import { useField } from 'formik';
// import React, { createContext, useRef } from 'react';



// type AddErrorListener = Record<keyof UseFileUploadErrorHandlers, (cb: UseFileUploadListener) => void>;

// interface FileInputProps {
//     name: string;
//     label: string;
//     accept: string;
//     multiple: boolean;
//     onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// }

// export type FormikFileUploadContext<MULTIPLE extends boolean> = {
//     value: MULTIPLE extends true ? EncodedFile[] : (EncodedFile | undefined);
//     fileInputProps: FileInputProps;
//     addErrorListener: AddErrorListener;
//     removeFiles: () => void;
//     removeFile: (indexToDelete: MULTIPLE extends true ? number : void) => void;
//     handleFileUpload: FileUploadHandler;
// }

// interface FormikFileUploadContextProvider<MULTIPLE extends boolean>
// extends PropsWithChildrenAsNodeOrFunction<FormikFileUploadContext<MULTIPLE>> {
//     name: string;
//     label: string;
//     options: EncodeFilesOptions;
//     multiple?: MULTIPLE,
// }

// export const FormikFileUploadContext = createContext<FormikFileUploadContext<boolean>>();

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// export const FormikFileUploadContextProvider = <MULTIPLE extends boolean>({
//     label,
//     name,
//     options,
//     multiple,
//     children,
// }: FormikFileUploadContextProvider<MULTIPLE>) => {
//     const [{ value }, _, { setValue }] = useField<MULTIPLE extends true ? EncodedFile[] : (EncodedFile | undefined)>(name);

//     const errorListenersRef = useRef<UseFileUploadErrorHandlers>({
//         onAmountLimit: noop,
//         onSizeLimit: noop,
//         onUnacceptableType: noop,
//     });

//     const currentFileAmount = Array.isArray(value) ? value.length : 0;

//     const handleFileUpload = useFileUpload(
//         currentFileAmount,
//         (filesToAdd) => {
//             console.log('set', value, filesToAdd);
//             const newValue = (
//                 multiple
//                     ? [...value as EncodedFile[], ...filesToAdd]
//                     : filesToAdd[0]
//             ) as typeof value;

//             setValue(newValue);
//         },
//         options,
//         errorListenersRef.current,
//     );

//     const removeFiles = () => setValue((multiple ? [] : undefined) as typeof value);

//     const removeFile = (indexToDelete: MULTIPLE extends true ? number : void) => {
//         const newValue = (
//             multiple
//                 ? (value as EncodedFile[]).filter((_, index) => index !== indexToDelete)
//                 : undefined
//         ) as typeof value;

//         setValue(newValue);
//     };
//     const addErrorListener: AddErrorListener = {
//         onAmountLimit: (cb) => errorListenersRef.current.onAmountLimit = cb,
//         onSizeLimit: (cb) => errorListenersRef.current.onSizeLimit = cb,
//         onUnacceptableType: (cb) => errorListenersRef.current.onUnacceptableType = cb,
//     };

//     const fileInputProps: FileInputProps = {
//         name,
//         label,
//         multiple: !!multiple,
//         accept: options.accept,
//         onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e.target.files),
//     };

//     const contextValues: FormikFileUploadContext<MULTIPLE> = {
//         value,
//         fileInputProps,
//         addErrorListener,
//         removeFiles,
//         removeFile,
//         handleFileUpload,
//     };

//     return (
//         <FormikFileUploadContext.Provider value={contextValues}>
//             <ChildrenAsNodeOrFunction args={contextValues}>
//                 {children}
//             </ChildrenAsNodeOrFunction>
//         </FormikFileUploadContext.Provider>
//     );
// };

// // export const FormikFileUploadContextProvider: FC<FormikFileUploadContextProvider> = ({
// //     name,
// //     label,
// //     options = {},
// //     multiple = false,
// //     children,
// // }) => {
// //     const [{ value }, _, { setValue }] = useField<EncodedFile[]>(name);

// //     const errorListenersRef = useRef<UseFileUploadListeners>({
// //         onAmountLimit: noop,
// //         onSizeLimit: noop,
// //         onUnacceptableType: noop,
// //     });

// //     const handleFileUpload = useFileUpload(
// //         value.length,
// //         (filesToAdd) => {
// //             console.log('set', value, filesToAdd);
// //             setValue([...value, ...filesToAdd]);
// //         },
// //         options,
// //         errorListenersRef.current,
// //     );

// //     const removeFiles = () => setValue([]);

// //     const removeFile = (indexToDelete: number) => setValue(value.filter((_, index) => index !== indexToDelete));

// //     const addErrorListener: AddErrorListener = {
// //         onAmountLimit: (cb) => errorListenersRef.current.onAmountLimit = cb,
// //         onSizeLimit: (cb) => errorListenersRef.current.onSizeLimit = cb,
// //         onUnacceptableType: (cb) => errorListenersRef.current.onUnacceptableType = cb,
// //     };

// //     const fileInputProps: FileInputProps = {
// //         name,
// //         label,
// //         multiple: options.amountLimit ? options.amountLimit > 1 : true,
// //         accept: options.accept || '*',
// //         onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleFileUpload(e.target.files),
// //     };

// //     const contextValues: FormikFileUploadContext = {
// //         value,
// //         fileInputProps,
// //         addErrorListener,
// //         removeFiles,
// //         removeFile,
// //         handleFileUpload,
// //     };

// //     return (
// //         <FormikFileUploadContext.Provider value={contextValues}>
// //             <ChildrenAsNodeOrFunction args={contextValues}>
// //                 {children}
// //             </ChildrenAsNodeOrFunction>
// //         </FormikFileUploadContext.Provider>
// //     );
// // };

export {};