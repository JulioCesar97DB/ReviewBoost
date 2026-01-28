import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { ThemedText } from '@/components/themed-text'
import { ThemedView } from '@/components/themed-view'
import { Colors } from '@/constants/theme'
import { useColorScheme } from '@/hooks/use-color-scheme'

export default function LoginScreen() {
  const colorScheme = useColorScheme() ?? 'light'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setIsLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    setIsLoading(false)

    if (error) {
      Alert.alert('Login Error', error.message)
    }
  }

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }

    setIsLoading(true)

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    })

    setIsLoading(false)

    if (error) {
      Alert.alert('Sign Up Error', error.message)
    } else {
      Alert.alert('Success', 'Check your email for the confirmation link')
    }
  }

  const inputStyle = [
    styles.input,
    {
      backgroundColor: colorScheme === 'dark' ? '#2a2a2a' : '#f5f5f5',
      color: Colors[colorScheme].text,
      borderColor: colorScheme === 'dark' ? '#444' : '#ddd',
    },
  ]

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ThemedView style={styles.container}>
          <ThemedText type="title" style={styles.title}>
            ReviewBoost
          </ThemedText>

          <ThemedView style={styles.form}>
            <TextInput
              style={inputStyle}
              placeholder="Email"
              placeholderTextColor={Colors[colorScheme].icon}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              editable={!isLoading}
            />

            <TextInput
              style={inputStyle}
              placeholder="Password"
              placeholderTextColor={Colors[colorScheme].icon}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />

            <Pressable
              style={[styles.button, styles.primaryButton]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <ThemedText style={styles.buttonText}>Login</ThemedText>
              )}
            </Pressable>

            <Pressable
              style={[styles.button, styles.secondaryButton]}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <ThemedText
                style={[styles.buttonText, styles.secondaryButtonText]}
              >
                Create Account
              </ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 48,
  },
  form: {
    gap: 16,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#0a7ea4',
    marginTop: 8,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#0a7ea4',
  },
})
