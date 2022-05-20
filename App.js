import React from "react";
import { View, Text, NativeBaseProvider } from "native-base";

const App = () => {
  return (
    <NativeBaseProvider>
      <View>
        <Text>
          Hello
        </Text>
      </View>
    </NativeBaseProvider>
  )
}

export default App;
