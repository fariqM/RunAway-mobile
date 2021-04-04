import React, { Component, } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


class StopSign extends Component {

    state = {
        color: 'tomato'
    }
    render() {
        return (
            <View style={{
                borderWidth: 2,
                borderColor: 'rgba(0,0,0,0.2)',
                alignItems: 'center',
                justifyContent: 'center',
                width: 80,
                height: 80,
                backgroundColor: '#ff6347',
                borderRadius: 75,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.8,
                shadowRadius: 5,
            }}>

                <MaterialCommunityIcons name="stop" size={50} style={{ paddingTop: 0 }} color={"#5018D9"} />

            </View>

        )
    }
}


export default class StopRunButton extends Component {
    render() {
        return (
            <View style={{ paddingVertical: 7 }}>

                <TouchableOpacity delayLongPress={1000} onLongPress={this.props.onLongPress}>
                    <View style={{ alignItems: 'center', paddingLeft: 150 }}>
                        <StopSign />
                        <Text> Hold To End Run</Text>
                    </View>
                </TouchableOpacity>

            </View>
        )
    }
}