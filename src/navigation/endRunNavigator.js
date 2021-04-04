import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SimplyRun from '../screens/SimplyRun';
import EndRun from '../screens/EndRun';

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'SimplyRun';



export default function endRunNavigator({ navigation, route }) {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={INITIAL_ROUTE_NAME}>
            <Stack.Screen
                name="SimplyRun"
                component={SimplyRun}
            />
            <Stack.Screen
                name="EndRun"
                component={EndRun}
            />
        </Stack.Navigator>
    );
}