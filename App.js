import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Calendar } from 'react-native-calendars';

const Stack = createStackNavigator();

const HomeScreen = ({ navigation }) => {
  const [waterTaken, setWaterTaken] = useState(0);
  const [selectedDrink, setSelectedDrink] = useState(null);
  const [waterRecord, setWaterRecord] = useState([]);
  const [totalWater, setTotalWater] = useState(0);
  const [totalCaffeine, setTotalCaffeine] = useState(0);
  const [weight, setWeight] = useState('');
  const [waterNeeded, setWaterNeeded] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null); // New state variable for selected date
  const [markedDates, setMarkedDates] = useState({});
  const [drinkName, setDrinkName] = useState('');
  const [drinkCaffeine, setDrinkCaffeine] = useState('');

  const handleWaterInputChange = (text) => {
    const amount = parseInt(text);
    setWaterTaken(amount ? amount : 0);
  };

  const handleDrinkSelection = (drink) => {
    setSelectedDrink(drink);
  };

  const handleRecordWater = () => {
    const record = {
      water: waterTaken,
      caffeineDrink: selectedDrink ? selectedDrink.name : 'None',
      caffeine: selectedDrink ? selectedDrink.caffeine : 0,
      timestamp: new Date().toLocaleString(),
    };
    setWaterRecord((prevRecords) => [record, ...prevRecords]);
    setWaterTaken(0);
    setSelectedDrink(null);
    setTotalWater((prevTotal) => prevTotal + waterTaken);
    setTotalCaffeine((prevCaffeine) => prevCaffeine + (selectedDrink ? selectedDrink.caffeine : 0));
    updateMarkedDates(); // Call the function to update marked dates
  };

  const handleReset = () => {
    setWaterRecord([]);
    setTotalWater(0);
    setTotalCaffeine(0);
  };

  const handleWeightInputChange = (text) => {
    setWeight(text);
  };

  const handleCalculateWaterIntake = () => {
    const weightInKg = parseFloat(weight);
    if (!isNaN(weightInKg)) {
      const waterIntake = Math.ceil(weightInKg * 30); // Adjust the multiplier as per your calculation formula
      setWaterNeeded(waterIntake);
    }
  };

  const calculateWaterNeeded = () => {
    if (selectedDrink) {
      const caffeineIntake = waterTaken;
      const waterNeeded = Math.ceil(caffeineIntake / 100) * 250;
      return waterNeeded;
    }
    return waterTaken;
  };

  const navigateToWaterInfoPage = () => {
    navigation.navigate('WaterInfo');
  };

  const updateMarkedDates = () => {
    if (selectedDate) {
      const markedDatesCopy = { ...markedDates };
      markedDatesCopy[selectedDate] = { selected: true, marked: true, dotColor: 'green' };
      setMarkedDates(markedDatesCopy);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
  };

  const handleAddCaffeineDrink = () => {
    const newDrink = {
      name: drinkName,
      caffeine: parseInt(drinkCaffeine),
    };
    setSelectedDrink(newDrink);
    setDrinkName('');
    setDrinkCaffeine('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Water Tracker</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Water Taken (ml)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={waterTaken.toString()}
          onChangeText={handleWaterInputChange}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select Caffeine Drink</Text>
        <ScrollView horizontal>
          {caffeineData.map((drink) => (
            <TouchableOpacity
              key={drink.name}
              style={[
                styles.drinkButton,
                selectedDrink === drink && styles.selectedDrinkButton,
              ]}
              onPress={() => handleDrinkSelection(drink)}
            >
              <Text style={styles.drinkButtonText}>{drink.name}</Text>
              <Text style={styles.drinkButtonText}>{drink.caffeine} mg</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Button title="Record Water" onPress={handleRecordWater} />

      <View style={styles.recordContainer}>
        <Text style={styles.recordTitle}>Water Intake Record</Text>
        {waterRecord.map((record, index) => (
          <Text key={index} style={styles.recordText}>
            {record.timestamp} - Water: {record.water} ml, Caffeine Drink: {record.caffeineDrink}, Caffeine: {record.caffeine} mg
          </Text>
        ))}
        {waterRecord.length === 0 && <Text style={styles.recordText}>No records found</Text>}
      </View>

      <Button title="Reset" onPress={handleReset} />

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Weight (kg)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={weight}
          onChangeText={handleWeightInputChange}
        />
      </View>

      <Button title="Calculate Water Intake" onPress={handleCalculateWaterIntake} />

      <Text style={styles.waterNeededText}>
        Water Needed: {waterNeeded} ml per day
      </Text>

      <Button
        title="View Calendar"
        onPress={navigateToWaterInfoPage}
      />
      <View style={styles.addCaffeineDrinkContainer}>
        <Text style={styles.addCaffeineDrinkTitle}>Add Caffeine Drink</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Drink Name</Text>
          <TextInput
            style={styles.input}
            value={drinkName}
            onChangeText={setDrinkName}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Caffeine (mg)</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={drinkCaffeine}
            onChangeText={setDrinkCaffeine}
          />
        </View>
        <Button title="Add Drink" onPress={handleAddCaffeineDrink} />
      </View>
    </ScrollView>
  );
};

const CalendarScreen = ({ markedDates }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Water Intake Calendar</Text>
    <Calendar
      style={styles.calendar}
      markedDates={markedDates}
      onDayPress={(date) => console.log('Selected date:', date)}
    />
  </View>
);

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="WaterInfo" component={CalendarScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  drinkButton: {
    padding: 10,
    backgroundColor: 'lightgray',
    borderRadius: 5,
    marginRight: 10,
  },
  selectedDrinkButton: {
    backgroundColor: 'orange',
  },
  drinkButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recordContainer: {
    marginTop: 20,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  recordTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recordText: {
    fontSize: 16,
    marginBottom: 5,
  },
  waterNeededText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: 'bold',
  },
  calendar: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
  },
  addCaffeineDrinkContainer: {
    marginTop: 20,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
  },
  addCaffeineDrinkTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

const caffeineData = [
  { name: 'Coffee', caffeine: 95 },
  { name: 'Black Tea', caffeine: 47 },
  { name: 'Green Tea', caffeine: 28 },
  { name: 'Cola', caffeine: 24 },
  { name: 'Energy Drink', caffeine: 80 },
];

export default App;
