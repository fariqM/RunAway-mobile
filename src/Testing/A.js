import React from 'react'
import { View, Text } from 'react-native'

const A = () => {
  return (
    <View>
      <Text>Halaman A</Text>
    </View>
  )
}

export default A





// import * as React from 'react';
// import { Text, View } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// import Bpage from './B'
// import Cpage from './C'

// const Tab = createBottomTabNavigator();

// export default function A() {
//     return (
//         <NavigationContainer>
//           <Tab.Navigator>
//             <Tab.Screen name="Home" component={Bpage} />
//             <Tab.Screen name="Settings" component={Cpage} />
//           </Tab.Navigator>
//         </NavigationContainer>
//       );
// }
