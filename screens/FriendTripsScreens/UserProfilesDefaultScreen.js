import {
  StyleSheet,
  Image,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
  Platform,
  Keyboard,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";

import {
  AntDesign,
  MaterialCommunityIcons,
  EvilIcons,
} from "@expo/vector-icons";

import { Camera, CameraType } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

import { logOut } from "../../redux/auth/authOperations";
import { ActionCodeURL, getAuth } from "firebase/auth";
import { useState, useEffect } from "react";

import variables from "../../styles/utils/variables";
import fonts from "../../styles/utils/mixins";
import { UserProfilesDefaultScreenStyles } from "../../styles/stylesScreens/UserProfilesDefaultScreenStyles";
import { validation } from "../../helpers/validation/validation";
import { ScreenSettings } from "../../styles/utils/ScreenSettings";

import handleToggle from "../../helpers/handleToggle";
import changeInputForProfiles from "../../helpers/changeInputForProfiles";

import ButtonLongBlue from "../../components/Buttons/ButtonLongBlue";
import ButtonRoundBlue from "../../components/Buttons/ButtonRoundBlue";

import CameraProfileComponents from "../../components/Profile/CameraProfileComponents";
import GalleryProfileComponents from "../../components/Profile/GalleryProfileComponents";

export default function UserProfilesDefaultScreen({ navigation }) {
  const state = useSelector((state) => state.auth);
  console.log("stateUserDef", state);

  const initialLocalState = {
    avatar: "",
    name: state.name,
    email: state.email,
    phone: state.phone,
    location: "",
    about: "",
  };

  // const [name, setName] = useState('');
  // const [avatar, setAvatar] = useState('');
  // const[email,setEmail] = useState('');
  // const[phone,setPhone] = useState('');
  // const[location,setLocation] = useState('');
  // const[about,setAbout] = useState('');

  const [isShowKeyboard, setIsShowKeyboard] = useState(false);

  const [dataCheckName, setDataCheckName] = useState(false);
  const [dataCheckEmail, setDataCheckEmail] = useState(false);
  const [dataCheckPhone, setDataCheckPhone] = useState(false);
  const [dataCheckLocation, setDataCheckLocation] = useState(false);
  const [dataCheckAbout, setDataCheckAbout] = useState(false);

  const [checkValidEmail, setCheckValidEmail] = useState(true);
  const [checkValidPhone, setCheckValidPhone] = useState(true);

  const [add, setAdd] = useState(false);

  const [localState, setLocalState] = useState(initialLocalState);

  const [modalVisible, setModalVisible] = useState(false);

  const [camera, setCamera] = useState(true);
  const [gallery, setGallery] = useState(true);

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(CameraType.back);
  const [photo, setPhoto] = useState("");
  const [snap, setSnap] = useState(null);

  const [image, setImage] = useState(null);

  const handleInput = () => {
    if (
      !dataCheckName ||
      (!dataCheckEmail &&
        !dataCheckPhone &&
        !dataCheckLocation &&
        !dataCheckAbout)
    ) {
      if (isShowKeyboard) {
        setIsShowKeyboard(false);
      }
    }
  };

  const auth = getAuth();

  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(logOut());
  };

  const takeGallery = (image) => {
    setLocalState((prevState) => ({ ...prevState, avatar: image }));
    setGallery(false);
    setAdd(false);
    setModalVisible(!modalVisible);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const showCamera = () => {
    setModalVisible(true);
    setCamera(true);
    setGallery(false);
  };

  const showGallery = () => {
    setModalVisible(true);
    setGallery(true);
    setCamera(false);
  };

  const takePhoto = async () => {
    const photo = await snap.takePictureAsync();
    setPhoto(photo?.uri);
    setLocalState((prevState) => ({ ...prevState, avatar: photo?.uri }));
    setCamera(false);
    setAdd(false);
    setModalVisible(!modalVisible);
  };

  const IOS = Platform.OS === "ios";
  return (
    <View style={styles.container}>
      <View style={{ position: "absolute", top: 0, left: 25 }}>
        <ButtonRoundBlue
          title={
            <AntDesign
              name="close"
              size={17}
              color={variables.labelButtonWhite}
            />
          }
          width={40}
          height={40}
          marginTop={37}
          click={handleSubmit}
        />
      </View>

      <View
        style={{
          ...styles.avatarContainer,
          marginTop: isShowKeyboard ? 120 : 0,
        }}
      >
        <View>
          <Image
            style={styles.avatarContainer}
            source={{ uri: localState.avatar }}
          ></Image>
        </View>
        <View
          style={{
            position: "absolute",
            top: ScreenSettings.returnParams(103, 170),
            left: ScreenSettings.returnParams(80, 145),
            zIndex: 1,
          }}
        >
          <ButtonRoundBlue
            title={
              <AntDesign
                name="check"
                size={ScreenSettings.returnParams(10, 20)}
                color={variables.labelButtonWhite}
              />
            }
            width={ScreenSettings.returnParams(21, 31)}
            height={ScreenSettings.returnParams(21, 31)}
            click={() => handleToggle(setAdd)}
          />
        </View>
        {add && (
          <>
            <View
              style={{
                position: "absolute",
                top: ScreenSettings.returnParams(90, 150),
                left: ScreenSettings.returnParams(20, 10),
              }}
            >
              <ButtonRoundBlue
                title={
                  <EvilIcons
                    name="image"
                    size={ScreenSettings.returnParams(18, 25)}
                    color={variables.labelButtonWhite}
                  />
                }
                width={ScreenSettings.returnParams(30, 40)}
                height={ScreenSettings.returnParams(30, 40)}
                click={showGallery}
              />
            </View>
            <View
              style={{
                position: "absolute",
                top: ScreenSettings.returnParams(65, 110),
                left: ScreenSettings.returnParams(2, -10),
              }}
            >
              <ButtonRoundBlue
                title={
                  <AntDesign
                    name="camera"
                    size={ScreenSettings.returnParams(18, 22)}
                    color={variables.labelButtonWhite}
                  />
                }
                width={ScreenSettings.returnParams(30, 40)}
                height={ScreenSettings.returnParams(30, 40)}
                click={showCamera}
              />
            </View>
          </>
        )}
      </View>

      {IOS && (
        <View
          style={{
            marginTop: 9,
            marginBottom: 26,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              marginTop: 8,
              ...fonts(16, "600"),
              color: variables.titleColor,
            }}
          >
            {initialLocalState.name}
          </Text>
          <Text
            style={{
              textAlign: "center",
              ...fonts(14, "500"),
              color: variables.textColor,
            }}
          >
            {initialLocalState.location}
          </Text>
        </View>
      )}

      <View style={styles.dataContainer}>
        <View
          style={{
            flexDirection: "row",
            marginBottom: ScreenSettings.returnParams(0, 10),
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.textTitle}>Name:</Text>
            <TextInput
              value={localState.name}
              editable={dataCheckName}
              style={styles.input}
              onFocus={() =>
                setIsShowKeyboard((isShowKeyboard) => !isShowKeyboard)
              }
              onChangeText={(value) =>
                changeInputForProfiles(value, setLocalState, "name")
              }
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              handleToggle(setDataCheckName);
              handleInput();
            }}
            style={styles.checkButton}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={ScreenSettings.returnParams(15, 20)}
              color={variables.textColor}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginBottom: ScreenSettings.returnParams(0, 10),
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.textTitle}>Email:</Text>

            {!checkValidEmail && (
              <View style={styles.stylesNotCorrect}>
                {localState.email === "" ? (
                  <Text style={styles.stylesNotCorrectText}>
                    You have not entered an email
                  </Text>
                ) : (
                  <Text style={styles.stylesNotCorrectText}>
                    You have entered an incorrect email
                  </Text>
                )}
              </View>
            )}
            <TextInput
              value={localState.email}
              editable={dataCheckEmail}
              style={styles.input}
              onFocus={() =>
                setIsShowKeyboard((isShowKeyboard) => !isShowKeyboard)
              }
              onChangeText={(value) =>
                changeInputForProfiles(
                  value,
                  setLocalState,
                  "email",
                  validation.email,
                  setCheckValidEmail
                )
              }
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              handleToggle(setDataCheckEmail);
              handleInput();
            }}
            style={styles.checkButton}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={ScreenSettings.returnParams(15, 20)}
              color={variables.textColor}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginBottom: ScreenSettings.returnParams(0, 10),
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.textTitle}>Phone:</Text>
            {!checkValidPhone && (
              <View style={styles.stylesNotCorrect}>
                {localState.phone === "" ? (
                  <Text style={styles.stylesNotCorrectText}>
                    You have not entered an phone
                  </Text>
                ) : (
                  <Text style={styles.stylesNotCorrectText}>
                    Enter the phone number in the format "+38 (067) 22-222-22"
                  </Text>
                )}
              </View>
            )}
            <TextInput
              value={localState.phone}
              editable={dataCheckPhone}
              style={styles.input}
              onFocus={() =>
                setIsShowKeyboard((isShowKeyboard) => !isShowKeyboard)
              }
              onChangeText={(value) =>
                changeInputForProfiles(
                  value,
                  setLocalState,
                  "phone",
                  validation.phone,
                  setCheckValidPhone
                )
              }
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              handleToggle(setDataCheckPhone);
              handleInput();
            }}
            style={styles.checkButton}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={ScreenSettings.returnParams(15, 20)}
              color={variables.textColor}
            />
          </TouchableOpacity>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginBottom: ScreenSettings.returnParams(0, 10),
          }}
        >
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.textTitle}>Locations:</Text>
            <TextInput
              value={localState.location}
              editable={dataCheckLocation}
              style={styles.input}
              onFocus={() =>
                setIsShowKeyboard((isShowKeyboard) => !isShowKeyboard)
              }
              onChangeText={(value) =>
                setLocalState((prevState) => ({
                  ...prevState,
                  location: value,
                }))
              }
            />
          </View>

          <TouchableOpacity
            onPress={() => {
              handleToggle(setDataCheckLocation);
              handleInput();
            }}
            style={styles.checkButton}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={ScreenSettings.returnParams(15, 20)}
              color={variables.textColor}
            />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View>
            <Text style={styles.textTitle}>About me:</Text>
            <View>
              <TextInput
                value={localState.about}
                editable={dataCheckAbout}
                style={styles.aboutText}
                underlineColorAndroid="transparent"
                numberOfLines={3}
                multiline={true}
                onFocus={() =>
                  setIsShowKeyboard((isShowKeyboard) => !isShowKeyboard)
                }
                onChangeText={(value) =>
                  setLocalState((prevState) => ({
                    ...prevState,
                    about: value,
                  }))
                }
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={() => {
              handleToggle(setDataCheckAbout);
              handleInput();
            }}
            style={styles.checkButton}
          >
            <MaterialCommunityIcons
              name="pencil-outline"
              size={ScreenSettings.returnParams(15, 20)}
              color={variables.textColor}
            />
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <ButtonLongBlue
          title="add trip"
          marginTop={ScreenSettings.returnParams(0, 40)}
          click={() => navigation.navigate("CreateTrip")}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <>
          {gallery && (
            <GalleryProfileComponents
              setGallery={setGallery}
              setAdd={setAdd}
              setModalVisible={setModalVisible}
              modalVisible={modalVisible}
              pickImage={pickImage}
              image={image}
              takeGallery={takeGallery}
            />
          )}
          {camera && (
            <CameraProfileComponents
              setCamera={setCamera}
              setAdd={setAdd}
              setSnap={setSnap}
              setType={setType}
              takePhoto={takePhoto}
              photo={photo}
              setModalVisible={setModalVisible}
              modalVisible={modalVisible}
              type={type}
            />
          )}
        </>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create(UserProfilesDefaultScreenStyles);

/// navigation.navigate("CreateTrip",)
