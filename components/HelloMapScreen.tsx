import React from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, LatLng } from 'react-native-maps'
import { SearchBar, Icon } from 'react-native-elements'
import Modal from "react-native-modal";

import { testStartLocation, testInitialRegion } from '../constants';
import { SearchScreen } from './SearchScreen';


export interface Props {
  navigation: NavigationScreenProp<any, any>
}

interface State {
  showSearchScreen: boolean,
  searchTitle: string,
  searchText: string;
  startLocation: LatLng;
}

export class HelloMapScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showSearchScreen: false,
      searchTitle: 'Search Routes',
      startLocation: testStartLocation,
      searchText: 'Fredrinkatu 47, Helsinki',
    };
  }

  static navigationOptions = () => {
    return {
      title: 'Hello Map',
    }
  };

  searchButtonPressed() {
    this.setState({showSearchScreen: !this.state.showSearchScreen})
  }

  showSearchScreen() {
    this.setState({ showSearchScreen: true });
  }

  onUserPinDragEnd(event: any) {
    this.setState({ startLocation: event.nativeEvent.coordinate });
  }

  render() {
    return (
      <View style={styles.container}>
        {!this.state.showSearchScreen && <SearchBar
          value={this.state.searchText}
          onChangeText={(searchText) => this.setState({ searchText })}
          onSubmitEditing={() => this.showSearchScreen()}
          placeholder='Search destination ...' />}

        {this.state.showSearchScreen &&
          <SearchScreen
            startLocation={
              this.state.startLocation || testStartLocation}
            searchText={this.state.searchText} />}

        {!this.state.showSearchScreen &&
          <MapView
            style={[styles.map]}
            initialRegion={testInitialRegion}>
            <Marker
              coordinate={this.state.startLocation}
              title='My Location'
              draggable
              onDragEnd={this.onUserPinDragEnd.bind(this)}
            >
              <Icon name="map-pin" type="font-awesome" color='red' />
            </Marker>
          </MapView>}}
        <TouchableOpacity
          style={styles.button}
          onPress={() => { this.searchButtonPressed() }}  >
          <Text style={styles.buttonText}> {this.state.showSearchScreen ? 'Search Again' : 'Search Routes'} </Text>
        </TouchableOpacity>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white'
  },
  map: {
    flex: 1,
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#3B3e42',
    padding: 20,

  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold'
  }
})
