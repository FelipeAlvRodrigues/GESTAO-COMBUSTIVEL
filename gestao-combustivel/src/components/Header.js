import React from 'react';
import { Appbar } from 'react-native-paper';

const Header = ({ title, goBack, children}) => {
  return (
    <Appbar.Header style={{ backgroundColor: '#7e57c2', }}>
      {
        goBack &&
        <Appbar.BackAction onPress={goBack} />
      }
      <Appbar.Content title={title}
        titleStyle={{ color: 'white' }} />
         {children}
    </Appbar.Header>
  );
};

export default Header;
