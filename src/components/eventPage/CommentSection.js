import React, {useEffect, useState} from 'react';
import {Modal, TouchableOpacity, ScrollView} from 'react-native';
import {
  Center,
  View,
  Text,
  VStack,
  HStack,
  Avatar,
  Icon,
  Pressable,
  TextArea,
  Input,
} from 'native-base';
import {MaterialIcons, Ionicons} from '@native-base/icons';
import {useAuth} from '../contexts/Auth';
import {getProfileDetails, getPublicURL} from '../../functions/helpers';
import {supabase} from '../../../supabaseClient';
import {Loading} from '../basic/Loading';

export const CommentSection = props => {
  const {modalButton, eventId} = props;

  const {user} = useAuth();

  const [loading, setLoading] = useState(true);
  const [currUserDetails, setCurrUserDetails] = useState({
    id: '',
    username: '',
    avatar_url: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    getComments();
    getProfileDetails(user.id).then(data =>
      setCurrUserDetails({
        id: data.id,
        username: data.username,
        avatar_url: data.avatar_url,
      }),
    );
  }, []);

  const getComments = async () => {
    try {
      setLoading(true)

      const {data, error} = await supabase
        .from('comments')
        .select('*, profiles:user_id(*)')
        .match({event_id: eventId})
        .order('created_at', {ascending: false});
      if (error) throw error;
      if (data) {
        const initialComments = [];
        for (let i = 0; i < data.length; i++) {
          initialComments[initialComments.length] = constructMessageObject(
            data[i],
          );
        }
        setComments(initialComments);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  };

  const onSendComment = newComment => {
    setComments(previousComments => [newComment, ...previousComments]);
    setNewCommentText('');
  };

  const handleSendComment = async commentText => {
    try {
      const {data, error} = await supabase.from('comments').insert({
        event_id: eventId,
        user_id: user.id,
        text: commentText,
      });
      if (error) throw error;
      if (data) {
        console.log(data);
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Center
      position="absolute"
      style={{transform: [{translateX: 295}, {translateY: 5}]}}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View
          height="100%"
          width="100%"
          padding="5%"
          backgroundColor="gray.200">
          <View
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center">
            <Pressable onPress={() => setModalVisible(!modalVisible)}>
              {({isPressed}) => {
                return (
                  <Center
                    height={45}
                    width={45}
                    borderRadius="full"
                    bgColor={
                      isPressed ? 'rose.500:alpha.20' : 'rose.500:alpha.50'
                    }>
                    <Icon
                      as={MaterialIcons}
                      size="lg"
                      name="close"
                      color="white"
                    />
                  </Center>
                );
              }}
            </Pressable>

            <Text fontSize="2xl" textAlign="right">
              Comments
            </Text>
          </View>
          {loading ? (
            <Center flex={1}>
              <Loading />
            </Center>
          ) : (
            <>
              <ScrollView marginTop="8%" paddingLeft="1%" paddingRight="1%">
                <VStack space={2}>
                  {comments.length == 0 ? (
                    <Text fontSize="md" textAlign="center">
                      There are no comments currently.
                    </Text>
                  ) : (
                    comments.map((commentDetails, index) => {
                      return (
                        <Comment
                          key={index}
                          commentDetails={commentDetails}
                          userDetails={currUserDetails}
                        />
                      );
                    })
                  )}
                </VStack>
              </ScrollView>

              <View marginTop="5%">
                <CommentInput
                  value={newCommentText}
                  onChangeText={setNewCommentText}
                  onSendHandler={() => {
                    if (newCommentText != '') {
                      handleSendComment(newCommentText).then(data =>
                        onSendComment(
                          constructNewMessageObject(data[0], currUserDetails),
                        ),
                      );
                    }
                  }}
                />
              </View>
            </>
          )}
        </View>
      </Modal>
      {React.cloneElement(modalButton, {
        onPressHandler: () => setModalVisible(true),
      })}
    </Center>
  );
};

const Comment = props => {
  const {commentDetails, userDetails} = props;

  const [expand, setExpand] = useState(false);
  const [replies, setReplies] = useState([]);
  const [newReplyText, setNewReplyText] = useState('');

  useEffect(() => {
    getReplies();
  }, []);

  const getReplies = async () => {
    try {
      const {data, error} = await supabase
        .from('replies')
        .select('*, profiles:user_id(*)')
        .match({comment_id: commentDetails.id})
        .order('created_at', {ascending: false});
      if (error) throw error;
      if (data) {
        const initialReplies = [];
        for (let i = 0; i < data.length; i++) {
          initialReplies[initialReplies.length] = constructMessageObject(
            data[i],
          );
        }
        setReplies(initialReplies);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onSendReply = newReply => {
    setReplies(previousReplies => [newReply, ...previousReplies]);
    setNewReplyText('');
  };

  const handleSendReply = async replyText => {
    try {
      const {data, error} = await supabase.from('replies').insert({
        comment_id: commentDetails.id,
        user_id: userDetails.id,
        text: replyText,
      });
      if (error) throw error;
      if (data) return data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => setExpand(!expand)}>
      <View width="100%" bgColor="gray.300" padding="3%" borderRadius={10}>
        <HStack justifyContent="space-between" alignItems="center">
          <HStack alignItems="center" space={3}>
            <Avatar source={{uri: commentDetails.avatar}}></Avatar>
            <Text fontSize="md" fontWeight="medium">
              {commentDetails.username}
            </Text>
            <Text fontSize="sm" italic>
              {formatDatetimeDifference(commentDetails.createdAt)}
            </Text>
          </HStack>
          <Icon
            as={MaterialIcons}
            name={expand ? 'expand-less' : 'expand-more'}
            color="black"
            size="lg"
          />
        </HStack>
        <Text marginLeft="18%">{commentDetails.text}</Text>
        {expand ? (
          <VStack alignItems="flex-end" marginTop="5%" space={3}>
            {replies.map((replyDetails, index) => {
              return <Reply key={index} replyDetails={replyDetails} />;
            })}

            <ReplyInput
              value={newReplyText}
              onChangeText={setNewReplyText}
              onSendHandler={() => {
                if (newReplyText != '') {
                  handleSendReply(newReplyText).then(data =>
                    onSendReply(
                      constructNewMessageObject(data[0], userDetails),
                    ),
                  );
                }
              }}
            />
          </VStack>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const Reply = props => {
  const {replyDetails} = props;

  return (
    <View width="83%">
      <HStack alignItems="center" space={2}>
        <Icon
          style={{transform: [{rotate: '180deg'}]}}
          as={MaterialIcons}
          name={'reply'}
          color="black"
          size="lg"
        />
        <HStack alignItems="center" space={3}>
          <Avatar size="sm" source={{uri: replyDetails.avatar}}></Avatar>
          <Text fontWeight="medium">{replyDetails.username}</Text>
          <Text fontSize="xs" italic>
            {formatDatetimeDifference(replyDetails.createdAt)}
          </Text>
        </HStack>
      </HStack>

      <Text fontSize="xs" marginLeft="27%">
        {replyDetails.text}
      </Text>
    </View>
  );
};

const CommentInput = props => {
  const {value, onChangeText, onSendHandler} = props;
  return (
    <HStack space={2} justifyContent="space-between" alignItems="center">
      <View bgColor="white" borderRadius={15} padding="2%" flex={0.88}>
        <TextArea
          size="lg"
          h={10}
          placeholder="Type your comment here."
          bgColor="#00000000"
          borderColor="#00000000"
          _focus={{borderColor: '#00000000'}}
          selectionColor="orange.500"
          value={value}
          onChangeText={onChangeText}
        />
      </View>

      <View flex={0.12}>
        <SendButton
          buttonSize={12}
          iconSize="lg"
          onSendHandler={onSendHandler}
        />
      </View>
    </HStack>
  );
};

const ReplyInput = props => {
  const {value, onChangeText, onSendHandler} = props;

  return (
    <HStack width="83%" alignItems="center" space={1}>
      <Input
        flex={0.88}
        borderRadius={10}
        placeholder="Reply here."
        selectionColor="#ea580c"
        bgColor="white"
        _focus={{borderColor: '#00000000'}}
        value={value}
        onChangeText={onChangeText}
      />
      <View flex={0.12}>
        <SendButton
          buttonSize={9}
          iconSize="sm"
          onSendHandler={onSendHandler}
        />
      </View>
    </HStack>
  );
};

const SendButton = props => {
  const {onSendHandler, buttonSize, iconSize} = props;
  return (
    <Pressable onPress={onSendHandler}>
      {({isPressed}) => {
        return (
          <Center
            height={buttonSize}
            width={buttonSize}
            borderRadius="full"
            bgColor={
              isPressed ? 'success.600:alpha.20' : 'success.600:alpha.50'
            }>
            <Icon
              as={Ionicons}
              size={iconSize}
              name="paper-plane-outline"
              color="white"
            />
          </Center>
        );
      }}
    </Pressable>
  );
};

const formatDatetimeDifference = createdAt => {
  const timeNow = new Date();
  const timeThen = new Date(createdAt);
  const diffInMinutes = Math.floor((timeNow - timeThen) / 60000);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInYears = Math.floor(diffInDays / 365);
  return diffInMinutes == 0
    ? 'Just now'
    : diffInMinutes < 60
    ? diffInMinutes + 'm ago'
    : diffInHours < 24
    ? diffInHours + 'h ago'
    : diffInDays < 364
    ? diffInDays + 'd ago'
    : diffInYears + ' y ago';
};

const constructNewMessageObject = (messageData, userData) => {
  return {
    id: messageData.id,
    username: userData.username,
    text: messageData.text,
    createdAt: messageData.created_at,
    avatar: getPublicURL(userData.avatar_url, 'avatars').uri,
  };
};

const constructMessageObject = messageData => {
  return {
    id: messageData.id,
    username: messageData.profiles.username,
    createdAt: messageData.created_at,
    text: messageData.text,
    avatar: getPublicURL(messageData.profiles.avatar_url, 'avatars').uri,
  };
};
