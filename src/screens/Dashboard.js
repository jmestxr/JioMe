import React, { useState, useEffect } from "react";
import { Text, HStack, View, Avatar, VStack } from "native-base"
import { Wrapper } from "../components/basic/Wrapper";
import { UpcomingEventCard } from "../components/eventCards/UpcomingEventCard";
import { ZeroEventCard } from "../components/eventCards/ZeroEventCard";
import { Loading } from "../components/basic/Loading";
import { useIsFocused } from "@react-navigation/native";
import { useAuth } from "../components/contexts/Auth";
import { supabase } from "../../supabaseClient";

import { handleQuitEvent } from "../functions/eventHelpers";


const Dashboard = () => {
    const isFocused = useIsFocused();
    const { user } = useAuth()

    const [loading, setLoading] = useState(true)

    const [username, setUsername] = useState('')
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
                .select('username')
                .eq('id', user.id)
                .single()
            if (error) throw error
            if (data) {
                setUsername(data.username)
            }
        }
        catch (error) {
            alert(error.error_description || error.message)
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

    // To unlike an event given its id
    const quitEventHandler = async (eventId) => {
        handleQuitEvent(user.id, eventId).then(() => getUpcomingEventsDetails());
    }

    return (loading ? <Loading /> : ( 
        <Wrapper>
            <HStack justifyContent='space-between' alignItems='center'>
                <Text fontSize="2xl">Welcome back, {"\n"} {username}!</Text>
                <Avatar bg="gray.300" size="xl" marginRight="3%" source={{uri: ''}}>
                        JM
                </Avatar>
            </HStack>
 
            <View width='100%' alignItems='center' marginTop='15%'>
                <Text fontSize="lg" fontWeight='medium' marginBottom='3%'>
                    You have {upcomingEventsDetails.length == 0 ? 'no' : upcomingEventsDetails.length} upcoming events.
                </Text>
                {upcomingEventsDetails.length == 0 ? 
                    <ZeroEventCard 
                        imagePath={require('../assets/joined_colored.png')} 
                        imageWidth={225}
                        imageHeight={225}
                        textMessage={'Events you have joined will be' + '\n' + 'displayed here.'} /> 
                    : 
                    <VStack width='90%' space={4} alignItems='center'>
                        {upcomingEventsDetails.map((detail, index) => {
                            return <UpcomingEventCard 
                                        key={index}
                                        id={detail.id}
                                        name={detail.title}
                                        location={detail.location} 
                                        daysToEvent='3 days' 
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