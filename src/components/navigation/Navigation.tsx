'use client';

import { useState } from 'react';

import Navbar from '@/components/navbar/Navbar';

const Navigation = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarVisibility, setSidebarVisibility] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleShowingSidebarBasedOnScreenSize = (visibility: boolean) => {
    setSidebarVisibility(visibility);
  };

  return (
    <>
      <Navbar
        toggleSidebar={toggleSidebar}
        setSideBarVisibility={handleShowingSidebarBasedOnScreenSize}
      />
      {/* <Sidebar
        sidebarVisibility={sidebarVisibility}
        navbarData={navbarData}
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
      /> */}
    </>
  );
};

export default Navigation;