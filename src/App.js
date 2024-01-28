import './App.css';
import { useState } from 'react';
import { createContext } from 'react';
import LoginPage from './components/SignIn';
import CrashList from './components/CrashRender';
import CrashContext from "./setCrashContext"
export const UserContext= createContext(null);
function App() {
  const [user, setUsers] = useState("");
 
  return (
    <div className="App">
      <UserContext.Provider value={{user:user, setUser:setUsers}}>
      {user ? (
        <CrashContext>
        <CrashList />
        </CrashContext>
      ) : (
        <CrashContext>
        <LoginPage/>
        </CrashContext>
      )}
      </UserContext.Provider>
    </div>
  );
}

export default App;
