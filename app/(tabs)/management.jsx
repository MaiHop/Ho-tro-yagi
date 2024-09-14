import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Image } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const API_URL = "https://danvanthanhphothuduc.org/diemden/login.php";

const SignIn = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa
    const checkLoggedIn = async () => {
      try {
        const userToken = await AsyncStorage.getItem('userToken');
        if (userToken) {
          setIsLoggedIn(true);
          console.log('Người dùng đã đăng nhập!');
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra đăng nhập:', error);
      }
    };
    checkLoggedIn();
  }, []);

  const submit = async () => {
    setError("");
    setSubmitting(true);
    
    if (isLoggedIn) {
      // Nếu đã đăng nhập, thực hiện đăng xuất
      try {
        await AsyncStorage.removeItem('userToken');
        setIsLoggedIn(false);
        console.log('Đăng xuất thành công!');
        navigation.navigate('home', { refresh: true }); // Chuyển hướng đến trang đăng nhập sau khi đăng xuất
      } catch (error) {
        console.error('Lỗi khi đăng xuất:', error);
        setError("Đã xảy ra lỗi khi đăng xuất.");
      }
    } else {
      // Nếu chưa đăng nhập, thực hiện đăng nhập
      if (!form.email || !form.password) {
        setError("Vui lòng nhập đầy đủ email và mật khẩu.");
        setSubmitting(false);
        return;
      }

      try {
        const response = await axios.post(API_URL, {
          email: form.email,
          password: form.password
        });
        console.log('API Response:', response.data);
        if (response.data.success) {
          if (response.data.token) {
            await AsyncStorage.setItem('userToken', response.data.token);
            setIsLoggedIn(true);
            console.log('Đăng nhập thành công!');
            navigation.navigate('home', { refresh: true }); // Chuyển hướng đến trang Home sau khi đăng nhập thành công
          } else {
            setError("Nhận token không thành công.");
          }
        } else {
          setError(response.data.message || "Đăng nhập thất bại.");
        }
      } catch (error) {
        console.error('Lỗi khi đăng nhập:', error);
        setError("Đã xảy ra lỗi khi đăng nhập.");
      }
    }
    
    setSubmitting(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          className="w-full flex justify-center px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 150,
          }}
        >
          <View className="flex-row items-center">
            <Image
              source={images.logo1}
              resizeMode="contain"
              className="max-w-[60px] max-h-[60px]"
            />
            <Text className="text-2xl font-semibold text-secondary-200 font-psemibold">
              CẤP CỨU HỖ TRỢ BÃO YAGI
            </Text>
          </View>

          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            {isLoggedIn ? "Đăng xuất" : "Đăng nhập"}
          </Text>

          {!isLoggedIn && (
            <>
              <FormField
                title="Email"
                value={form.email}
                handleChangeText={(e) => setForm({ ...form, email: e })}
                otherStyles="mt-7"
                keyboardType="email-address"
              />

              <FormField
                title="Mật khẩu"
                value={form.password}
                handleChangeText={(e) => setForm({ ...form, password: e })}
                otherStyles="mt-7"
                secureTextEntry
              />
            </>
          )}

          {error ? (
            <Text className="text-red-500 mt-4">{error}</Text>
          ) : null}

          <CustomButton
            title={isLoggedIn ? "Đăng xuất" : "Đăng nhập"}
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
