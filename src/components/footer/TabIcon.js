import React, { useState } from "react";
import { View } from "react-native";
import { IconButton, Icon, Text, PresenceTransition } from "native-base";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';


const TabIcon = ({tabName, iconName}) => ({color, onPressHandler, onLongPressHandler}) => {
    const [showLabel, setShowLabel] = useState(false);

    const displayLabel = () => {
        setShowLabel(true);
    }

    const hideLabel = () => {
        setShowLabel(false);
    }

    return (
        <View style={{alignItems:'center', flex:1, marginBottom:'5%'}}>
            <PresenceTransition 
                visible={showLabel} 
                initial={{opacity: 0}} 
                animate={{
                    opacity: 1,
                    transition: {
                      duration: 250
                    }
                 }}
                 >
                <Text fontSize='xs' fontWeight='semibold'>{tabName}</Text>
            </PresenceTransition>
            <IconButton 
                    icon={<Icon as={MaterialIcons} name={iconName} color={color} />}
                    borderRadius="full"
                    _icon={{
                      size: "2xl"
                    }} 
                    _hover={{
                      bg: "orange.600:alpha.20",
                      
                    }} 
                    _pressed={{
                      bg: "orange.600:alpha.20",
                    }}
                    onPress={onPressHandler}
                    onLongPress={() => { displayLabel(); onLongPressHandler();}}
                    onPressOut={hideLabel}
            />
        </View>  
    )
}

export default TabIcon;
