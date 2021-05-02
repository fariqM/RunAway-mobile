import React, {Component} from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

class Apps extends Component {
  constructor() {
    super();
    this.state = {
      initialPosition: {
        latitude: 0,
        longitude: 0,
        latitudeDelta: 0.0102,
          longitudeDelta: 0.0101,
      },
      marker: {
        latitude: 0,
        longitude: 0,
      },
    };
  }


  componentDidMount() {
    Geolocation.getCurrentPosition(
      position => {
        var lat = parseFloat(position.coords.latitude);
        var long = parseFloat(position.coords.longitude);
        var initialRegion = {
          latitude: lat,
          longitude: long,
          latitudeDelta: 0.0102,
          longitudeDelta: 0.0101,
        };

        var Mymarker = {
          latitude: lat,
          longitude: long,
        };

        this.setState({initialPosition: initialRegion});
        this.setState({marker: Mymarker});
      },
      error => alert(JSON.stringify(error)),
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView style={styles.map} initialRegion={this.state.initialPosition}>
          <Marker
            coordinate={this.state.marker}
            title={'SAYA'}></Marker>
        </MapView>
      </View>
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


export default Apps;
