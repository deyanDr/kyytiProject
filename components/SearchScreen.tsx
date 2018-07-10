// components/Hello.tsx
import React from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { Button, StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SEARCH_ROUTE, HEADERS, URLS } from '../constants';

export interface Props {
    navigation: NavigationScreenProp<any,any>
}

interface State {
    loading: boolean;
    travelOptions: Object
}

export class SearchScreen extends React.Component<Props, State> {

    static navigationOptions = {
        title: 'Search',
    };

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            travelOptions: [],
        }
    }

    componentDidMount() {
        console.log(this.props.navigation.actions.navigate)
    }

    getRoutes() {
        this.setState({
            loading: true,
        })
        fetch(URLS.ROUTES, {
            method: 'POST',
            headers: HEADERS,
            body: JSON.stringify(SEARCH_ROUTE),
        }).then((response) => response.json())
            .then((responseJson => {

                let travelOptions = [];

                let publicTransportOptionsArray = responseJson.routes.publicTransport;

                publicTransportOptionsArray.forEach((publicTransportOption) => {
                    let legs = publicTransportOption.legs;
                    let coordinates2DArray = Array<Array<LatLng>>();
                    let colorsObjectArray = Array<string>();
                    let travelTypeArray = Array<string>();
                    let coordinates = Array<LatLng>();

                    legs.forEach(leg => {
                        // 1. Travel type and colors
                        travelTypeArray.push(leg.iconRef);
                        colorsObjectArray.push(leg.color);
                        // 2. Coordinates
                        leg.shape.forEach(coord => {
                            let coordinate = {
                                latitude: coord[0],
                                longitude: coord[1]
                            }
                            coordinates.push(coordinate);
                        });

                        // 3. Coordinated 2D
                        coordinates2DArray.push(coordinates);

                        // 4. Create object
                        let travelObject = {
                            'travelTypeArray': travelTypeArray,
                            'colorsObjectArray': colorsObjectArray,
                            'coordinates2DArray': coordinates2DArray
                        }
                        // 5. Update trave; options array
                        travelOptions.push(travelObject);

                    })

                    this.setState({
                        travelOptions,
                        loading: false
                    })
                })

                console.log(travelOptions[0].coordinates2DArray.length);
            }))
            .catch((error) => {
                console.log(error);
            });
    }

    onPressRenderRow(item, navigate) {
        navigate('MapScreen', {
            coordinates2DArray: item.coordinates2DArray,
            colorsObjectArray: item.colorsObjectArray,
            travelTypeArray: item.travelTypeArray,
        })

    }

    renderRow(item) {
        return (
            <View>
                <TouchableOpacity style={styles.button} onPress={() => this.onPressRenderRow(item, this.props.navigation.navigate)}>
                    <Text style={styles.itemRow}> {item.travelTypeArray.join(" => ")}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    render() {

        return (
            <View style={styles.root}>
                <Text style={styles.headline}> List routes from user’s mocked location
                    (60.189862, 24.921628)
                     to Kyyti office at Fredrikinkatu 47,
                     Helsinki. </Text>
                <Button onPress={() => this.getRoutes()}
                    title="Search Routes"
                    color="#841584"
                    accessibilityLabel="Get Routes Button"
                />

                {this.state.loading && <ActivityIndicator size="large" color="red" />}

                <FlatList
                    style={styles.screenWidth}
                    data={this.state.travelOptions}
                    renderItem={({ item }) => this.renderRow(item)}
                    keyExtractor={(item, index) => `${index}`}

                />
            </View>
        );
    }
}

// styles
const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        alignSelf: 'center',
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
    }
});