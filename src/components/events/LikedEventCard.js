import React, {useEffect, useState} from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import {
  View,
  Text,
  HStack,
  Icon,
  PresenceTransition,
  Pressable,
  Center,
} from 'native-base';
import {Ionicons} from '@native-base/icons';
import {CardIcon} from './CardIcon';
import {useNavigation} from '@react-navigation/native';

export const LikedEventCard = props => {
  const navigation = useNavigation();
  const [showIcons, setShowIcons] = useState(false);
  const [cardHeight, setCardHeight] = useState(0);

  useEffect(() => {
    setShowIcons(false);
  }, [props.reset]);

  // To obtain height of this event card
  const onLayout = event => {
    const {x, y, height, width} = event.nativeEvent.layout;
    setCardHeight(height);
  };

  return !showIcons ? (
    <Pressable
      onLongPress={() => setShowIcons(true)}
      onPress={() =>
        navigation.navigate('EventPage', {
          eventId: props.eventId,
        })
      }>
      {({isHovered, isFocused, isPressed}) => {
        return (
          <View onLayout={onLayout}>
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
                  source={require('../../assets/sentosa.jpg')}
                />
              </View>

              <View flex={1} padding="1%">
                <Text
                  fontSize="md"
                  fontWeight="medium"
                  textAlign="right"
                  padding="3%"
                  paddingBottom="0%">
                  {props.title}
                </Text>
                <HStack space={2} padding="3%" alignItems="center">
                  <Icon
                    as={Ionicons}
                    name="location"
                    color="orange.600:alpha.70"
                    size="2xl"
                  />
                  <Text
                    fontSize="xs"
                    color="gray.600"
                    fontWeight="medium"
                    flex={1}
                    flexWrap="wrap"
                    numberOfLines={1}>
                    {props.location}
                  </Text>
                </HStack>
                <HStack space={2} padding="3%" alignItems="center">
                  <Icon
                    as={Ionicons}
                    name="time"
                    color="orange.600:alpha.70"
                    size="2xl"
                  />
                  <Text
                    fontSize="xs"
                    color="gray.600"
                    fontWeight="medium"
                    flex={1}
                    flexWrap="wrap">
                    {props.time}
                  </Text>
                </HStack>
                <HStack space={2} padding="3%" alignItems="center">
                  <Icon
                    as={Ionicons}
                    name="people"
                    color="orange.600:alpha.70"
                    size="2xl"
                  />
                  <Text
                    fontSize="xs"
                    color="gray.600"
                    fontWeight="medium"
                    flex={1}
                    flexWrap="wrap">
                    {props.capacity}
                  </Text>
                </HStack>
              </View>
            </View>
          </View>
        );
      }}
    </Pressable>
  ) : (
    // Card Buttons: 'Join event' and 'Remove from wishlist'
    <TouchableOpacity
      style={{height: cardHeight}}
      activeOpacity={1}
      onPress={() => setShowIcons(false)}>
      <Center
        style={styles.cardView}
        bgColor="gray.200:alpha.40"
        width="100%"
        height="100%"
        justifyContent="space-evenly">
        <CardIcon
          iconLabel="Join"
          iconName="person-add"
          shiftX={-8}
          onPressHandler={() => alert('Join event?')}
        />
        <CardIcon
          iconLabel="Delete"
          iconName="delete"
          shiftX={-18}
          onPressHandler={props.unlikeHandler}
        />
      </Center>
    </TouchableOpacity>
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
