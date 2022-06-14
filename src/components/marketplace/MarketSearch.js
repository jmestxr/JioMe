import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Icon, Box } from "native-base";
import { MaterialIcons } from "@native-base/icons";

const MarketSearch = (props) => {
    const { placeholder, value, textHandler } = props;

    return (
        <Box alignItems="center">
      <Input 
      mx="20%" 
      _focus={{borderColor:'orange.500'}}
      placeholder={placeholder} 
      w="100%"
      value={value}
      onChangeText={textHandler} />
    </Box>
        // <View style={styles.fieldBox}>
        //     <Icon as={MaterialIcons} name={iconName} color='black' size='lg' marginRight={'3%'}  />
        //     <Input
        //         variant='underlined'
        //         size='lg'
        //         _focus={{borderColor:'orange.500'}}
        //         placeholder={placeholder}
        //         value={value}
        //         secureTextEntry={secureTextEntry}
        //         onChangeText={textHandler}
        //         width='73%'
        //         editable={editable}
        //         />
        // </View>

    )
}

const styles = StyleSheet.create({
    fieldBox: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
      flexWrap:'wrap'
    }
})

export default MarketSearch;