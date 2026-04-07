import React, { useState, useEffect } from 'react'
import {  View,  Text,  Button,  Image,  TextInput,  FlatList,  TouchableOpacity,  ActivityIndicator,
  StyleSheet,  KeyboardAvoidingView,  Platform,  SafeAreaView,} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { collection, addDoc, onSnapshot, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from './firebase'

const Posts = () => {
  const [image, setImage] = useState(null)
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [posts, setPosts] = useState([])
  const [comment, setComment] = useState('')
  const [permissionsGranted, setPermissionsGranted] = useState(false)

  useEffect(() => {
    ;(async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        alert('Sorry, we need media library permissions to make this work!')
      } else {
        setPermissionsGranted(true)
      }
    })()

    const unsubscribe = onSnapshot(collection(db, 'posts'), snapshot => {
      const fetchedPosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setPosts(fetchedPosts.sort((a, b) => b.createdAt?.toDate() - a.createdAt?.toDate()))
    })
    return () => unsubscribe()
  }, [])

  const pickImage = async () => {
    if (!permissionsGranted) {
      alert('Permission not granted')
      return
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    })
    if (!result.canceled && result.assets?.length > 0) {
      setImage(result.assets[0])
    }
  }

  const handleUpload = async () => {
    if (!image || !caption.trim()) {
      alert('Please select an image and enter a caption.')
      return
    }
    try {
      setUploading(true)
      const response = await fetch(image.uri)
      const blob = await response.blob()
      const imageName = `post_Images/${Date.now()}_${image.uri.split('/').pop()}`
      const storageRef = ref(storage, imageName)
      const uploadTask = uploadBytesResumable(storageRef, blob)

      await new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          error => {
            console.error('Upload failed:', error.message)
            alert('Image upload failed.')
            setUploading(false)
            reject(error)
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
            await addDoc(collection(db, 'posts'), {
              imageUrl: downloadURL,
              caption,
              likes: 0,
              comments: [],
              createdAt: new Date(),
            })
            resolve()
          }
        )
      })

      setImage(null)
      setCaption('')
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed, check your internet or Firebase rules.')
    } finally {
      setUploading(false)
    }
  }

  const handleDeletePost = async (postId, imageUrl) => {
    try {
  
      const urlParts = imageUrl.split('%2F')
      const imagePath = decodeURIComponent(urlParts.slice(1).join('/').split('?')[0])
      const storageRef = ref(storage, imagePath)
      await deleteObject(storageRef)
    } catch (err) {
      
      console.log('Image delete error:', err)
    }
    try {
      await deleteDoc(doc(db, 'posts', postId))
    } catch (err) {
      console.error('Delete post error:', err)
    }
  }

  const handleLike = async (postId, currentLikes) => {
    const postRef = doc(db, 'posts', postId)
    await updateDoc(postRef, { likes: currentLikes + 1 })
  }

  const handleComment = async postId => {
    if (!comment.trim()) return
    const postRef = doc(db, 'posts', postId)
    const post = posts.find(p => p.id === postId)
    const newComments = [...(post.comments || []), comment]
    await updateDoc(postRef, { comments: newComments })
    setComment('')
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
       
        <View style={styles.header}>
          <Image source={require('./pictures/Bethellogo.jpg')} style={styles.logo} />
          <Text style={styles.headerText}>Welcome to Bethel Community Posts</Text>
          <Text style={styles.subHeaderText}>
            Share your ads, events, and community updates with everyone!
          </Text>
        </View>

       
        <View style={styles.form}>
          <Button title="Pick an Image" onPress={pickImage} />
          {image && <Image source={{ uri: image.uri }} style={styles.imagePreview} />}
          <TextInput
            placeholder="Enter caption or ad content"
            value={caption}
            onChangeText={setCaption}
            style={styles.input}
          />
          <Button title="Upload Post" onPress={handleUpload} disabled={uploading} />
          {uploading && <ActivityIndicator size="large" color="blue" />}
        </View>
        <FlatList
          data={posts}
          keyExtractor={item => item.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.post}>
              <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
              <Text style={styles.caption}>{item.caption}</Text>
              <TouchableOpacity onPress={() => handleLike(item.id, item.likes)}>
                <Text style={styles.likeButton}>👍 Like ({item.likes})</Text>
              </TouchableOpacity>
              <TextInput
                placeholder="Add a comment"
                value={comment}
                onChangeText={setComment}
                onSubmitEditing={() => handleComment(item.id)}
                style={styles.commentInput}
              />
              {item.comments?.map((c, index) => (
                <Text key={index} style={styles.comment}>
                  💬 {c}
                </Text>
              ))}
              <TouchableOpacity
                style={styles.deletePostButton}
                onPress={() => handleDeletePost(item.id, item.imageUrl)}
              >
                <Text style={styles.deleteText}>Delete Post</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, paddingTop: 50, backgroundColor: '#fff' },

  header: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
  subHeaderText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: 20,
  },

  form: { marginBottom: 20 },
  imagePreview: { width: '100%', height: 200, marginVertical: 10, borderRadius: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 10, borderRadius: 5 },
  post: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
  postImage: { width: '100%', height: 200, borderRadius: 5 },
  caption: { marginTop: 10, fontWeight: 'bold' },
  likeButton: { color: 'blue', marginTop: 25 },
  commentInput: {
    borderBottomWidth: 1,
    borderColor: '#aaa',
    marginTop: 10,
    padding: 5,
    borderRadius: 3,
  },
  comment: { fontStyle: 'italic', marginTop: 5 },
  deleteText: { color: 'red', fontWeight: 'bold', marginTop: 10 },
  deletePostButton: {
    alignItems: 'center',
    marginTop: 10,
    backgroundColor: '#ffe5e5',
    padding: 8,
    borderRadius: 4,
  },
})

export default Posts
