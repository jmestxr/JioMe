import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Icon } from "native-base";
import { MaterialIcons } from "@native-base/icons";

const AuthTextInput = (props) => {
    const { placeholder, value, secureTextEntry, textHandler, iconName } = props;

    return (
        <View style={styles.fieldBox}>
            <Icon as={MaterialIcons} name={iconName} color='black' size='xl' style={{marginRight: '4%'}} />
            <Input
                variant='underlined'
                size='xl'
                _focus={{borderColor:'orange.500'}}
                placeholder={placeholder}
                value={value}
                secureTextEntry={secureTextEntry}
                onChangeText={textHandler}
                />
        </View>

    )
}



const styles = StyleSheet.create({
    fieldBox: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      width: '85%'
    }
})

export default AuthTextInput;