import { createContext, useState } from 'react';

export const CrashType = createContext([]);

const CrashContext = ({ children }) => {
  const [crashes, setCrashRecord] = useState([]);

  return (
    <CrashType.Provider value={{ crashes, setCrashRecord }}>
      {children}
    </CrashType.Provider>
  );
};

export default CrashContext;
