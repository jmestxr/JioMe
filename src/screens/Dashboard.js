import React, { useState, useEffect } from "react";
import { useAuth } from "../components/contexts/Auth";
import { Text, HStack, View, Avatar, VStack } from "native-base"
import { Wrapper } from "../components/basic/Wrapper";
import { SquareNav } from "../components/dashboard/SquareNav";
import { UpcomingEventCard } from "../components/events/UpcomingEventCard";
import { Loading } from "../components/basic/Loading";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { supabase } from "../../supabaseClient";


const Dashboard = () => {
    const navigation = useNavigation(); 
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

    return (loading ? <Loading /> : ( 
        <Wrapper>
            <HStack justifyContent='space-between' alignItems='center'>
                <Text fontSize="2xl">Welcome back, {"\n"} {username}!</Text>
                <Avatar bg="gray.300" size="xl" marginRight="3%" source={{uri: ''}}>
                        JM
                </Avatar>
            </HStack>
 
            <View width='100%' alignItems='center' marginTop='15%'>
                <Text fontSize="lg" fontWeight='semibold' marginBottom='3%'>
                    You have {upcomingEventsDetails.length == 0 ? 'no' : upcomingEventsDetails.length} upcoming events.
                    </Text>
                {upcomingEventsDetails.length == 0 ? <SquareNav /> : (
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
                )}
            </View>
        </Wrapper>
        )   
      )
}

export default Dashboard;