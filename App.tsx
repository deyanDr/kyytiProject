import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { StyleSheet, Text, View } from 'react-native';

import { Hello } from './components/Hello';
import { MapScreen } from './components/MapScreen';


const App = createStackNavigator({
  MapScreen: { screen: MapScreen },
  SearchScreen: { screen: SearchScreen }
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});
