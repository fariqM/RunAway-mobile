import React, { Component } from 'react';

import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';

import MapView from 'react-native-maps';

const {width, height} = Dimensions.get('window')

const SCREEN_HEIGHT = height
const SCREEN_WIDTH = width
const ASPECT_RATIO = width / height
const LATITUDE_DELTA = 0.0922
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO

class MapComponent extends Component {
  constructor() {
    super()
    this.state = {
      initialPosition: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0,
        longitudeDelta: 0,
      },
    }
  }

  componentDidMount() {
    Geolocation.getCurrentPosition((position) => {
      var lat = parseFloat(position.coords.latitude)
      var long = parseFloat(position.coords.longitude)

      var initialRegion = {
        latitude: lat,
        longitude: long,
        
      }

      this.setState({initialPosition: initialRegion})
    },
    (error) => alert(JSON.stringify(error)),
    {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000});
  }


  renderScreen = () => {
      return (
        <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={this.state.initialPosition}/>
        </View>
      );
  }

  render() {
    return (
      this.renderScreen()
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default MapComponent;