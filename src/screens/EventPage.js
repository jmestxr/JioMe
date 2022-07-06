import React, {useState, useEffect} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {Text, View, Icon, HStack, VStack, Center, Avatar} from 'native-base';
import {Wrapper} from '../components/basic/Wrapper';
import {EssentialDetail} from '../components/basic/EssentialDetail';
import {Detail} from '../components/eventPage/Detail';
import CustomButton from '../components/basic/CustomButton';
import {HeaderButton} from '../components/basic/HeaderButton';
import {TextCollapsible} from '../components/eventPage/TextCollapsible';
import {AvatarsCollapsible} from '../components/eventPage/AvatarsCollapsible';
import {MaterialIcons, Ionicons} from '@native-base/icons';
import LinearGradient from 'react-native-linear-gradient';
import {supabase} from '../../supabaseClient';
import {useIsFocused} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import {useAuth} from '../components/contexts/Auth';

import {
  MONTH,
  PROFILE_DEFAULT_IMAGE,
  WEEKDAY_LONG,
  WEEKDAY_SHORT,
  WINDOW_HEIGHT,
} from '../constants/constants';
import {
  handleLikeEvent,
  handleUnlikeEvent,
  hasJoinedEvent,
  handleJoinEvent,
  handleQuitEvent,
  getEventCurrCapacity,
  handleDeleteEvent,
  isOrganiser,
  eventIsOver,
} from '../functions/eventHelpers';
import {getLocalDateTimeNow, getPublicURL} from '../functions/helpers';
import {CustomModal} from '../components/basic/CustomModal';
import {LoadingPage} from '../components/basic/LoadingPage';

const EventPage = ({route}) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {user} = useAuth();

  const {eventId} = route.params; // the unique id of this event

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingEventHandler, setLoadingEventHandler] = useState(false);

  const [liked, setLiked] = useState(false);
  const [joined, setJoined] = useState(false);
  const [canEdit, setCanEdit] = useState(false);

  // Details of this event
  const [eventDetails, setEventDetails] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    from_datetime: '',
    to_datetime: '',
    max_capacity: '',
    picture_url: '',
  });

  const [currCapacity, setCurrCapacity] = useState(0);

  const [datetimePeriod, setDatetimePeriod] = useState({
    day: '',
    date: '',
    time: '',
  });
  // e.g. {day: 'Thursday', date: '2 Jun 2022', time: '1800 - 1900 hrs'}
  // e.g. {day: 'Mon - Sat', date: '2 Jun 2022 - 7 Jun 2022', time: '1800 - 1900 hrs'}

  const [organiserDetails, setOrganiserDetails] = useState({});
  const [participantsAvatars, setParticipantsAvatars] = useState([]);

  useEffect(() => {
    if (isFocused) {
      setLoadingPage(true);
      getEventDetails()
        .then(() => getEventCurrCapacity(eventId))
        .then(currCap => setCurrCapacity(currCap))
        .then(() => getParticipantsAvatars())
        .then(() => getLikedState())
        .then(() => getJoinedState())
        .then(() => getEditPermission())
        .then(() => setLoadingPage(false));
    } else {
      setLoadingPage(true);
    }
  }, [isFocused]);

  // this function is called when 'liked button' is pressed
  const toggleLiked = async () => {
    if (liked) {
      handleUnlikeEvent(user.id, eventId);
    } else {
      handleLikeEvent(user.id, eventId);
    }
    setLiked(!liked);
  };

  // function to get the user's liked status of this event (whether user has liked it or not as of current state)
  const getLikedState = async e => {
    try {
      const {data, count, error} = await supabase
        .from('user_likedevents')
        .select('user_id, event_id', {count: 'exact'})
        .match({user_id: user.id, event_id: eventId});
      if (error) throw error;
      if (data) {
        setLiked(count == 1);
      }
    } catch (error) {
      console.log(error.error_description || error.message);
    }
  };

  // function to get the user's joined status of this event (whether user has joined it or not as of current state)
  const getJoinedState = async e => {
    hasJoinedEvent(user.id, eventId).then(value => setJoined(value > 0));
  };

  // Can edit event only if the user is the organiser and event is not yet over
  const getEditPermission = async () => {
    Promise.all([isOrganiser(user.id, eventId), eventIsOver(eventId)]).then(
      results => setCanEdit(results[0] == 1 && results[1] == 0),
    );
  };

  const getEventDetails = async e => {
    try {
      const {data, error} = await supabase
        .from('events')
        .select(
          `
          *,
          profiles!events_organiser_id_fkey (
            *
          )
        `,
        )
        .eq('id', eventId)
        .single();
      if (error) throw error;
      if (data) {
        setEventDetails(data);
        setOrganiserDetails(data.profiles);
        formatEventPeriod(data.from_datetime, data.to_datetime);
      }
    } catch (error) {
      console.log(error.error_description || error.message);
    }
  };

  const getOrganiserAvatarPublicURL = () => {
    return getPublicURL(organiserDetails.avatar_url, 'avatars');
  };

  // function stores list of avatar private URLS in participantsAvatars
  const getParticipantsAvatars = async e => {
    try {
      const {data, error} = await supabase
        .from('profiles')
        .select('id, username, avatar_url, user_joinedevents!inner(*)')
        .eq('user_joinedevents.event_id', eventId);

      if (error) throw error;
      if (data) {
        setParticipantsAvatars(data);
      }
    } catch (error) {
      console.log(error.error_description || error.message);
    }
  };

  const joinEventHandler = async () => {
    setLoadingEventHandler(true);
    handleJoinEvent(user.id, eventId)
      .then(() => getEventDetails()) // update
      .then(() => getEventCurrCapacity(eventId)) // update
      .then(() => getParticipantsAvatars()) // update
      .then(() => getJoinedState()) // update
      .then(() => setLoadingEventHandler(false));
  };

  const quitEventHandler = async () => {
    setLoadingEventHandler(true);
    handleQuitEvent(user.id, eventId)
      .then(() => getEventDetails()) // update
      .then(() => getEventCurrCapacity(eventId)) // update
      .then(() => getParticipantsAvatars()) // update
      .then(() => getJoinedState()) // update
      .then(() => setLoadingEventHandler(false));
  };

  const deleteEventHandler = async () => {
    setLoadingEventHandler(true);
    handleDeleteEvent(eventId)
      .then(() => setLoadingEventHandler(false))
      .then(() => navigation.navigate('Marketplace'));
  };

  const formatEventPeriod = (fromTimeStamp, toTimeStamp) => {
    const from = new Date(fromTimeStamp);
    const to = new Date(toTimeStamp);
    const fromDate = fromTimeStamp.slice(0, 10);
    const toDate = toTimeStamp.slice(0, 10);

    if (fromDate == toDate) {
      // if event only lasts within the same day
      setDatetimePeriod(prev => ({
        ...prev,
        day: WEEKDAY_LONG[from.getDay()],
      }));
      setDatetimePeriod(prev => ({
        ...prev,
        date:
          from.getDate() +
          ' ' +
          MONTH[from.getMonth()] +
          ' ' +
          from.getFullYear(),
      }));
    } else {
      setDatetimePeriod(prev => ({
        ...prev,
        day: WEEKDAY_SHORT[from.getDay()] + ' - ' + WEEKDAY_SHORT[to.getDay()],
      }));
      setDatetimePeriod(prev => ({
        ...prev,
        date:
          from.getDate() +
          ' ' +
          MONTH[from.getMonth()] +
          ' ' +
          from.getFullYear() +
          ' - ' +
          '\n' +
          to.getDate() +
          ' ' +
          MONTH[to.getMonth()] +
          ' ' +
          to.getFullYear(),
      }));
    }
    setDatetimePeriod(prev => ({
      ...prev,
      time:
        String(from.getUTCHours()).padStart(2, '0') +
        String(from.getMinutes()).padStart(2, '0') +
        ' - ' +
        String(to.getUTCHours()).padStart(2, '0') +
        String(to.getMinutes()).padStart(2, '0') +
        ' hrs',
    }));
  };

  const formatAvailCapacity = (currCapacity, maxCapacity) => {
    const availCapacity = maxCapacity - currCapacity;
    return (
      availCapacity.toString() +
      '/' +
      maxCapacity.toString() +
      '\n' +
      'available'
    );
  };

  return loadingPage ? (
    <LoadingPage />
  ) : (
    <Wrapper contentViewStyle={{width: '100%'}} statusBarColor="#f97316">
      <ImageBackground style={{backgroundColor: '#f97316'}}>
        <View width="100%" alignItems="center">
          <ImageBackground
            style={{height: WINDOW_HEIGHT * 0.35, width: '100%'}}
            source={getPublicURL(eventDetails.picture_url, 'eventpics')}>
            <LinearGradient
              colors={['#00000000', '#f97316']}
              style={{height: '100%', width: '100%'}}></LinearGradient>

            <HeaderButton
              onPressHandler={() => navigation.goBack()}
              xShift={12}
              icon={<Icon as={Ionicons} name="chevron-back" color="white" />}
            />

            {canEdit ? (
              <HeaderButton
                onPressHandler={() =>
                  navigation.navigate('EventEditForm', {
                    eventId: eventId,
                  })
                }
                xShift={295}
                icon={<Icon as={MaterialIcons} name="edit" color="white" />}
              />
            ) : null}

            <HeaderButton
              onPressHandler={toggleLiked}
              xShift={350}
              icon={
                <Icon
                  as={MaterialIcons}
                  name={liked ? 'favorite' : 'favorite-outline'}
                  color={liked ? 'red.500' : 'white'}
                />
              }
            />
          </ImageBackground>

          <Center>
            <View style={styles.eventTitle} alignItems="center" bgColor="white">
              <Text textAlign="center" fontSize="2xl">
                {eventDetails.title}
              </Text>
            </View>
            <Text color="white" marginTop="2%" italic>
              {'Category: ' + eventDetails.category}
            </Text>
          </Center>
        </View>

        <View marginTop="3%" marginBottom="3%" padding="3%">
          <HStack justifyContent="space-between">
            <EssentialDetail width="30%" iconName="location" iconColor="white">
              <Text color="white" textAlign="center">
                {eventDetails.location}
              </Text>
            </EssentialDetail>

            <EssentialDetail width="30%" iconName="time" iconColor="white">
              <Text color="white" textAlign="center">
                {datetimePeriod.day}
              </Text>
              <Text color="white" textAlign="center">
                {datetimePeriod.date}
              </Text>
              <Text color="white" textAlign="center">
                {datetimePeriod.time}
              </Text>
            </EssentialDetail>

            <EssentialDetail width="30%" iconName="people" iconColor="white">
              <Text color="white" textAlign="center">
                {formatAvailCapacity(currCapacity, eventDetails.max_capacity)}
              </Text>
            </EssentialDetail>
          </HStack>
        </View>
      </ImageBackground>

      <VStack space={8} padding="5%">
        <Detail title="About">
          <TextCollapsible longText={eventDetails.description} />
        </Detail>

        <Detail title="Organiser">
          <Avatar>
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() =>
                navigation.navigate('AvatarProfile', {
                  screen: 'UserProfile',
                  params: {userId: organiserDetails.id, showBackButton: true},
                })
              }>
              <Avatar
                bg='#f2f2f2'
                source={getOrganiserAvatarPublicURL()}></Avatar>
            </TouchableOpacity>
          </Avatar>
        </Detail>

        <Detail title="Participants">
          {participantsAvatars.length == 0 ? (
            <Center>
              <Image
                style={{height: 130, width: 130}}
                source={require('../assets/koala_sad.png')}
              />
              <Text>No participants at the moment...</Text>
            </Center>
          ) : (
            <AvatarsCollapsible avatarUrls={participantsAvatars} />
          )}
        </Detail>
      </VStack>

      <Center>
        {eventDetails.to_datetime < getLocalDateTimeNow() ? ( // event is over
          <CustomButton
            title="This event has already ended. Sorry!"
            width="95%"
            color="#a1a1aa" // gray.400
            isDisabled={false}
          />
        ) : organiserDetails.id == user.id ? ( // user is organiser
          <CustomModal
            modalButton={
              <CustomButton
                title="Delete Event"
                width="95%"
                color="#ef4444" // red.500
              />
            }
            confirmHandler={deleteEventHandler}
            showWarning={true}
            isLoading={loadingEventHandler}
          />
        ) : joined ? ( // user is already participant
          <CustomModal
            modalButton={
              <CustomButton
                title="Quit"
                width="95%"
                color="#ef4444" // red.500
              />
            }
            confirmHandler={quitEventHandler}
            isLoading={loadingEventHandler}
          />
        ) : (
          <CustomModal // user is not participant/organiser
            modalButton={
              <CustomButton
                title="Join Now!"
                width="95%"
                color="#f97316" // orange.500
              />
            }
            confirmHandler={joinEventHandler}
            isLoading={loadingEventHandler}
          />
        )}
      </Center>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  eventTitle: {
    maxWidth: '80%',
    paddingTop: '2.5%',
    paddingBottom: '2.5%',
    paddingLeft: '5%',
    paddingRight: '5%',
  },
});

export default EventPage;
