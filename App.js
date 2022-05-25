import 'react-native-url-polyfill/auto'
import React from "react";
import { NativeBaseProvider } from "native-base";
import SignInPage from './src/screens/SignInPage';
import SignUpPage from './src/screens/SignUpPage';
import BottomTabs from './src/components/footer/BottomTabs';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/components/contexts/Auth';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

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
      return 'Create New Event';
    case 'Liked':
      return 'My Liked Events';
    case 'Profile':
      return 'My Profile';
  }
}

const App = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NativeBaseProvider>
      <NavigationContainer>
      <AuthProvider>
        <Stack.Navigator 
          initialRouteName="Dashboard"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#ea580c',
            
            },
            headerTintColor: '#fff',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize:18
            }
          }}
        >
          <Stack.Screen name="SignIn" component={SignInPage} options={{ headerShown:false }}/>
          <Stack.Screen name="SignUp" component={SignUpPage} />
          <Stack.Screen name="Dashboard" component={BottomTabs} 
            options={ ({ route }) => ({ headerTitle: getHeaderTitle(route), headerBackVisible:false }) } />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  </NativeBaseProvider>
  )
}

export default App;

