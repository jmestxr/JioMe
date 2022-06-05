import React from "react";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, StyleSheet } from 'react-native';
import TabIcon from "./TabIcon";
import Dashboard from "../../screens/Dashboard";
import { PlaceholderScreen } from "../../screens/PlaceholderScreen";
import { UserProfile } from "../../screens/UserProfile";
import { EventForm } from "../../screens/EventForm";

const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.bar}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const BarIcon = options.tabBarIcon;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
            <BarIcon 
              color={isFocused ? 'orange.600' : 'gray.600'}
              onPressHandler={onPress}
              onLongPressHandler={onLongPress}
            />
        );
      })}
    </View>
  );
}


const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator 
    tabBar={props => <CustomTabBar {...props} />}
    screenOptions={{
        headerShown:false,
        
      }}
     >
       <Tab.Screen
        name="Home"
        component={Dashboard}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: TabIcon({tabName: 'Home', iconName:'home'})
          }}
        />

      <Tab.Screen
        name="Marketplace"
        component={PlaceholderScreen}
        options={{
          tabBarLabel: 'Marketplace',
          tabBarIcon: TabIcon({tabName: 'Marketplace', iconName:'store'}),
          title:'Marketplace'
        }}
      />
      <Tab.Screen
        name="Create"
        component={EventForm}
        options={{
          tabBarLabel: 'Create Event',
          tabBarIcon: TabIcon({tabName: 'New Event', iconName:'create'})
        }}
      />
      <Tab.Screen
        name="Liked"
        component={PlaceholderScreen}
        options={{
          tabBarLabel: 'Liked Events',
          tabBarIcon: TabIcon({tabName: 'Wishlist', iconName:'favorite'})
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfile}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: TabIcon({tabName: 'Profile', iconName:'face'})
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection:'row', 
    justifyContent:'space-around',
    alignItems:'center',
    backgroundColor:'#f2f2f2', 
    height:'10%', 
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    elevation: 8, // shadow for android
    // overflow: 'hidden'
  }
});

export default BottomTabs;