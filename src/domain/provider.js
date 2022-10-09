import React, { useState } from 'react';

export const AppContext = React.createContext();

const Provider = props => {
    const [isDark, setTheme] = useState(false);

    return (
        <AppContext.Provider value={{
            isDark,
            changeTheme: () => setTheme(!isDark)
        }}>
            {props.children}
        </AppContext.Provider>
    )
};
export default ({ element }) => (
    <Provider>
        {element}
    </Provider>
);