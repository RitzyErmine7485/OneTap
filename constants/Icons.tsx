import { Ionicons } from "@expo/vector-icons"
import { StyleSheet } from "react-native"

export const icon = {
    dashboard: ({ color }: { color: string}) => ( <Ionicons name="home-outline" size={ 20 } color={ color } /> ),
    upload: ({ color }: { color: string}) => ( <Ionicons name="add-circle-outline" size={ 30 } color={ color } /> ),
    report: ({ color }: { color: string}) => ( <Ionicons name="bar-chart-outline" size={ 20 } color={ color } /> ),
}

const styles = StyleSheet.create({
    profile: {
        height: 24,
        width: 24,
        borderRadius: 20,
    }
})