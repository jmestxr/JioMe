import React, { useState, useEffect } from "react";
import { Text, HStack, View, VStack } from "native-base"
import Avatar from "../components/basic/Avatar";

import { Wrapper } from "../components/basic/Wrapper";
import { UpcomingEventCard } from "../components/eventCards/UpcomingEventCard";
import { ZeroEventCard } from "../components/eventCards/ZeroEventCard";
import { Loading } from "../components/basic/Loading";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../components/contexts/Auth";
import { supabase } from "../../supabaseClient";
// import sizes from "native-base/lib/typescript/theme/base/sizes";


const Dashboard = () => {
    const navigation = useNavigation(); 
    const isFocused = useIsFocused();
    const { user } = useAuth()

    const [loading, setLoading] = useState(true)

    const [username, setUsername] = useState('')
    const [avatar, setAvatar] = useState("")
    const [upcomingEventsDetails, setUpcomingEventsDetails] = useState(null)

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
                const { data, error } = await supabase
                    .from('events')
                    .select('id, title, location, user_joinedevents!inner(*)')
                    .eq('user_joinedevents.user_id', user.id)
                    if (error) throw error
                if (data) {
                    setUpcomingEventsDetails(Object.values(data));
                }
            } catch (error) {
                alert(error.error_description || error.message);
            }
    }

    return (loading ? <Loading /> : ( 
        <Wrapper>
            <HStack justifyContent='space-between' alignItems='center'>
                <Text fontSize="2xl">Welcome back, {"\n"} {username}!</Text>
                {/* <Avatar source={{ uri: avatar }} size={200} /> */}
                {checkAvatar()}                        
                {/* </Avatar> */}
            </HStack>
            {/* {checkAvatar()} */}
            <View width='100%' alignItems='center' marginTop='15%'>
                <Text fontSize="lg" fontWeight='semibold' marginBottom='3%'>
                    You have {upcomingEventsDetails.length == 0 ? 'no' : upcomingEventsDetails.length} upcoming events.
                </Text>
                {upcomingEventsDetails.length == 0 ? 
                    <ZeroEventCard 
                        imagePath={require('../assets/joined_colored.png')} 
                        textMessage={'Events you have joined will be' + '\n' + 'displayed here.'} /> 
                    : 
                    <VStack width='90%' space={4} alignItems='center'>
                        {upcomingEventsDetails.map((detail, index) => {
                            return <UpcomingEventCard 
                                        key={index}
                                        name={detail.title}
                                        location={detail.location} 
                                        daysToEvent='3 days' 
                                        onPressHandler={() => navigation.navigate('EventPage',  {
                                            eventId: detail.id
                                            }
                                        )}
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