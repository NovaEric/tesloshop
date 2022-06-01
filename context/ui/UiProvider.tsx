import { FC, PropsWithChildren, useReducer } from 'react';
import { uiReducer, UiContext } from './';


export interface UiState { isMenuOpen: boolean; };

const UI_INITIAL_STATE: UiState = { isMenuOpen: false, };

interface Props { children?: React.ReactNode | undefined };

export const UiProvider:FC<PropsWithChildren<Props>> = ({children}) => {

const [ state, dispatch ] = useReducer( uiReducer, UI_INITIAL_STATE );

const toggleSideMenu = () => { dispatch({ type: '[UI] - ToggleMenu' }); };

return (

<UiContext.Provider value={{ ...state, toggleSideMenu }}>
{children}
</UiContext.Provider>

) 
};