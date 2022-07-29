import { CSSProperties, FC, ReactNode } from 'react';



interface IContainer {
    children?: ReactNode;
    title?: string;
}

export const Container: FC<IContainer> = ({
    children, 
    title = 'Untitled',
}) => {
    const wrapperStyle: CSSProperties = {
        margin: '20px 0',
        border: '3px solid black',
        backgroundColor: '#d1d1d1',
        color: 'black',
    };

    const titleStyle: CSSProperties = {
        borderBottom: '3px solid black',
        fontSize: '20px',
        fontWeight: '600',
        display: 'flex',
        padding: '10px',
    };
    
    const innerStyle: CSSProperties = {
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    };

    return (
        <>
            <div style={wrapperStyle}>
                <span style={titleStyle}>
                    {title}
                </span>

                <div style={innerStyle}>
                    {children}
                </div>
            </div>
        </>
    );
};