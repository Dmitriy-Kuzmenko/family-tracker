import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { StyleSheet, Text, View, Alert, Dimensions, SafeAreaView } from 'react-native';
import { IconButton, Colors, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

import { fetchUsersAction, addFriendAction, deleteFriendAction, fetchFriendsLocationAction, addUserLocationAction, updateLocationAction, fetchUserLocationAction, clearUserLocations } from '../actions';

import BottomSheet, { BottomSheetTextInput, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import Loading from '../components/Loading';

const MainScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { userId } = useSelector((state) => state.auth);
  const { users, isLoading: isLoadingUsers } = useSelector((state) => state.users);
  const { friendLocations, userLocations } = useSelector((state) => state.locations);

  const [_, setLocationServiceEnabled] = useState(false);
  const [userLocation, setUserLocation] = useState({ latitude: null, longitude: null });
  const [displayCurrentAddress, setDisplayCurrentAddress] = useState('Wait, we are fetching you location...');
  const [openBottomSheet, setOpenBottomSheet] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredUserList, setFilteredUserList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [isOpenUser, setIsOpenUser] = useState(false);

  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ["1%", "50%"], []);

  const displayCurrentAddressRef = useRef(displayCurrentAddress);
  displayCurrentAddressRef.current = displayCurrentAddress;

  useEffect(() => {
    dispatch(fetchUsersAction());
    dispatch(fetchFriendsLocationAction());
  }, []);

  useEffect(() => {
    setUserList(users);
    setFilteredUserList(users);
  }, [users]);

  useEffect(() => {
    userLocations.length ? setIsOpenUser(true) : setIsOpenUser(false);
  }, [userLocations]);

  useEffect(() => {
    CheckIfLocationEnabled();
    GetCurrentLocation();
  }, []);

  const searchFilterFunction = (text) => {
    if (text) {
      const newData = userList.filter(
        function (item) {
          const itemData = item.username
            ? item.username.toUpperCase()
            : ''.toUpperCase();
          const textData = text.toUpperCase();
          return itemData.indexOf(textData) > -1;
        });
      setFilteredUserList(newData);
      setSearch(text);
    } else {
      setFilteredUserList(userList);
      setSearch(text);
    }
  };

  const UserView = ({ item }) => {
    return (
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10
      }}>
        <Text
          style={styles.itemStyle}
          onPress={() => openFriend(item)}
        >
          {item.username}
        </Text>
        {item.friend ?
          (<IconButton
            icon="delete-outline"
            size={30}
            onPress={() => deleteFriend(item)} />)
          :
          (<IconButton
            icon="plus"
            size={30}
            onPress={() => addFriend(item)} />)
        }
      </View>
    );
  };

  const UserLocationView = ({ item }) => {
    return (
      <View style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingLeft: 10,
        paddingRight: 10
      }}>
        <Text
          style={styles.itemStyle}
        >
          {item.address}
        </Text>
      </View>
    );
  }

  const openFriend = async (user) => {
    dispatch(fetchUserLocationAction(user._id));
  }

  const addFriend = async (user) => {
    dispatch(addFriendAction(user._id));
  }

  const deleteFriend = async (user) => {
    dispatch(deleteFriendAction(user._id));
  }

  const addUserLocation = async (latitude, longitude, address) => {
    dispatch(addUserLocationAction(latitude, longitude, address));
  }

  const updateLocation = async (latitude, longitude, address) => {
    dispatch(updateLocationAction(latitude, longitude, address));
  }

  const ItemSeparatorView = () => {
    return (
      <View
        style={{
          height: 0.5,
          width: '100%',
        }}
      />
    );
  };

  // callbacks
  const handleSheetChange = useCallback((index) => {
    if (index == 0) {
      sheetRef.current?.close();
      setOpenBottomSheet(false);
    }
  }, []);

  const handleSnapPress = useCallback(() => {
    openBottomSheet ? sheetRef.current?.close() : sheetRef.current?.snapToIndex(1);
    setOpenBottomSheet(!openBottomSheet);
  }, [openBottomSheet]);

  const CheckIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      Alert.alert(
        'Location Service not enabled',
        'Please enable your location services to continue',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    } else {
      setLocationServiceEnabled(enabled);
    }
  };

  const GetCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission not granted',
        'Allow the app to use location service.',
        [{ text: 'OK' }],
        { cancelable: false }
      );
    }

    let { coords } = await Location.getCurrentPositionAsync();

    if (coords) {
      const { latitude, longitude } = coords;
      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      for (let item of response) {
        let address = `${item.name}, ${item.city}`;

        if (address.length > 0) {
          setUserLocation({ latitude, longitude });
          setDisplayCurrentAddress(address);

          updateLocation(latitude, longitude, address);

          setTimeout(async () => {
            GetCurrentLocation();
          }, 120000);

          setTimeout(() => {
            addUserLocation(latitude, longitude, address);
          }, 600000);
        }
      }
    }
  };

  const getFriendName = (userId) => {
    const user = users.find((item) => item._id === userId);
    return user ? user.username : "Friend";
  }

  return (
    <View style={styles.container}>
      <MapView style={styles.map}>
        {userLocation.latitude && userLocation.longitude &&
          (<Marker
            coordinate={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
            title={"It's you"}
            description={displayCurrentAddress}
            key={1}
            pinColor={"black"}
          >
            <View style={{ display: 'flex', 'justifyContent': 'center', 'alignItems': 'center' }}>
              <Icon name="map-marker" size={45} color="#8A2BE2" />
              <Text style={{ color: 'white', fontWeight: 'bold', backgroundColor: 'rgba(52, 52, 52, 0.2)', padding: 2 }}>It's you</Text>
            </View>
          </Marker>)
        }
        {friendLocations.map(location => {
          return (<Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title={getFriendName(location.user_id)}
            description={location.address}
            key={location._id}
          >
            <View style={{ display: 'flex', 'justifyContent': 'center', 'alignItems': 'center' }}>
              <Icon name="map-marker" size={45} color="#9370DB" />
              <Text style={{ color: 'white', fontWeight: 'bold', backgroundColor: 'rgba(52, 52, 52, 0.2)', padding: 2 }}>{getFriendName(location.user_id)}</Text>
            </View>
          </Marker>)
        })}
      </MapView>
      <IconButton
        icon="account-search"
        size={50}
        style={[styles.button, openBottomSheet && styles.buttonOpen]}
        color={Colors.white}
        animated={true}
        onPress={() => handleSnapPress()}
      />
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
      >
        {isOpenUser === false &&
          <BottomSheetTextInput
            style={styles.textInput}
            placeholder="Search Here"
            onChangeText={(text) => searchFilterFunction(text)}
            value={search}
          />}
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            {isOpenUser === false &&
              <>
                {isLoadingUsers ? (<Loading />) : (<BottomSheetFlatList
                  data={filteredUserList}
                  keyExtractor={(item, index) => index.toString()}
                  ItemSeparatorComponent={ItemSeparatorView}
                  renderItem={UserView}
                />)}
              </>
            }
            {isOpenUser == true && (<View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: Dimensions.get('window').width }}><Button icon="keyboard-backspace" onPress={() => dispatch(clearUserLocations())}>Back</Button><Text style={{ fontWeight: 'bold' }}>Places visited by a friend:</Text></View>)}

            {isOpenUser == true && userLocations && (<BottomSheetFlatList
              data={userLocations}
              keyExtractor={(item, index) => index.toString()}
              ItemSeparatorComponent={ItemSeparatorView}
              renderItem={UserLocationView}
            />)}
          </View>
        </SafeAreaView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height
  },
  button: {
    borderRadius: 30,
    zIndex: 1000,
    position: 'absolute',
    bottom: 60,
    backgroundColor: '#8274d4',
  },
  buttonOpen: {
    display: 'none'
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: "#eee",
  },
  itemStyle: {
    padding: 10,
  },
  textInput: {
    alignSelf: "stretch",
    marginHorizontal: 12,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "grey",
    color: "white",
    textAlign: "center",
  },
});

export default MainScreen;