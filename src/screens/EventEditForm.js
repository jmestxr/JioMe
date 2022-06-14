import React, {useEffect, useState} from 'react';
import {Center, VStack} from 'native-base';
import {Wrapper} from '../components/basic/Wrapper';
import {EventPictureInput} from '../components/eventForm/EventPictureInput';
import {EventSingleFieldInput} from '../components/eventForm/EventSingleFieldInput';
import {EventTextFieldInput} from '../components/eventForm/EventTextFieldInput';
import {EventSelectFieldInput} from '../components/eventForm/EventSelectFieldInput';
import {DateTimeInput} from '../components/eventForm/DateTimeInput';
import CustomButton from '../components/basic/CustomButton';
import {Warning} from '../components/basic/Warning';
import DatePicker from 'react-native-date-picker';
import {decode} from 'base64-arraybuffer';
import {useAuth} from '../components/contexts/Auth';
import {supabase} from '../../supabaseClient';
import { MONTH } from '../constants/constants';

const EventEditForm = ({route}) => {
  const {user} = useAuth();
  const {eventId} = route.params; // the unique id of this event

  const [loading, setLoading] = useState(false);
  // const [uploadingPic, setUploadingPic] = useState(false);

  // Details of this event
  const [eventDetails, setEventDetails] = useState({
    title: '',
    category: '',
    description: '',
    location: '',
    from_datetime: new Date(),
    to_datetime: new Date(),
    max_capacity: 0,
    picture_url: '', // url of existing picture
  });

  const [eventPicture, setEventPicture] = useState(''); // The new picture uploaded

  const [startDateString, setStartDateString] = useState(''); // for display and insert into database
  const [endDateString, setEndDateString] = useState(''); // for display and insert into database
  const [startOpen, setStartOpen] = useState(false); // open date picker for start date
  const [endOpen, setEndOpen] = useState(false); // open date picker for end date

  useEffect(() => {
    getEventDetails();
  }, [eventId]);

  const setEventDetail = (detail, value) => {
    setEventDetails(prevState => ({
      ...prevState,
      [detail]: value,
    }));
  };

  const getEventDetails = async e => {
    try {
      const {data, error} = await supabase
        .from('events')
        .select('*')
        .eq('id', eventId)
        .single();
      if (error) throw error;
      if (data) {
        setEventDetail('title', data.title);
        setEventDetail('category', data.category);
        setEventDetail('description', data.description);
        setEventDetail('location', data.location);
        setEventDetail('from_datetime', new Date(data.from_datetime));
        setEventDetail('to_datetime', new Date(data.to_datetime));
        setEventDetail('max_capacity', data.max_capacity);
        setEventDetail('picture_url', data.picture_url);
        setStartDateString(formatDateTimeUTC(new Date(data.from_datetime)));
        setEndDateString(formatDateTimeUTC(new Date(data.to_datetime)));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdatePic = async image => {
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
      alert('We have encountered an error updating the image. Try again.');
      return false;
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
  const handleUpdateEventDetails = async e => {
    if (eventDetails.title == '') {
      alert('Please insert a title');
    } else if (eventDetails.location == '') {
      alert('Please insert a location');
    } else if (startDateString == '') {
      alert('Please enter a start date');
    } else if (endDateString == '') {
      alert('Please enter an end date');
    } else if (eventDetails.category == '') {
      alert('Please select a category');
    } else if (eventDetails.description.length > 1000) {
      alert('Description is too long');
    } else {
      try {
        const {data, error} = await supabase
          .from('events')
          .update({
            title: eventDetails.title,
            category: eventDetails.category,
            description: eventDetails.description,
            location: eventDetails.location,
            from_datetime: startDateString,
            to_datetime: endDateString,
            max_capacity: eventDetails.max_capacity,
            picture_url: eventPicture == '' ? eventDetails.picture_url : eventPicture.path,
          })
          .match({id: eventId});
        if (error) throw error
        else {
          alert('Event details are updated.')
        }
      } catch (error) {
        console.log(error);
        alert('We have encountered updating the event details. Try again.');
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
  const handleEditEvent = async e => {
    setLoading(true);
    if (eventPicture != '') {
      // picture is updated
      handleUpdatePic(eventPicture)
        .then((result) => {
          if (result) {
            handleUpdateEventDetails().then(() => setLoading(false))
          } else {
            setLoading(false)
          }
          })
    } else {
      handleUpdateEventDetails().then(() => setLoading(false));
    }
  };

  const formatDateTimeUTC = date => {
    return (
      date.getDate() +
      ' ' +
      MONTH[date.getMonth()] +
      ' ' +
      date.getFullYear() +
      ' ' +
      (date.getUTCHours() % 12) +
      ':' +
      (date.getMinutes() < 10 ? '00' : date.getMinutes()) +
      ' ' +
      (date.getHours() > 11 ? 'PM' : 'AM')
    );
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

  return (
    <Wrapper
      contentViewStyle={{width: '95%', paddingTop: '3%'}}
      statusBarColor="#ea580c">
      <EventPictureInput
        imageInputHandler={image => setEventPicture(image)}
        existingPictureUrl={eventDetails.picture_url}
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
          date={eventDetails.from_datetime}
          minimumDate={new Date()}
          minuteInterval={15}
          onConfirm={date => {
            setStartOpen(false);
            setEventDetail('from_datetime', date);
            setStartDateString(formatDateTime(date));
            if (date > eventDetails.to_datetime) {
              setEventDetail('to_datetime', new Date());
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
          date={eventDetails.to_datetime}
          minimumDate={eventDetails.from_datetime}
          minuteInterval={15}
          onConfirm={date => {
            setEndOpen(false);
            setEventDetail('to_datetime', date);
            // console.log(date.getMonth())
            setEndDateString(formatDateTime(date));
          }}
          onCancel={() => {
            setEndOpen(false);
          }}
        />

        <EventSingleFieldInput
          placeholder="Capacity (does not include yourself)"
          value={eventDetails.max_capacity.toString()}
          textHandler={value => setEventDetail('max_capacity', value)}
          keyboardType="numeric"
          iconName="people-outline"
        />
      </VStack>

      <CustomButton
        title="Edit Event"
        width="100%"
        color="#fb923c" // orange.400
        onPressHandler={handleEditEvent}
        isDisabled={false}
      />
    </Wrapper>
  );
};

export default EventEditForm;
