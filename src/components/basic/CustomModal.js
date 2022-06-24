import React, {useState} from 'react';
import {Modal} from 'react-native';
import {Icon, Text, Pressable, Center, HStack, VStack} from 'native-base';
import {Ionicons} from '@native-base/icons';
import CustomButton from './CustomButton';
import { Warning } from './Warning';

export const CustomModal = props => {
  const {
    modalButtonTitle,
    modalButtonColor,
    confirmHandler,
    showWarning = false,
  } = props;

  const [modalVisible, setModalVisible] = useState(false);
  return (
    <Center width="100%">
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <Center height="100%" width="100%" backgroundColor="gray.200:alpha.90">
          <VStack justifyContent="center" alignItems="center" space={5}>
            <Center>
              <Text fontSize="md" fontWeight="medium">
                Are you sure?
              </Text>
              {showWarning ? (
                <Center marginTop='2%'>
                <Warning textColor='rose.600' warningMessage="This action is irreversible." />
                </Center>
              ) : null}
            </Center>

            <HStack space={7}>
              <Pressable
                onPress={() => {
                  confirmHandler();
                  setModalVisible(false);
                }}>
                {({isPressed}) => {
                  return (
                    <Icon
                      as={Ionicons}
                      size="6xl"
                      name="checkmark-circle"
                      color={
                        isPressed
                          ? 'success.600:alpha.20'
                          : 'success.600:alpha.50'
                      }
                    />
                  );
                }}
              </Pressable>

              <Pressable onPress={() => setModalVisible(!modalVisible)}>
                {({isPressed}) => {
                  return (
                    <Icon
                      as={Ionicons}
                      size="6xl"
                      name="close-circle"
                      color={
                        isPressed ? 'rose.500:alpha.20' : 'rose.500:alpha.50'
                      }
                    />
                  );
                }}
              </Pressable>
            </HStack>
          </VStack>
        </Center>
      </Modal>

      <CustomButton
        title={modalButtonTitle}
        width="95%"
        color={modalButtonColor}
        onPressHandler={() => setModalVisible(true)}
        isDisabled={false}
      />
    </Center>
  );
};
