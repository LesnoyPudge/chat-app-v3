import { FC } from 'react';
import { Outlet } from 'react-router-dom';



export const AppPage: FC = () => {
    return (
        <>
            <div style={{ height: '100%' }}>
                <ChannelsNavigation/>
            </div>
        </>
    );
};

const ChannelsNavigation: FC = () => {
    return (
        <>
            <div>
                <span>
                    1
                </span>

                <ul>
                    <li>
                        1
                    </li>

                    <li>
                        2
                    </li>

                    <li>
                        3
                    </li>
                </ul>

                <span>
                    2
                </span>

                <span>
                    3
                </span>
            </div>
        </>
    );
};