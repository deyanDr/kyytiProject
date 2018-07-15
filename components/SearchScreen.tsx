// components/Hello.tsx
import React from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { Button, StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SearchBar, List, ListItem, Icon, PricingCard } from 'react-native-elements'
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
    travelTypes2DArray: Array<Array<TravelObject>>;
    travelOptions: Array<Object>;
    searchText: string;
    startLocation: LatLng;
    endLocation: LatLng;
}

interface TravelObject {
    travelMode: string;
    lineCode?: string;
    distance: number;
    duration: {
        min: number,
        max: number
    }
    color: string
}

export class SearchScreen extends React.Component<Props, State> {

    static navigationOptions = {
        title: 'Search Results',
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            travelTypes2DArray: Array<Array<TravelObject>>(),
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
                let travelTypes2DArray = Array<Array<TravelObject>>();

                this.setState({
                    travelOptions: publicTransportOptionsArray,
                })

                publicTransportOptionsArray.forEach((publicTransportOption: any) => {
                    let travelTypesArray = Array<TravelObject>();

                    publicTransportOption.legs.forEach((leg: any) => {
                        let lineCode = leg.line;
                        // 1. Travel type update
                        let travelObject = {
                            travelMode: leg.travelMode,
                            lineCode: leg.line !== null ? leg.line.code : "",
                            distance: leg.distance,
                            duration: leg.duration,
                            color: leg.color,
                        }

                        travelTypesArray.push(travelObject);
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

    getTransportIcon(type: string) {
        switch (type) {
            case 'walk':
                return "directions-walk";
            case 'tram':
                return "tram"
            case 'bus':
                return "directions-bus"
            default:
                return "";
        }
    }

    renderListItem(travelTypesArray: Array<TravelObject>, travelOption: Object) {
        console.log(travelTypesArray)
        var timeDiff = Math.abs(new Date(travelOption.departureTime.time).getTime() - new Date().getTime());
        var diffMins = Math.round(((timeDiff % 86400000) % 3600000) / 60000);

        return (
            <TouchableOpacity
                style={{
                    flex: 1,
                    backgroundColor: 'white',
                    height: 90,
                    borderBottomColor: 'black',
                    borderBottomWidth: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between'
                }}
                onPress={() => this.onListItemPress(travelOption, this.props.navigation.navigate)}>
                <View style={{ flex: 0.8, flexDirection: "column" }}>

                    <View style={{ flex: 0.4, flexDirection: "row", alignItems: 'center', marginBottom: 10, marginTop: 10 }}>
                        <Icon name="access-time"
                            containerStyle={{ marginLeft: 10 }} />
                        <Text>  Leave in {diffMins} minutes.</Text>
                    </View>

                    <View style={{ flex: 0.6, flexDirection: 'row', justifyContent: 'space-between', }}>
                        <View style={{ flex: 0.7, flexDirection: 'row' }}>
                            {travelTypesArray.map((travelType, index) =>
                                <View key={index} style={{ marginLeft: 10 }} >
                                    <View style={{ justifyContent: 'space-between' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Icon name={this.getTransportIcon(travelType.travelMode)}
                                                color={travelType.color}
                                            />
                                            <Text style={{ fontSize: 10 }}>{travelType.lineCode}</Text>
                                        </View>
                                        <Text style={{ fontSize: 10 }}> {
                                            travelType.travelMode === 'walk' ?
                                                `${Math.floor(travelType.distance)} m` :
                                                `${Math.floor(travelType.duration.max / 60)} min`
                                        }
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </View>

                </View>
                <View style={styles.price} >
                    <Text style={styles.priceText}>{travelOption.totalPrice ? travelOption.totalPrice.formattedPrice : 'n/a'}</Text>
                </View>
            </TouchableOpacity>
            //     subtitle={"Leave at " + new Date(travelOption.departureTime.time).toLocaleString()}
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
                {this.state.loading && <ActivityIndicator style={{ alignSelf: 'center', margin: 20 }} size="large" color="black" />}

                <View style={[styles.flatList]}>
                    <FlatList
                        // style={[styles.screenWidth, styles.screenHeight]}
                        data={this.state.travelTypes2DArray}
                        renderItem={({ item, index }) => this.renderListItem(item, this.state.travelOptions[index])}
                        keyExtractor={(item, index) => `${index}`}
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
    price: {
        flex: 0.2,
        justifyContent: 'center',
        backgroundColor: '#3B3e42',
        padding: 10

    },
    priceText: {
        color: 'white',
        fontWeight: 'bold'
    }
});