// components/Hello.tsx
import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

export interface Props {
  name: string;
  enthusiasmLevel?: number;
}

interface State {
  enthusiasmLevel: number;
}

export class Hello extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    if ((props.enthusiasmLevel || 0) <= 0) {
      throw new Error('You could be a little more enthusiastic. :D');
    }

    this.state = {
      enthusiasmLevel: props.enthusiasmLevel || 1,
    };
  }

  componentDidMount() {
    fetch('https://devapi.tuup.fi/routing/v1/routes', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "start":{
                "name":"Middle of nowhere - Test",
                "address":"Museokatu 32",
                "city":"Helsinki",
                "country":"Suomi",
                "type":"poi",
                "location":{
                    "lat":60.172585,
                    "lon":24.9260266
                }
            },
            "end":{
                "name":"Kyyti Office - Test",
                "address":"Kaisaniemenkatu 1",
                "city":"Helsinki",
                "country":"Suomi",
                "type":"poi",
                "location":{
                    "lat":60.1706234,
                    "lon":24.9440555
                }
            },
            "timeType":"departure",
            "routeModes":"kyyti:express,flex,smart",
            "passengers":{
                "count":1
            },
            "extraInfo":{
                "extraLuggageCount":0
            }
        }),
      }).then((response) => response.json())
      .then((responseJson => {console.log(responseJson)}))
      .catch((error) => {
          console.log(error);
      });
  }

  onIncrement = () =>
    this.setState({enthusiasmLevel: this.state.enthusiasmLevel + 1});
  onDecrement = () =>
    this.setState({enthusiasmLevel: this.state.enthusiasmLevel - 1});

  getExclamationMarks = (numChars: number) => Array(numChars + 1).join('!');

  render() {
    return (
      <View style={styles.root}>
        <Text style={styles.greeting}>
          Hello{' '}
          {this.props.name +
            this.getExclamationMarks(this.state.enthusiasmLevel)}
        </Text>

        <View style={styles.buttons}>
          <View style={styles.button}>
            <Button
              title="-"
              onPress={this.onDecrement}
              accessibilityLabel="decrement"
              color="red"
            />
          </View>

          <View style={styles.button}>
            <Button
              title="+"
              onPress={this.onIncrement}
              accessibilityLabel="increment"
              color="blue"
            />
          </View>
        </View>
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
  buttons: {
    flexDirection: 'row',
    minHeight: 70,
    alignItems: 'stretch',
    alignSelf: 'center',
    borderWidth: 5,
  },
  button: {
    flex: 1,
    paddingVertical: 0,
  },
  greeting: {
    color: '#999',
    fontWeight: 'bold',
  },
});