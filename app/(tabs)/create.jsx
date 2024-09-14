import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Alert, Image, TouchableOpacity, ScrollView, PermissionsAndroid, Platform } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { useState, useEffect } from "react";
import { icons } from "../../constants";
import { CustomButton, FormField } from "../../components";
import * as ImagePicker from 'expo-image-picker';
import axios from "axios";
import { useNavigation } from '@react-navigation/native';
// Dòng 120 hàm axios.post cần đc sửa DOMAIN
async function requestStoragePermission() {
  if (Platform.OS === 'android') { 
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, 
        {
          title: "Yêu cầu ủy quyền",
          message: "Ứng dụng cần truy cập bộ nhớ thiết bị, cho phép truy cập?.",
          buttonNeutral: "Nhắc lại",
          buttonNegative: "Từ chối",
          buttonPositive: "OK"
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Có thể sử dụng kho ảnh");
      } else {
        console.log("Ủy quyền bị từ chối");
      }
    } catch (err) {
      console.warn(err);
    }
  }
}

const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(today.getDate()).padStart(2, '0');
  return `${day}-${month}-${year}`;
};

const Create = () => {
  const navigation = useNavigation();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    content: "",
    name: "",
    phone: "",
    address: "",
    note: "",
    created_at: getCurrentDate(), // Đặt này mặc định
    image: null,
  });

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Xin lỗi, ứng dụng cần quyền truy cập thư viện ảnh để hoạt động!');
    }
  };
  
  useEffect(() => {
    requestPermissions();
  }, []);

  
  // Function to open image picker
  const openPicker = async (selectType) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: selectType === "image"
        ? ["image/png", "image/jpg", "image/jpeg"]
        : ["video/mp4", "video/gif"],
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({
          ...form,
          image: result.assets[0], // Lưu ảnh đã lựa chọn
        });
      }
    }
  };

  const submit = async () => {
    if (
      form.content === "" ||
      form.title === "" ||
      form.name === "" ||
      form.phone === "" ||
      form.address === ""
    ) {
      return Alert.alert("Lỗi","Vui lòng cung cấp thông đầy đủ");
    }
  
    setUploading(true);
    try {
      // Chuẩn bị cho việc thêm data
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      formData.append('name', form.name);
      formData.append('phone', form.phone);
      formData.append('address', form.address);
      formData.append('note', form.note);
      formData.append('created_at', form.created_at);
  
      // Thêm hình ảnh nếu nó tồn tại
      if (form.image) {
        formData.append('image', {
          uri: form.image.uri,
          type: form.image.mimeType,
          name: form.image.name, //Đảm bảo sử dụng đúng định dạng ảnh
        });
      }
      console.log(form.image);



      // Gửi dữ liệu tới sever
      await axios.post('https://danvanthanhphothuduc.org/diemden/submit_report.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      Alert.alert("Success", "Yêu cầu được gửi đi thành công");
      // Chuyển sang màn hình home sau khi gửi thành công
      navigation.navigate('home', { refresh: true }); // Chuyển hướng đến trang Home sau khi đăng nhập thành công

    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      // Reset form after submission
      setForm({
        title: "",
        image: null,
        content: "",
        name: "",
        phone: "",
        address: "",
        created_at: getCurrentDate(),
        image: null,
      });
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-secondary-200 font-psemibold">Gửi yêu cầu cứu nạn</Text>

        <FormField
          title="Tiêu đề:"
          value={form.title}
          placeholder="Tiêu đề cho yêu cầu..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">Tải hình ảnh yêu cầu:</Text>

          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.image ? (
              <Image
                source={{ uri: form.image.uri }}
                resizeMode="cover"
                style={{ width: '100%', height: 600, borderRadius: 20}} // Đặt chiều cao cụ thể
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl border-2 border-black-200 flex justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  alt="upload"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">Chọn một hình ảnh</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        <FormField
          title="Ghi nhận số lượng người + nhu yếu phẩm:"
          value={form.content}
          placeholder="Lý do..."
          handleChangeText={(e) => setForm({ ...form, content: e })}
          otherStyles="mt-7"
        />
        
        <FormField
          title="Họ và tên:"
          value={form.name}
          placeholder=""
          handleChangeText={(e) => setForm({ ...form, name: e })}
          otherStyles="mt-7"
        />

        <FormField
          title="Số điện thoại:"
          value={form.phone}
          placeholder=""
          handleChangeText={(e) => setForm({ ...form, phone: e })}
          otherStyles="mt-10"
        />
        
        <FormField
          title="Địa chỉ:"
          value={form.address}
          placeholder="Số nhà/Đường/Phường/Quận"
          handleChangeText={(e) => setForm({ ...form, address: e })}
          otherStyles="mt-7"
        />

        <FormField
          title="Ghi chú:"
          value={form.note}
          placeholder= "Chú thích liên quan"
          handleChangeText={(e) => setForm({ ...form, note: e })}
          otherStyles="mt-7"
        />

        <FormField
          title="Ngày gửi yêu cầu:"
          value={form.created_at}
          placeholder={getCurrentDate()}
          handleChangeText={(e) => setForm({ ...form, created_at: e })}
          otherStyles="mt-7"
          editable={false}
        />

        <CustomButton
          title="Gửi yêu cầu"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;