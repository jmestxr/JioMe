import React, { useState, useEffect } from "react";
import { Wrapper } from "../components/basic/Wrapper";
import { HeaderTitle } from "../components/basic/HeaderTitle";
import { Loading } from "../components/basic/Loading";
import { VStack, IconButton, Text, HStack, Center, Select, Image, Box, Input } from "native-base"
import { supabase } from "../../supabaseClient";
import { MaterialIcons } from "@native-base/icons";
import { useAuth } from '../components/contexts/Auth';
import EventFormat from "../components/marketplace/EventFormat";
import { ZeroEventCard } from "../components/eventCards/ZeroEventCard";
import MarketSearch from "../components/marketplace/MarketSearch";





export const Marketplace = () => {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true)
  const [filtering, setFiltering] = useState(false)
  const [searching, setSearching] = useState(false)  
  const [availableEvents, setAvailableEvents] = useState([])
  const [allAvailableEvents, setAllAvailableEvents] = useState([])
  // in case people use the search function multiple times
  const [beforeSearchAvailableEvents, setBeforeSearchAvailableEvents] = useState([])

  const [filter, setFilter] = useState("all")
  const [search, setSearch] = useState("")



  useEffect(() => {
    // let flag = true;
    if (loading) {
      getEvents().then(() => setLoading(false))
    }
  })

  const getEvents = async (e) => {
    try {
      // setLoading(true)

      let { data, error } = await supabase
        .from('events')
        .select(`id, title, category, from_datetime, to_datetime, picture_url`)

      if (error) {
        console.log(error)
        throw error
      }
      if (data) {
        let list = data.sort((a, b) => a.from_datetime > b.from_datetime)
        setAvailableEvents(list)
        setAllAvailableEvents(list)
        setBeforeSearchAvailableEvents(list)
      }
    } catch (error) {
      console.log('error', error.message)
    } finally {
      // setLoading(false)
    }
  }

  const searchEvents = async (e) => {
    setSearching(true)
    setSearch(e)
    // console.log('Searching')
    // console.log(e)
    if (filter == "all") {
      setAvailableEvents(allAvailableEvents.filter(x => x.title.toLowerCase().includes(e.toLowerCase())))
    } else {
      setAvailableEvents(beforeSearchAvailableEvents.filter(x => x.title.toLowerCase().includes(e.toLowerCase())))
    }
    setSearching(false)
  }

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


  const filterEvents = async (event) => {
    // function filterEvents (event) {
    setFiltering(true)
    console.log(event)
    setFilter(event)
    if (event == "all" && search == "") {
      setAvailableEvents(allAvailableEvents)
      setBeforeSearchAvailableEvents(allAvailableEvents)
    } else if (search == "") {
      let { data, error } = await supabase
        .from('events')
        .select(`id, title, category, from_datetime, to_datetime, picture_url`)
        .eq('category', event)
      if (data) {
        let list = data.sort((a, b) => a.from_datetime > b.from_datetime)
        setAvailableEvents(list)
        setBeforeSearchAvailableEvents(list)
      } else {
        setAvailableEvents([])
        setBeforeSearchAvailableEvents([])
      }
    } else if (event == "all") {
      let list = allAvailableEvents.filter(x => x.title.toLowerCase().includes(search.toLowerCase()))
      setAvailableEvents(list)
      setBeforeSearchAvailableEvents(list)
    } else {
      let { data, error } = await supabase
        .from('events')
        .select(`id, title, category, from_datetime, to_datetime, picture_url`)
        .eq('category', event).filter(x => x.title.toLowerCase().includes(search.toLowerCase()))
      if (data) {
        let list = data.sort((a, b) => a.from_datetime > b.from_datetime)
        setAvailableEvents(list)
        setBeforeSearchAvailableEvents(list)
      } else {
        setAvailableEvents([])
        setBeforeSearchAvailableEvents([])
      }
    }
    // console.log(data)
    setFiltering(false)

  }


  return (loading || filtering || searching ? <Loading /> : (
    <Wrapper>
      <HeaderTitle title="Available Events" />

      <Center>
        <HStack space={2} justifyContent='space-between' alignItems='center'>

        <MarketSearch placeholder={"Search"} value={search} textHandler={searchEvents}/>

                  {/** Not sure if we still need the search button below*/}
              {/* <IconButton onPress={searchEvents} size="lg" _icon={{
            as: MaterialIcons,
            name: "search",
            color: "#e8ab8b"
          }} ></IconButton> */}
          
          <Select
            flex={1}
            marginLeft='0.5%'
            style={{ transform: [{ translateX: -1 }, { translateY: -5 }] }}
            borderColor="#00000000"
            selectedValue={filter}
            borderWidth={1}
            placeholder="All"
            size="lg"
            _selectedItem={{
              bg: 'orange.200',
            }}
            mt={1}
            onValueChange={filterEvents}>
            <Select.Item label="All Categories" value="all" />
            <Select.Item label="Sports" value="sports" />
            <Select.Item label="Leisure" value="leisure" />
            <Select.Item label="Food" value="food" />
            <Select.Item label="Music" value="music" />
            <Select.Item label="Study" value="study" />
            <Select.Item label="Nature" value="nature" />
            <Select.Item label="Extreme" value="extreme" />
            <Select.Item label="Others" value="others" />
            {/* <IconButton onPress={filterEvents} size="lg" _icon={{
                        as: MaterialIcons,
                        name: "filter-list",
                        color: "#e8ab8b"
                    }} ></IconButton> */}
          </Select>

        </HStack>
      </Center>
      {availableEvents.length == 0 ?
      <Center>
        {/* <Image
        style={{ width: 300, height: 300, opacity:0.6 }}
        resizeMode={"contain"}
        // borderRadius={100}
        source={require('../assets/joined_colored.png')}
      /> */}
        <ZeroEventCard
          imagePath={require('../assets/koala_join.png')}
          textMessage={'Available events will be displayed here.'} />
          </Center>
        :
        availableEvents.map((detail) => {
          return <EventFormat
            id={detail.id}
            title={detail.title}
            from_datetime={detail.from_datetime}
            to_datetime={detail.to_datetime}
            picture_url={detail.picture_url} />
        })

        // <EventFormat 
        // id={availableEvents[0].id}
        // title={availableEvents[0].title}
        // from_datetime={availableEvents[0].from_datetime}
        // to_datetime={availableEvents[0].to_datetime}
        // picture_url={availableEvents[0].picture_url}/>
        // <VStack width='90%' space={4} alignItems='center'>
        //     {upcomingEventsDetails.map((detail, index) => {
        //         return <UpcomingEventCard 
        //                     key={index}
        //                     name={detail.title}
        //                     location={detail.location} 
        //                     daysToEvent='3 days' 
        //                     onPressHandler={() => navigation.navigate('EventPage',  {
        //                         eventId: detail.id
        //                         }
        //                     )}
        //                 />
        //     })}
        // </VStack>
      }
      {/* <VStack>
                    <EventFormat 
                    id={availableEvents[0].id}
                    title={availableEvents[0].title}
                    from_datetime={availableEvents[0].from_datetime}
                    to_datetime={availableEvents[0].to_datetime}
                    picture_url={availableEvents[0].picture_url}/>
            </VStack> */}

    </Wrapper>
  ))
}