import { AutoLinkPlugin, LinkMatcher } from '@lexical/react/LexicalAutoLinkPlugin';
import { FC } from 'react';



const linkMatchers: LinkMatcher[] = (() => {
    const URL_MATCHER = /((https?:\/\/(www\.)?)|(www\.))[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

    const matcher: LinkMatcher = (text) => {
        const match = URL_MATCHER.exec(text);
        if (!match) return null;

        const fullMatch = match[0];

        return {
            index: match.index,
            length: fullMatch.length,
            text: fullMatch,
            url: fullMatch.startsWith('http') ? fullMatch : `https://${fullMatch}`,
            attributes: {
                title: 'Внешняя ссылка',
                rel: 'noreferrer',
                target: '_blank',
            },
        };
    };

    return [matcher];
})();

export const LinkPlugin: FC = () => {
    return (
        <AutoLinkPlugin matchers={linkMatchers}/>
    );
};