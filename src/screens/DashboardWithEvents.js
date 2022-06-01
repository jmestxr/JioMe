import React, { useState, useEffect } from "react";
import { useAuth } from "../components/contexts/Auth";
import { Text, HStack, Icon, Pressable, Square, PresenceTransition, View, Avatar, VStack, Button } from "native-base"
import { Dimensions } from "react-native";
import { Wrapper } from "../components/basic/Wrapper";
import { UpcomingEventCard } from "../components/events/UpcomingEventCard";
import { MaterialIcons } from "@native-base/icons";
import { Ionicons } from "@native-base/icons";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../supabaseClient";

const windowWidth = Dimensions.get('window').width;

const DashboardWithEvents = () => {
    const [username, setUsername] = useState('')

    const navigation = useNavigation(); 

    useEffect(() => {
        getUsername()
    })

    const { user } = useAuth()

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
    
    return (
        <Wrapper>
            <HStack justifyContent='space-between' alignItems='center'>
                <Text fontSize="2xl">Welcome back, {"\n"} {username}!</Text>
                <Avatar bg="gray.300" size="xl" marginRight="3%" source={{uri: ''}}>
                        JM
                </Avatar>
            </HStack>
 
            <View width='100%' alignItems='center' marginTop='15%'>
                <Text fontSize="lg" fontWeight='semibold' marginBottom='3%'>You have 2 upcoming events.</Text>

                <VStack width='90%' space={4} alignItems='center'>
                    <UpcomingEventCard name='Event Name1' location='Event Location1' daysToEvent='3 days' />
                    <UpcomingEventCard name='Event Name2' location='Event Location2' daysToEvent='5 days' />
                </VStack>
            </View>
        </Wrapper>
      )
}

export default DashboardWithEvents;