import React, { useState } from 'react';
import { ScrollView, View, Text, Button, StyleSheet, Alert, ActivityIndicator } from 'react-native';

// --- CONFIGURATION ---
const BASE_URL = 'http://ec2-63-178-67-11.eu-central-1.compute.amazonaws.com:8000'; // REPLACE with your actual local IP and port (e.g., 10.0.2.2 for Android emulator)
const headers = {
  'Content-Type': 'application/json',
};

// --- HELPER FUNCTION: Request Logic ---
const postResource = async (endpoint, data) => {
  const url = `${BASE_URL}${endpoint}`;
  console.log(`POSTing to: ${url}`);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.ok) {
      return { success: true, data: responseData };
    } else {
      // Handle 4xx, 5xx errors from FastAPI
      return { success: false, error: responseData.detail || 'Unknown API Error' };
    }
  } catch (error) {
    // Handle network errors (server not running, wrong IP)
    return { success: false, error: `Network Error: ${error.message}` };
  }
};

// --- MAIN COMPONENT ---
const AdminDemoScreen = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  // Simplified Dummy Data for POST requests
  const demoData = [
    { 
      name: "Course", 
      endpoint: "/courses", 
      data: { 
        title: "ReactNative Course Demo", 
        description: "A course created via admin panel." 
      }
    },
    { 
      name: "Chapter", 
      endpoint: "/chapters", 
      data: { 
        title: "Chapter 1: Admin Test", 
        content_order: 1 
      }
    },
    { 
      name: "Video", 
      endpoint: "/videos", 
      data: { 
        title: "Demo Video Lecture", 
        url: "https://example.com/demo-lecture.mp4",
        duration_minutes: 10 
      }
    },
    { 
      name: "Image", 
      endpoint: "/images", 
      data: { 
        title: "Demo Image Diagram", 
        url: "https://example.com/demo-diagram.jpg"
      }
    },
    { 
      name: "Text", 
      endpoint: "/texts", 
      data: { 
        title: "Demo Reading Text", 
        content: "This is a test paragraph uploaded from the admin demo screen." 
      }
    },
    { 
      name: "Quiz", 
      endpoint: "/quizzes", 
      data: { 
        title: "Demo Quiz Assessment", 
        time_limit_minutes: 20 
      }
    },
    { 
      name: "Question", 
      endpoint: "/questions", 
      data: { 
        text: "Was this POST request successful?", 
        type: "boolean" 
      }
    },
    { 
      name: "Flashcard", 
      endpoint: "/flashcards", 
      data: { 
        front_text: "Front: Demo Term", 
        back_text: "Back: Demo Definition" 
      }
    },
  ];

  // --- HANDLER: Runs all POST requests sequentially ---
  const runAllPosts = async () => {
    if (loading) return;

    setLoading(true);
    setResults([]);
    let allPassed = true;

    for (const item of demoData) {
      const result = await postResource(item.endpoint, item.data);
      
      const newResult = {
        name: item.name,
        endpoint: item.endpoint,
        status: result.success ? 'SUCCESS' : 'FAILURE',
        response: result.success ? JSON.stringify(result.data, null, 2) : result.error,
      };
      
      if (!result.success) {
        allPassed = false;
      }

      setResults(prevResults => [...prevResults, newResult]);
    }
    
    setLoading(false);
    Alert.alert(
      "Demo Complete", 
      allPassed ? "All POST requests were successful!" : "One or more POST requests failed. Check logs."
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>FastAPI Admin POST Demo</Text>
      
      <Button 
        title={loading ? "Running..." : "Run All POST Methods"} 
        onPress={runAllPosts} 
        disabled={loading}
      />
      {loading && <ActivityIndicator size="small" color="#0000ff" style={{ marginVertical: 10 }} />}
      
      <ScrollView style={styles.resultsContainer}>
        {results.length === 0 && !loading && (
          <Text style={styles.infoText}>Press 'Run All POST Methods' to start the demonstration.</Text>
        )}
        
        {results.map((item, index) => (
          <View key={index} style={[styles.resultBox, item.status === 'FAILURE' ? styles.failure : styles.success]}>
            <Text style={styles.resultHeader}>[{item.status}] - {item.name}</Text>
            <Text style={styles.resultEndpoint}>{item.endpoint}</Text>
            <Text style={styles.resultBody}>{item.response}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  resultsContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  infoText: {
    marginTop: 20,
    color: '#666',
    textAlign: 'center',
  },
  resultBox: {
    padding: 10,
    marginVertical: 8,
    borderRadius: 5,
    borderLeftWidth: 5,
    elevation: 2,
    backgroundColor: '#fff',
  },
  success: {
    borderLeftColor: '#4CAF50', // Green
  },
  failure: {
    borderLeftColor: '#F44336', // Red
  },
  resultHeader: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultEndpoint: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  resultBody: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#333',
    whiteSpace: 'pre-wrap', // Allows JSON to wrap
  },
});

export default AdminDemoScreen;