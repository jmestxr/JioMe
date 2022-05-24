import React from "react";
import { Text } from "native-base"
import { View, ScrollView } from "react-native";

const Dashboard = () => {
    return (
        <View style={{flex: 1}}>
            <ScrollView>
                <Text fontSize='xl'>Dashboard</Text>
            </ScrollView>
      </View>
    )
}

export default Dashboard;