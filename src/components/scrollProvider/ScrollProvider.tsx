import React, { createContext, useContext, useState } from 'react';

const ScrollContext = createContext({
  isScrolled: false,
  setIsScrolled: (value: boolean) => {},
});

export const ScrollProvider = ({ children }: { children: React.ReactNode }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  return (
    <ScrollContext.Provider value={{ isScrolled, setIsScrolled }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScroll = () => useContext(ScrollContext);