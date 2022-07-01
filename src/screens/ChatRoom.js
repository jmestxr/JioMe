import React, {useState, useCallback, useEffect} from 'react';
import {
  GiftedChat,
  Bubble,
  MessageText,
  InputToolbar,
  Send,
  Composer,
} from 'react-native-gifted-chat';
import {Center, Icon, View, Avatar, Text, VStack, HStack} from 'native-base';
import {Ionicons} from '@native-base/icons';
import {supabase} from '../../supabaseClient';
import {getEventCurrCapacity, getEventDetails} from '../functions/eventHelpers';
import {getPublicURL} from '../functions/helpers';

const renderChatFooter = () => {
  return <View height={7} width="100%"></View>;
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

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [eventDetails, setEventDetails] = useState({});
  const [eventCurrCapacity, setEventCurrCapacity] = useState(0);

  useEffect(() => {
    getMessages();

    const subscription = supabase
      .from('chat_messages')
      .on('INSERT', payload => {
        // console.log('payload is ', payload);
        const newMessage = payload.new;
        if (newMessage.user_id != '4a8f494c-6609-4bbe-981a-c082a99325e4') {
          getSenderDetails(newMessage.user_id).then(sender => {
            // console.log('sender is ', sender);
            newMessage.profiles = {};
            newMessage.profiles.id = sender.id;
            newMessage.profiles.username = sender.username;

            // console.log('new message is ', newMessage);

            setMessages(previousMessages =>
              GiftedChat.append(previousMessages, [
                constructMessageObject(newMessage),
              ]),
            );
          });
        }
      })
      .subscribe();

    // return () => {
    //   supabase.removeSubscription(subscription);
    // };

    getEventDetails('7fffd7a3-fcfe-447c-b50c-700ec4824eb1')
      .then(details => setEventDetails(details))

    getEventCurrCapacity('7fffd7a3-fcfe-447c-b50c-700ec4824eb1')
      .then(currCap => setEventCurrCapacity(currCap))
  }, []);

  const constructMessageObject = data => {
    return {
      _id: data.id,
      text: data.text,
      createdAt: new Date(data.created_at),
      user: {
        _id: data.profiles.id,
        name: data.profiles.username,
        // avatar: 'https://facebook.github.io/react/img/logo_og.png',
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
      if (data) return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getMessages = async () => {
    try {
      const {data, error} = await supabase
        .from('chat_messages')
        .select('*, profiles!chat_messages_user_id_fkey(*)')
        .eq('event_id', '7fffd7a3-fcfe-447c-b50c-700ec4824eb1')
        .order('created_at', {ascending: false});

      if (error) throw error;
      if (data) {
        const messagesArr = [];
        for (let i = 0; i < data.length; i++) {
          messagesArr[messagesArr.length] = constructMessageObject(data[i]);
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
    // console.log('all messages: ', messages)
  }, []);

  const insertMessage = async textMessage => {
    try {
      const {data, error} = await supabase.from('chat_messages').insert([
        {
          event_id: '7fffd7a3-fcfe-447c-b50c-700ec4824eb1',
          user_id: '4a8f494c-6609-4bbe-981a-c082a99325e4',
          text: textMessage,
        },
      ]);

      if (error) throw error;
      if (data) return data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <HStack 
        space={3}
        borderBottomWidth={1} 
        borderColor="gray.200" 
        alignItems='center' 
        justifyContent='flex-end'
        padding='3%'
        paddingTop='2%'
        paddingBottom='2%'>
        <VStack>
          <Text fontSize="lg" fontWeight='semibold'>{eventDetails.title}</Text>
          <Text>{(eventCurrCapacity + 1) + ' members'} </Text>
        </VStack>
        <Avatar
          source={getPublicURL(eventDetails.picture_url, 'eventpics')}
          size="xl"></Avatar>
      </HStack>

      <GiftedChat
        messages={messages}
        onSend={messages => {
          // console.log('sent message is ', messages);
          onSend(messages);
          insertMessage(messages[0].text);
        }}
        user={{
          _id: '4a8f494c-6609-4bbe-981a-c082a99325e4',
        }}
        alwaysShowSend={true}
        renderBubble={renderBubble}
        renderMessageText={renderMessageText}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        renderComposer={renderComposer}
        renderChatFooter={renderChatFooter}
      />
    </>
  );
};

export default ChatRoom;
