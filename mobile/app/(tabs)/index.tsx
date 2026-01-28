import { ScrollView, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import SignOutButton from '@/components/social-auth-buttons/sign-out-button'
import { useAuthContext } from '@/hooks/use-auth-context'

export default function HomeScreen() {
  const { profile } = useAuthContext()

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <ThemedView style={styles.container}>
          <ThemedText type="title">Welcome!</ThemedText>

          <ThemedView style={styles.profileContainer}>
            <ThemedText type="subtitle">Username</ThemedText>
            <ThemedText>{profile?.username ?? 'Not set'}</ThemedText>

            <ThemedText type="subtitle">Full name</ThemedText>
            <ThemedText>{profile?.full_name ?? 'Not set'}</ThemedText>
          </ThemedView>

          <SignOutButton />
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    gap: 24,
  },
  profileContainer: {
    gap: 8,
  },
})
