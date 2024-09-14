import { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { Tabs, useRouter } from "expo-router";
import { Image, Text, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { icons } from "../../constants";
import { Loader } from "../../components";

const TabIcon = ({ icon, color, name, focused }) => {
  return (
    <View className="flex items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className="w-6 h-6"
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs`}
        style={{ color: color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Giả lập trạng thái loading
  const router = useRouter(); // Sử dụng useRouter để điều hướng

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        setIsLoggedIn(!!userToken);
      } catch (error) {
        console.error('Lỗi khi kiểm tra đăng nhập:', error);
      } finally {
        setLoading(false);
      }
    };

    checkLoggedIn();
  }, []);

  if (loading) {
    return <Loader isLoading={loading} />;
  }

  const handleTabPress = () => {
    router.push('/auth/sign-in'); // Chuyển hướng đến trang đăng nhập
  };

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.home}
                color={color}
                name="Xem yêu cầu"
                focused={focused}
              />
            ),
          }}
        />
        
        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.plus}
                color={color}
                name="Tạo yêu cầu"
                focused={focused}
              />
            ),
          }}
        />
        
        <Tabs.Screen
          name="management"
          options={{
            title: "management",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.profile}
                color={color}
                name="Quản lý"
                focused={focused}
                onPress={handleTabPress} // Đặt hàm xử lý nhấn tab
              />
            ),
          }}
        />
      </Tabs>

      <StatusBar backgroundColor="#102C57" style="light" />
    </>
  );
};

export default TabLayout;
