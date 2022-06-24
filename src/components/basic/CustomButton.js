import React, {useEffect, useState} from 'react';
import {TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from 'native-base';
import {Loading} from './Loading';

const CustomButton = props => {
  const {title, width, color, onPressHandler, isDisabled=false} = props;

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(isDisabled)
  }, [isDisabled])

  return (
    <TouchableOpacity
      style={[styles.button, {width: width, backgroundColor: color}]}
      activeOpacity={0.5}
      disabled={isDisabled}
      onPress={onPressHandler}>
      {loading ? (
        <Loading color="white" size="sm" />
      ) : (
        <Text fontSize="md" color="white">
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 55, // 10%
    marginTop: '6%',
    borderRadius: 5,
  },
});

export default CustomButton;
