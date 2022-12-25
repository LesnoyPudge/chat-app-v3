import { Heading, HeadingLevel } from '@libs';
import { setTitle } from '@utils';
import { FC, PropsWithChildren, useEffect } from 'react';



interface WithTitle extends PropsWithChildren {
    title: string;
}

export const WithTitle: FC<WithTitle> = ({
    title,
    children,
}) => {
    const formatedTitle = `ChatApp | ${title.trim()}`;

    useEffect(() => setTitle(formatedTitle), [formatedTitle]);

    return (
        <>
            <Heading className='sr-only'>
                <>{formatedTitle}</>
            </Heading>

            <HeadingLevel>
                {children}
            </HeadingLevel>
        </>
    );
};