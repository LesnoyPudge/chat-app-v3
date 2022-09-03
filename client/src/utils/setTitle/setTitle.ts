


export const setTitle = (title: string) => {
    const newTitle = `${title} | ChatApp`;
    if (newTitle !== document.title) document.title = newTitle; 
};