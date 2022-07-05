import React, {useState, useEffect} from 'react';
import {Text, HStack, View, VStack} from 'native-base';
import {Wrapper} from '../components/basic/Wrapper';
import {UpcomingEventCard} from '../components/eventCards/UpcomingEventCard';
import {ZeroEventCard} from '../components/eventCards/ZeroEventCard';
import {ProfileAvatar} from '../components/profilePage/ProfileAvatar';
import {useIsFocused, useNavigation} from '@react-navigation/native';
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
  const [
    upcomingEventsParticipatedDetails,
    setUpcomingEventsParticipatedDetails,
  ] = useState([]);
  const [upcomingEventsOrganisedDetails, setUpcomingEventsOrganisedDetails] =
    useState([]);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      getProfileDetails()
        .then(() => getUpcomingEventsDetails())
        .then(() => setLoading(false));
    } else {
      setLoading(true);
    }
  }, [isFocused]);

  const getProfileDetails = async e => {
    try {
      const {data, error} = await supabase
        .from('profiles')
        .select(`username, avatar_url`)
        .eq('id', user.id)
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
        id: user.id,
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

  const getUpcomingEventsDetails = async e => {
    try {
      let {data: participatingData, error: participatingError} = await supabase
        .from('events')
        .select(
          'id, title, location, from_datetime, to_datetime, user_joinedevents!inner(*)',
        )
        .eq('user_joinedevents.user_id', user.id)
        .gte('to_datetime', getLocalDateTimeNow());
      if (participatingError) throw participatingError;
      if (participatingData) {
        setUpcomingEventsParticipatedDetails(participatingData);
      }

      let {data: organisingData, error: organisingError} = await supabase
        .from('events')
        .select('id, title, location, from_datetime, to_datetime')
        .eq('organiser_id', user.id)
        .gte('to_datetime', getLocalDateTimeNow());
      if (organisingError) throw organisingError;
      if (organisingData) {
        setUpcomingEventsOrganisedDetails(organisingData);
      }
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  // To unlike an event given its id
  const quitEventHandler = async eventId => {
    handleQuitEvent(user.id, eventId).then(() => getUpcomingEventsDetails());
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
      <HeaderBar headerText='Dashboard' />
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
              {upcomingEventsParticipatedDetails.length +
                upcomingEventsOrganisedDetails.length ==
              0
                ? 'no'
                : upcomingEventsParticipatedDetails.length +
                  upcomingEventsOrganisedDetails.length}{' '}
              upcoming events.
            </Text>
            {upcomingEventsParticipatedDetails.length +
              upcomingEventsOrganisedDetails.length ==
            0 ? (
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
                {upcomingEventsParticipatedDetails.map((detail, index) => {
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
                {upcomingEventsOrganisedDetails.map((detail, index) => {
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
