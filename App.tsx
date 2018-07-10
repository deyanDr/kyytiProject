import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { StyleSheet, Text, View } from 'react-native';

import { Hello } from './components/Hello';
import { MapStarterScreen } from './components/MapStarterScreen';


const App = createStackNavigator({
  MapStarterScreen: { screen: MapStarterScreen },
});


export default class KyytiProject extends React.Component {
  render() {
    return (
      <App style={styles.container} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
