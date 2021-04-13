import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import Launch from './src/screens/Launch'
import Login from './src/screens/Login';
import ForgotPassword from './src/screens/ForgotPassword';
import CreateAccount from './src/screens/CreateAccount'
import SuccessLogin from './src/screens/SuccessLogin'
import InputPersonalInfo from './src/screens/InputPersonalInfo'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import rootReducer from './src/reducers' // Importing the index (do not need specifying)
import { decode, encode } from 'base-64'


if (!global.btoa) { global.btoa = encode }

if (!global.atob) { global.atob = decode }

//Create a stack navigator 
const Stack = createStackNavigator();

//Create a store using the rootReducer 
const store = createStore(rootReducer)

export default function App() {

    return (
        <Provider store={store}>
            <NavigationContainer >
                <Stack.Navigator >
                    <Stack.Screen name="Launch" options={{headerLeft: null}} component={Launch}/>
                    <Stack.Screen name="Login" options={{ headerLeft: null }} component={Login}/>
                    <Stack.Screen name="CreateAccount" component={CreateAccount}/>
                    <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
                    <Stack.Screen name="InputPersonalInfo" component={InputPersonalInfo}/>
                    <Stack.Screen name="SuccessLogin" component={SuccessLogin}/>
                    {/* <Stack.Screen name="Main" options={{ headerLeft: null }} component={BottomTabNavigator} /> */}
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
}
