import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {View, StyleSheet} from 'react-native';
import TabIcon from './TabIcon';
import Dashboard from '../../screens/Dashboard';
import Wishlist from '../../screens/Wishlist';
import EventForm from '../../screens/EventForm';
import UserProfile from '../../screens/UserProfile';
import EventPage from '../../screens/EventPage';
import EventEditForm from '../../screens/EventEditForm';
import {Marketplace} from '../../screens/Marketplace';
import ChatRoom from '../../screens/ChatRoom';

import {CardStyleInterpolators} from '@react-navigation/stack';
import {useAuth} from '../contexts/Auth';
import {StackActions} from '@react-navigation/native';
import ChatsPage from '../../screens/ChatsPage';

const TAB_TO_RESET = ['Home', 'Marketplace', 'Liked', 'Chat', 'Profile'];
const resetStackNavigators = ({navigation, route}) => ({
  tabPress: e => {
    const state = navigation.getState();

    if (state) {
      // Grab all the tabs that are NOT the one we just pressed
      const nonTargetTabs = state.routes.filter(r => r.key !== e.target);

      nonTargetTabs.forEach(tab => {
        // Find the tab we want to reset and grab the key of the nested stack
        const tabName = tab?.name;
        const stackKey = tab?.state?.key;

        if (stackKey && TAB_TO_RESET.includes(tabName)) {
          // Pass the stack key that we want to reset and use popToTop to reset it
          navigation.dispatch({
            ...StackActions.popToTop(),
            target: stackKey,
          });
        }
      });
    }
  },
});

const CustomTabBar = ({state, descriptors, navigation}) => {
  const {user} = useAuth();
  return (
    <View style={styles.bar}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
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
            route.name == 'Profile'
              ? navigation.navigate('Profile', {
                  screen: 'UserProfile',
                  params: {userId: user.id, showBackButton: false},
                })
              : navigation.navigate({name: route.name, merge: true});
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
};

const Tab = createBottomTabNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      tabBar={props => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen
        name="Home"
        component={DashboardScreens}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: TabIcon({tabName: 'Home', iconName: 'home'}),
        }}
        listeners={resetStackNavigators}
      />

      <Tab.Screen
        name="Marketplace"
        component={MarketplaceScreens}
        options={{
          tabBarLabel: 'Marketplace',
          tabBarIcon: TabIcon({tabName: 'Marketplace', iconName: 'store'}),
        }}
        listeners={resetStackNavigators}
      />
      <Tab.Screen
        name="Create"
        component={EventForm}
        options={{
          tabBarLabel: 'Create Event',
          tabBarIcon: TabIcon({tabName: 'New Event', iconName: 'create'}),
        }}
        listeners={resetStackNavigators}
      />
      <Tab.Screen
        name="Liked"
        component={WishlistScreens}
        options={{
          tabBarLabel: 'Liked Events',
          tabBarIcon: TabIcon({tabName: 'Wishlist', iconName: 'favorite'}),
        }}
        listeners={resetStackNavigators}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreens}
        options={{
          tabBarLabel: 'Chats',
          tabBarIcon: TabIcon({tabName: 'Chats', iconName: 'chat'}),
        }}
        listeners={resetStackNavigators}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreens}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: TabIcon({tabName: 'Profile', iconName: 'face'}),
        }}
        listeners={resetStackNavigators}
      />
    </Tab.Navigator>
  );
};

const EventPageStack = createStackNavigator();
const EventPageScreens = () => {
  return (
    <EventPageStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <EventPageStack.Screen name="EventPage" component={EventPage} />
      <EventPageStack.Screen
        name="AvatarProfile"
        component={ProfileScreens}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <EventPageStack.Screen
        name="EventEditForm"
        component={EventEditForm}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </EventPageStack.Navigator>
  );
};

const DashboardStack = createStackNavigator();
const DashboardScreens = () => {
  return (
    <DashboardStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <DashboardStack.Screen name="Dashboard" component={Dashboard} />
      <DashboardStack.Screen
        name="UpcomingEventPage"
        component={EventPageScreens}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </DashboardStack.Navigator>
  );
};

const MarketplaceStack = createStackNavigator();
const MarketplaceScreens = () => {
  return (
    <MarketplaceStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <MarketplaceStack.Screen name="Marketplace" component={Marketplace} />
      <MarketplaceStack.Screen
        name="OngoingEventPage"
        component={EventPageScreens}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </MarketplaceStack.Navigator>
  );
};

const WishlistStack = createStackNavigator();
const WishlistScreens = () => {
  return (
    <WishlistStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <WishlistStack.Screen name="Wishlist" component={Wishlist} />
      <WishlistStack.Screen
        name="LikedEventPage"
        component={EventPageScreens}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </WishlistStack.Navigator>
  );
};

const ChatStack = createStackNavigator();
const ChatScreens = () => {
  return (
    <ChatStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <ChatStack.Screen name="ChatsPage" component={ChatsPage} />
      <ChatStack.Screen
        name="ChatRoom"
        component={ChatRoom}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <DashboardStack.Screen
        name="JoinedEventPage"
        component={EventPageScreens}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <ChatStack.Screen
        name="AvatarProfile"
        component={ProfileScreens}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </ChatStack.Navigator>
  );
};

const ProfileStack = createStackNavigator();
const ProfileScreens = () => {
  return (
    <ProfileStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <ProfileStack.Screen name="UserProfile" component={UserProfile} />
      <ProfileStack.Screen
        name="PastEventPage"
        component={EventPageScreens}
        options={{
          headerShown: false,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
    </ProfileStack.Navigator>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    height: '10%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    elevation: 8, // shadow for android
    // overflow: 'hidden'
  },
});

export default BottomTabs;
