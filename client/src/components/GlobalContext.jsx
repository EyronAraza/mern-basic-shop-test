import React, { createContext } from 'react'

const GlobalContext = createContext()

export const GlobalProvider = ({ children }) => {
    const originUrl = "http://localhost:5000"

    return (
        <GlobalContext.Provider value={{ originUrl }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContext