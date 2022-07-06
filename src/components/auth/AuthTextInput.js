import React from 'react';
import {StyleSheet} from 'react-native';
import {Input, Icon, View, Text, Center} from 'native-base';
import {MaterialIcons} from '@native-base/icons';

const AuthTextInput = props => {
  const {
    placeholder,
    value,
    secureTextEntry = false,
    textHandler,
    iconLibrary = MaterialIcons,
    iconName,
    keyboardType = 'default',
    textInFront = false,
  } = props;

  return (
    <View style={styles.fieldBox}>
      <Icon
        as={iconLibrary}
        name={iconName}
        color="black"
        size="lg"
        marginRight={'3%'}
      />
      <Center width="73%" flexDirection="row">
        {textInFront ? (
          <Text fontSize="md" marginRight="2%">
            (+65)
          </Text>
        ) : null}

        <Input
          variant="underlined"
          size="lg"
          _focus={{borderColor: 'orange.500'}}
          placeholder={placeholder}
          value={value}
          secureTextEntry={secureTextEntry}
          onChangeText={textHandler}
          keyboardType={keyboardType}
          width={textInFront ? '85%' : '100%'}
        />
      </Center>
    </View>
  );
};

const styles = StyleSheet.create({
  fieldBox: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default AuthTextInput;
