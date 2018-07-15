import React from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, LatLng } from 'react-native-maps'
import { SearchBar, Icon } from 'react-native-elements'

import { testStartLocation, testInitialRegion } from '../constants';
import { SearchScreen } from './SearchScreen';


export interface Props {
  navigation: NavigationScreenProp<any, any>
}

interface State {
  searchText: string;
  startLocation: LatLng;
}

export class HelloMapScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      startLocation: testStartLocation,
      searchText: 'Fredrinkatu 47, Helsinki',
    };
    this.navigateToSearchResults = this.navigateToSearchResults.bind(this);
  }

  componentDidMount() {
    this.props.navigation.setParams({ navigateToSearchResults: this.navigateToSearchResults });
  }

  static navigationOptions = () => {
    return {
      title: 'Hello Map',
    }
  };


  navigateToSearchResults() {
    this.props.navigation.navigate('SearchScreen', {
      startLocation: this.state.startLocation || testStartLocation,
      searchText: this.state.searchText
    })
  }

  onUserPinDragEnd(event: any) {
    this.setState({ startLocation: event.nativeEvent.coordinate });
  }

  render() {
    return (
      <View style={styles.container}>
        <SearchBar
          value={this.state.searchText}
          onChangeText={(searchText) => this.setState({ searchText })}
          onSubmitEditing={() => this.navigateToSearchResults()}
          placeholder='Search destination ...' />
        <MapView
          style={[styles.map]}
          initialRegion={testInitialRegion}>
          <Marker
            coordinate={testStartLocation}
            title='My Location'
            draggable
            onDragEnd={this.onUserPinDragEnd.bind(this)}
          >
            <Icon name="map-pin" type="font-awesome" color='red' />
          </Marker>
        </MapView>
        <TouchableOpacity
          style={styles.button}
          onPress={() => { this.navigateToSearchResults() }}  >
          <Text style={styles.buttonText}> Search Routes </Text>
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
