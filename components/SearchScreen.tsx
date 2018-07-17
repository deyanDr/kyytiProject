// components/Hello.tsx
import React from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { Button, StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity, Dimensions, Alert } from 'react-native';
import Modal from "react-native-modal";
import { SearchBar, List, ListItem, Icon, PricingCard } from 'react-native-elements'
import MapView, { Marker, Polyline, LatLng } from 'react-native-maps'

import { MapScreen } from './MapScreen';

import { testStartLocation, testInitialRegion, testEndLocation } from '../constants';
import { SEARCH_ROUTE, HEADERS, URLS } from '../constants';

import { API } from './Helpers/API'
import { ITravelObject, ITravelOption } from './Helpers/Types';

export interface Props {
    searchText: string,
    startLocation: LatLng,
}

interface State {
    loading: boolean;
    travelTypes2DArray: Array<Array<ITravelObject>>;
    travelOptions: Array<ITravelOption>;
    searchText: string;
    startLocation: LatLng;
    endLocation: LatLng;
    mapModalVisible: boolean;
    travelOption: ITravelOption;
}

export class SearchScreen extends React.Component<Props, State> {

    static navigationOptions = {
        title: 'Search Results',
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            travelTypes2DArray: Array<Array<ITravelObject>>(),
            travelOptions: Array<ITravelOption>(),
            travelOption: {} as ITravelOption,
            searchText: props.searchText,
            startLocation: props.startLocation,
            endLocation: testEndLocation,
            mapModalVisible: false,
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
        this.setState({
            loading: true,
        })

        API.getPublicTransitRoutes("Kyyti Office - Test", address, startLocation, endLocation)
            .then((publicTransportOptionsArray) => {
                let travelTypes2DArray = Array<Array<ITravelObject>>();

                this.setState({
                    travelOptions: publicTransportOptionsArray,
                })

                publicTransportOptionsArray.forEach((publicTransportOption: any) => {
                    let travelTypesArray = Array<ITravelObject>();

                    publicTransportOption.legs.forEach((leg: any) => {
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

    onListItemPress(travelOption: ITravelOption) {
        this.setState({ mapModalVisible: true, travelOption: travelOption })
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

    renderModalContent = (travelOption: ITravelOption, startLocation: LatLng) => (
        <MapScreen travelOption={travelOption} startLocation={startLocation} />
    );

    renderListItem(travelTypesArray: Array<ITravelObject>, travelOption: ITravelOption) {
        var timeDiff = Math.abs(new Date(travelOption.departureTime.time).getTime() - new Date().getTime());
        var diffMins = Math.round(((timeDiff % 86400000) % 3600000) / 60000);
        let travelPrice = travelOption.totalPrice ? travelOption.totalPrice.formattedPrice : 'n/a'

        return (
            <TouchableOpacity
                style={styles.listItemContainer}
                onPress={() => this.onListItemPress(travelOption)}>

                <View style={styles.listItem}>

                    <View style={styles.listItemDeparture}>
                        <Icon
                            name="access-time"
                            containerStyle={{ marginLeft: 10 }}
                        />
                        <Text>  Leave in {diffMins} minutes.</Text>
                    </View>

                    <View style={styles.listItemIconsContainer}>
                        <View style={styles.listItemIcons}>
                            {/* Render icons for travel types */}
                            {travelTypesArray.map((travelType, index) => {

                                let travelModeNumbers = travelType.travelMode === 'walk' ?
                                    `${Math.floor(travelType.distance)} m` :
                                    `${Math.floor(travelType.duration.max / 60)} min`;

                                return (
                                    <View key={index} style={{ marginLeft: 10 }} >
                                        <View style={{ justifyContent: 'space-between' }}>
                                            <View style={{ flexDirection: 'row' }}>
                                                {/* Set proper transport icon respective to travelMode */}
                                                <Icon name={this.getTransportIcon(travelType.travelMode)}
                                                    color={travelType.color}
                                                />
                                                {/* Line code renders if available */}
                                                <Text style={styles.iconTextFontSize}>{travelType.lineCode}</Text>
                                            </View>
                                            {/* Render minutes(not walking) or meters(walking) */}
                                            <Text style={styles.iconTextFontSize}> {travelModeNumbers} </Text>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                </View>
                <View style={styles.price} >
                    <Text style={styles.priceText}>{travelPrice}</Text>
                </View>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.loading && <ActivityIndicator style={{ alignSelf: 'center', margin: 20 }} size="large" color="black" />}

                <View style={styles.flatList}>
                    <FlatList
                        data={this.state.travelTypes2DArray}
                        renderItem={({ item, index }) => this.renderListItem(item, this.state.travelOptions[index])}
                        keyExtractor={(item, index) => `${index}`}
                    />
                </View>
                <Modal
                    backdropOpacity={0.3}
                    hideModalContentWhileAnimating={true}
                    onBackdropPress={() => { this.setState({ mapModalVisible: false }) }}
                    isVisible={this.state.mapModalVisible} style={[styles.bottomModal]}
                >
                    {this.renderModalContent(this.state.travelOption, this.state.startLocation)}
                </Modal>
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
    flatList: {
        flex: 1,
        backgroundColor: 'white'
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
    },
    bottomModal: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    listItemContainer: {
        flex: 1,
        backgroundColor: 'white',
        height: 90,
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    listItem: {
        flex: 0.8,
        flexDirection: "column"
    },
    listItemDeparture: {
        flex: 0.4,
        flexDirection: "row",
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 10
    },
    iconTextFontSize: {
        fontSize: 10
    },
    listItemIconsContainer: {
        flex: 0.6,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    listItemIcons: {
        flex: 0.7,
        flexDirection: 'row'
    }
});