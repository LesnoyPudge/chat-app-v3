import { useNavigate } from 'react-router-dom';



export const useNavigateTo = () => {
    const navigate = useNavigate();

    const navigateToApp = () => {
        navigate('/app');
    };

    const navigateToPrivateChat = ({ privateChatId }: {privateChatId: string}) => {
        navigate(`/app/private-chat/${privateChatId}`);
    };
    
    return {
        navigateToApp,
        navigateToPrivateChat,
    };
};