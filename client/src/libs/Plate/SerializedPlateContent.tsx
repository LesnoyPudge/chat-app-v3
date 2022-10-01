import React, { FC, ReactElement } from 'react';
import { Text } from 'slate';
import { TextComponent } from './components';
import { PlateContentValue } from './types';



interface ISerializedNode {
    nodes?: PlateContentValue;
}

export const SerializedPlateContent: FC<ISerializedNode> = ({ 
    nodes = [{ text: '' }], 
}) => {
    const serialize = (nodes: PlateContentValue): ReactElement[] => {
        return nodes.map((node) => {
            if (Text.isText(node)) {
                return (
                    <TextComponent 
                        text={node.text} 
                        bold={!!node.bold} 
                        italic={!!node.italic}
                    />
                );
            }
            
            const childrens = node.children as PlateContentValue;
            const serialized = childrens.map((childrenNode) => {
                return serialize([childrenNode]).map((child, index) => {
                    return React.cloneElement(child, { key: index });
                });
            });

            switch (node.type) {
            case 'quote':
                return <blockquote><p>{serialized}</p></blockquote>;
            case 'paragraph':
                return <p>{serialized}</p>;
            case 'link':
                return <a href={node.url as string}>{serialized}</a>;
            default:
                return <>{serialized}</>;
            }
        });
    };

    const value = serialize(nodes).map((child, index) => {
        return React.cloneElement(child, { key: index });
    });
    
    return (
        <>{value}</>
    );
};