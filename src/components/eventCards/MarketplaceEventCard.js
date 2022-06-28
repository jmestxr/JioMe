import {Image, StyleSheet} from 'react-native';
import {View, Text, HStack, Pressable, Icon, VStack} from 'native-base';
import {Ionicons} from '@native-base/icons';
import React from 'react';
import {getPublicURL} from '../../functions/helpers';
import {MONTH, WEEKDAY_LONG} from '../../constants/constants';
import {useNavigation} from '@react-navigation/native';

export const MarketplaceEventCard = props => {
  const {eventDetails} = props;

  const navigation = useNavigation();

  const formatDateTime = timestamp => {
    const dt = new Date(timestamp);
    const date = timestamp.slice(0, 10);

    const timeString =
      String(dt.getUTCHours()).padStart(2, '0') +
      String(dt.getMinutes()).padStart(2, '0');

    return (
      WEEKDAY_LONG[dt.getDay()] +
      ',' +
      '\n' +
      dt.getDate() +
      ' ' +
      MONTH[dt.getMonth()] +
      ' ' +
      dt.getFullYear() +
      ' ' +
      '(' +
      timeString +
      ' hrs)'
    );
  };

  return (
    <Pressable
      width="49%"
      height={330}
      marginBottom="2%"
      onPress={() =>
        navigation.navigate('OngoingEventPage', {
          screen: 'EventPage',
          params: {eventId: eventDetails.id},
        })
      }>
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
            <View height="53%">
              <Image
                style={[styles.img, {opacity: isPressed ? 0.8 : 1}]}
                source={getPublicURL(eventDetails.picture_url, 'eventpics')}
              />
            </View>

            <VStack space={3} flex={1} padding="5%">
              <View>
                <Text fontSize="md">{eventDetails.title}</Text>
                <Text fontSize="xs" italic>
                  by {eventDetails.profiles.username}
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
                  <Text fontSize="xs">{eventDetails.category}</Text>
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
                    {'Starts' +
                      ' ' +
                      formatDateTime(eventDetails.from_datetime)}
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
