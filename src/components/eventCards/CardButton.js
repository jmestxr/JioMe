import React from 'react';
import {IconButton, Icon} from 'native-base';
import {MaterialIcons, Ionicons} from '@native-base/icons';

export const CardButton = props => {
  const {buttonColor, iconName, onPressHandler} = props;
  return (
    <IconButton
      size="sm"
      bgColor={buttonColor}
      borderRadius="full"
      icon={<Icon as={MaterialIcons} size='xs' name={iconName} color="white" />}
      _hover={{
        bg: 'orange.500:alpha.20',
      }}
      _pressed={{
        bg: 'orange.500:alpha.20',
      }}
      onPress={onPressHandler}
    />
  );
};
