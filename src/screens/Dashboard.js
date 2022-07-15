import React, {useState, useEffect} from 'react';
import {Text, HStack, View, VStack} from 'native-base';
import {Wrapper} from '../components/basic/Wrapper';
import {UpcomingEventCard} from '../components/eventCards/UpcomingEventCard';
import {ZeroEventCard} from '../components/eventCards/ZeroEventCard';
import {ProfileAvatar} from '../components/profilePage/ProfileAvatar';
import {useIsFocused} from '@react-navigation/native';
import {useAuth} from '../components/contexts/Auth';
import {supabase} from '../../supabaseClient';
import {handleQuitEvent} from '../functions/eventHelpers';
import {getLocalDateTimeNow, getPublicURL} from '../functions/helpers';
import {LoadingPage} from '../components/basic/LoadingPage';
import {HeaderBar} from '../components/basic/HeaderBar';

const Dashboard = () => {
  const isFocused = useIsFocused();
  const {user} = useAuth();

  const [loading, setLoading] = useState(true);

  const [reRender, setReRender] = useState(1); // to rerender to display latest uploaded avatar (not the correct way to do so though)

  const [profileDetails, setProfileDetails] = useState([]);
  const [upcomingEventsDetails, setUpcomingEventsDetails] = useState([]);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      getProfileDetails().then(() => getUpcomingEventsDetails());
    } else {
      setLoading(true);
    }
  }, [isFocused]);

  const getProfileDetails = async e => {
    try {
      const {data, error} = await supabase
        .from('profiles')
        .select(`username, avatar_url`)
        .eq('id', user?.id)
        .single();
      if (error) throw error;
      if (data) {
        setProfileDetails(data);
      }
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  const handleUploadAvatar = async image => {
    try {
      //   setUploading(true)

      const base64FileData = image.data;

      const filePath = image.path;

      let {error: uploadError} = await supabase.storage
        .from('avatars')
        .upload(filePath, decode(base64FileData));

      if (uploadError) throw uploadError;

      let {error: updateError} = await supabase.from('profiles').upsert({
        id: user?.id,
        avatar_url: filePath,
      });

      if (updateError) throw updateError;
    } catch (error) {
      setReRender(reRender * -1); // to render the existing avatar again
      console.log(error.message);
      alert('Error in uploading profile picture!');
    } finally {
      //   setUploading(false)
    }
  };

  // sort upcoming events by from_datetime (earliest first)
  const sortUpcomingEvents = upcomingEventsArr => {
    return upcomingEventsArr.sort(function (a, b) {
      const keyA = new Date(a.from_datetime);
      const keyB = new Date(b.from_datetime);
      // Compare the 2 dates
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });
  };

  const getUpcomingEventsDetails = async () => {
    Promise.all([
      getUpcomingEventsParticipatedDetails(),
      getUpcomingEventsOrganisedDetails(),
    ])
      .then(results => {
        // sort by last_chat_message created_at time (latest first)
        setUpcomingEventsDetails(
          sortUpcomingEvents(results[0].concat(results[1])),
        );
      })
      .then(() => setLoading(false));
  };

  const getUpcomingEventsParticipatedDetails = async e => {
    try {
      const {data, error} = await supabase
        .from('events')
        .select('*, user_joinedevents!inner(*)')
        .eq('user_joinedevents.user_id', user?.id)
        .gte('to_datetime', getLocalDateTimeNow());
      if (error) throw error;
      if (data) return data;
    } catch (error) {
      console.log(error);
    }
  };

  const getUpcomingEventsOrganisedDetails = async e => {
    try {
      const {data, error} = await supabase
        .from('events')
        .select('*')
        .eq('organiser_id', user?.id)
        .gte('to_datetime', getLocalDateTimeNow());
      if (error) throw error;
      if (data) return data;
    } catch (error) {
      console.log(error);
    }
  };

  // To unlike an event given its id
  const quitEventHandler = async eventId => {
    handleQuitEvent(user?.id, eventId).then(() => getUpcomingEventsDetails());
  };

  // calculate exact difference in hours (timestamp - now)
  const getHourDifference = (now, givenTimestamp) => {
    const nowDt = new Date(now);
    const givenDt = new Date(givenTimestamp);
    let hourDiff = (givenDt.getTime() - nowDt.getTime()) / 1000;
    hourDiff /= 60 * 60;
    return hourDiff > 0 ? Math.abs(hourDiff) + 8 : -Math.abs(hourDiff);
  };

  // for display on UpcomingEventCard
  const displayTimeDifference = hourDifference => {
    if (Math.abs(hourDifference) > 24) {
      return hourDifference > 0
        ? 'Starts in ' + Math.floor(hourDifference / 24).toString() + ' days'
        : 'Ongoing';
    }
    return hourDifference > 0
      ? 'Starts in ' + Math.floor(hourDifference).toString() + ' hours'
      : 'Ongoing';
  };

  return (
    <>
      <HeaderBar headerText="Dashboard" />
      {loading ? (
        <LoadingPage />
      ) : (
        <Wrapper
          contentViewStyle={{width: '95%', paddingTop: '3%'}}
          statusBarColor="#ea580c">
          <HStack justifyContent="space-between" alignItems="center">
            <Text fontSize="2xl">
              Welcome back, {'\n'} {profileDetails.username}!
            </Text>
            <ProfileAvatar
              imageInputHandler={handleUploadAvatar}
              existingAvatarUrl={
                getPublicURL(profileDetails.avatar_url, 'avatars').uri
              }
              imageSize={125}
              reRender={reRender}
            />
          </HStack>
          <View width="100%" alignItems="center" marginTop="10%">
            <Text fontSize="lg" fontWeight="medium" marginBottom="3%">
              You have{' '}
              {upcomingEventsDetails.length == 0
                ? 'no'
                : upcomingEventsDetails.length}{' '}
              upcoming events.
            </Text>
            {upcomingEventsDetails.length == 0 ? (
              <ZeroEventCard
                imagePath={require('../assets/koala_join.png')}
                imageWidth={225}
                imageHeight={225}
                textMessage={
                  'Events you have joined will be' + '\n' + 'displayed here.'
                }
              />
            ) : (
              <VStack width="90%" space={2} alignItems="center">
                {upcomingEventsDetails.map((detail, index) => {
                  return (
                    <UpcomingEventCard
                      key={index}
                      id={detail.id}
                      name={detail.title}
                      location={detail.location}
                      daysToEvent={displayTimeDifference(
                        getHourDifference(
                          getLocalDateTimeNow(),
                          detail.from_datetime,
                        ),
                      )}
                      quitEventHandler={() => quitEventHandler(detail.id)}
                    />
                  );
                })}
              </VStack>
            )}
          </View>
        </Wrapper>
      )}
    </>
  );
};

export default Dashboard;
