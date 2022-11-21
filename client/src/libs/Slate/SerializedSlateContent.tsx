import { tryParseJSONObject } from '@utils';
import { FC, useRef, ReactElement, useCallback } from 'react';
import { Descendant, Text } from 'slate';
import { Emoji, Link, Paragraph } from './components';



interface ISerializedNode {
    nodes?: string;
}

export const SerializedSlateContent: FC<ISerializedNode> = ({ nodes = '' }) => {
    const keyRef = useRef(0);

    const serialize = useCallback((nodes: Descendant[]): ReactElement[] => {
        const key = () => {
            const current = keyRef.current;
            keyRef.current++;
            return current;
        };

        return nodes.map((node) => {
            if (Text.isText(node)) return <span key={key()}>{node.text}</span>;
        
            const serialized = node.children.map((childrenNode) => serialize([childrenNode]));
            
            switch (node.type) {
            case 'paragraph':
                return <Paragraph isSerialized key={key()}>{serialized}</Paragraph>;

            case 'emoji':
                return <Emoji isSerialized code={node.code} key={key()}/>;

            case 'link': 
                return <Link isSerialized url={node.url} key={key()}>{node.url}</Link>;

            default:
                return <>{serialized}</>;
            }
        });
    }, []);

    const validNodes = tryParseJSONObject(nodes);

    const value = validNodes ? serialize(validNodes as Descendant[]) : nodes;
    
    return (
        <>{value}</>
    );
};