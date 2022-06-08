import React, {useState} from 'react';
import {Keyboard, TouchableWithoutFeedback} from 'react-native';
import {View, Input, Divider, HStack, Text} from 'native-base';
import {Icon} from 'native-base';
import {Ionicons} from '@native-base/icons';

export const EventSingleFieldInput = ({
  placeholder,
  keyboardType = 'default',
  iconName,
}) => {
  const [focus, setFocus] = useState();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <HStack
          paddingLeft="1%"
          paddingTop="1.5%"
          paddingBottom="1.5%"
          justifyContent='space-between'
          alignItems='center'>
          <Icon as={Ionicons} name={iconName} color="black" size="lg" />

          <Input
            variant="unstyled"
            size="lg"
            placeholder={placeholder}
            keyboardType={keyboardType}
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
            width="93%"
          />
        </HStack>
        <Divider my="2" bg={focus ? 'orange.500' : 'gray.300'} />
      </View>
    </TouchableWithoutFeedback>
  );
};
