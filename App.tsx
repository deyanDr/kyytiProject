import React from 'react';
import { createStackNavigator } from 'react-navigation';
import { StyleSheet, StatusBar } from 'react-native';

import { HelloMapScreen } from './components/HelloMapScreen';

const App = createStackNavigator({
  HelloMapScreen: { screen: HelloMapScreen},
},
{
  initialRouteName: 'HelloMapScreen',
  navigationOptions: {
    title: 'Kyyti',
    headerTintColor: 'white',
    headerTitleStyle: {
      color: 'white'
    },
    headerBackTitleStyle: {
      color: 'white'
    },
    headerStyle: {
      borderBottomWidth: 0,
      backgroundColor: '#3A3E42'
    },
  }
});


export default class KyytiProject extends React.Component {
  render() {
    StatusBar.setBarStyle('light-content', true);
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
