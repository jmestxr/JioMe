import React, {useEffect, useState} from 'react';
import {Modal, TouchableOpacity, ScrollView, TextInput} from 'react-native';
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

export const CommentSection = props => {
  const {modalButton, isLoading = false, data} = props;

  const {user} = useAuth();

  const [currUserDetails, setCurrUserDetails] = useState({
    username: '',
    avatar_url: '',
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState('');

  useEffect(() => {
    getProfileDetails(user.id).then(data =>
      setCurrUserDetails({
        username: data.username,
        avatar_url: data.avatar_url,
      }),
    );
  }, []);

  const constructNewComment = newCommentText => {
    return {
      username: currUserDetails.username,
      text: newCommentText,
      avatar: getPublicURL(currUserDetails.avatar_url, 'avatars').uri,
    };
  };

  const constructNewCommentObject = data => {
    return {
      username: currUserDetails.username,
      text: data.text,
      createdAt: data.created_at,
      avatar: getPublicURL(currUserDetails.avatar_url, 'avatars').uri,
    };
  };

  const constructCommentObject = data => {
    return {
      username: data.profiles.username,
      createdAt: data.created_at,
      text: data.text,
      avatar: getPublicURL(data.profiles.avatar_url, 'avatars').uri,
    };
  };

  const onSendComment = newComment => {
    if (newComment.text != '') {
      setComments(previousComments => [...previousComments, newComment]);
      setNewCommentText('');
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

          <ScrollView marginTop="5%" padding="1%">
            <VStack space={2}>
              {comments.length == 0 ? (
                <Text fontSize="md" textAlign="center">
                  There are no comments currently.
                </Text>
              ) : (
                comments.map((commentDetails, index) => {
                  return <Comment commentDetails={commentDetails} />;
                })
              )}
            </VStack>
          </ScrollView>

          <View marginTop="5%">
            <CommentInput
              value={newCommentText}
              onChangeText={setNewCommentText}
              onSendHandler={() =>
                onSendComment(constructNewComment(newCommentText))
              }
            />
          </View>
        </View>
      </Modal>
      {React.cloneElement(modalButton, {
        onPressHandler: () => setModalVisible(true),
      })}
    </Center>
  );
};

const Comment = props => {
  const {commentDetails} = props;
  const [expand, setExpand] = useState(false);

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
              4d ago
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
            <Reply />
            <Reply />
            <ReplyInput />
          </VStack>
        ) : null}
      </View>
    </TouchableOpacity>
  );
};

const Reply = () => {
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
          <Avatar
            size="sm"
            source={{
              uri: 'https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
            }}></Avatar>
          <Text fontWeight="medium">User456</Text>
          <Text fontSize="xs" italic>
            Just now
          </Text>
        </HStack>
      </HStack>

      <Text fontSize="xs" marginLeft="27%">
        Text reply here
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
  return (
    <HStack width="83%" alignItems="center" space={1}>
      <Input
        flex={0.88}
        borderRadius={10}
        placeholder="Reply here."
        selectionColor="#ea580c"
        bgColor="white"
        _focus={{borderColor: '#00000000'}}
      />
      <View flex={0.12}>
        <SendButton
          buttonSize={9}
          iconSize="sm"
          onSendHandler={() => alert('send reply')}
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
