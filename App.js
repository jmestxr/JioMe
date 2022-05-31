import 'react-native-url-polyfill/auto'
import React from "react";
import { LogBox } from 'react-native';
import { NativeBaseProvider } from "native-base";
import SignInPage from './src/screens/SignInPage';
import SignUpPage from './src/screens/SignUpPage';
import BottomTabs from './src/components/footer/BottomTabs';
import { NavigationContainer, getFocusedRouteNameFromRoute } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/components/contexts/Auth';
import EventPage from './src/screens/EventPage';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

function getHeaderTitle(route) {
   // If the focused route is not found, we need to assume it's the initial screen
  // This can happen during if there hasn't been any navigation inside the screen
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';

  switch (routeName) {
    case 'Home':
      return 'Dashboard';
    case 'Marketplace':
      return 'Marketplace';
    case 'Create':
      return 'Event Form';
    case 'Liked':
      return 'Wishlist';
    case 'Profile':
      return 'User Profile';
  }
}

const App = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NativeBaseProvider>
      <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator 
          initialRouteName="EventPage"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#ea580c', // orange.600
            
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize:18
            }
          }}
        >
          <Stack.Screen name="SignIn" component={SignInPage} options={{ headerShown:false }}/>
          <Stack.Screen name="SignUp" component={SignUpPage} options={{ headerShown:false }}/>
          <Stack.Screen name="Dashboard" component={BottomTabs} 
            options={ ({ route }) => ({ headerTitle: getHeaderTitle(route), headerBackVisible:false }) } />
          <Stack.Screen name="EventPage" component={EventPage} options={{ headerShown:false }}/>
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  </NativeBaseProvider>
  )
}

export default App;

