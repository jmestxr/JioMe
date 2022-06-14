import React, { useState, useEffect } from "react";
import { Wrapper } from "../components/basic/Wrapper";
import { HeaderTitle } from "../components/basic/HeaderTitle";
import { Loading } from "../components/basic/Loading";
import { VStack, IconButton, Text, HStack, Center } from "native-base"
import { supabase } from "../../supabaseClient";
import { MaterialIcons } from "@native-base/icons";
import { useAuth } from '../components/contexts/Auth';
import EventFormat from "../components/marketplace/EventFormat";
import { ZeroEventCard } from "../components/eventCards/ZeroEventCard";





export const Marketplace = () => {
    const { user } = useAuth();

    const [loading, setLoading] = useState(true)
    const [filtering, setFiltering] = useState(false)
    const [availableEvents, setAvailableEvents] = useState([])


    useEffect(() => {
        // let flag = true;
        getEvents().then(() => setLoading(false))
      })

      const getEvents = async (e) => {
        try {
          // setLoading(true)
  
          let { data, error } = await supabase
            .from('events')
            .select(`id, title, from_datetime, to_datetime, picture_url`)
  
          if (error) {
            console.log(error)
            throw error
          }
        if (data) {
            setAvailableEvents(data.sort((a, b) => a.from_datetime > b.from_datetime))
        }
        } catch (error) {
          console.log('error', error.message)
        } finally {
          // setLoading(false)
        }
      }

    const searchEvents = async (e) => {
        console.log('Searching')
    }

    const filterEvents = async (e) => {
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
        console.log('Filtering')
        console.log(availableEvents[0].id)

    }


    return (loading ? <Loading /> : ( 
        <Wrapper>
            <Center>
                <HStack space={2} justifyContent='space-between' alignItems='center'>
                    <Text fontSize='2xl' textAlign='right'>Available Events </Text>
                    <IconButton onPress={searchEvents} size="lg" _icon={{
                        as: MaterialIcons,
                        name: "search",
                        color: "#e8ab8b"
                    }} ></IconButton>
                    <IconButton onPress={filterEvents} size="lg" _icon={{
                        as: MaterialIcons,
                        name: "filter-list",
                        color: "#e8ab8b"
                    }} ></IconButton>
                </HStack>
            </Center>
            {availableEvents.length == 0 ? 
                    <ZeroEventCard 
                        imagePath={require('../assets/joined_colored.png')} 
                        textMessage={'Available events will be displayed here.'} /> 
                    : 
                    availableEvents.map((detail) => {
                        return <EventFormat
                        id={detail.id}
                        title={detail.title}
                        from_datetime={detail.from_datetime}
                        to_datetime={detail.to_datetime}
                        picture_url={detail.picture_url}/>
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