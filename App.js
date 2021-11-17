import React, { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  Share,
  SafeAreaView,
  Platform,
  StyleSheet,
  View,
  StatusBar,
  TextInput,
  Image,
  Pressable,
  Animated,
} from "react-native";
import { Text, Card } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { APP_ID } from "./keys";
import SplashScreen from "react-native-splash-screen";
import * as Haptics from "expo-haptics";

export default function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [input, setInput] = useState("");
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const findWeather = () => {
    if (!input) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    Keyboard.dismiss();

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${APP_ID}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === "404") {
          alert("Location not found!");
        } else {
          setWeatherData(data);
        }
      });

    setInput("");
  };

  const handleShare = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      const result = await Share.share({
        message: `Today the temperature is ${weatherData?.main?.temp}°C and the weather condition is ${weatherData["weather"][0]["description"]} at ${weatherData?.name}.`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar animated={true} backgroundColor="#000" />

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Enter a location"
          placeholderTextColor="white"
          style={styles.input}
          value={input}
          onChangeText={(text) => setInput(text)}
          onSubmitEditing={findWeather}
        />

        <Pressable style={styles.button} onPress={findWeather}>
          <Icon name="search" size={24} color="white" />
        </Pressable>
      </View>

      {weatherData?.main?.temp && (
        <>
          <View style={styles.result}>
            <Animated.View style={{ opacity: fadeAnim }}>
              <Card containerStyle={styles.card}>
                <Text style={styles.title} h3>
                  Location: {weatherData?.name}
                </Text>
                <Text style={styles.text} h4>
                  Temperature: {weatherData?.main?.temp}°C
                </Text>
                <Text style={styles.text} h4>
                  Description: {weatherData["weather"][0]["description"]}
                </Text>
                <Text style={styles.text} h4>
                  Humidity: {weatherData?.main?.humidity}%
                </Text>
                <Text style={styles.text} h4>
                  Visibility: {weatherData?.visibility} meters
                </Text>
                <Text style={styles.text} h4>
                  Pressure: {weatherData?.main?.pressure} hPa
                </Text>
                {weatherData?.main?.temp <= 10.99 && (
                  <Image
                    source={require("./assets/frost.png")}
                    style={styles.image}
                  />
                )}
                {weatherData?.main?.temp <= 20.99 &&
                  weatherData?.main?.temp >= 11 && (
                    <Image
                      source={require("./assets/cold.png")}
                      style={styles.image}
                    />
                  )}
                {weatherData?.main?.temp <= 30.99 &&
                  weatherData?.main?.temp >= 21 && (
                    <Image
                      source={require("./assets/humid.png")}
                      style={styles.image}
                    />
                  )}
                {weatherData?.main?.temp <= 40.99 &&
                  weatherData?.main?.temp >= 31 && (
                    <Image
                      source={require("./assets/hot.png")}
                      style={styles.image}
                    />
                  )}
              </Card>
            </Animated.View>

            <Pressable style={styles.share} onPress={handleShare}>
              <Text style={{ color: "white", fontSize: 20 }}>
                Share this weather forecast
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#040404",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  inputContainer: {
    marginTop: 50,
    flex: 0.2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    color: "white",
    width: "100%",
    alignSelf: "center",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#fff",
    borderWidth: 2,
    marginBottom: 10,
    paddingLeft: 10,
    width: "65%",
    alignSelf: "center",
    borderRadius: 999,
    backgroundColor: "rgba(250, 250, 250, 0.05)",
  },
  button: {
    backgroundColor: "rgba(250, 250, 250, 0.05)",
    height: 50,
    width: 50,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    borderColor: "#fff",
    borderWidth: 2,
  },
  result: {
    flex: 0.8,
    alignItems: "center",
  },
  card: {
    width: 360,
    height: "auto",
    borderRadius: 5,
    alignItems: "center",
    backgroundColor: "rgba(250, 250, 250, 0.05)",
    borderColor: "#fff",
    borderWidth: 2,
  },
  image: {
    height: 100,
    width: 100,
    alignSelf: "center",
    margin: 10,
  },
  text: {
    alignSelf: "center",
    color: "white",
    padding: 6,
  },
  title: {
    alignSelf: "center",
    color: "white",
    padding: 6,
  },
  share: {
    marginTop: 60,
    width: "auto",
    backgroundColor: "rgba(250, 250, 250, 0.05)",
    borderColor: "#fff",
    borderWidth: 2,
    padding: 14,
    borderRadius: 999,
  },
});
