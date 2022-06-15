import {Image, StyleSheet} from 'react-native';
import {View, Text, HStack, Pressable, Icon, VStack} from 'native-base';
import {Ionicons} from '@native-base/icons';
import React from 'react';
import { CardButton } from './CardButton';

export const MarketplaceEventCard = () => {
  return (
    <Pressable
      width="49%"
      height={350}
      marginBottom="2%"
      // ================= INPUT NAVIGATION HERE ================= //
      onPress={() => alert('navigate to event page')}> 
      {({isHovered, isFocused, isPressed}) => {
        return (
          <View
            height="100%"
            bgColor={
              isPressed
                ? 'gray.200'
                : isHovered
                ? 'gray.200'
                : 'gray.200:alpha.40'
            }>
            <View height="55%">
              <Image
                style={[styles.img, {opacity: isPressed ? 0.8 : 1}]}
                source={require('../../assets/sentosa.jpg')}
              />
            </View>
            <CardButton buttonColor='emerald.400' iconName='person-add' onPressColor='emerald' onPressHandler={() => alert('Join event handler')} />

            <VStack space={3} flex={1} padding="5%">
              <View>
                <Text fontSize="md">Event Title</Text>
                <Text fontSize="xs" italic>
                  by User123
                </Text>
              </View>
              <HStack alignItems="center" justifyContent="space-between">
                <View flex={1}>
                  <Icon
                    as={Ionicons}
                    name="shapes-outline"
                    color="orange.600"
                    size="xl"
                  />
                </View>
                <View width="80%">
                  <Text fontSize="xs">Sports</Text>
                </View>
              </HStack>
              <HStack justifyContent="space-between">
                <View flex={1}>
                  <Icon
                    as={Ionicons}
                    name="alarm-outline"
                    color="orange.600"
                    size="xl"
                  />
                </View>
                <View width="80%">
                  <Text fontSize="xs">
                    Starts Monday,{'\n'}27 Jun 2022 (1700 hrs)
                  </Text>
                </View>
              </HStack>
            </VStack>
          </View>
        );
      }}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  img: {
    width: '100%',
    height: '100%',
    flex: 1,
  },
});
