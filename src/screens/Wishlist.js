import React, { useState, useEffect } from "react";
import { View, Text, VStack } from "native-base";
import { Wrapper } from "../components/basic/Wrapper";
import { HeaderTitle } from "../components/basic/HeaderTitle";
import { LikedEventCard } from "../components/eventCards/LikedEventCard";
import { ZeroEventCard } from "../components/eventCards/ZeroEventCard";
import { Loading } from "../components/basic/Loading";
import { useAuth } from "../components/contexts/Auth";
import { useIsFocused } from "@react-navigation/native";
import { supabase } from "../../supabaseClient";

import { handleUnlikeEvent } from "../functions/eventHelpers";



const Wishlist = () => { 
    const isFocused = useIsFocused();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true)
    
    const [likedEventsDetails, setLikedEventsDetails] = useState(null)
    const [likedEventsCurrCapacity, setLikedEventsCurrCapacity] = useState(null)

    useEffect(() => {
        setLoading(true)
        getLikedEventsDetails()
            .then(() => getLikedEventsCurrCapacity())
            .then(() => setLoading(false));
    }, [isFocused])


    const getLikedEventsDetails = async (e) => {
        try {
            const { data, error } = await supabase
                .from('events')
                .select('*, user_likedevents!inner(*)')
                .eq('user_likedevents.user_id', user.id)            

            if (error) throw error
            if (data) {
                setLikedEventsDetails(Object.values(data));
            }
        } catch (error) {
            alert(error.error_description || error.message);
        }
    }

    // function to get the current capacity of each liked event
    const getLikedEventsCurrCapacity = async (e) => {
        try {
            const { data, error } = await supabase
                .rpc('getcurrcapacityofuserlikedevents', { user_id: user.id })
            
            if (error) throw error
            if (data) {
                setLikedEventsCurrCapacity(data);
            }
        } catch (error) {
            alert(error.error_description || error.message);
        }
    }

// To unlike an event given its id
const unLikeEventHandler = async (eventId) => {
    handleUnlikeEvent(user.id, eventId).then(() => getLikedEventsDetails()).then(() => {
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
            <Wrapper>
                {/* <HeaderTitle title="My Liked Events" /> */}
                
                <View width='100%' alignItems='center' marginTop='5%'>
                    <Text fontSize="lg" fontWeight='medium' marginBottom='3%'>
                        You have {likedEventsDetails.length == 0 ? 'no' : likedEventsDetails.length} liked events.
                    </Text>
                    {likedEventsDetails.length == 0 ? 
                        <ZeroEventCard 
                            imagePath={require('../assets/liked_colored.png')} 
                            imageWidth={225}
                            imageHeight={225}
                            textMessage={'Events you have liked will be' + '\n' + 'displayed here.'} /> 
                        :
                        <VStack width='100%' space={4}>
                            {likedEventsDetails.map((detail, index) => {
                                return <LikedEventCard 
                                            key={index}
                                            eventId={detail.id}
                                            pictureURL={detail.picture_url}
                                            title={detail.title}
                                            location={detail.location} 
                                            time={formatEventPeriod(detail.from_datetime, detail.to_datetime)}
                                            capacity={formatAvailCapacity(likedEventsCurrCapacity[index].no_of_participants, detail.max_capacity)}
                                            unlikeHandler={() => {        
                                                unLikeEventHandler(detail.id);
                                            }}
                                        />
                            })}
                        </VStack>
                    }                     
                </View>

            </Wrapper>
    ))
}

export default Wishlist;