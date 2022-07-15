import React, {useState, useCallback, useEffect} from 'react';
import {
  GiftedChat,
  Bubble,
  MessageText,
  InputToolbar,
  Send,
  Composer,
  LoadEarlier,
} from 'react-native-gifted-chat';
import {
  Center,
  Icon,
  View,
  Avatar,
  Text,
  VStack,
  HStack,
  Pressable,
} from 'native-base';
import {Ionicons} from '@native-base/icons';
import {supabase} from '../../supabaseClient';
import {getEventCurrCapacity, getEventDetails} from '../functions/eventHelpers';
import {getPublicURL} from '../functions/helpers';
import {useAuth} from '../components/contexts/Auth';
import {HeaderButton} from '../components/basic/HeaderButton';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {Loading} from '../components/basic/Loading';

const ChatRoom = ({route}) => {
  const {eventId, eventDetails} = route.params;

  const {user} = useAuth();
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [messages, setMessages] = useState([]);
  const [eventCurrCapacity, setEventCurrCapacity] = useState(0);

  useEffect(() => {
    const subscription = supabase
      .from('chat_messages')
      .on('INSERT', appendIncomingMessage)
      // .on('INSERT', payload => console.log('BOOP'))
      .subscribe();

    getMessages()
      .then(() => getEventCurrCapacity(eventId))
      .then(currCap => setEventCurrCapacity(currCap));

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  const appendIncomingMessage = async payload => {
    const newMessage = payload.new;
    if (newMessage.user_id != user?.id) {
      getSenderDetails(newMessage.user_id).then(sender => {
        console.log('sender is ', sender);
        newMessage.profiles = {id: '', username: '', avatar_url: ''};
        newMessage.profiles.id = sender.id;
        newMessage.profiles.username = sender.username;
        newMessage.profiles.avatar_url = sender.avatar_url;

        console.log('new message is ', newMessage);

        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, [
            constructMessageObjectForChat(newMessage),
          ]),
        );
        // onSend([constructMessageObject(newMessage)]);
        // setMessages(oldMessages => [...oldMessages, constructMessageObject(newMessage)])
      });
    }
  };

  const constructMessageObjectForChat = data => {
    return {
      _id: data.id,
      text: data.text,
      createdAt: new Date(data.created_at),
      user: {
        _id: data.profiles.id,
        name: data.profiles.username,
        avatar: getPublicURL(data.profiles.avatar_url, 'avatars').uri,
      },
    };
  };

  const getSenderDetails = async senderId => {
    try {
      const {data, error} = await supabase
        .from('profiles')
        .select('*')
        .eq('id', senderId)
        .single();

      if (error) throw error;
      if (data) {
        console.log('BOOP: ', data);
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMessages = async () => {
    try {
      const {data, error} = await supabase
        .from('chat_messages')
        .select('*, profiles!chat_messages_user_id_fkey(*)')
        .eq('event_id', eventId)
        .order('created_at', {ascending: false});

      if (error) throw error;
      if (data) {
        const messagesArr = [];
        for (let i = 0; i < data.length; i++) {
          messageAlreadyRead(data[i]).then(result =>
            result == 0 ? markMessageAsRead(data[i]) : null,
          );
          messagesArr[messagesArr.length] = constructMessageObjectForChat(
            data[i],
          );
        }
        setMessages(messagesArr);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSend = useCallback((newMessages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMessages),
    );
  }, []);

  const insertMessage = async messageData => {
    try {
      const {data, error} = await supabase.from('chat_messages').insert([
        {
          event_id: eventId,
          user_id: user?.id,
          text: messageData.text,
        },
      ]);

      if (error) throw error;
      if (data) return data;
    } catch (error) {
      console.log(error);
    }
  };

  const markMessageAsRead = async messageData => {
    try {
      const {data, error} = await supabase.from('chat_messages_read').insert({
        created_at: messageData.created_at,
        event_id: messageData.event_id,
        sender_id: messageData.user_id,
        receiver_id: user?.id,
        text: messageData.text,
      });
      if (error) throw error;
      if (data) return data;
    } catch (error) {
      console.log(error);
    }
  };

  const messageAlreadyRead = async messageData => {
    try {
      const {data, error, count} = await supabase
        .from('chat_messages_read')
        .select('*', {count: 'exact'})
        .match({
          created_at: messageData.created_at,
          event_id: messageData.event_id,
          sender_id: messageData.user_id,
          receiver_id: user?.id,
          text: messageData.text,
        });
      if (error) throw error;
      if (data) return count;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {renderChatHeader(eventDetails, eventCurrCapacity)}

      <GiftedChat
        messages={messages}
        onSend={messages => {
          onSend(messages);
          insertMessage(messages[0]).then(data => markMessageAsRead(data[0]));
        }}
        user={{
          _id: user?.id,
        }}
        alwaysShowSend={true}
        onPressAvatar={user =>
          navigation.navigate('AvatarProfile', {
            screen: 'UserProfile',
            params: {userId: user._id, showBackButton: true},
          })
        }
        renderBubble={renderBubble}
        renderMessageText={renderMessageText}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        renderComposer={renderComposer}
        renderChatFooter={renderChatFooter}
        renderLoading={renderLoading}
      />
    </>
  );
};

// This is a self-made component, not from react-native-gifted-chat
const renderChatHeader = (eventDetails, eventCurrCapacity) => {
  const navigation = useNavigation();

  return (
    <HStack
      borderBottomWidth={1}
      borderColor="gray.200"
      alignItems="center"
      justifyContent="space-between"
      padding="3%"
      paddingTop="2%"
      paddingBottom="2%">
      <HeaderButton
        onPressHandler={() => navigation.goBack()}
        xShift={0}
        yShift={0}
        position="relative"
        icon={<Icon as={Ionicons} name="chevron-back" color="black" />}
        showBgColor={false}
      />
      <Pressable
        flex={1}
        onPress={() =>
          navigation.navigate('JoinedEventPage', {
            screen: 'EventPage',
            params: {eventId: eventDetails.id},
          })
        }>
        {({isHovered, isFocused, isPressed}) => {
          return (
            <HStack space={5} alignItems="center" justifyContent="flex-end">
              <VStack flex={1}>
                <Text fontSize="lg" fontWeight="semibold" textAlign="right">
                  {eventDetails.title}
                </Text>
                <Text textAlign="right">
                  {eventCurrCapacity + 1 + ' members'}{' '}
                </Text>
              </VStack>
              <Avatar
                source={getPublicURL(eventDetails.picture_url, 'eventpics')}
                size="xl"></Avatar>
            </HStack>
          );
        }}
      </Pressable>
    </HStack>
  );
};

const renderChatFooter = () => {
  return <View height={10} width="100%"></View>;
};

const renderComposer = props => {
  return (
    <View
      flex="0.9"
      padding="1%"
      bgColor="white"
      marginBottom="1%"
      height={65}
      borderWidth={1}
      borderRadius={20}
      borderColor="#e4e4e7">
      <Composer {...props} textInputStyle={{fontFamily: 'body'}} />
    </View>
  );
};

const renderSend = props => {
  return (
    <Send
      {...props}
      containerStyle={{
        height: '100%',
        flex: 0.1,
        padding: '3%',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Center height={12} width={12} borderRadius="full" bgColor="orange.500">
        <Icon as={Ionicons} name="send-outline" color="white" size="md" />
      </Center>
    </Send>
  );
};

const renderInputToolbar = props => {
  return (
    <InputToolbar
      {...props}
      containerStyle={{
        paddingLeft: '2%',
        paddingRight: '1%',
        borderTopWidth: 0,
        backgroundColor: '#f2f2f2',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
};

const renderMessageText = props => {
  return (
    <MessageText
      {...props}
      textStyle={{
        left: {
          fontSize: 14, // sm
        },
        right: {
          fontSize: 14, // sm
        },
      }}
    />
  );
};

const renderBubble = props => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        textStyle: {
          fontSize: 10,
        },
        left: {
          backgroundColor: '#e4e4e7', // gray.200
          padding: '1%',
        },
        right: {
          backgroundColor: '#f97316', // orange.500
          padding: '1%',
        },
      }}
    />
  );
};

const renderLoading = () => {
  return (
    <Center height="100%" width="100%">
      <Loading />
    </Center>
  );
};

export default ChatRoom;
