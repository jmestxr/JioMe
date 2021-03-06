import React, {useState} from 'react';
import {Center, VStack} from 'native-base';
import {Wrapper} from '../components/basic/Wrapper';
import {EventPictureInput} from '../components/eventForm/EventPictureInput';
import {EventSingleFieldInput} from '../components/eventForm/EventSingleFieldInput';
import {EventTextFieldInput} from '../components/eventForm/EventTextFieldInput';
import {EventSelectFieldInput} from '../components/eventForm/EventSelectFieldInput';
import {DateTimeInput} from '../components/eventForm/DateTimeInput';
import CustomButton from '../components/basic/CustomButton';
import {CustomModal} from '../components/basic/CustomModal';
import {Warning} from '../components/basic/Warning';
import DatePicker from 'react-native-date-picker';
import {decode} from 'base64-arraybuffer';
import {useAuth} from '../components/contexts/Auth';
import {supabase} from '../../supabaseClient';
import {MONTH} from '../constants/constants';

import Toast from 'react-native-toast-message';
import {HeaderBar} from '../components/basic/HeaderBar';
import { useNavigation } from '@react-navigation/native';

const EventForm = () => {
  const {user} = useAuth();
  const navigation = useNavigation();

  const [loading, setLoading] = useState(false);
  // const [uploadingPic, setUploadingPic] = useState(false);

  // Details of this event
  const [eventDetails, setEventDetails] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    startDate: new Date(),
    endDate: new Date(),
    capacity: 0,
    eventPicture: '',
  });

  const [startDateString, setStartDateString] = useState(''); // for display and insert into database
  const [endDateString, setEndDateString] = useState(''); // for display and insert into database
  const [startOpen, setStartOpen] = useState(false); // open date picker for start date
  const [endOpen, setEndOpen] = useState(false); // open date picker for end date

  const setEventDetail = (detail, value) => {
    setEventDetails(prevState => ({
      ...prevState,
      [detail]: value,
    }));
  };

  const handleUploadPic = async image => {
    if (eventDetails.eventPicture == '') {
      Toast.show({
        type: 'error',
        text1: 'Please upload an image.',
      });
      return false;
    } else {
      try {
        const base64FileData = image.data;

        const filePath = image.path;

        let {error: uploadError} = await supabase.storage
          .from('eventpics')
          .upload(filePath, decode(base64FileData));

        if (uploadError) throw uploadError;
        else return true;
      } catch (error) {
        console.log(error);
        Toast.show({
          type: 'error',
          text1:
            'We have encountered an error uploading the image. Please upload the image again or try again later.',
        });
        return false;
      }
    }
  };

  // function checks how many characters they can input in description
  const checkCharacters = () => {
    let remaining = 1000 - description.length;
    if (remaining < 100) {
      return (
        <Center>
          <Warning
            warningMessage={
              remaining < 0
                ? 'Description is too long'
                : remaining + ' characters remaining.'
            }
          />
        </Center>
      );
    }
  };

  // function stores event details in supabase
  const handleUploadEventDetails = async e => {
    if (eventDetails.title == '') {
      Toast.show({
        type: 'error',
        text1: 'Please insert a title.',
      });
    } else if (eventDetails.location == '') {
      Toast.show({
        type: 'error',
        text1: 'Please insert a location.',
      });
    } else if (startDateString == '') {
      Toast.show({
        type: 'error',
        text1: 'Please enter a start date.',
      });
    } else if (endDateString == '') {
      Toast.show({
        type: 'error',
        text1: 'Please enter an end date.',
      });
    } else if (eventDetails.category == '') {
      Toast.show({
        type: 'error',
        text1: 'Please select a category.',
      });
    } else if (eventDetails.description.length > 1000) {
      Toast.show({
        type: 'error',
        text1: 'Description is too long.',
      });
    } else {
      try {
        const {data, error} = await supabase.from('events').insert([
          {
            created_at: new Date(),
            organiser_id: user?.id,
            title: eventDetails.title,
            category: eventDetails.category,
            description: eventDetails.description,
            location: eventDetails.location,
            from_datetime: startDateString,
            to_datetime: endDateString,
            max_capacity: eventDetails.capacity,
            picture_url: eventDetails.eventPicture.path,
          },
        ]);
        if (error) throw error;
        if (data) {
          clearForm();
          Toast.show({
            type: 'success',
            text1: 'Event successfully created.',
          });
          navigation.navigate('Marketplace', {
            screen: 'OngoingEventPage',
            params: {
              screen: 'EventPage',
              params: {eventId: data[0].id},
            },
          })
        }
      } catch (error) {
        console.log(error);
        Toast.show({
          type: 'error',
          text1:
            'We have encountered an error uploading the event details. Please try again later.',
        });
      }
      // TO BE COMPLETED
      // Useful information:
      // startDate, endDate, eventPic, title, description, location, cat, capacity

      // checks the Usernames table whether username is in use
      // const {data, count} = await supabase
      //     .from('profiles')
      //     .select('*', { count: 'exact' })
      //     .eq('username', username)

      // if (password.length < 8) {
      //     alert('Error: Your password should have at least 8 characters.')
      // } else if (password != confirmpassword) {
      //     alert('Error: Your passwords do not match.')
      // } else if (count > 0) {
      //     // username taken
      //     alert('Error: Username has already been taken. Please try again.')
      // } else {
      //     const { error } = await signUp({ email, password })
      //     if (error) {
      //         alert('Error: unable to sign up with the email provided. Please enter a different email.')
      //     } else {
      //         // Sign up is successful; proceeds to call signIn function to insert user details into profiles table
      //         handleLogin()
      //     }
      // }
    }
  };

  // function handles the Event Creation
  const handleCreateEvent = async e => {
    setLoading(true);
    handleUploadPic(eventDetails.eventPicture).then(result => {
      if (result) {
        handleUploadEventDetails().then(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });
  };

  const formatDateTime = date => {
    return (
      date.getDate() +
      ' ' +
      MONTH[date.getMonth()] +
      ' ' +
      date.getFullYear() +
      ' ' +
      (date.getHours() % 12) +
      ':' +
      (date.getMinutes() < 10 ? '00' : date.getMinutes()) +
      ' ' +
      (date.getHours() > 11 ? 'PM' : 'AM')
    );
  };

  const clearForm = () => {
    setEventDetails({
      title: '',
      category: '',
      description: '',
      location: '',
      startDate: new Date(),
      endDate: new Date(),
      capacity: 0,
      eventPicture: '',
    });
    setStartDateString('');
    setEndDateString('');
  };

  return (
    <>
      <HeaderBar headerText="Create Event" />

      <Wrapper
        contentViewStyle={{width: '95%', paddingTop: '3%'}}
        statusBarColor="#ea580c">

        <EventPictureInput
          imageInputHandler={image => setEventDetail('eventPicture', image)}
        />

        <VStack paddingLeft="1%" paddingRight="1%" marginTop="2%">
          <EventSingleFieldInput
            placeholder="Title"
            value={eventDetails.title}
            textHandler={value => setEventDetail('title', value)}
            iconName="bookmark-outline"
          />

          <EventSelectFieldInput
            selectedValue={eventDetails.category}
            selectHandler={value => setEventDetail('category', value)}
          />

          <EventTextFieldInput
            value={eventDetails.description}
            textHandler={value => setEventDetail('description', value)}
          />

          <EventSingleFieldInput
            value={eventDetails.location}
            textHandler={value => setEventDetail('location', value)}
            placeholder="Location"
            iconName="location-outline"
          />

          <DateTimeInput
            placeholder="Start Time"
            value={startDateString}
            textHandler={setStartDateString}
            onPressHandler={() => setStartOpen(true)}
          />
          <DatePicker
            modal
            open={startOpen}
            date={eventDetails.startDate}
            minimumDate={new Date()}
            minuteInterval={15}
            onConfirm={date => {
              setStartOpen(false);
              setEventDetail('startDate', date);
              setStartDateString(formatDateTime(date));
              if (date > eventDetails.endDate) {
                setEventDetail('endDate', new Date());
                setEndDateString('');
              }
            }}
            onCancel={() => {
              setStartOpen(false);
            }}
          />

          <DateTimeInput
            placeholder="End Time"
            value={endDateString}
            textHandler={setEndDateString}
            onPressHandler={() => setEndOpen(true)}
          />
          <DatePicker
            modal
            open={endOpen}
            date={eventDetails.endDate}
            minimumDate={eventDetails.startDate}
            minuteInterval={15}
            onConfirm={date => {
              setEndOpen(false);
              setEventDetail('endDate', date);
              // console.log(date.getMonth())
              setEndDateString(formatDateTime(date));
            }}
            onCancel={() => {
              setEndOpen(false);
            }}
          />

          <EventSingleFieldInput
            placeholder="Capacity (does not include yourself)"
            value={eventDetails.capacity}
            textHandler={value => setEventDetail('capacity', value)}
            keyboardType="numeric"
            iconName="people-outline"
          />
        </VStack>
        <CustomModal
          modalButton={
            <CustomButton
              title="Create Event!"
              width="100%"
              color="#f97316" // orange.500
            />
          }
          confirmHandler={handleCreateEvent}
          isLoading={loading}
        />
      </Wrapper>
    </>
  );
};

export default EventForm;
