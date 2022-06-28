import React from 'react';
import {Center, Text, Icon} from 'native-base';
import {HeaderButton} from './HeaderButton';
import {Ionicons} from '@native-base/icons';
import {useNavigation} from '@react-navigation/native';

export const HeaderBar = ({headerText, backButtonVisible = false}) => {
  const navigation = useNavigation();
  return (
    <Center bgColor="#ea580c" padding="3%" flexDirection="row">
      {backButtonVisible ? (
        <HeaderButton
          xShift={-170}
          yShift={0}
          showBgColor={false}
          onPressHandler={() => navigation.goBack()}
          icon={<Icon as={Ionicons} name="chevron-back" color="white" />}
        />
      ) : null}
      <Text color="white" fontSize="lg" textAlign="center">
        {headerText}
      </Text>
    </Center>
  );
};
