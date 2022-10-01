import classNames from 'classnames';
import { FC } from 'react';



interface ITextComponent {
    text: string;
    bold?: boolean;
    italic?: boolean;
}

export const TextComponent: FC<ITextComponent> = ({
    text,
    bold = false,
    italic = false,
}) => {
    const isStyled = bold || italic;

    if (!isStyled) return <>{text}</>;

    return (
        <span 
            className={classNames({ 
                'font-bold': bold, 
                'italic': italic, 
            })}
        >
            {text}
        </span>
    );
};