import React, { useEffect, useState } from "react";
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
} from "react-native";
import { Button, Text, Card } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { APP_ID } from "./keys";
import SplashScreen from "react-native-splash-screen";

export default function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [input, setInput] = useState("");

  // npx react-native run-android

  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const findWeather = () => {
    if (!input) {
      return;
    }

    Keyboard.dismiss();

    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${APP_ID}&units=metric`
    )
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data);
      });

    setInput("");
  };

  const handleShare = async () => {
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
        <View style={styles.inputView}>
          <Icon name="search" size={24} color="white" />
          <TextInput
            placeholder="Enter a location"
            placeholderTextColor="white"
            style={styles.input}
            value={input}
            onChangeText={(text) => setInput(text)}
            onSubmitEditing={findWeather}
          />
        </View>
        <Button
          onPress={findWeather}
          containerStyle={styles.button}
          title="Search"
          raised
        />
      </View>
      {weatherData?.main?.temp && (
        <>
          <View style={styles.result}>
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

            <View style={styles.share}>
              <Button
                onPress={handleShare}
                title="Share this weather forecast"
              />
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2E3040",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  inputContainer: {
    marginTop: 50,
    flex: 0.2,
  },
  input: {
    color: "white",
    width: "100%",
    alignSelf: "center",
  },
  button: {
    width: "70%",
    alignSelf: "center",
  },
  result: {
    flex: 0.8,
    alignItems: "center",
  },
  card: {
    width: 360,
    height: 320,
    borderRadius: 5,
    alignItems: "center",
  },
  inputView: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderColor: "#fff",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: "85%",
    alignSelf: "center",
    borderRadius: 5,
  },
  image: {
    height: 100,
    width: 100,
    alignSelf: "center",
  },
  text: {
    alignSelf: "center",
  },
  title: {
    alignSelf: "center",
  },
  share: {
    marginTop: 60,
    width: "70%",
  },
});
