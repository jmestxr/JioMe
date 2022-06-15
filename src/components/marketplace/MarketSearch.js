import React, {useState} from 'react';
import {StyleSheet, Keyboard, TouchableWithoutFeedback} from 'react-native';
import {
  Input,
  Icon,
  HStack,
  Divider,
  View,
  Select,
} from 'native-base';
import {Ionicons} from '@native-base/icons';

const MarketSearch = props => {
  const {
    placeholder,
    searchValue,
    searchHandler,
    selectedValue,
    filterHandler,
  } = props;

  const [focus, setFocus] = useState();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View>
        <HStack
          paddingLeft="1%"
          paddingBottom="1.5%"
          justifyContent="space-between"
          alignItems="center">
          <Icon as={Ionicons} name="search-outline" color="black" size="lg" />

          <Input
            size="lg"
            variant="unstyled"
            _focus={{borderColor: 'orange.500'}}
            placeholder={placeholder}
            w="85%"
            onBlur={() => setFocus(false)}
            onFocus={() => setFocus(true)}
            value={searchValue}
            onChangeText={searchHandler}
          />

          <Icon as={Ionicons} name="filter-outline" color="black" size="lg" />

          <Select
            position="absolute" // to position Select over the filter icon
            width={24} // to position Select over the filter icon
            height={20} // to position Select over the filter icon
            marginLeft="81%" // to position Select over the filter icon
            marginBottom="50%" // to position Select over the filter icon
            bgColor="#00000000" // to hide
            borderColor="#00000000" // to hide
            selectedValue={selectedValue}
            // placeholder="All"
            // _placeholder
            // size="lg"
            _selectedItem={{
              bg: 'orange.200',
            }}
            onValueChange={filterHandler}>
            <Select.Item label="All Categories" value="all" />
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
        <Divider bg={focus ? 'orange.500' : 'gray.300'} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  selectPopUp: {
    width: 24,
    height: 20,
  },
});

export default MarketSearch;
