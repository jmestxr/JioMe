import React, { useState, useEffect } from 'react'
import { Wrapper } from "../components/basic/Wrapper";
import { HeaderTitle } from "../components/basic/HeaderTitle";
import DatePicker from 'react-native-date-picker'
import { supabase } from "../../supabaseClient";
import { Image, Button } from "react-native";
import UploadButton from "../components/auth/UploadButton";
import AuthTextInput from '../components/auth/AuthTextInput';
import { Warning } from "../components/basic/Warning";
import { Text, VStack, Box, IconButton, HStack, Icon, Input, TextArea, ScrollView, Center, Checkbox, Slider, Select, CheckIcon } from "native-base";
import { useAuth } from '../components/contexts/Auth';
import { decode } from 'base64-arraybuffer'

import Avatar from "../components/basic/Avatar";
import { FunctionOpenMenu } from 'native-base/lib/typescript/components/composites/Typeahead/useTypeahead/types';



export const EventFormArchive = () => {
    const { user } = useAuth();

    const [loading, setLoading] = useState(false)
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [startOpen, setStartOpen] = useState(false)
    const [endOpen, setEndOpen] = useState(false)
    const [startDateString, setStartDateString] = useState("")
    const [endDateString, setEndDateString] = useState("")
    const [uploading, setUploading] = useState(false)
    const [eventPic, setEventPic] = useState("")
    const [eventPicPath, setEventPicPath] = useState("")
    const [title, setTitle] = useState("")
    // const [category, setCategory] = useState("") //change?
    const [description, setDescription] = useState("")
    const [location, setLocation] = useState("")
    // const [categories, setCategories] = useState([false, false, false, false, false, false, false, false, false]);
    // const [catString, setCatString] = useState("")
    const [cat, setCat] = useState("")
    // const catList = ["Sports", "Leisure", "Food", "Music", "Study", "Recreational", "Nature", "Extreme", "Others"]
    // const [categoryOpen, setCategoryOpen] = useState(false)
    const [strCapacity, setStrCapacity] = useState("Capacity: 50")
    const [capacity, setCapacity] = useState(50)
    const monthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


    useEffect(() => {
        // let flag = true;
        getProfile()
        // getCategory()
    })

    const getProfile = async (e) => {
        // async function getProfile() {
        try {
            // setLoading(true)
            const user = supabase.auth.user()
            let { data, error } = await supabase
                .from('profiles')
                .select(`neweventpic_url`)
                .eq('id', user.id)
                .single()
            if (error) {
                console.log(error)
                // throw error
            }
            setProfile(data)
        } catch (error) {
            console.log('error', error.message)
        } finally {
            // setLoading(false)
        }
    }

    function setProfile(profile) {
        setEventPicPath(profile.neweventpic_url)
        const { publicURL, error } = supabase
            .storage
            .from('eventpics')
            .getPublicUrl(profile.neweventpic_url)

        setEventPic(publicURL)
    }

    // function getCategory() {
    //     let tempString = ""
    //     for (let index = 0; index < catList.length; index++) {
    //         const element = catList[index];
    //         if (categories[index]) {
    //             if (tempString == "") {
    //                 tempString = tempString + element;
    //             } else {
    //                 tempString = tempString + ", " + element;
    //             }
    //         }
    //     }
    //     setCatString(tempString)
    // }
    // function checks whether to put the default event pic or given one
    function checkEventPic() {
        if (eventPic == null || eventPic == "") {
            // return <Avatar source={require('../assets/profile.png')} size={200} />
            return <Image
                style={{ width: 300, height: 200 }}
                // resizeMode={"contain"}
                // borderRadius={100}
                source={require('../assets/events.jpg')}
            />
        } else {
            //   return <Avatar source={{ uri: avatar }} size={200} />
            return <Image
                source={{
                    uri: eventPic
                }}
                style={{ width: 300, height: 200 }}
            // resizeMode={"contain"}
            // borderRadius={100}
            />
        }
    }

    const uploadPic = async (event) => {
        // event.preventDefault()
        try {
            setUploading(true)

            const base64FileData = event.data

            const filePath = event.path;

            let { error: uploadError } = await supabase.storage
                .from('eventpics')
                .upload(filePath, decode(base64FileData))

            if (uploadError) {
                console.log(uploadError)
                // throw uploadError
            }

            let { error: updateError } = await supabase.from('profiles').upsert({
                id: user.id,
                neweventpic_url: filePath,
            })

            if (updateError) {
                console.log(updateError)
                // throw updateError
            }
        } catch (error) {
            alert(error.message)
        } finally {
            setUploading(false)
        }

    }

    // function checks what button to show for Category
    // function checkCatButton() {
    //     if (categoryOpen) {
    //         return <Button title="Hide" onPress={() => setCategoryOpen(false)} />
    //     } else {
    //         return <Button title="Show" onPress={() => setCategoryOpen(true)} />
    //     }
    // }

    //function checks whether to show the categories
    // function checkCatShow() {
    //     if (categoryOpen) {
    //         return <><HStack alignSelf="center" space={5}>
    //             <Checkbox value="Sports" onChange={state => { let temp = categories; temp[0] = state; setCategories(categories); getCategory(); }}>Sports</Checkbox>
    //             <Checkbox value="Leisure" onChange={state => { let temp = categories; temp[1] = state; setCategories(categories); getCategory(); }}>Leisure</Checkbox>
    //             <Checkbox value="Food" onChange={state => { let temp = categories; temp[2] = state; setCategories(categories); getCategory(); }}>Food</Checkbox>
    //         </HStack><HStack alignSelf="center" space={5}>

    //                 <Checkbox value="Music" onChange={state => { let temp = categories; temp[3] = state; setCategories(categories); getCategory(); }}>Music</Checkbox>
    //                 <Checkbox value="Study" onChange={state => { let temp = categories; temp[4] = state; setCategories(categories); getCategory(); }}>Study</Checkbox>
    //                 <Checkbox value="Recreational" onChange={state => { let temp = categories; temp[5] = state; setCategories(categories); getCategory(); }}>Recreational</Checkbox>
    //             </HStack><HStack alignSelf="center" space={5}>

    //                 <Checkbox value="Nature" onChange={state => { let temp = categories; temp[6] = state; setCategories(categories); getCategory(); }}>Nature</Checkbox>
    //                 <Checkbox value="Extreme" onChange={state => { let temp = categories; temp[7] = state; setCategories(categories); getCategory(); }}>Extreme</Checkbox>
    //                 <Checkbox value="Others" onChange={state => { let temp = categories; temp[8] = state; setCategories(categories); getCategory(); }}>Others</Checkbox>
    //             </HStack></>
    //     }
    // }

    // function checks what the button for capacity do
    // function checkLimitedButton() {
    //     if (strCapacity == "Unlimited") {
    //         return <Button title="Switch" onPress={() => { setStrCapacity("50"); setCapacity(50); }} />
    //     } else {
    //         return <Button title="Switch" onPress={() => { setStrCapacity("Unlimited"); setCapacity(99999); }} />
    //     }
    // }

    // function checks whether to show the slider for capacity
    function checkSlider() {
        // if (strCapacity != "Unlimited") {
        return <Slider minValue={1} defaultValue={50} colorScheme="orange" onChange={v => {
            setStrCapacity("Capacity: " + Math.floor(v).toString());
            setCapacity(Math.floor(v))
        }}>
            <Slider.Track>
                <Slider.FilledTrack />
            </Slider.Track>
            <Slider.Thumb />
        </Slider>
        // }
    }
    // function checks how many characters they can input
    function checkCharacters() {
        let remaining = 1000 - description.length;
        if (remaining < 100) {
            return <Center><Warning warningMessage={remaining < 0 ? "Description is too long" : remaining + " characters remaining."} /></Center>
        }
    }

    // function handles the Event Creation
    const handleCreateEvent = async (e) => {
        if (title == "") {
            alert("Please insert a title")
        } else if (location == "") {
            alert("Please insert a location")
        } else if (startDateString == "") {
            alert("Please enter a start date")
        } else if (endDateString == "") {
            alert("Please enter an end date")
        } else if (cat == "") {
            alert("Please select a category")
        } else if (description.length > 1000) {
            alert("Description is too long")
        } else {
            e.preventDefault()

            setLoading(true)

            try {
                const { data, error } = await supabase
                    .from('events')
                    .insert([{
                        created_at: new Date(), 
                        organiser_id: user.id, 
                        title: title,
                        category: cat,
                        description: description,
                        location: location,
                        from_datetime: startDateString,
                        to_datetime: endDateString,
                        curr_capacity: 1,
                        max_capacity: capacity,
                        picture_url: eventPicPath
                        },])
            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }
            // TO BE COMPLETED
            // Useful information:
            // startDate, endDate, eventPic, title, description, location, cat, capacity


            // checks the Usernames table whether username is in use
            // const {data, count} = await supabase
            //     .from('profiles')
            //     .select('*', { count: 'exact' })
            //     .eq('username', username)

            // if (password.length < 8) {
            //     alert('Error: Your password should have at least 8 characters.')
            // } else if (password != confirmpassword) {
            //     alert('Error: Your passwords do not match.')
            // } else if (count > 0) {
            //     // username taken
            //     alert('Error: Username has already been taken. Please try again.')
            // } else {
            //     const { error } = await signUp({ email, password })
            //     if (error) {
            //         alert('Error: unable to sign up with the email provided. Please enter a different email.')
            //     } else {
            //         // Sign up is successful; proceeds to call signIn function to insert user details into profiles table
            //         handleLogin()
            //     }
            // }  
            setLoading(false)

        }

    }
    return (
        <Wrapper>
            <HeaderTitle title="Event Form" />
            <VStack space={4}>
                <Center>
                    {checkEventPic()}
                </Center>
                <UploadButton onUpload={uploadPic} width={300} height={200} />
                <HStack>
                    <AuthTextInput
                        placeholder='Title'
                        value={title}
                        secureTextEntry={false}
                        textHandler={setTitle}
                        iconName='bookmark-outline'
                    />
                </HStack>
                <HStack>
                    <AuthTextInput
                        placeholder='Location'
                        value={location}
                        secureTextEntry={false}
                        textHandler={setLocation}
                        iconName='pin-drop'
                    />
                </HStack>
                <HStack alignItems="center">
                    <AuthTextInput
                        placeholder='Start Date'
                        value={startDateString}
                        secureTextEntry={false}
                        textHandler={setStartDateString}
                        iconName='schedule'
                        editable={false}
                    />
                    <Button title="Choose" onPress={() => setStartOpen(true)} />
                    <DatePicker
                        modal
                        open={startOpen}
                        date={startDate}
                        minimumDate={new Date()}
                        minuteInterval={15}
                        onConfirm={(date) => {
                            setStartOpen(false)
                            setStartDate(date)
                            setStartDateString(date.getDate() + " " + monthArray[date.getMonth()] + " " + date.getFullYear() + " "
                                + (date.getHours() % 12) + ":" + (date.getMinutes() < 10 ? "00" : date.getMinutes())
                                + " " + (date.getHours() > 11 ? "PM" : "AM"))
                            if (date > endDate) {
                                setEndDate(new Date())
                                setEndDateString("")
                            }
                        }}
                        onCancel={() => {
                            setStartOpen(false)
                        }}
                    />
                </HStack>

                <HStack alignItems="center">
                    <AuthTextInput
                        placeholder='End Date'
                        value={endDateString}
                        secureTextEntry={false}
                        textHandler={setEndDateString}
                        iconName='schedule'
                        editable={false}
                    />
                    <Button title="Choose" onPress={() => setEndOpen(true)} />
                    <DatePicker
                        modal
                        open={endOpen}
                        date={endDate}
                        minimumDate={startDate}
                        minuteInterval={15}
                        onConfirm={(date) => {
                            setEndOpen(false)
                            setEndDate(date)
                            // console.log(date.getMonth())
                            setEndDateString(date.getDate() + " " + monthArray[date.getMonth()] + " " + date.getFullYear() + " "
                                + (date.getHours() % 12) + ":" + (date.getMinutes() < 10 ? "00" : date.getMinutes())
                                + " " + (date.getHours() > 11 ? "PM" : "AM"))
                        }}
                        onCancel={() => {
                            setEndOpen(false)
                        }}
                    />
                </HStack>
                {/* <HStack alignItems="center">
                    <AuthTextInput
                        placeholder='Category'
                        value={catString}
                        secureTextEntry={false}
                        textHandler={setCatString}
                        iconName='help-outline'
                        editable={false}
                    />
                    {checkCatButton()} */}
                {/* <Button title="Choose" onPress={() => setCategoryOpen(true)} /> */}


                {/* </HStack> */}
                <Center>
                    <Box w="full" maxW="350">

                        <Select fontSize={"md"} selectedValue={cat} minWidth="200" accessibilityLabel="Choose a Category" placeholder="Choose a Category" _selectedItem={{
                            bg: "teal.600",
                            endIcon: <CheckIcon size="5" />
                        }} mt={1} onValueChange={itemValue => setCat(itemValue)}>
                            <Select.Item label="Sports" value="Sports" />
                            <Select.Item label="Leisure" value="Leisure" />
                            <Select.Item label="Food" value="Food" />
                            <Select.Item label="Music" value="Music" />
                            <Select.Item label="Study" value="Study" />
                            <Select.Item label="Recreational" value="Recreational" />
                            <Select.Item label="Nature" value="Nature" />
                            <Select.Item label="Extreme" value="Extreme" />
                            <Select.Item label="Others" value="Others" />

                        </Select>
                    </Box>
                </Center>
                {/* {checkCatShow()} */}

                <HStack alignItems="center">
                    <AuthTextInput
                        placeholder='Capacity'
                        value={strCapacity}
                        secureTextEntry={false}
                        textHandler={setStrCapacity}
                        iconName='person-outline'
                        editable={false}
                    />
                    {/* {checkLimitedButton()} */}
                </HStack>
                {checkSlider()}
                <TextArea
                    borderColor="#e8ab8b"
                    size='lg'
                    h="250"
                    placeholder="Description: Tell us more about the activity. (Maximum 1000 Characters)"
                    //   placeholderTextColor="black"
                    value={description}
                    onChangeText={setDescription}
                    _text={{
                        fontSize: "md",
                        fontWeight: "medium",
                        letterSpacing: "lg",
                    }}
                />
                {checkCharacters()}

                {/* <Center>
                    <AuthButton onPressHandler={handleCreateEvent} title='Create Event' isDisabled={loading} />
                </Center> */}
            </VStack>
        </Wrapper>

    )
}