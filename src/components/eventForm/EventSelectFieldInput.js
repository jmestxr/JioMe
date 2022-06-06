import React, {useState} from 'react';
import {
  View,
  Divider,
  Select,
  HStack,
} from 'native-base';
import {Icon} from 'native-base';
import {Ionicons} from '@native-base/icons';

export const EventSelectFieldInput = () => {
  const [category, setCategory] = useState(''); // to store category chosen by user

  return (
    <View>
      <HStack paddingLeft="1%" alignItems="center">
        <Icon
          as={Ionicons}
          name="file-tray-stacked-outline"
          color="gray.600"
          size="lg"
        />
        <Select
          flex={1}
          style={{transform: [{translateX: -1}, {translateY: -5}]}}
          borderColor="#00000000"
          selectedValue={category}
          borderWidth={1}
          placeholder="Category"
          size="lg"
          _selectedItem={{
            bg: 'orange.200',
          }}
          mt={1}
          onValueChange={itemValue => setCategory(itemValue)}>
          <Select.Item label="Sports" value="sports" />
          <Select.Item label="Leisure" value="leisure" />
          <Select.Item label="Food" value="food" />
          <Select.Item label="Music" value="music" />
          <Select.Item label="Study" value="study" />
          <Select.Item label="Nature" value="nature" />
          <Select.Item label="Extreme" value="extreme" />
          <Select.Item label="Others" value="others" />
        </Select>
      </HStack>
      <Divider my="2" bg="gray.300" />
    </View>
  );
};
