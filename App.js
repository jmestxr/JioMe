import React from "react";
import { View, Text, NativeBaseProvider } from "native-base";
import SignInPage from "./app/SignInPage";

const App = () => {
  return (
    <NativeBaseProvider>
      <SignInPage />
    </NativeBaseProvider>
  )
}

export default App;
