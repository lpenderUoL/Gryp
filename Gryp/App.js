import { StatusBar } from "expo-status-bar";
import {
  TextInput,
  StyleSheet,
  Text,
  View,
  Button,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  FlatList,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Section, TableView } from "react-native-tableview-simple";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import AsyncStorage from "@react-native-community/async-storage";
import React, { useEffect, useState } from "react";
import UserData from "./userdata.json";
import LogInfo from "./log.json";
import JsonGoals from "./goalList.json";
import { ClimbingLogCell } from "./components/ClimbingLogCell.js";
import { GoalItem } from "./components/GoalComp";
import { Picker } from "@react-native-picker/picker";
import CheckBox from "expo-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import Spinner from "react-native-loading-spinner-overlay";
import { WorkOutCell } from "./components/Training";
import { Set } from "./components/Set";

const Stack = createNativeStackNavigator();
const log = JSON.parse(`{
  "Climbing_logs": [
    {
      "entry_name": "This is log 1",
      "date": "23/04/2022",
      "info": "Climbed today on a slab, it went well, fell off 3 times, I am now extending the length of this to check multi line printing",
      "imagePath": "",
      "grade": "4",
      "completed": false
    },
    {
      "entry_name": "This is log 2",
      "date": "",
      "info": "climbed today on an overhand, fell off 10 times ",
      "imagePath": "",
      "grade": "1",
      "completed": false
    },
    {
      "entry_name": "And this is log 3",
      "date": "22/03/2022",
      "info": "blah blah blah",
      "imagePath": "",
      "grade": "2",
      "completed": true
    }
  ]
}`);

const gljson = {
  goal: [
    { title: "Goal 1", date: "2023/03/23", achieved: false },
    { title: "Goal 2", date: "2023/01/23", achieved: false },
  ],
};

// const gl = JSON.parse(gljson);

function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.scrollStyle}>
      <Image
        style={styles.logo}
        source={require("./assets/GrypLogoWhite.png")}
      />
      <Image
        style={styles.homeImage}
        source={require("./assets/homeClimb.jpg")}
      />

      <View style={styles.homeScreenCells}>
        <TouchableOpacity
          style={styles.homeScreenTouchable}
          onPress={() => navigation.navigate("Training")}
        >
          <ImageBackground
            style={styles.homePageImages}
            source={require("./assets/gym.png")}
          />
          <Text style={styles.homeCellText}>Training</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.homeScreenCells}>
        <TouchableOpacity
          style={styles.homeScreenTouchable}
          onPress={() => navigation.navigate("ClimbingLogScreen")}
        >
          <ImageBackground
            style={styles.homePageImages}
            source={require("./assets/logImage.jpg")}
          />
          <Text style={styles.homeCellText}>Climbing Log</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.homeScreenCells}>
        <TouchableOpacity
          style={styles.homeScreenTouchable}
          onPress={() => navigation.navigate("Goals")}
        >
          <ImageBackground
            style={styles.homePageImages}
            source={require("./assets/goals.jpg")}
          />
          <Text style={styles.homeCellText}>Goals</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.homeScreenCells}>
        <TouchableOpacity
          style={styles.homeScreenTouchable}
          onPress={() => navigation.navigate("Setting")}
        >
          <Text style={styles.homeCellText}>Settings</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </ScrollView>
  );
}

function Training({ navigation }) {
  // changed from Calendar to training
  const arr = [
    {
      Name: "Default",
      contents: [
        { name: "Pull up", type: "count", quant: 10 },
        { name: "Push up", type: "count", quant: 10 },
      ],
    },
    {
      Name: "Default 2",
      contents: [
        { name: "Pull up", type: "count", quant: 10 },
        { name: "Push up", type: "count", quant: 10 },
        { name: "Squats", type: "count", quant: 10 },
        { name: "50Kg Reps", type: "count", quant: 10 },
        { name: "Finger hang", type: "time", quant: 20 },
      ],
    },
  ];

  return (
    <View style={styles.scrollStyle}>
      <Image
        style={styles.logo}
        source={require("./assets/GrypLogoWhite.png")}
      />
      <FlatList
        data={arr}
        numColumns={2}
        renderItem={({ item }) => (
          <WorkOutCell
            name={item.Name}
            action={() => navigation.navigate("Work Out", item.contents)}
          />
        )}
      />
    </View>
  );
}

function WorkOut({ route, navigation }) {
  return (
    <ScrollView style={styles.scrollStyle}>
      {route.params.map((item, i) => (
        <Set key={i} name={item.name} quant={item.quant} type={item.type} />
      ))}
    </ScrollView>
  );
}

async function _getGoalValues(k) {
  try {
    const goalJson = await AsyncStorage.getItem(k);
    return JSON.parse(goalJson).goal;
  } catch (e) {
    console.log("failed to laod: " + e);
  }
}

function Goals({ navigation }) {
  const [goalArr, setGoalArr] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await _getGoalValues("@GoalList");
      setGoalArr(data);
    };
    fetchData();
  }, []);

  return (
    <ScrollView style={styles.scrollStyle}>
      <Image
        style={styles.logo}
        source={require("./assets/GrypLogoWhite.png")}
      />
      <TouchableOpacity
        style={styles.newGoal}
        onPress={() => navigation.navigate("New goal")}
      >
        <Text style={styles.newGoalText}>New Goal</Text>
      </TouchableOpacity>
      {goalArr.map((item, i) => (
        <GoalItem
          key={i}
          k={i}
          date={item.date}
          title={item.title}
          achieved={item.achieved}
        />
      ))}
      <GoalItem k={5} date={"2023/03/23"} title={"test"} achieved={true} />
    </ScrollView>
  );
}

function NewGoal({ navigation }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
  };

  const showMode = (currentMode) => {
    setMode(currentMode);
    setShow(true);
  };

  return (
    <View style={styles.scrollStyle}>
      <Text>Goal</Text>
      <TextInput
        style={styles.logNameText}
        onChangeText={async (name) => {
          setName(name);
        }}
        value={name}
        placeholder={""}
      />
      <Text>Deadline Date</Text>
      <DateTimePicker></DateTimePicker>
    </View>
  );
}

function Settings({ navigation }) {
  return (
    <ScrollView style={styles.scrollStyle}>
      <Image
        style={styles.logo}
        source={require("./assets/GrypLogoWhite.png")}
      />
      <Text>Hello {JSONdata.name}</Text>
    </ScrollView>
  );
}

function ClimbingLogScreen({ navigation }) {
  return (
    <ScrollView style={styles.scrollStyle}>
      <Image
        style={styles.logo}
        source={require("./assets/GrypLogoWhite.png")}
      />
      <TableView>
        {LogInfo.Climbing_logs.map((section, i) => (
          <Section
            name={"climbing log"}
            hideSeparator="false"
            separatorTintColor={"transparent"}
            headerComponent
          >
            <ClimbingLogCell
              key={i}
              logEntryName={section.entry_name}
              date={section.date}
              grade={section.grade}
              logInfo={section.info}
              action={() => navigation.navigate("Log Page", { k: i })}
            />
          </Section>
        ))}
      </TableView>
    </ScrollView>
  );
}

function LogPage({ route, navigation }) {
  const { k } = route.params;
  const [name, setName] = useState(LogInfo.Climbing_logs[k].entry_name);
  const [date, setDate] = useState(LogInfo.Climbing_logs[k].date);
  const [info, setInfo] = useState(LogInfo.Climbing_logs[k].info);
  const [image, setImage] = useState(LogInfo.Climbing_logs[k].imagePath);
  const [grade, setGrade] = useState(LogInfo.Climbing_logs[k].grade);
  const [isCompleted, setCompleted] = useState(
    LogInfo.Climbing_logs[k].completed
  );

  return (
    <ScrollView style={styles.logStyle}>
      <View>
        <Text> Log Name</Text>
        <TextInput
          style={styles.logNameText}
          onChangeText={async (name) => {
            setName(name);
          }}
          value={name}
          placeholder={"log " + k}
        />
        <View style={{ flexDirection: "row" }}>
          <Text style={styles.dateText}>{date}</Text>
        </View>

        <View style={styles.pickerView}>
          <Picker
            style={styles.dropdown}
            selectedValue={grade}
            onValueChange={(itemValue, itemIndex) => setGrade(itemValue)}
          >
            <Picker.Item label="V1" value="1" />
            <Picker.Item label="V2" value="2" />
            <Picker.Item label="V3" value="3" />
            <Picker.Item label="V4" value="4" />
            <Picker.Item label="V5" value="5" />
            <Picker.Item label="V6" value="6" />
            <Picker.Item label="V7" value="7" />
            <Picker.Item label="V8" value="8" />
            <Picker.Item label="V9" value="9" />
            <Picker.Item label="V10" value="10" />
            <Picker.Item label="V11" value="11" />
          </Picker>
        </View>
        <ScrollView style={styles.logEntryScroll}>
          <TextInput
            multiline={true}
            onChangeText={async (info) => {
              setInfo(info);
            }}
            value={info}
            placeholder={""}
          />
        </ScrollView>
        <View style={styles.checkboxContainer}>
          <Text> Route Completed </Text>
          <CheckBox
            value={isCompleted}
            onValueChange={setCompleted}
            style={styles.checkbox}
          />
        </View>
      </View>
      <View style={styles.saveButton}>
        <Button
          style={styles.saveButton}
          title="Save changes"
          onPress={() => {
            console.log("saving new data");
            console.log(name);
            LogInfo.Climbing_logs[k].name = name;
            LogInfo.Climbing_logs[k].date = date;
            LogInfo.Climbing_logs[k].info = info;
            LogInfo.Climbing_logs[k].imagePath = image;
            LogInfo.Climbing_logs[k].grade = grade;
            LogInfo.Climbing_logs[k].completed = isCompleted;
          }}
        />
      </View>
    </ScrollView>
  );
}

export default function App() {
  useEffect(() => {
    AsyncStorage.clear();
  });

  useEffect(() => {
    (async () => {
      let t = await AsyncStorage.getItem("@LogInfo");
      // console.log("log = " + t);
      if (t == null) {
        try {
          const jsonValueLog = JSON.stringify(log);
          await AsyncStorage.setItem("@LogInfo", jsonValueLog);
        } catch (e) {
          console.log("error with log saving: " + e);
        }
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let g = await AsyncStorage.getItem("@GoalList");
      if (g == null) {
        try {
          // const jsonValueGoal = JSON.stringify();
          // await AsyncStorage.setItem("@GoalList", jsonValueGoal);
          await AsyncStorage.setItem("@GoalList", JSON.stringify(gljson));
        } catch (e) {
          console.log("error with log saving: " + e);
        }
      }
    })();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Training" component={Training} />
        <Stack.Screen name="Setting" component={Settings} />
        <Stack.Screen name="ClimbingLogScreen" component={ClimbingLogScreen} />
        <Stack.Screen name="Goals" component={Goals} />
        <Stack.Screen name="Log Page" component={LogPage} />
        <Stack.Screen name="New goal" component={NewGoal} />
        <Stack.Screen name="Work Out" component={WorkOut} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "0065ff",
    alignItems: "center",
    justifyContent: "center",
  },

  scrollStyle: {
    width: "100%",
    height: "100%",
    backgroundColor: "#003482",
  },
  logStyle: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F5F5F5",
  },
  homeScreenTouchable: {
    width: "100%",
    height: "100%",
  },
  homeScreenCells: {
    backgroundColor: "white",
    width: "90%",
    height: 100,
    marginBottom: 10,
    marginVertical: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  logo: {
    alignSelf: "center",
    width: 100,
    height: 50,
    marginVertical: 10,
    borderRadius: 10,
    resizeMode: "stretch",
  },

  homeImage: {
    alignSelf: "center",
    width: "100%",
    marginVertical: 10,
    height: 150,
  },

  newGoal: {
    width: "90%",
    height: 30,
    backgroundColor: "white",
    borderRadius: 10,
    alignSelf: "center",
    marginBottom: 10,
  },

  newGoalText: {
    fontSize: 18,
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    margin: 10,
  },
  checkbox: {
    alignSelf: "center",
  },
  infoScroll: {
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    height: 100,
  },
  dropdown: {
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "white",
    marginVertical: 5,
    marginHorizontal: 10,
  },
  pickerView: {
    marginVertical: 5,
    marginHorizontal: 10,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 15,
    backgroundColor: "white",
  },
  logNameText: {
    fontSize: 18,
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: "white",
    height: 30,
    paddingHorizontal: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  logEntryScroll: {
    padding: 5,
    marginHorizontal: 10,
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 15,
    borderColor: "black",
    height: 100,
  },
  saveButton: {
    justifyContent: "center",
    margin: 10,
  },
  homePageImages: {
    height: "100%",
    width: "100%",
    opacity: 0.4,
    position: "absolute",
    borderRadius: 10,
    resizeMode: "contain",
    overflow: "hidden",
  },
  homeCellText: {
    fontSize: 40,
    textAlign: "center",
    textAlignVertical: "center",
  },
  trainingCell: {
    flex: 1,
  },
  trainingTouchable: {
    flex: 1,
    flexDirection: "column",
    margin: 4,
    borderRadius: 5,
    backgroundColor: "#808080",
  },
});
