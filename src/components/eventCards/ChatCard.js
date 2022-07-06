import {useNavigation} from '@react-navigation/native';
import {
  Avatar,
  HStack,
  View,
  Text,
  VStack,
  Pressable,
  Center,
} from 'native-base';
import React, {useEffect, useState} from 'react';
import {MONTH} from '../../constants/constants';
import {getLocalDateTimeNow, getPublicURL} from '../../functions/helpers';
import {supabase} from '../../../supabaseClient';
import { useAuth } from '../contexts/Auth';

export const ChatCard = props => {
  const {eventDetails, reRender} = props;

  const {user} = useAuth();
  const navigation = useNavigation();

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    Promise.all([getAllMessagesCount(), getReadMessagesCount()]).then(results =>
      setUnreadMessagesCount(results[0] - results[1]),
    );
  }, [reRender]);

  const getAllMessagesCount = async e => {
    try {
      const {data, error, count} = await supabase
        .from('chat_messages')
        .select('*', {count: 'exact'})
        .eq('event_id', eventDetails.id);
      if (error) throw error;
      if (data) return count;
    } catch (error) {
      console.log(error);
    }
  };

  const getReadMessagesCount = async e => {
    try {
      const {data, error, count} = await supabase
        .from('chat_messages_read')
        .select('*', {count: 'exact'})
        .match({event_id: eventDetails.id, receiver_id: user.id});
      if (error) throw error;
      if (data) return count;
    } catch (error) {
      console.log(error);
    }
  };

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
            <VStack space={2} width="78%">
              <HStack alignItems="center" justifyContent="space-between">
                <Text fontSize="md" fontWeight="semibold" flex={1} flexWrap="wrap" numberOfLines={1}>
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
              <HStack>
                <View flex={0.85}>
                  {eventDetails.last_chat_message.length != 0 ? (
                    <Text flex={1} flexWrap="wrap" numberOfLines={1}>
                      {eventDetails.last_chat_message[0].profiles.username +
                        ': ' +
                        eventDetails.last_chat_message[0].text}
                    </Text>
                  ) : (
                    <Text italic>This chat is empty.</Text>
                  )}
                </View>
                <View flex={0.15} alignItems="flex-end">
                  {unreadMessagesCount > 0 ? (
                    <Center
                      height={7}
                      width={7}
                      borderRadius="full"
                      bgColor="orange.400">
                      <Text fontSize='xs' color="white">{unreadMessagesCount}</Text>
                    </Center>
                  ) : null}
                </View>
              </HStack>
            </VStack>
          </HStack>
        );
      }}
    </Pressable>
  );
};
