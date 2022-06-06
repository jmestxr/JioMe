import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, VStack } from "native-base";
import { Wrapper } from "../components/basic/Wrapper";
import { HeaderTitle } from "../components/basic/HeaderTitle";
import { LikedEventCard } from "../components/events/LikedEventCard";
import { Loading } from "../components/basic/Loading";
import { useAuth } from "../components/contexts/Auth";
import { useIsFocused } from "@react-navigation/native";
import { supabase } from "../../supabaseClient";

import { handleUnlikeEvent } from "../functions/eventHelpers";
import { getEventCurrCapacity } from "../functions/eventHelpers";


const Wishlist = () => { 
    const isFocused = useIsFocused();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true)

    const [resetCards, setResetCards] = useState(true) // to re-render likedEventCards
    
    const [likedEventsDetails, setLikedEventsDetails] = useState(null)

    useEffect(() => {
        setLoading(true)
        getLikedEventsDetails().then(() => setLoading(false));
    }, [isFocused])


    const getLikedEventsDetails = async (e) => {
        try {
            const { data, count, error } = await supabase
                .from('events')
                .select('id, title, location, from_datetime, to_datetime, curr_capacity, max_capacity, user_likedevents!inner(*)')
                .eq('user_likedevents.user_id', user.id)
            
                // .from('user_joinedevents')
                // .select('event_id, events!inner(*, user_likedevents!inner(*))', { count: 'exact' })
                // .eq('user_likedevents.user_id', user.id)
                // .eq('events.id', 'event_id')

            
                if (error) throw error
            if (data) {
                setLikedEventsDetails(Object.values(data));
                console.log(data)
                console.log(count)
            }
        } catch (error) {
            alert(error.error_description || error.message);
        }
    }

// To unlike an event given its id
const unLikeEventHandler = async (eventId) => {
    handleUnlikeEvent(user.id, eventId).then(() => getLikedEventsDetails()).then(() => {
        setResetCards(!resetCards)
        alert('Removed event from wishlist.');
    });
}

const formatEventPeriod = (fromTimeStamp, toTimeStamp) => {
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

    const from = new Date(fromTimeStamp);
    const to = new Date(toTimeStamp);
    const fromDate = fromTimeStamp.slice(0, 10);
    const toDate = toTimeStamp.slice(0, 10);

    const fromTimeString = String(from.getUTCHours()).padStart(2, '0') + String(from.getMinutes()).padStart(2, '0');
    const toTimeString = String(to.getUTCHours()).padStart(2, '0') + String(to.getMinutes()).padStart(2, '0');


    if (fromDate == toDate) { // if event only lasts within the same day
        return from.getDate() + ' ' + month[from.getMonth()] + ' ' + from.getFullYear() + '\n' +
                '(' + fromTimeString + ' - ' + toTimeString + ' hrs)';
    } else {
        return from.getDate() + ' ' + month[from.getMonth()] + ' ' + from.getFullYear() + ' (' + fromTimeString + ' hrs)' +
                ' - ' + '\n' +
                to.getDate() + ' ' + month[to.getMonth()] + ' ' + to.getFullYear() +
                ' (' + toTimeString + ' hrs)';
    }
}

const formatAvailCapacity = (currCapacity, maxCapacity) => {
    const availCapacity = maxCapacity - currCapacity;
    return availCapacity.toString() + '/' + maxCapacity.toString() + ' available';
}


    return (loading ? <Loading /> : ( 
        <TouchableOpacity style={{height:'100%', width:'100%'}} activeOpacity={1} onPress={() => {setResetCards(!resetCards)}}>

            <Wrapper>
                <HeaderTitle title="My Liked Events" />


                <View width='100%' alignItems='center' marginTop='5%'>
                    <Text fontSize="lg" fontWeight='semibold' marginBottom='3%'>
                        You have {likedEventsDetails.length == 0 ? 'no' : likedEventsDetails.length} liked events.
                    </Text>
                    {/* {likedEventsCards.length == 0 ? <SquareNav /> : ( */}
                        <VStack width='100%' space={4}>
                            {likedEventsDetails.map((detail, index) => {
                                return <LikedEventCard 
                                            key={index}
                                            reset={resetCards} 
                                            eventId={detail.id}
                                            title={detail.title}
                                            location={detail.location} 
                                            time={formatEventPeriod(detail.from_datetime, detail.to_datetime)}
                                            // capacity={formatAvailCapacity(detail.curr_capacity, detail.max_capacity)}
                                            // capacity={getEventCurrCapacity(detail.id)}
                                            unlikeHandler={() => {        
                                                unLikeEventHandler(detail.id);
                                            }}
                                        />
                            })}
                        </VStack>
                    {/* )}  */}
                    
                </View>

            </Wrapper>
        </TouchableOpacity>
    ))
}

export default Wishlist;