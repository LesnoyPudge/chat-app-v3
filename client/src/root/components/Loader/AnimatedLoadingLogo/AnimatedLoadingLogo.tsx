import { FC } from 'react';



export const AnimatedLoadingLogo: FC = () => {
    return (
        <div>
            {/* <svg
                width='300' height='200'
                xmlns='http://www.w3.org/2000/svg'
            >



            </svg> */}
            <svg
                // viewBox='0 0 10 10'
                xmlns='http://www.w3.org/2000/svg'
                fill='#fff'
                // width={100}
                // height={100}
                width='300' height='200'
            >
                <rect width='100%' height='100%' fill='white' />

                <circle cx='150' cy='100' r='80' fill='green' />

                <text x='150' y='125' fontSize='60' textAnchor='middle' fill='white'>SVG</text>
            </svg>
        </div>
    );
};