
import React from 'react';
import MainTabNavigator from './MainTabNavigator';
import AuthStack from './AuthStack'; 

const AppNavigation = () => {
  const isLoggedIn = true; 

  return isLoggedIn ? <MainTabNavigator /> : <AuthStack />;
};

export default AppNavigation;