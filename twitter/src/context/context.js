import React, { createContext, useReducer } from 'react'
import { reducer } from './reducer';

export const GlobalContext = createContext("Initial Value");

let data = {
  darkTheme: true,
  user: {},
  isLogin: null,
  baseUrl:  window.location.href.split(":")[0] === "http"
  ? "http://localhost:5001/api/v1"
<<<<<<< HEAD
  : " https://clumsy-ox-housecoat.cyclic.app/api/v1",

=======
  : " https://socket-io-react-time-chat-app-production.up.railway.app/api/v1",
>>>>>>> 07d0ea52fcbddc650ee03256445f74437e1478d1
  baseUrlSocketIo: (window.location.href.includes('localhost'))
  ?
  `http://localhost:5001` : ``
 
}


export default function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, data)
  return (
    <GlobalContext.Provider value={{ state, dispatch }}>
      {children}
    </GlobalContext.Provider>
  )
} 