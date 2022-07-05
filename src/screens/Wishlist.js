import React, {useState, useEffect} from 'react';
import {View, Text, VStack} from 'native-base';
import {Wrapper} from '../components/basic/Wrapper';
import {LikedEventCard} from '../components/eventCards/LikedEventCard';
import {ZeroEventCard} from '../components/eventCards/ZeroEventCard';
import {useAuth} from '../components/contexts/Auth';
import {useIsFocused} from '@react-navigation/native';
import {supabase} from '../../supabaseClient';

import {handleUnlikeEvent, handleJoinEvent} from '../functions/eventHelpers';
import {MONTH} from '../constants/constants';
import {LoadingPage} from '../components/basic/LoadingPage';
import {HeaderBar} from '../components/basic/HeaderBar';

const Wishlist = () => {
  const isFocused = useIsFocused();
  const {user} = useAuth();

  const [loading, setLoading] = useState(true);
  const [loadingEventHandler, setLoadingEventHandler] = useState(false);

  const [likedEventsDetails, setLikedEventsDetails] = useState(null);
  const [likedEventsCurrCapacity, setLikedEventsCurrCapacity] = useState(null);

  useEffect(() => {
    if (isFocused) {
      setLoading(true);
      getLikedEventsDetails()
        .then(() => getLikedEventsCurrCapacity())
        .then(() => setLoading(false));
    } else {
      setLoading(true);
    }
  }, [isFocused]);

  const getLikedEventsDetails = async e => {
    try {
      const {data, error} = await supabase
        .from('events')
        .select('*, user_likedevents!inner(*)')
        .eq('user_likedevents.user_id', user.id);

      if (error) throw error;
      if (data) {
        setLikedEventsDetails(Object.values(data));
      }
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  // function to get the current capacity of each liked event
  const getLikedEventsCurrCapacity = async e => {
    try {
      const {data, error} = await supabase.rpc(
        'getcurrcapacityofuserlikedevents',
        {_user_id: user.id},
      );

      if (error) throw error;
      if (data) {
        setLikedEventsCurrCapacity(data);
      }
    } catch (error) {
      alert(error.error_description || error.message);
    }
  };

  // To unlike an event given its id
  const unLikeEventHandler = async eventId => {
    handleUnlikeEvent(user.id, eventId).then(() => getLikedEventsDetails());
  };

  // To join an event given its id
  const joinEventHandler = async eventId => {
    setLoadingEventHandler(true);
    handleJoinEvent(user.id, eventId).then(() => setLoadingEventHandler(false));
  };

  const formatEventPeriod = (fromTimeStamp, toTimeStamp) => {
    const from = new Date(fromTimeStamp);
    const to = new Date(toTimeStamp);
    const fromDate = fromTimeStamp.slice(0, 10);
    const toDate = toTimeStamp.slice(0, 10);

    const fromTimeString =
      String(from.getUTCHours()).padStart(2, '0') +
      String(from.getMinutes()).padStart(2, '0');
    const toTimeString =
      String(to.getUTCHours()).padStart(2, '0') +
      String(to.getMinutes()).padStart(2, '0');

    if (fromDate == toDate) {
      // if event only lasts within the same day
      return (
        from.getDate() +
        ' ' +
        MONTH[from.getMonth()] +
        ' ' +
        from.getFullYear() +
        '\n' +
        '(' +
        fromTimeString +
        ' - ' +
        toTimeString +
        ' hrs)'
      );
    } else {
      return (
        from.getDate() +
        ' ' +
        MONTH[from.getMonth()] +
        ' ' +
        from.getFullYear() +
        ' (' +
        fromTimeString +
        ' hrs)' +
        ' - ' +
        '\n' +
        to.getDate() +
        ' ' +
        MONTH[to.getMonth()] +
        ' ' +
        to.getFullYear() +
        ' (' +
        toTimeString +
        ' hrs)'
      );
    }
  };

  const formatAvailCapacity = (currCapacity, maxCapacity) => {
    const availCapacity = maxCapacity - currCapacity;
    return (
      availCapacity.toString() + '/' + maxCapacity.toString() + ' available'
    );
  };

  return (
    <>
      <HeaderBar headerText="Wishlist" />

      {loading ? (
        <LoadingPage />
      ) : (
        <Wrapper
          contentViewStyle={{width: '95%', paddingTop: '3%'}}
          statusBarColor="#ea580c">
          {/* <HeaderTitle title="My Liked Events" /> */}

          <View width="100%" alignItems="center" marginTop="5%">
            <Text fontSize="lg" fontWeight="medium" marginBottom="3%">
              You have{' '}
              {likedEventsDetails.length == 0
                ? 'no'
                : likedEventsDetails.length}{' '}
              liked events.
            </Text>
            {likedEventsDetails.length == 0 ? (
              <ZeroEventCard
                imagePath={require('../assets/koala_like.png')}
                imageWidth={225}
                imageHeight={225}
                textMessage={
                  'Events you have liked will be' + '\n' + 'displayed here.'
                }
              />
            ) : (
              <VStack width="100%" space={2}>
                {likedEventsDetails.map((detail, index) => {
                  return (
                    <LikedEventCard
                      key={index}
                      eventId={detail.id}
                      pictureURL={detail.picture_url}
                      title={detail.title}
                      location={detail.location}
                      time={formatEventPeriod(
                        detail.from_datetime,
                        detail.to_datetime,
                      )}
                      capacity={formatAvailCapacity(
                        likedEventsCurrCapacity[index].no_of_participants,
                        detail.max_capacity,
                      )}
                      unlikeHandler={() => {
                        unLikeEventHandler(detail.id);
                      }}
                      joinEventHandler={() => joinEventHandler(detail.id)}
                      isLoadingJoiningEvent={loadingEventHandler}
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

export default Wishlist;
