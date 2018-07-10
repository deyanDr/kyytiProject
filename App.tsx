import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { StyleSheet, Text, View } from 'react-native';

import { Hello } from './components/Hello';
import { MapScreen } from './components/MapScreen';
import { SearchScreen } from './components/SearchScreen';


const App = createStackNavigator({
  SearchScreen: { screen: SearchScreen },
  MapScreen: { screen: MapScreen },
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
