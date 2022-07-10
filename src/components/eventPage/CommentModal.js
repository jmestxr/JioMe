import React, {useEffect, useState} from 'react';
import {Modal} from 'react-native';
import {Icon, Text, Pressable, Center, HStack, VStack, Wrap} from 'native-base';
import {MaterialIcons} from '@native-base/icons';
import { Warning } from '../basic/Warning';
import { Loading } from '../basic/Loading';
import { Wrapper } from '../basic/Wrapper';
import { CommentCollapsible } from './CommentCollapsible';
import { Detail } from './Detail';
import { ScrollView } from 'native-base';

export const CommentModal = props => {
  const {
    modalButton,
    confirmHandler,
    showWarning = false,
    isLoading = false,
    data,
    replies
  } = props;

  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(isLoading);
    if (isLoading) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [isLoading]);

  return (
    <Center position='absolute'  style={{transform: [{translateX: 295}, {translateY: 5}]}}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <Center height="100%" width="100%" backgroundColor="gray.200:alpha.90">
          <ScrollView>
          <VStack justifyContent="center" alignItems="center" space={5}>
            <Center width={"100%"}>
            <Detail title="Comments">
          <CommentCollapsible comments={data} replies={replies}/>
        </Detail>
              
            </Center>

         
          </VStack>
          {loading ? (
            <Center position="absolute" top={500}>
              <Loading />
            </Center>
          ) : null}
          </ScrollView>
        </Center>
      </Modal>
      {React.cloneElement(modalButton, {
        onPressHandler: () => setModalVisible(true),
      })}
    </Center>
  );
};
