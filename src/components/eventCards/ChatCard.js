import {useNavigation} from '@react-navigation/native';
import {Avatar, HStack, View, Text, VStack, Pressable} from 'native-base';
import React from 'react';
import {MONTH} from '../../constants/constants';
import {getLocalDateTimeNow, getPublicURL} from '../../functions/helpers';

export const ChatCard = props => {
  const {eventDetails} = props;

  const navigation = useNavigation();

  // determine if the two timestamps are within the same day
  const withinSameDay = (timestamp1, timestamp2) => {
    const date1 = new Date(timestamp1);
    const date2 = new Date(timestamp2);
    return (
      date1.getUTCDate() == date2.getUTCDate() &&
      date1.getMonth() == date2.getMonth() &&
      date1.getFullYear() == date2.getFullYear()
    );
  };

  // for display on ChatCard
  const formatDateTime = timestamp => {
    const date = new Date(timestamp);

    if (withinSameDay(getLocalDateTimeNow(), timestamp)) {
      return (
        (date.getHours() % 12) +
        ':' +
        (date.getMinutes() < 10 ? '00' : date.getMinutes()) +
        ' ' +
        (date.getHours() > 11 ? 'PM' : 'AM')
      );
    } else {
      return (
        date.getDate() + ' ' + MONTH[date.getMonth()] + ' ' + date.getFullYear()
      );
    }
  };

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('ChatRoom', {
          eventId: eventDetails.id,
          eventDetails: eventDetails,
        })
      }>
      {({isHovered, isFocused, isPressed}) => {
        return (
          <HStack
            padding="4%"
            space={4}
            borderBottomWidth={1}
            borderBottomColor="gray.200"
            bgColor={
              isPressed ? 'gray.200' : isHovered ? 'gray.200' : 'transparent'
            }>
            <Avatar
              opacity={isPressed ? 0.8 : 1}
              source={getPublicURL(eventDetails.picture_url, 'eventpics')}
              size="lg"></Avatar>
            <VStack space={1} width="78%">
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontSize="md" fontWeight="semibold">
                  {eventDetails.title}
                </Text>
                {eventDetails.last_chat_message.length != 0 ? (
                  <Text>
                    {formatDateTime(
                      eventDetails.last_chat_message[0].created_at,
                    )}
                  </Text>
                ) : null}
              </HStack>
              {/* <Text>user123: hello how are you doing?</Text> */}
              {eventDetails.last_chat_message.length != 0 ? (
                <Text>
                  {eventDetails.last_chat_message[0].profiles.username +
                    ': ' +
                    eventDetails.last_chat_message[0].text}
                </Text>
              ) : (
                <Text italic>This chat is empty.</Text>
              )}
            </VStack>
          </HStack>
        );
      }}
    </Pressable>
  );
};
