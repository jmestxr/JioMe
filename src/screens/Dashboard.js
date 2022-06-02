import React, { useState, useEffect } from "react";
import { useAuth } from "../components/contexts/Auth";
import { Text, HStack, View, Avatar, VStack } from "native-base"
import { Wrapper } from "../components/basic/Wrapper";
import { SquareNav } from "../components/dashboard/SquareNav";
import { UpcomingEventCard } from "../components/events/UpcomingEventCard";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../supabaseClient";


const Dashboard = () => {
    const navigation = useNavigation(); 

    const [username, setUsername] = useState('')
    const [upcomingEventsId, setUpcomingEventsId] = useState([])
    const [upcomingEventsCards, setUpcomingEventsCards] = useState([])

    const { user } = useAuth()

    useEffect(() => {
        getUsername();
    }, [])


    useEffect(() => {
        getUpcomingEventsId().then(() => getUpcomingEventsCards()).then(cards => setUpcomingEventsCards(cards))
    }, [upcomingEventsCards])


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

    const getUpcomingEventsId = async (e) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('upcoming_events')
                .eq('id', user.id)
                .single()
            if (error) throw error
            if (data) {
                setUpcomingEventsId(data.upcoming_events)
            }
        }
        catch (error) {
            alert(error.error_description || error.message)
        }
    }

    const getUpcomingEventsCards = () => {
        return Promise.all(Object.values(upcomingEventsId).map(async (eventId, index) => {
            try {
                const { data, error } = await supabase
                    .from('events')
                    .select('title, location')
                    .eq('id', eventId)
                    .single()
                if (error) throw error
                if (data) {
                    return <UpcomingEventCard 
                                name={data.title} 
                                location={data.location} 
                                daysToEvent='3 days' 
                                onPressHandler={() => navigation.navigate('EventPage',  {
                                        eventId: eventId
                                    }
                                )}
                            />
                }
            } catch (error) {
                alert(error.error_description || error.message);
            }
        }))
    }
    

    return (
        <Wrapper>
            <HStack justifyContent='space-between' alignItems='center'>
                <Text fontSize="2xl">Welcome back, {"\n"} {username}!</Text>
                <Avatar bg="gray.300" size="xl" marginRight="3%" source={{uri: ''}}>
                        JM
                </Avatar>
            </HStack>
 
            <View width='100%' alignItems='center' marginTop='15%'>
                <Text fontSize="lg" fontWeight='semibold' marginBottom='3%'>You have {upcomingEventsCards.length == 0 ? 'no' : upcomingEventsCards.length} upcoming events.</Text>
                {upcomingEventsCards.length == 0 ? <SquareNav /> : (
                    <VStack width='90%' space={4} alignItems='center'>
                        {upcomingEventsCards.map((card, index) => {
                            return card;
                        })}
                    </VStack>
                )}
            </View>
        </Wrapper>
      )
}

export default Dashboard;