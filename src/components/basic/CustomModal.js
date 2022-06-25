import React, {useEffect, useState} from 'react';
import {Modal} from 'react-native';
import {Icon, Text, Pressable, Center, HStack, VStack} from 'native-base';
import {MaterialIcons} from '@native-base/icons';
import {Warning} from './Warning';
import {Loading} from './Loading';

export const CustomModal = props => {
  const {
    modalButton,
    confirmHandler,
    showWarning = false,
    isLoading = false,
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
    <Center width="100%">
      <Modal
        animationType="fade"
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
                <Center marginTop="2%">
                  <Warning
                    textColor="rose.600"
                    warningMessage="This action is irreversible."
                  />
                </Center>
              ) : null}
            </Center>

            <HStack space={7}>
              <Pressable onPress={confirmHandler}>
                {({isPressed}) => {
                  return (
                    <Center
                      height={60}
                      width={60}
                      borderRadius={30}
                      bgColor={
                        isPressed
                          ? 'success.600:alpha.20'
                          : 'success.600:alpha.50'
                      }>
                      <Icon
                        as={MaterialIcons}
                        size="2xl"
                        name="check"
                        color="white"
                      />
                    </Center>
                  );
                }}
              </Pressable>

              <Pressable onPress={() => setModalVisible(!modalVisible)}>
                {({isPressed}) => {
                  return (
                    <Center
                      height={60}
                      width={60}
                      borderRadius={30}
                      bgColor={
                        isPressed ? 'rose.500:alpha.20' : 'rose.500:alpha.50'
                      }>
                      <Icon
                        as={MaterialIcons}
                        size="2xl"
                        name="close"
                        color="white"
                      />
                    </Center>
                  );
                }}
              </Pressable>
            </HStack>
          </VStack>
          {loading ? (
            <Center position="absolute" top={500}>
              <Loading />
            </Center>
          ) : null}
        </Center>
      </Modal>
      {React.cloneElement(modalButton, {
        onPressHandler: () => setModalVisible(true),
      })}
    </Center>
  );
};
