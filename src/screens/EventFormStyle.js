import React from 'react';
import {Dimensions} from 'react-native';
import {
  Text,
  Center,
  VStack,
} from 'native-base';
import {Icon} from 'native-base';
import {Wrapper} from '../components/basic/Wrapper';
import {HeaderTitle} from '../components/basic/HeaderTitle';
import {EventSingleFieldInput} from '../components/eventForm/EventSingleFieldInput';
import {EventTextFieldInput} from '../components/eventForm/EventTextFieldInput';
import {EventSelectFieldInput} from '../components/eventForm/EventSelectFieldInput';
import CustomButton from '../components/basic/CustomButton';
import {Ionicons} from '@native-base/icons';


const windowHeight = Dimensions.get('window').height;

const EventFormStyle = () => {
  return (
    <Wrapper>
      <HeaderTitle title="New Event" />
      <Center
        width="100%"
        height={windowHeight * 0.3}
        bgColor="gray.200:alpha.40"
        borderRadius={5}>
        <Icon as={Ionicons} name="cloud-upload" color="gray.300" size={100} />
        <Text fontSize="md" color="gray.300">
          Upload an image
        </Text>
      </Center>

      <VStack marginTop="2%">
        <EventSingleFieldInput
          placeholder="Title"
          iconName="bookmark-outline"
        />

        <EventSelectFieldInput />

        <EventTextFieldInput />

        <EventSingleFieldInput
          placeholder="Location"
          iconName="location-outline"
        />

        <EventSingleFieldInput
          placeholder="Capacity (includes yourself)"
          keyboardType="numeric"
          iconName="people-outline"
        />
      </VStack>

      <CustomButton 
        title='Create Event!' 
        width='100%'
        color='#f97316'// orange.500
        onPressHandler={() => alert("Submit?")} 
        isDisabled={false} 
        />
    </Wrapper>
  );
};

export default EventFormStyle;
