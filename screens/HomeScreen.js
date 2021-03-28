import React, { useState, useEffect } from "react";
import { useFocusEffect, useScrollToTop } from "@react-navigation/native";
import { Animated, SectionList, RefreshControl, Alert } from "react-native";
import styled from "styled-components/native";
import { Octicons } from "@expo/vector-icons";
import { RectButton } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";

import { appointmentsApi } from "../utils/api";
import { Appointment, SectionTitle } from "../src/components";

const HomeScreen = ({ navigation, route }) => {
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [refsArray, setRefsArray] = useState([]);
  const [noConnection, setNoConnection] = useState(false);
  const ref = React.useRef(null);

  useFocusEffect(
    React.useCallback(() => {
      cleanFetch();
    }, [])
  );

  useScrollToTop(ref);

  const cleanFetch = () => {
    appointmentsApi
      .get()
      .then(({ data }) => {
        setData(data.message.sort());
        if (data && data.status === "success") {
          setNoConnection(false);
        }
      })
      .catch((error) => {
        error.request ? console.log(error.request) : console.log("Error", error.message);
        setNoConnection(true);
      })
      .finally((resp) => {
        setRefreshing(false);
      });
  };

  const fetchAppointments = () => {
    setRefreshing(true);
    cleanFetch();
  };

  useEffect(fetchAppointments, []);

  const removeAppointment = (id, closeRaw) => {
    Alert.alert(
      "Удаление приема",
      "Вы действительно хотите удалить прием?",
      [
        {
          text: "Отмена",
          onPress: () => {
            closeRaw();
          },
          style: "cancel",
        },
        {
          text: "Да, удалить",
          onPress: () => {
            const result = data.map((group) => {
              const data = (group.data = group.data.filter((item) => item._id !== id));
              group.data = data;
              return group;
            });
            closeRaw();
            setData(result);
            appointmentsApi.remove(id);
          },
          style: "default",
        },
      ],
      { cancelable: false }
    );
  };

  renderRightAction = (text, color, x, progress, id, item, index) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
    });

    const closeRow = () => {
      refsArray[item._id].close();
    };

    const pressHandler = () => {
      if (text === "pencil") {
        closeRow();
        navigation.navigate("EditAppointment", { patientId: item });
      } else {
        removeAppointment(id, closeRow);
      }
    };

    return (
      <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
        <RectButton
          style={{
            alignItems: "center",
            flex: 1,
            justifyContent: "center",
            backgroundColor: color,
          }}
          onPress={pressHandler}
        >
          <ActionText>
            <Octicons name={text} size={24} color="white" />
          </ActionText>
        </RectButton>
      </Animated.View>
    );
  };

  renderRightActions = (progress, id, item, index) => (
    <RightButtonsHandler>
      {renderRightAction("pencil", "#B4C1CB", 160, progress, id, item, index)}
      {renderRightAction("trashcan", "#F85A5A", 80, progress, id, item, index)}
    </RightButtonsHandler>
  );

  const listEmptyComponent = () => {
    return noConnection === false ? (
      <ActionText style={{ color: "#816CFF" }}>Нет запланированных приемов.. 💁‍♀️</ActionText>
    ) : (
      <ActionText style={{ color: "#F38181" }}>
        Пожалуйста проверьте соединение с сервером... ⚙️
      </ActionText>
    );
  };

  return (
    <Container>
      <SectionList
        ref={ref}
        style={{ paddingLeft: 20, paddingRight: 20 }}
        sections={data ? data : null}
        keyExtractor={(item) => item._id}
        renderItem={({ item, index }) => (
          <Swipeable
            ref={(ref) => {
              refsArray[item._id] = ref;
            }}
            renderRightActions={(progress) => renderRightActions(progress, item._id, item, index)}
            index={item._id}
            friction={2}
          >
            <Appointment navigation={navigation} item={item} index={index} />
          </Swipeable>
        )}
        renderSectionHeader={({ section }) =>
          section.data.length > 0 ? <SectionTitle>{section.title}</SectionTitle> : null
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchAppointments} />}
        ListEmptyComponent={() => listEmptyComponent()}
      />

      {/* убрал круглую кнопку, удалил импорт данной кнопки из компонентов
			<PlusButton onPress={() => navigation.navigate('AddPatient')} /> */}
    </Container>
  );
};

const Container = styled.SafeAreaView({
  flex: 1,
  backgroundColor: "#fff",
});

const RightButtonsHandler = styled.View({
  width: 160,
  flexDirection: "row",
  marginLeft: 20,
});

const ActionText = styled.Text({
  color: "white",
  fontSize: 16,
  backgroundColor: "transparent",
  padding: 10,
});

export default HomeScreen;
