import React from 'react';
import {Pressable, View, Text, VStack, HStack, Icon} from 'native-base';
import {Ionicons} from '@native-base/icons';
import {UpcomingEventCardButtons} from './UpcomingEventCardButtons';
import { useNavigation } from "@react-navigation/native";


export const UpcomingEventCard = props => {
  const {id, name, location, daysToEvent, quitEventHandler} = props;

  const navigation = useNavigation(); 

  return (
    <Pressable
      width="100%"
      onPress={() =>
        navigation.navigate('EventPage', {
          eventId: id,
        })
      }>
      {({isHovered, isFocused, isPressed}) => {
        return (
          <View
            bgColor={
              isPressed
                ? 'gray.200'
                : isHovered
                ? 'gray.200'
                : 'gray.200:alpha.40'
            }>
            <Text
              fontSize="md"
              textAlign="right"
              paddingTop="3%"
              paddingRight="3%">
              {name}
            </Text>
            <VStack marginTop="3%">
              <HStack space={2} padding="2%" alignItems="center">
                <Icon
                  as={Ionicons}
                  name="location-outline"
                  color="orange.600"
                  size="2xl"
                />
                <Text flex={1} flexWrap="wrap">
                  {location}
                </Text>
              </HStack>
              <HStack space={2} padding="2%" alignItems="center">
                <Icon
                  as={Ionicons}
                  name="alarm-outline"
                  color="orange.600"
                  size="2xl"
                />
                {/* TODO: reminder of days to event; hours if 24h prior */}
                <Text flex={1} flexWrap="wrap">
                  {daysToEvent}
                </Text>
              </HStack>
            </VStack>
            {/* <UpcomingEventCardButtons quitEventHandler={quitEventHandler} /> */}
          </View>
        );
      }}
    </Pressable>
  );
};
