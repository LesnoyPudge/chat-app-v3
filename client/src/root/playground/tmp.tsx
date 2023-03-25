import { useSharedIntersectionObserver } from '@hooks';
import { FC, useRef, useState } from 'react';



const ChunkItemPlaceholder: FC = () => {
    return (
        <div className='h-11'>
            placeholder
        </div>
    );
};

const itemsArr = Array(150).fill(null).map((_, i) => ({
    id: String(i),
    content: String(i),
}));

const props = {
    chunkSize: 50,
    chunkItemPlaceholder: <ChunkItemPlaceholder/>,
    items: itemsArr,
};


interface Chunk {
    type: 'top' | 'middle' | 'bottom';
}

const Chunk: FC<Chunk> = ({ type }) => {
    return (
        <div>
            <>chunk {type}</>
        </div>
    );
};

export const ChunkedList: FC = () => {
    const {
        chunkItemPlaceholder,
        chunkSize,
        items,
    } = props;

    const chunkIntersection = useRef({
        top: false,
        middle: false,
        bottom: false,
    });

    const chunkedList = useState({
        top: [],
        middle: [],
        bottom: [],
    });

    const [_, topChunkRef] = useSharedIntersectionObserver(undefined, ({ isIntersecting }) => {
        chunkIntersection.current.top = isIntersecting;
    });

    const [__, middleChunkRef] = useSharedIntersectionObserver(undefined, ({ isIntersecting }) => {
        chunkIntersection.current.middle = isIntersecting;
    });

    const [___, bottomChunkRef] = useSharedIntersectionObserver(undefined, ({ isIntersecting }) => {
        chunkIntersection.current.bottom = isIntersecting;
    });

    return (
        <div className='h-screen' aria-hidden='true'>
            <div ref={topChunkRef}>
                <>chunk top</>
            </div>

            <div ref={middleChunkRef}>
                <>chunk top</>
            </div>

            <div ref={bottomChunkRef}>
                <>chunk top</>
            </div>
            
            {/* <Chunk type='top'/>

            <Chunk type='middle'/>

            <Chunk type='bottom'/> */}
        </div>
    );
};