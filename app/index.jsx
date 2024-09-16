import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { View, Text, Image, ScrollView, Linking, Alert, Platform  } from "react-native";
import CustomButton from "../components/CustomButton";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../constants";


const Welcome = () => {
  const router = useRouter();

  const makePhoneCall  = () => {
    const phoneNumber = '1800 6132'; // Số điện thoại bạn muốn hiển thị
    // Sử dụng Linking để mở ứng dụng điện thoại
    let phoneUrl = `tel:${phoneNumber}`;
    
    Linking.openURL(phoneUrl);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
          justifyContent: "center",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4">
          <Image
            source={images.logo1}
            className="max-w-[380px] w-full h-[298px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Cứu nạn cứu trợ {"\n"}
              bão{" "}
              <Text className="text-secondary-200">Yagi</Text>
            </Text>

            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 -right-8"
              resizeMode="contain"
            />
          </View>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Tiếp nhận yêu cầu hỗ trợ của người dân bất cứ mọi nơi. {"\n"}
            Hỗ trợ dân cư các vấn đề cấp bách.
          </Text>

          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            LIÊN HỆ NGAY HOTLINE CỨU NẠN KHẨN CẤP {"\n"}
            (Miễn phí, luôn có người nghe máy)
          </Text>

          <CustomButton
            title="GỌI NGAY HOTLINE : 1800 6132"
            handlePress={makePhoneCall}
            containerStyles="w-full mt-7"
          />
          
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            HOẶC            
          </Text>

          <CustomButton
            title="GỬI YÊU CẦU HỖ TRỢ TẠI ĐÂY"
            handlePress={() => router.push("/home")}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#102C57" style="light" />
    </SafeAreaView>
  );
};

export default Welcome;
