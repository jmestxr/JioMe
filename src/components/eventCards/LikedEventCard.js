import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {
  View,
  Text,
  HStack,
  Icon,
  Pressable,
} from 'native-base';
import {Ionicons} from '@native-base/icons';
import {LikedEventCardButtons} from './LikedEventCardButtons';
import {useNavigation} from '@react-navigation/native';
import { getEventPicture } from '../../functions/eventHelpers';

export const LikedEventCard = props => {
  const {eventId, pictureURL, title, location, time, capacity, unlikeHandler} = props;

  const navigation = useNavigation();

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('EventPage', {
          eventId: eventId,
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
                  source={getEventPicture(pictureURL)}
                />    
            </View>

            <View flex={1} padding="1%">
              <Text
                fontSize="md"
                fontWeight="medium"
                textAlign="right"
                padding="3%"
                paddingBottom="0%">
                {title}
              </Text>
              <HStack space={2} padding="3%" alignItems="center">
                <Icon
                  as={Ionicons}
                  name="location"
                  color="orange.600:alpha.70"
                  size="xl"
                />
                <Text
                  fontSize="xs"
                  color="gray.600"
                  fontWeight="medium"
                  flex={1}
                  flexWrap="wrap"
                  numberOfLines={1}>
                  {location}
                </Text>
              </HStack>
              <HStack space={2} padding="3%" alignItems="center">
                <Icon
                  as={Ionicons}
                  name="time"
                  color="orange.600:alpha.70"
                  size="xl"
                />
                <Text
                  fontSize="xs"
                  color="gray.600"
                  fontWeight="medium"
                  flex={1}
                  flexWrap="wrap">
                  {time}
                </Text>
              </HStack>
              <HStack space={2} padding="3%" alignItems="center">
                <Icon
                  as={Ionicons}
                  name="people"
                  color="orange.600:alpha.70"
                  size="xl"
                />
                <Text
                  fontSize="xs"
                  color="gray.600"
                  fontWeight="medium"
                  flex={1}
                  flexWrap="wrap">
                  {capacity}
                </Text>
              </HStack>
            </View>

            <LikedEventCardButtons unlikeHandler={unlikeHandler} />
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
    borderTopLeftRadius: 5, // must be same as parent's borderRadius
    borderBottomLeftRadius: 5, // must be same as parent's borderRadius
  },
  cardView: {
    flexDirection: 'row',
    borderRadius: 5,
  },
});
