import 'react-native-url-polyfill/auto';
import React from 'react';
import {LogBox} from 'react-native';
import {NativeBaseProvider, extendTheme, View} from 'native-base';
import SignInPage from './src/screens/SignInPage';
import SignUpPage from './src/screens/SignUpPage';
import BottomTabs from './src/components/footer/BottomTabs';
import {
  NavigationContainer,
  getFocusedRouteNameFromRoute,
} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AuthProvider} from './src/components/contexts/Auth';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const theme = extendTheme({
  fontConfig: {
    Lato: {
      100: {
        normal: 'Lato-Regular',
        italic: 'Lato-Italic',
      },
      200: {
        normal: 'Lato-Regular',
        italic: 'Lato-Italic',
      },
      300: {
        normal: 'Lato-Regular',
        italic: 'Lato-Italic',
      },
      400: {
        normal: 'Lato-Regular',
        italic: 'Lato-Italic',
      },
      500: { // 'medium'
        normal: 'Lato-Bold',
        italic: 'Lato-BoldItalic',
      },
      600: { // 'semibold'
        normal: 'Lato-Bold',
        italic: 'Lato-BoldItalic',
      },

      // 700: {
      //   normal: 'Lato-Regular',
      //   italic: 'Lato-Italic',
      // },
      // 800: {
      //   normal: 'Lato-Regular',
      //   italic: 'Lato-Italic',
      // },
      // 900: {
      //   normal: 'Lato-Regular',
      //   italic: 'Lato-Italic',
      // },
    },
  },

  // Make sure values below matches any of the keys in `fontConfig`
  fonts: {
    heading: 'Lato',
    body: 'Lato',
    mono: 'Lato',
  },
});

// const customFonts = {
//   'SalmaalfasansLight': require("./src/assets/fonts/SalmaalfasansLight-d9MJx.otf"),
//   'SalmaalfasansLightitalic': require("./src/assets/fonts/SalmaalfasansLight-d9MJx.otf"),
// };

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
      return 'Create Event';
    case 'Liked':
      return 'Wishlist';
    case 'Profile':
      return 'User Profile';
    case 'EventPage':
      return 'Event Page';
    case 'EventEditForm':
      return 'Edit Event';
  }
}

const App = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <AuthProvider>
          <Stack.Navigator
            initialRouteName="SignIn"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#ea580c', // orange.600
                // backgroundColor:'#f2f2f2',
              },
              headerTintColor: '#fff',
              // headerTintColor:'#52525b', // gray.600
              headerTitleAlign: 'center',
              headerTitleStyle: {
                fontSize: 18,
                fontFamily: 'body'
              },
              headerShadowVisible:false,
            }}>
            <Stack.Screen
              name="SignIn"
              component={SignInPage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpPage}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Dashboard"
              component={BottomTabs}
              options={({route}) => ({
                headerTitle: getHeaderTitle(route),
                headerBackVisible: false,
                headerShown: getFocusedRouteNameFromRoute(route) != 'Profile' &&
                              getFocusedRouteNameFromRoute(route) != 'EventPage',
              })}
            />
          </Stack.Navigator>
        </AuthProvider>
      </NavigationContainer>
    </NativeBaseProvider>
  );
};

export default App;
