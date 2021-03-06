import React, {useState, useEffect} from 'react';
import {Image, StyleSheet} from 'react-native';
import {View, Text, HStack, Icon, Pressable} from 'native-base';
import {Ionicons} from '@native-base/icons';
import {useNavigation} from '@react-navigation/native';
import {getPublicURL} from '../../functions/helpers';
import {CardButton} from './CardButton';
import {CustomModal} from '../basic/CustomModal';

export const LikedEventCard = props => {
  const {
    eventId,
    pictureURL,
    title,
    location,
    time,
    capacity,
    unlikeHandler,
    joinEventHandler,
    isLoadingJoiningEvent,
  } = props;

  const navigation = useNavigation();

  const [loadingEventHandler, setLoadingEventHandler] = useState(false);

  useEffect(() => {
    setLoadingEventHandler(isLoadingJoiningEvent);
  }, [isLoadingJoiningEvent]);

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('LikedEventPage', {
          screen: 'EventPage',
          params: {eventId: eventId},
        })
      }>
      {({isHovered, isFocused, isPressed}) => {
        return (
          <View
            style={styles.cardView}
            bgColor={
              isPressed
                ? 'gray.200'
                : isHovered
                ? 'gray.200'
                : 'gray.200:alpha.40'
            }>
            <View width="45%">
              <Image
                style={[styles.img, {opacity: isPressed ? 0.8 : 1}]}
                source={getPublicURL(pictureURL, 'eventpics')}
              />
            </View>

            <View flex={1} padding="1%">
              <Text
                fontSize="md"
                textAlign="right"
                padding="3%"
                paddingBottom="0%">
                {title}
              </Text>
              <HStack space={2} padding="3%" alignItems="center">
                <Icon
                  as={Ionicons}
                  name="location-outline"
                  color="orange.600"
                  size="xl"
                />
                <Text fontSize="xs" flex={1} flexWrap="wrap" numberOfLines={1}>
                  {location}
                </Text>
              </HStack>
              <HStack space={2} padding="3%" alignItems="center">
                <Icon
                  as={Ionicons}
                  name="time-outline"
                  color="orange.600"
                  size="xl"
                />
                <Text fontSize="xs" flex={1} flexWrap="wrap">
                  {time}
                </Text>
              </HStack>
              <HStack space={2} padding="3%" alignItems="center">
                <Icon
                  as={Ionicons}
                  name="people-outline"
                  color="orange.600"
                  size="xl"
                />
                <Text fontSize="xs" flex={1} flexWrap="wrap">
                  {capacity}
                </Text>
              </HStack>
            </View>
            <View position="absolute" top={0.5} left={0.5}>
              <CustomModal
                modalButton={
                  <CardButton buttonColor="emerald.500" iconName="person-add" />
                }
                confirmHandler={joinEventHandler}
                isLoading={loadingEventHandler}
              />
            </View>

            <View position="absolute" top={0.5} left={8}>
              <CardButton
                buttonColor="red.400"
                iconName="delete"
                onPressHandler={unlikeHandler}
              />
            </View>
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
  cardView: {
    flexDirection: 'row',
  },
});
