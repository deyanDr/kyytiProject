// components/Hello.tsx
import React from 'react';
import { NavigationScreenProp } from 'react-navigation';
import { Button, StyleSheet, Text, View, ActivityIndicator, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { SEARCH_ROUTE, HEADERS, URLS } from '../constants';

export interface Props {
    navigation: NavigationScreenProp<any, any>
}

interface State {
    loading: boolean;
    travelTypes2DArray: Array<Array<string>>;
    travelOptions: Array<Object>;
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
        }
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
                let travelTypes2DArray = Array<Array<string>>();
                let publicTransportOptionsArray = responseJson.routes.publicTransport;

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
            }))
            .catch((error) => {
                console.log(error);
            });
    }

    onPressRenderRow(travelOption: Object, navigate: Function) {
        navigate('MapScreen', {
            travelOption
        })
    }

    renderRow(travelTypesArray: Array<string>, travelOption: Object) {
        return (
            <View>
                <TouchableOpacity style={styles.button} onPress={() => this.onPressRenderRow(travelOption, this.props.navigation.navigate)}>
                    <Text style={styles.itemRow}> {travelTypesArray.join(" => ")}</Text>
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
                    data={this.state.travelTypes2DArray}
                    renderItem={({ item, index }) => this.renderRow(item, this.state.travelOptions[index])}
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