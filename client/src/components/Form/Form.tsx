import { log } from '@utils';
import React, { CSSProperties, FC, useState } from 'react';



interface IInput {
    placeholder?: string;
    type?: string;
    name: string;
}

interface ISubmit {
    text: string;
    handler: (args: any) => void;
}

interface IFormProps {
    title?: string;
    inputs?: IInput[];
    submit: ISubmit;
}

export const Form: FC<IFormProps> = ({ title, inputs, submit }) => {
    const [values, setValues] = useState<{[key: string]: string}>({});
 
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submit.handler(values);
    };    
    
    const formStyle: CSSProperties = {
        display: 'flex',
        flexDirection: 'column',
        border: '2px solid black',
        padding: '10px',
        gap: '10px',
        backgroundColor: 'darkseagreen',
    };

    const titleStyle: CSSProperties = {
        fontSize: '20px',
        fontWeight: '600',
        margin: '10px',
    };

    return (
        <>
            <form onSubmit={handleSubmit} style={formStyle}>
                <span style={titleStyle}>
                    {title}
                </span>

                {
                    inputs?.map(({ placeholder, type = 'text', name }) => {
                        const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
                            const value = e.currentTarget.value;
                            const obj: Record<string, unknown> = {};
                            obj[name] = value;
                            const newValues = Object.assign(values, obj);
                            setValues(newValues);
                        };

                        return (
                            <input 
                                type={type} 
                                placeholder={placeholder || name} 
                                onChange={changeHandler}
                                required
                                key={name}
                            />
                        );
                    })
                }

                <button type='submit'>
                    {submit.text}
                </button>
            </form>
        </>
    );
};
