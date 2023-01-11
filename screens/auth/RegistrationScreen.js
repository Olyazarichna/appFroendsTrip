import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
} from "react-native";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { signUp } from "../../redux/auth/authOperations";

import { AntDesign, Octicons, Ionicons, Feather } from "@expo/vector-icons";

import variables from "../../styles/utils/variables";
import fonts from "../../styles/utils/mixins";

import handleToggle from "../../helpers/handleToggle";
import changeInput from "../../helpers/changeInput";

import ButtonLongBlue from "../../components/Buttons/ButtonLongBlue";

const initialState = {
  login: "",
  email: "",
  phone: "",
  password: "",
  repeatingPassword: "",
};

export default function RegistrationScreen({ navigation }) {
  const [state, setState] = useState(initialState);
  const [passwordError, setPasswordError] = useState(false);
  const [togglePassword, setTogglePassword] = useState(true);
  const [toggleRepeatingPassword, setToggleRepeatingPassword] = useState(true);

  const [inputChange, setImputChange] = useState(false); 

  const dispatch = useDispatch();
  console.log("dispatch", dispatch);

  const handleSubmit = () => {
    const { login, email, phone, password, repeatingPassword } = state;
    if (password !== repeatingPassword) {
      setPasswordError(true);
      return;
    } 
    setImputChange(false);
    setPasswordError(false);
    dispatch(signUp(state));
    setState(initialState);
    Keyboard.dismiss();
    console.log(state);
  };

  return (
    <View style={styles.container}>
          <Text style={styles.title}>lets Get Started</Text>
          <Text style={styles.titleText}>Find new trip and friends in our app</Text>
      <ScrollView>
      <View style={styles.form}>
         
          
        <View>
            {inputChange ? <Text style={styles.inputLableOff}>Name</Text> : <Text style={styles.inputLable}>Name</Text>}
          <TextInput
            value={state.login}
            style={styles.input}
            onChangeText={(value) =>
            changeInput(value, setState, setImputChange, 'login')
            }
            />
            <View style={styles.inputIcon}>
            <Feather name="user" size={24} color={variables.inputColor} />
          </View>
          </View>
          <View>
           {inputChange ? <Text style={styles.inputLableOff}>Phone</Text> : <Text style={styles.inputLable}>Phone</Text>}
          <TextInput
            keyboardType="phone-pad"
            value={state.phone}
            style={styles.input}
            onChangeText={(value) =>
             changeInput(value, setState, setImputChange, 'phone')
            }
            />
          <View style={styles.inputIcon}>
            <Feather name="phone" size={24} color={variables.inputColor} />
          </View>
        </View>
        <View>
           {inputChange ? <Text style={styles.inputLableOff}>Your Email</Text> : <Text style={styles.inputLable}>Your Email</Text>}
          <TextInput
            keyboardType="email-address"
            value={state.email}
            style={styles.input}
            onChangeText={(value) =>
              changeInput(value, setState, setImputChange, 'email')
            }
            />
        <View style={styles.inputIcon}>
            <Octicons name="mail" size={24} color={variables.inputColor} />
          </View>
        </View>
           
        <View>
          {inputChange ? <Text style={styles.inputLableOff}>Password</Text> : <Text style={styles.inputLable}>Password</Text>}
          <TextInput
            value={state.password}
            style={styles.input}
            secureTextEntry={togglePassword}
            onChangeText={(value) =>
              changeInput(value, setState, setImputChange, 'password')
            }
            />
            
          <TouchableOpacity onPress={() => handleToggle(setTogglePassword)}>
            <View style={styles.inputIconPass}>
           {togglePassword ? <Feather name="lock" size={24} color={variables.inputColor} /> : <Feather name="unlock" size={24} color={variables.inputColor} />}
            </View>
            </TouchableOpacity>
            </View>
        <View>
         {inputChange ? <Text style={styles.inputLableOff}>Confirm Password</Text> : <Text style={styles.inputLable}>Confirm Password</Text>}
          <TextInput
            value={state.repeatingPassword}
            style={styles.input}
            secureTextEntry={toggleRepeatingPassword}
            onChangeText={(value) =>
             changeInput(value, setState, setImputChange, 'repeatingPassword')
            }
          />
          <TouchableOpacity
            onPress={() => handleToggle(setToggleRepeatingPassword)}>
            <View style={styles.inputIconPass}>
           {toggleRepeatingPassword ? <Feather name="lock" size={24} color={variables.inputColor} /> : <Feather name="unlock" size={24} color={variables.inputColor} />}
            </View>
          </TouchableOpacity>
        </View>
       
        <ButtonLongBlue
          title={'Register'}
          marginTop={10}
          marginLeft={"auto"}
          marginRight={"auto"}
          click={handleSubmit}
        />

        {passwordError && (
          <Text style={styles.error}>Passwords do not match</Text>
          )}

       </View>
        </ScrollView>   
          <Text style={styles.textRegister}>By using the application, you agree to the
          <Text style={styles.buttonRegister}>Terms & Conditons.</Text></Text>
        <Text style={styles.textRegister}>
          Already have an account?
          <Text style={styles.buttonRegister} onPress={() => navigation.navigate("Login")}>To come in</Text>
        </Text>

        <TouchableOpacity style={styles.buttonHome} onPress={() => navigation.navigate("Home")}>
          <Ionicons name="md-home" size={24} color={variables.lableButtonBlue} />
        </TouchableOpacity>
        
    </View>
  );
}
//Password confirmation
const styles = StyleSheet.create({
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
   
  },
   buttonHome: {
    position: "absolute",
    top: 35,
    left: 15
  },
  title: {
      marginTop: 40,
    color: variables.titleColor,
    textAlign: "center",
    marginBottom: 20,
  ...fonts(24, "600")
  },
  titleText: {
    width: 154,
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: 18,
    textAlign: "center",
    color: variables.textColor,
    ...fonts(14, "500")
  },
  form: {
    marginHorizontal: 24,
    marginTop: 5
  },
  input: {
    marginTop: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: variables.lableButtonWhite,
    height: 63,
    paddingLeft: 60,
    borderRadius: 20,
    backgroundColor: "rgba(249, 250, 251, 1)",
    color: variables.inputColor
  },
  inputIcon: {
    position: "absolute",
    top: 35,
    left: 22,  
  },
  inputIconPass: {
   position: "absolute",
    top: -55,
    left: 22,
  },
  inputLable: {
  position: "absolute",
  zIndex: 1,
  top: 38,
  left: 60,
  color: variables.inputColor,
  ...fonts(14, "500")
  },
inputLableOff: {
  position: "absolute",
  zIndex: 1,
  top: 0,
  left: 10,
   color: variables.inputColor,
  ...fonts(14, "500")
  },
  error: {
    color: "red",
  },
  textRegister: {
  width: 230,
  marginTop: 14,
  marginLeft: "auto",
  marginRight: "auto",
  textAlign: "center",
  color: variables.textColor,
  marginBottom: 10,
  ...fonts(14, "500")
  },
  buttonRegister: {
    color: "#375ABE",  
  }
});
