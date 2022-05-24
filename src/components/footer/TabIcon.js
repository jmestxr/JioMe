import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { IconButton, Icon, Text } from "native-base";
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
        <View style={{alignItems:'center', flex:1}}>
            {showLabel ? <Text style={styles.label} fontSize='xs'>{tabName}</Text> : []}
            <IconButton 
                    icon={<Icon as={MaterialIcons} name={iconName} color={color} />}
                    borderRadius="full"
                    _icon={{
                      size: "2xl"
                    }} 
                    _hover={{
                      bg: "orange.600:alpha.20"
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

const styles = StyleSheet.create({
    label: {
        position:'absolute',
        transform:[{translateY:-20}],
        flex:1,
        flexDirection:'row',
    }
});

export default TabIcon;
