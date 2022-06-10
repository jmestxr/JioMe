import React from 'react';
import {Icon, VStack} from 'native-base';
import {Ionicons} from '@native-base/icons';

export const EssentialDetail = props => {
  const {width, iconName, iconColor, children} = props;

  return (
    <VStack space={2} width={width} alignItems="center">
      <Icon as={Ionicons} name={iconName} color={iconColor} size={55} />

      {children}
    </VStack>
  );
};
