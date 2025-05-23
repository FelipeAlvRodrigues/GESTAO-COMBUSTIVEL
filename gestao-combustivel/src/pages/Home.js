import React, {useState} from 'react';
import { BottomNavigation, Text } from 'react-native-paper';

import Calculadora from './Calculadora';
import Gastos from './Gastos';
const Home = () => {
  const [index, setIndex] = useState(0);
  
  const [routes] = useState([
    { key: 'gastos', title: 'gastos', focusedIcon: 'gas-station' },
    { key: 'calculadora', title: 'Calculadora', focusedIcon:  'calculator' },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    gastos: Gastos,
    calculadora: Calculadora,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default Home;