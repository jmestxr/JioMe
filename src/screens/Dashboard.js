import React, { useState, useEffect } from "react";
import { Text, HStack, View, VStack } from "native-base"
import Avatar from "../components/basic/Avatar";

import { Wrapper } from "../components/basic/Wrapper";
import { UpcomingEventCard } from "../components/eventCards/UpcomingEventCard";
import { ZeroEventCard } from "../components/eventCards/ZeroEventCard";
import { Loading } from "../components/basic/Loading";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../components/contexts/Auth";
import { supabase } from "../../supabaseClient";
// import sizes from "native-base/lib/typescript/theme/base/sizes";

import { handleQuitEvent } from "../functions/eventHelpers";
import { getLocalDateTimeNow } from "../functions/helpers";


const Dashboard = () => {
    const isFocused = useIsFocused();
    const { user } = useAuth()

    const [loading, setLoading] = useState(true)

    const [username, setUsername] = useState('')
    const [upcomingEventsDetails, setUpcomingEventsDetails] = useState([])
    const [avatar, setAvatar] = useState("")
    // const [upcomingEventsDetails, setUpcomingEventsDetails] = useState(null)

    useEffect(() => {
        setLoading(true)
        getUsername()
        getUpcomingEventsDetails().then(() => setLoading(false));
    }, [isFocused])

    const getUsername = async (e) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select(`username, avatar_url`)
                .eq('id', user.id)
                .single()
            if (error) throw error
            if (data) {
                setProfile(data)
            }
        }
        catch (error) {
            alert(error.error_description || error.message)
        }
    }

    function setProfile(profile) {
        const { publicURL, error } = supabase
          .storage
          .from('avatars')
          .getPublicUrl(profile.avatar_url)
        // console.log('public url is', publicURL)
    
        setAvatar(publicURL)
        setUsername(profile.username)
      }

      function checkAvatar() {
        if (avatar == null || avatar == "") {
            // return <Text>HELLO</Text>
          return <Avatar source={require('../assets/profile.png')} size={150} />
        } else {
            // return <Text>HI</Text>

          return <Avatar source={{ uri: avatar }} size={150} />
        }
      }
    const getUpcomingEventsDetails = async (e) => {
            try {
                setUpcomingEventsDetails([])

                let { data: participatingData, error: participatingError } = await supabase
                    .from('events')
                    .select('id, title, location, from_datetime, to_datetime, user_joinedevents!inner(*)')
                    .eq('user_joinedevents.user_id', user.id)
                    .gte('to_datetime', getLocalDateTimeNow());
                if (participatingError) throw participatingError
                if (participatingData) {
                    setUpcomingEventsDetails(prevArr => [...prevArr, ...Object.values(participatingData)]);
                }

                let { data: organisingData, error: organisingError } = await supabase
                    .from('events')
                    .select('id, title, location, from_datetime, to_datetime')
                    .eq('organiser_id', user.id)
                    .gte('to_datetime', getLocalDateTimeNow());
                if (organisingError) throw organisingError
                if (organisingData) {
                    setUpcomingEventsDetails(prevArr => [...prevArr, ...Object.values(organisingData)]);
                }
            } catch (error) {
                alert(error.error_description || error.message);
            }
    }

    // To unlike an event given its id
    const quitEventHandler = async (eventId) => {
        handleQuitEvent(user.id, eventId).then(() => getUpcomingEventsDetails());
    }

    // calculate exact difference in hours (timestamp - now)
    const getHourDifference = (now, givenTimestamp) => {
        const nowDt = new Date(now);
        const givenDt = new Date(givenTimestamp);
        let hourDiff =(givenDt.getTime() - nowDt.getTime()) / 1000;
        hourDiff /= (60 * 60);
        return hourDiff > 0 ? Math.abs(hourDiff) + 8 : -Math.abs(hourDiff);

    }

    // for display on UpcomingEventCard
    const displayTimeDifference = (hourDifference) => {
        if (Math.abs(hourDifference) > 24) {
            return hourDifference > 0 
                ? 'Starts in ' + Math.floor(hourDifference / 24).toString() + ' days'
                : 'Ongoing'
        }
        return hourDifference > 0 
            ? 'Starts in ' + Math.floor(hourDifference).toString() + ' hours'
            : 'Ongoing'
    }

    return (loading ? <Loading /> : ( 
        <Wrapper contentViewStyle={{width:'95%', paddingTop:'3%'}} statusBarColor='#ea580c'>
            <HStack justifyContent='space-between' alignItems='center'>
                <Text fontSize="2xl">Welcome back, {"\n"} {username}!</Text>
                {/* <Avatar source={{ uri: avatar }} size={200} /> */}
                {checkAvatar()}                        
                {/* </Avatar> */}
            </HStack>
            {/* {checkAvatar()} */}
            <View width='100%' alignItems='center' marginTop='15%'>
                <Text fontSize="lg" fontWeight='medium' marginBottom='3%'>
                    You have {upcomingEventsDetails.length == 0 ? 'no' : upcomingEventsDetails.length} upcoming events.
                </Text>
                {upcomingEventsDetails.length == 0 ? 
                    <ZeroEventCard 
                        imagePath={require('../assets/koala_join.png')} 
                        imageWidth={225}
                        imageHeight={225}
                        textMessage={'Events you have joined will be' + '\n' + 'displayed here.'} /> 
                    : 
                    <VStack width='90%' space={4} alignItems='center'>
                        {upcomingEventsDetails.map((detail, index) => {
                            // {displayTimeDifference(getHourDifference(detail.from_datetime, Date.now()))}
                            return <UpcomingEventCard
                                        key={index}
                                        id={detail.id}
                                        name={detail.title}
                                        location={detail.location} 
                                        daysToEvent={displayTimeDifference(getHourDifference(getLocalDateTimeNow(), detail.from_datetime))}
                                        quitEventHandler={() => quitEventHandler(detail.id)}
                                    />
                        })}
                    </VStack>
                }
            </View>
        </Wrapper>
        )   
      )
}

export default Dashboard;