import React from "react";
import { useDisclose, Stagger, IconButton, Icon, HStack, Center } from "native-base";
import {MaterialIcons, Ionicons} from '@native-base/icons';

export const UpcomingEventCardButtons = (props) => {
    const {
      isOpen,
      onToggle
    } = useDisclose();
    return <Center position='absolute' left={1} top={1}>
        <HStack space={2} style={{transform:[{rotateZ: '180deg'}]}} alignItems="center">
           
          <Stagger visible={isOpen} initial={{
          opacity: 0,
          scale: 0,
          translateX: 34
        }} animate={{
          translateX: 0,
          scale: 1,
          opacity: 1,
          transition: {
            type: "spring",
            mass: 0.8,
            stagger: {
              offset: 30,
              reverse: true
            }
          }
        }} exit={{
          translateX: 34,
          scale: 0.5,
          opacity: 0,
          transition: {
            duration: 100,
            stagger: {
              offset: 30,
              reverse: true
            }
          }
        }}>
             <IconButton 
              style={{transform:[{rotateZ: '180deg'}]}}  
              size="sm"
              bg="red.400" 
              colorScheme="red" 
              borderRadius="full" 
              icon={<Icon as={MaterialIcons} size='xs' name="person-remove" color="white" />}
              onPress={() => alert("Quit event?")}
              />

          </Stagger>

           <IconButton 
            style={{transform:[{rotateZ: '180deg'}]}} 
            borderRadius="full" 
            size="md" 
            onPress={onToggle}
            colorScheme="black"
            bg="gray.400:alpha.30" 
                icon={<Icon as={Ionicons} size='xs' name="ellipsis-vertical-outline" color="white" />} 
            />
          
        </HStack>
       
      </Center>;
  };