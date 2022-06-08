import React from 'react';
import {Image} from 'react-native';
import {View, Text} from 'native-base';

export const ZeroEventCard = props => {
  const {imagePath, textMessage} = props;

  return (
    <View marginTop="15%">
      <Image style={{width: 225, height: 225, opacity:0.6}} source={imagePath} />
      <Text
        color='gray.600'
        fontSize="md"
        fontWeight='semibold'
        textAlign="center"
        marginTop="5%">
        {textMessage}
      </Text>
    </View>
  );
};
