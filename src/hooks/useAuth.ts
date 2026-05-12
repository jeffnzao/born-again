'use client'

import { useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { auth, db } from '@/lib/firebase'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseUser,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { useAppStore } from '@/store/appStore'

export const useAuth = () => {
  const { setUser, setIsLoading, logout } = useAppStore()
  const queryClient = useQueryClient()

  // Monitor auth state
  useEffect(() => {
    setIsLoading(true)
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // Get user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          setUser({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: userDoc.data().name || firebaseUser.displayName || '',
            role: userDoc.data().role || 'user',
            profileImage: userDoc.data().profileImage,
            church: userDoc.data().church,
            mentorId: userDoc.data().mentorId,
            createdAt: new Date(userDoc.data().createdAt),
            updatedAt: new Date(userDoc.data().updatedAt),
          })
        }
      } else {
        logout()
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [setUser, setIsLoading, logout])

  // Sign in with email
  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const result = await signInWithEmailAndPassword(auth, email, password)
      return result.user
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })

  // Sign up with email
  const signupMutation = useMutation({
    mutationFn: async ({ email, password, name }: { email: string; password: string; name: string }) => {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      const user = result.user

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        role: 'user',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })

      return user
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })

  // Sign out
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await signOut(auth)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })

  // Google Sign-In
  const googleSignInMutation = useMutation({
    mutationFn: async () => {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (!userDoc.exists()) {
        // Create new user document
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName || '',
          email: user.email,
          role: 'user',
          profileImage: user.photoURL,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }

      return user
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth'] })
    },
  })

  return {
    login: loginMutation.mutate,
    signup: signupMutation.mutate,
    logout: logoutMutation.mutate,
    googleSignIn: googleSignInMutation.mutate,
    isLoading:
      loginMutation.isPending ||
      signupMutation.isPending ||
      logoutMutation.isPending ||
      googleSignInMutation.isPending,
    error:
      loginMutation.error ||
      signupMutation.error ||
      logoutMutation.error ||
      googleSignInMutation.error,
  }
}
