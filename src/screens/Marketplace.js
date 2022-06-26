import React, {useState, useEffect} from 'react';
import {Wrapper} from '../components/basic/Wrapper';
import {Text, HStack, Center} from 'native-base';
import {supabase} from '../../supabaseClient';
import {useAuth} from '../components/contexts/Auth';
import {ZeroEventCard} from '../components/eventCards/ZeroEventCard';
import MarketSearch from '../components/marketplace/MarketSearch';
import {MarketplaceEventCard} from '../components/eventCards/MarketplaceEventCard';
import {getLocalDateTimeNow} from '../functions/helpers';
import { useIsFocused } from '@react-navigation/native';
import { LoadingPage } from '../components/basic/LoadingPage';

export const Marketplace = () => {
  const {user} = useAuth();

  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(false);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [allAvailableEvents, setAllAvailableEvents] = useState([]);
  // in case people use the search function multiple times
  const [beforeSearchAvailableEvents, setBeforeSearchAvailableEvents] =
    useState([]);

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (isFocused) {
      setFilter('all')
      setSearch('')
      getEvents()
    } else {
      setLoading(true)
    }
  }, [isFocused]);

  const getEvents = async e => {
    try {
      setLoading(true)

      let {data, error} = await supabase
        .from('events')
        .select(
          `
            *,
            profiles!events_organiser_id_fkey (
              username
            )
          `,
        )
        .gte('to_datetime', getLocalDateTimeNow());
      if (error) {
        console.log(error);
        throw error;
      }
      if (data) {
        let list = data.sort((a, b) => a.from_datetime > b.from_datetime);
        setAvailableEvents(list);
        setAllAvailableEvents(list);
        setBeforeSearchAvailableEvents(list);
      }
    } catch (error) {
      console.log('error', error.message);
    } finally {
      setLoading(false)
    }
  };

  const searchEvents = async e => {
    setLoading(true);
    setSearch(e);
    // console.log('Searching')
    // console.log(e)
    if (filter == 'all') {
      setAvailableEvents(
        allAvailableEvents.filter(x =>
          x.title.toLowerCase().includes(e.toLowerCase()),
        ),
      );
    } else {
      setAvailableEvents(
        beforeSearchAvailableEvents.filter(x =>
          x.title.toLowerCase().includes(e.toLowerCase()),
        ),
      );
    }
    setLoading(false);
  };

  // const filterEvents = async (e) => {
  // e.preventDefault()
  //   if (newProfDesc.length > 200) {
  //     alert('Your description is too long.')
  //   } else {
  //     const user = supabase.auth.user();
  //     try {
  //       setFiltering(true)
  //       let { error: updateError } = await supabase.from('profiles').upsert({
  //         id: user.id,
  //         profile_description: newProfDesc,
  //       })
  //       switchEditingState()
  //       if (updateError) {
  //         console.log(updateError)
  //         // throw updateError
  //       }
  //     } catch (error) {
  //       alert(error.message)
  //     } finally {
  //       setFiltering(false)
  //     }
  //   }
  //     console.log('Filtering')
  //     console.log(availableEvents[0].id)

  // }

  const filterEvents = async event => {
    console.log(event)
    // function filterEvents (event) {
    setLoading(true);
    console.log(event);
    setFilter(event);
    if (event == 'all' && search == '') {
      setAvailableEvents(allAvailableEvents);
      setBeforeSearchAvailableEvents(allAvailableEvents);
    } else if (search == '') {
      let {data, error} = await supabase
        .from('events')
        .select(
          `
          *,
          profiles!events_organiser_id_fkey (
            username
          )
        `,
        )
        .gte('to_datetime', getLocalDateTimeNow())
        .eq('category', event);
      if (data) {
        let list = data.sort((a, b) => a.from_datetime > b.from_datetime);
        setAvailableEvents(list);
        setBeforeSearchAvailableEvents(list);
      } else {
        setAvailableEvents([]);
        setBeforeSearchAvailableEvents([]);
      }
    } else if (event == 'all') {
      let list = allAvailableEvents.filter(x =>
        x.title.toLowerCase().includes(search.toLowerCase()),
      );
      setAvailableEvents(list);
      setBeforeSearchAvailableEvents(list);
    } else {
      let {data, error} = await supabase
        .from('events')
        .select(
          `
          *,
          profiles!events_organiser_id_fkey (
            username
          )
        `,
        )
        .gte('to_datetime', getLocalDateTimeNow())
        .eq('category', event)
        data = data.filter(x => x.title.toLowerCase().includes(search.toLowerCase()));
      if (data) {
        let list = data.sort((a, b) => a.from_datetime > b.from_datetime);
        setAvailableEvents(list);
        setBeforeSearchAvailableEvents(list);
      } else {
        setAvailableEvents([]);
        setBeforeSearchAvailableEvents([]);
      }
    }
    // console.log(data)
    setLoading(false);
  };

  return loading ? (
    <LoadingPage />
  ) : (
    <Wrapper contentViewStyle={{width: '97%', paddingTop: '3%'}} statusBarColor="#ea580c">
      <Center>
        <HStack space={2} justifyContent="space-between" alignItems="center">
          <MarketSearch
            placeholder={'Search'}
            searchValue={search}
            searchHandler={searchEvents}
            selectedValue={filter}
            filterHandler={filterEvents}
          />
        </HStack>
      </Center>

      <Text
        fontSize="sm"
        textAlign="right"
        fontWeight="medium"
        marginTop="2%"
        marginRight="2%">
        {availableEvents.length +
          ' ' +
          (availableEvents.length == 1 ? 'result' : 'results') +
          ' ' +
          'for' +
          ' ' +
          filter}
      </Text>

      {availableEvents.length == 0 ? (
        <Center marginTop="30%">
          <ZeroEventCard
            imagePath={require('../assets/koala_sad.png')}
            imageWidth={175}
            imageHeight={175}
          />
          <Text style={{transform: [{translateY: -50}]}} fontSize="md">
            No available events currently. Sorry!
          </Text>
        </Center>
      ) : (
        <HStack
          marginTop="5%"
          justifyContent="space-between"
          width="100%"
          flexWrap="wrap">
          {availableEvents.map((detail, index) => {
            return <MarketplaceEventCard key={index} eventDetails={detail} />;
          })}
        </HStack>
      )}
    </Wrapper>
  );
};
