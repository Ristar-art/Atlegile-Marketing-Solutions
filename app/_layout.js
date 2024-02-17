import { Stack } from "expo-router"

const stackLaout = ()=>    {
    return(
        <Stack>
           <Stack.Screen name="(tabs)" options={{headerShown:false}}/> 
            
        </Stack>
    )
}
export default stackLaout;