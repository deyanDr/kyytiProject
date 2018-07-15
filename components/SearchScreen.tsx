// components/Hello.tsx
import React from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { Button, StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SearchBar, List, ListItem, Icon } from 'react-native-elements'
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps'


import { testStartLocation, testInitialRegion, testEndLocation } from '../constants';
import { SEARCH_ROUTE, HEADERS, URLS } from '../constants';

import { API } from './Helpers/API'

export interface Props {
    navigation: NavigationScreenProp<any, any>,
    searchText: string,
    startLocation: LatLng,
}

interface State {
    loading: boolean;
    travelTypes2DArray: Array<Array<string>>;
    travelOptions: Array<Object>;
    searchText: string;
    startLocation: LatLng;
    endLocation: LatLng;
}

export class SearchScreen extends React.Component<Props, State> {

    static navigationOptions = {
        title: 'Search',
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            travelTypes2DArray: Array<Array<string>>(),
            travelOptions: Array<Object>(),
            searchText: props.navigation.state.params.searchText,
            startLocation: props.navigation.state.params.startLocation,
            endLocation: testEndLocation
        }
    }

    componentDidMount() {
        this.getRoutes(this.state.searchText, this.state.startLocation, this.state.endLocation)
    }

    getDepartureLocations() {
        API.getDepartureLocations()
            .then((departureLocations) => {
                console.log(departureLocations);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    getRoutes(address: string, startLocation = testStartLocation, endLocation = testEndLocation) {
        console.log(startLocation);
        this.setState({
            loading: true,
        })

        API.getPublicTransitRoutes("Kyyti Office - Test", address, startLocation, endLocation)
            .then((publicTransportOptionsArray) => {
                let travelTypes2DArray = Array<Array<string>>();

                this.setState({
                    travelOptions: publicTransportOptionsArray,
                })

                publicTransportOptionsArray.forEach((publicTransportOption: any) => {
                    let travelTypesArray = Array<string>();

                    publicTransportOption.legs.forEach((leg: any) => {
                        // 1. Travel type update
                        travelTypesArray.push(leg.iconRef);
                    })

                    travelTypes2DArray.push(travelTypesArray);
                })
                this.setState({
                    travelTypes2DArray,
                    loading: false
                })
            }).catch((error) => {
                console.log(error);
            });
    }

    onListItemPress(travelOption: Object, navigate: Function) {
        navigate('MapScreen', {
            travelOption,
            startLocation: this.state.startLocation
        })
    }

    renderListItem(travelTypesArray: Array<string>, travelOption: Object) {
        return (
            <ListItem
                leftIcon={{ name: "directions" }}
                title={travelTypesArray.join(" => ")}
                subtitle={"Leave at " + new Date(travelOption.departureTime.time).toLocaleString()}
                onPress={() => this.onListItemPress(travelOption, this.props.navigation.navigate)}
                badge={{ value: `${travelOption.totalPrice.formattedPrice}`, textStyle: { color: 'white' } }}
            />
        )
    }

    renderHeader = () => {
        return <SearchBar containerStyle={[styles.searchBar, styles.screenWidth]}
            value={this.state.searchText}
            onChangeText={(searchText) => this.setState({ searchText })}
            onSubmitEditing={() => this.getRoutes(this.state.searchText, this.state.startLocation, this.state.endLocation)}
            lightTheme
            placeholder='Search places' />;
    };

    render() {
        return (
            <View style={[styles.container]}>
                {/* <MapView
                    style={[styles.map, styles.screenHeight, styles.screenWidth]}
                    initialRegion={testInitialRegion}>
                    <Marker
                        coordinate={testStartLocation}
                        title="My Location"
                        draggable
                    />
                </MapView> */}

                <View style={[styles.flatList]}>
                {this.state.loading && <ActivityIndicator style={{ alignSelf: 'center', margin: 20 }} size="large" color="black" />}

                    <FlatList
                        // style={[styles.screenWidth, styles.screenHeight]}
                        data={this.state.travelTypes2DArray}
                        renderItem={({ item, index }) => this.renderListItem(item, this.state.travelOptions[index])}
                        keyExtractor={(item, index) => `${index}`}
                        // ListHeaderComponent={this.renderHeader}
                    />
                </View>
            </View>
        );
    }
}

// styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'white'
        
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    },
    searchBar: {

    },
    flatList: {
        flex: 1,
        backgroundColor: 'white'
    },
    headline: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        margin: 20,
    },
    itemRow: {
        padding: 5,
        height: 40,
        fontSize: 15
    },
    button: {
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
    },
    screenWidth: {
        width: Dimensions.get('window').width,
    },
    screenHeight: { 
        height: Dimensions.get('window').height
    },
    map: {
        position: 'absolute',
        zIndex: -10
    },
    headerImage: {
        height: 150,
        // width: deviceWidth
    },
    subHeaderImage: {
        backgroundColor: 'rgba(128, 128, 128, 0.9)',
        zIndex: 5
    },
});