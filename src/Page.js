// @flow
import React, { Component, PureComponent } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { createStore } from 'redux';
import { diff } from 'deep-diff';

import R from 'ramda';
// import Perf from 'react-native/Libraries/Performance/RCTRenderingPerf';
import Perf from 'ReactPerf';

class Page extends PureComponent {
  componentDidUpdate() {
    Perf.stop();
    const measurements = Perf.getLastMeasurements();
    Perf.printInclusive(measurements);
  }

  addEntity = () => {
    this.props.addEntity({
      id: Math.floor(Math.random() * 1000),
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <Title text="The app Title" />
        <Counter value={this.props.counter} />
        <Button onPress={this.props.increment} text="Increment" />
        <Button onPress={this.props.misc} text="dispatch Action" />
        <Button onPress={this.addEntity} text="Add Entity" />
        <Entities values={this.props.entities} />
      </View>
    );
  }
}

class Title extends PureComponent {
  render() {
    return (
      <Text style={styles.welcome}>
        {this.props.text}
      </Text>
    );
  }
}

class Button extends PureComponent {
  onPress = () => {
    this.props.onPress();
    Perf.start();
  };
  render() {
    return (
      <TouchableOpacity onPress={this.onPress} activeOpacity={0.7}>
        <Text style={styles.button}>
          {this.props.text}
        </Text>
      </TouchableOpacity>
    );
  }
}

class Counter extends PureComponent {
  render() {
    return (
      <Text>
        {this.props.value}
      </Text>
    );
  }
}

class Entities extends PureComponent {
  /*
  shouldComponentUpdate(nextProps) {
    return !R.equals(nextProps, this.props);
  }
  */

  render() {
    return (
      <View>
        {this.props.values.map(value =>
          <Text key={value.id}>
            {value.id}
          </Text>
        )}
      </View>
    );
  }
}

// REDUX LIKE

const initialState = {
  counter: 0,
  entities: {},
  otherProps: 0,
};

const reducer = (state = initialState, action) => {
  console.log(action);
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        counter: state.counter + 1,
      };
    case 'ADD_ENTITY':
      return {
        ...state,
        entities: {
          ...state.entities,
          [action.payload.id]: action.payload,
        },
      };
    case 'MISC':
      return {
        ...state,
        otherProp: state.otherProp + 1,
      };
    default:
      return state;
  }
};

const getValues = R.memoize(values => Object.values(values));
const selector = state => getValue(state.entities);

mapStateToProps = state => ({
  counter: state.counter,
  entities: selector(state),
});

mapDispatchToProps = {
  addEntity: entity => ({ type: 'ADD_ENTITY', payload: entity }),
  misc: () => ({ type: 'MISC' }),
  increment: () => ({ type: 'INCREMENT' }),
};

const Container = connect(mapStateToProps, mapDispatchToProps)(Page);
const store = createStore(reducer);
const App = () => <Container store={store} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  button: {
    backgroundColor: 'rgb(88, 195, 183)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    margin: 20,
    borderRadius: 8,
    color: 'white',
  },
});

export default App;
