import React, {useState} from 'react';
import {Keyboard, TouchableWithoutFeedback} from 'react-native';
import {View, Divider, HStack, TextArea} from 'native-base';
import {Icon} from 'native-base';
import {Ionicons} from '@native-base/icons';

export const EventTextFieldInput = () => {
  const [focus, setFocus] = useState();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <HStack paddingLeft="1%" justifyContent='space-between'>
          <Icon
            as={Ionicons}
            name="document-text-outline"
            color="black"
            size="lg"
            marginTop="2.5%"
          />

          <TextArea
            w='93%'
            h={40}
            bgColor="#00000000"
            borderColor="#00000000"
            size="lg"
            placeholder={
              'Tell us more about the activity.' +
              '\n' + '\n' + '\n' +
              '(Maximum 1000 characters)'
            }
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
            _focus={{borderColor: '#00000000'}}
            // style={{lineHeight: 10}}
            // _text={{fontSize:'sm'}}
          />
        </HStack>
        <Divider my="2" bg={focus ? 'orange.500' : 'gray.300'} />
      </View>
    </TouchableWithoutFeedback>
  );
};
