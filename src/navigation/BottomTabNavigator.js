import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import SimplyRun from '../screens/SimplyRun'
import RunLog from '../screens/RunLog'
import endRunNavigator from './endRunNavigator.js';
import settingsNavigator from './settingsNavigator.js';
import {MaterialCommunityIcons} from "@expo/vector-icons";

const BottomTab = createBottomTabNavigator();
const INITIAL_ROUTE_NAME = 'SIMPLY_RUN';

export default function BottomTabNavigator({ navigation, route }) {
  // Set the header title on the parent stack navigator depending on the
  // currently active tab. Learn more in the documentation:
  // https://reactnavigation.org/docs/en/screen-options-resolution.html

  navigation.setOptions({ headerTitle: getHeaderTitle(route) });

  var activeTintColor = "#5018D9";
  var inactiveTintColor = "#CBCBCB";

  return (
    <BottomTab.Navigator initialRouteName={INITIAL_ROUTE_NAME} tabBarOptions={{activeTintColor: "blue", inactiveTintColor: "#CBCBCB"}}>
      <BottomTab.Screen
        name="RUN_LOG"
        component={RunLog}
        options={{
          title: 'Run Log',
          tabBarIcon: ({ focused }) => <MaterialCommunityIcons focused={focused} name="folder-outline" size={25} style={{paddingTop: 0}} color={ focused ? activeTintColor : inactiveTintColor} />,
        }}
      />
      <BottomTab.Screen
        name="SIMPLY_RUN"
              component={endRunNavigator}
        options={{
          title: 'Start a Run',
          tabBarIcon: ({ focused }) => <MaterialCommunityIcons focused={focused} name="run-fast" size={25} style={{paddingTop: 0}} color={ focused ? activeTintColor : inactiveTintColor} />,
        }}
      />
      <BottomTab.Screen
        name="SETTINGS"
        component={settingsNavigator}
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => <MaterialCommunityIcons focused={focused} name="settings-outline" size={25} style={{paddingTop: 0}} color={ focused ? activeTintColor : inactiveTintColor} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

export function getHeaderTitle(route) {
  const routeName = route.state?.routes[route.state.index]?.name ?? INITIAL_ROUTE_NAME;
  switch (routeName) {
    case 'RUN_LOG':
      return 'Run Log';
    case 'SIMPLY_RUN':
      return 'Simply Run';
    case 'SETTINGS':
      return 'Settings';
  }
}
