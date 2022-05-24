import 'react-native-url-polyfill/auto'
import React from "react";
import { NativeBaseProvider } from "native-base";
import SignInPage from './src/screens/SignInPage';
import SignUpPage from './src/screens/SignUpPage';
import BottomTabs from './src/components/footer/BottomTabs';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider } from './src/components/contexts/Auth';


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
          }}
        >
          <Stack.Screen name="SignIn" component={SignInPage} options={{ headerShown:false }}/>
          <Stack.Screen name="SignUp" component={SignUpPage} />
          <Stack.Screen name="Dashboard" component={BottomTabs} options={{headerBackVisible:false}} />
        </Stack.Navigator>
      </AuthProvider>
    </NavigationContainer>
  </NativeBaseProvider>
  )
}

export default App;

