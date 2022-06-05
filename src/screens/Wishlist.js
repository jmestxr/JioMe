import React, { useState, useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, VStack } from "native-base";
import { Wrapper } from "../components/basic/Wrapper";
import { HeaderTitle } from "../components/basic/HeaderTitle";
import { LikedEventCard } from "../components/events/LikedEventCard";
import { Loading } from "../components/basic/Loading";
import { useAuth } from "../components/contexts/Auth";
import { useNavigation } from "@react-navigation/native";
import { useIsFocused } from "@react-navigation/native";
import { supabase } from "../../supabaseClient";

import { handleUnlikeEvent } from "../functions/eventHelpers";


const Wishlist = () => { 
    const navigation = useNavigation(); 
    const isFocused = useIsFocused();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true)

    const [resetCards, setResetCards] = useState(true) // to re-render likedEventCards

    // // To re-render this page
    // const [refresh, setRefresh] = useState(1);
    // const refreshPage = () => {
    //     setRefresh(-refresh);
    // }
    
    
    const [likedEventsId, setLikedEventsId] = useState([])
    const [likedEventsDetails, setLikedEventsDetails] = useState([])

    // useEffect(() => {
        // setLikedEventsId([])
        // setLikedEventsDetails([])
    //     getLikedEventsId()
    //         .then(() => getLikedEventsDetails())
    //         .then(detail => setLikedEventsDetails(oldArray => [...oldArray, ...detail]))
    //     // console.log(likedEventsDetails)
    // }, [isFocused, refresh])

    useEffect(() => {
        setLoading(true)
        // setLikedEventsId([]);
        // setLikedEventsDetails([]);
        getLikedEventsId()
            .then(() => getLikedEventsDetails())
            .then(() => setLoading(false));

        return () => {
            setLikedEventsId([]);
            setLikedEventsDetails([]);
        };
    }, [isFocused])

    const getLikedEventsId = async (e) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('liked_events')
                .eq('id', user.id)
                .single()
            if (error) throw error
            if (data) {
                setLikedEventsId(data.liked_events)
            }
        }
        catch (error) {
            alert(error.error_description || error.message)
        }
    }

    // const getLikedEventsDetails = () => {
    //     return Promise.all(Object.values(likedEventsId).map(async (eventId, index) => {
    //         try {
    //             const { data, error } = await supabase
    //                 .from('events')
    //                 .select('id, title, location')
    //                 .eq('id', eventId)
    //                 .single()
    //             if (error) throw error
    //             if (data) {
    //                 return data;
    //             }
    //         } catch (error) {
    //             alert(error.error_description || error.message);
    //         }
    //     }))
    // }
    const getLikedEventsDetails = async () => {
        Object.values(likedEventsId).map(async (eventId, index) => {
            try {
                const { data, error } = await supabase
                    .from('events')
                    .select('id, title, location, from_datetime, to_datetime, curr_capacity, max_capacity')
                    .eq('id', eventId)
                    .single()
                if (error) throw error
                if (data) {
                    setLikedEventsDetails(oldArray => [...oldArray, data])
                }
            } catch (error) {
                alert(error.error_description || error.message);
            }
        })
    }

// To unlike an event given its id
const unLikeEventHandler = async (eventId) => {
    handleUnlikeEvent(user.id, eventId).then((data) => {
        setLikedEventsDetails(data);
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
                                            capacity={formatAvailCapacity(detail.curr_capacity, detail.max_capacity)}
                                            unlikeHandler={() => {        
                                                unLikeEventHandler(detail.id);
                                                // refreshPage();
                                            }}
                                        />
                            })}
                        </VStack>
                    {/* )} */}
                </View>

            </Wrapper>
        </TouchableOpacity>
    ))
}

export default Wishlist;