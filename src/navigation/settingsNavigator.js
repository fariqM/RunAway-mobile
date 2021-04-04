import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Settings from '../screens/Settings';
import editSettings from '../screens/editSettings';
import UpdateEmailPassword from '../screens/updateEmailPassword';

const Stack = createStackNavigator();
const INITIAL_ROUTE_NAME = 'Settings';

export default function settingsNavigator({ navigation, route }) {

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={ INITIAL_ROUTE_NAME }>
      <Stack.Screen
        name="SETTINGS"
        component={Settings}
      />
      <Stack.Screen
        name="EDIT"
        component={editSettings}
      />
      <Stack.Screen
        name="EMAILPASSWORD"
        component={UpdateEmailPassword}
      />
    </Stack.Navigator>
  );
}
