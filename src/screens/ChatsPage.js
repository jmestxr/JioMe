import React, {isValidElement, useEffect, useState} from 'react';
import {View, Text, VStack, Center} from 'native-base';
import {HeaderBar} from '../components/basic/HeaderBar';
import {Wrapper} from '../components/basic/Wrapper';
import {ChatCard} from '../components/eventCards/ChatCard';
import {useAuth} from '../components/contexts/Auth';
import {supabase} from '../../supabaseClient';
import {useIsFocused} from '@react-navigation/native';
import {ZeroEventCard} from '../components/eventCards/ZeroEventCard';
import {LoadingPage} from '../components/basic/LoadingPage';

const ChatsPage = () => {
  const {user} = useAuth();
  const isFocused = useIsFocused();

  const [reRender, setReRender] = useState(1);
  const [loading, setLoading] = useState(true);
  const [joinedEventsDetails, setJoinedEventsDetails] = useState([]);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      getJoinedEventsDetails();
    } else {
      setLoading(true);
    }

    const subscription = supabase
      .from('chat_messages')
      .on('INSERT', payload => getJoinedEventsDetails())
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [isFocused]);

  // sort by last_chat_message created_at time (latest first)
  const sortChats = chatsArr => {
    return chatsArr.sort(function (a, b) {
      const lastMessageObjectA = a.last_chat_message;
      const lastMessageObjectB = b.last_chat_message;

      if (lastMessageObjectA.length == 0) {
        // i.e. []
        if (lastMessageObjectB.length == 0) {
          // i.e. []
          return 0;
        } else {
          return 1;
        }
      } else if (lastMessageObjectB.length == 0) {
        // i.e. []
        return -1;
      } else {
        const keyA = new Date(lastMessageObjectA[0].created_at);
        const keyB = new Date(lastMessageObjectB[0].created_at);
        // Compare the 2 dates
        if (keyA < keyB) return 1;
        if (keyA > keyB) return -1;
        return 0;
      }
    });
  };

  const getJoinedEventsDetails = async () => {
    Promise.all([
      getJoinedEventsParticipatedDetails(),
      getJoinedEventsOrganisedDetails(),
    ])
      .then(results => {
        // sort by last_chat_message created_at time (latest first)
        setJoinedEventsDetails(sortChats(results[0].concat(results[1])));
      })
      .then(() => setReRender(-reRender))
      .then(() => setLoading(false));
  };

  const getJoinedEventsParticipatedDetails = async e => {
    try {
      const {data, error} = await supabase
        .from('events')
        .select(
          '*, user_joinedevents!inner(*), last_chat_message(*, profiles(*))',
        )
        .eq('user_joinedevents.user_id', user.id);
      if (error) throw error;
      if (data) return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getJoinedEventsOrganisedDetails = async e => {
    try {
      const {data, error} = await supabase
        .from('events')
        .select('*, last_chat_message(*, profiles(*))')
        .eq('organiser_id', user.id);
      if (error) throw error;
      if (data) {
        // console.log(data[1].last_chat_message);
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <HeaderBar headerText="Event Chats" />
      {loading ? (
        <LoadingPage />
      ) : (
        <Wrapper contentViewStyle={{width: '100%'}} statusBarColor="#ea580c">
          {joinedEventsDetails.length == 0 ? (
            <Center>
              <Text
                fontSize="lg"
                fontWeight="medium"
                marginTop="5%"
                marginBottom="3%">
                You have yet to join an event.
              </Text>
              <ZeroEventCard
                imagePath={require('../assets/koala_chat.png')}
                imageWidth={225}
                imageHeight={225}
                textMessage={
                  'Chats of joined events will be' + '\n' + 'displayed here.'
                }
              />
            </Center>
          ) : (
            <VStack>
              {joinedEventsDetails.map((detail, index) => {
                return (
                  <ChatCard
                    key={index}
                    eventDetails={detail}
                    reRender={reRender}
                  />
                );
              })}
            </VStack>
          )}
        </Wrapper>
      )}
    </>
  );
};

export default ChatsPage;
