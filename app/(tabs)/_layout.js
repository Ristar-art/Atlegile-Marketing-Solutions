import { Tabs } from "expo-router"

export default ()=>{
    return(
        <Tabs>
            <Tabs.Screen name="Landing"/>
            <Tabs.Screen name="About"/>
        </Tabs>
    )
}