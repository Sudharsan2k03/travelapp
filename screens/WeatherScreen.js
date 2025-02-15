import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import weather icons

const API_KEY = 'c66be348dd685af5d09b8dddeb08148b';

export default function WeatherScreen({ route }) {
  const { city } = route.params || {};
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (city) {
      fetchWeather(city);
    } else {
      setLoading(false);
    }
  }, [city]);

  const fetchWeather = async (cityName) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      
      if (data.cod === 200) {
        setWeather(data);
      } else {
        setWeather(null);
        alert("City not found. Please try again.");
      }
    } catch (error) {
      alert("Error fetching weather data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={{ uri: 'https://source.unsplash.com/1600x900/?weather' }} 
      style={styles.background}
    >
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : weather ? (
          <View style={styles.weatherContainer}>
            <Ionicons name="partly-sunny" size={80} color="yellow" />
            <Text style={styles.city}>{weather.name}</Text>
            <Text style={styles.temperature}>{weather.main.temp}°C</Text>
            <Text style={styles.description}>{weather.weather[0].description}</Text>
            <Text style={styles.info}>Humidity: {weather.main.humidity}%</Text>
          </View>
        ) : (
          <Text style={styles.errorText}>No weather data available.</Text>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  weatherContainer: { alignItems: 'center', padding: 20, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 10 },
  city: { fontSize: 36, fontWeight: 'bold', color: 'white', marginVertical: 10 },
  temperature: { fontSize: 50, fontWeight: 'bold', color: 'yellow' },
  description: { fontSize: 24, fontStyle: 'italic', color: 'white' },
  info: { fontSize: 20, color: 'white', marginTop: 10 },
  errorText: { fontSize: 18, color: 'red', textAlign: 'center' }
});
