import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native"
import { Text } from "native-base";


const CustomButton = (props) => {
    const { title, width, color, onPressHandler, isDisabled } = props;

    return (
        <TouchableOpacity
            style={[styles.button, {width:width, backgroundColor:color}]}
            activeOpacity={0.5}
            disabled={isDisabled}
            onPress={onPressHandler}
        >
            <Text fontSize='md' color='white'>{title}</Text>    
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        height:55, // 10%
        marginTop:'6%',
        borderRadius: 5
    }
});

export default CustomButton;