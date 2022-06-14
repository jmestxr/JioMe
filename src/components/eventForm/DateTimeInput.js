import React from 'react';
import {TouchableOpacity} from 'react-native';
import {View, Input, Divider, HStack} from 'native-base';
import {Icon} from 'native-base';
import {Ionicons, MaterialIcons} from '@native-base/icons';

export const DateTimeInput = ({ placeholder, value, textHandler, onPressHandler }) => {
  return (
    <TouchableOpacity activeOpacity={1} onPress={onPressHandler}>
      <HStack
        paddingLeft="1%"
        paddingTop="1.5%"
        paddingBottom="1.5%"
        justifyContent="space-between"
        alignItems="center">
        <Icon as={Ionicons} name="time-outline" color="black" size="lg" />

        <Input
          editable={false}
          variant="unstyled"
          size="lg"
          placeholder={placeholder}
          value={value}
          onChangeText={textHandler}
          width="93%"
        />
      </HStack>
      <View position="absolute" left={358} top={4}>
        <Icon as={MaterialIcons} name="event" color="black" size="lg" />
      </View>
      <Divider my="2" bg="gray.300" />
    </TouchableOpacity>
  );
};
