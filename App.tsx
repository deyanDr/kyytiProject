import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { StyleSheet, Text, View } from 'react-native';

import { MapScreen } from './components/MapScreen';
import { SearchScreen } from './components/SearchScreen';
import { HelloMapScreen } from './components/HelloMapScreen';


const App = createStackNavigator({
  HelloMapScreen: { screen: HelloMapScreen},
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
