import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';

// const App = () => {
//   return (
//     <MapView
//     style={styles.map}
//     initialRegion={{
//       latitude: -7.3222874293433176,
//       longitude: 112.73418672360881,
//       latitudeDelta: 0.0922,
//       longitudeDelta: 0.0421,
//     }}
//   />
//   )
// }

export default class Apps extends Component {
  state = {
    coordinates: [
      {
        name: '2',
        latitude: -7.319893121173853,
        longitude: 112.73356445115098,
      },
      {
        name: '1',
        latitude: -7.3240326060527146,
        longitude: 112.73263104247353,
      },
      
      {
        name: '3',
        latitude: -7.324692366198258,
        longitude: 112.73424036785293,
      },
      {
        name: '4',
        latitude: -7.324165622321358,
        longitude: 112.73451395315494,
      },
    ],
  };
  render() {
    return (
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: -7.3222874293433176,
          longitude: 112.73418672360881,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}>
        <Marker
          coordinate={{
            latitude: -7.319893121173853,
            longitude: 112.73356445115098,
          }} title={'Mulai'} ></Marker>
        <Marker
          coordinate={{
            latitude: -7.324165622321358,
            longitude: 112.73451395315494,
          }} title={'Selesai'} ></Marker>

          <Polyline coordinates={this.state.coordinates} ></Polyline>
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    height: '100%',
  },
});

// export default App
