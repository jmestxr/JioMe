import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native"
import { Text } from "native-base";


const AuthButton = (props) => {
    const { onPressHandler, title } = props;

    return (
        <TouchableOpacity
            style={styles.button}
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
        backgroundColor: '#f97316', // orange.500
        height:50, // 10%
        width:100, // 30%
        marginTop:'6%',
        borderRadius: 5
    }
});

export default AuthButton;