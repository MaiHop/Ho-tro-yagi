import { useState, useEffect, React} from "react";
import { View, Text,Alert, StyleSheet, Image, TextInput, Button,  ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { CustomButton, FormField } from "../../components";
import axios from "axios";

// Dòng 63 có hàm gửi dữ liệu axios.post cần chỉnh sửa DOMAIN
const SERVER_DOMAIN = "https://danvanthanhphothuduc.org/diemden/upload/";

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${day}-${month}-${year}`;
  };

  const EditReport = () => {
    const route = useRoute({ route });
    const { item } = route.params; // Sử dụng tên tham số là 'item'
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({
      id: item.id || "",
      title: item.title || "",
      content: item.content || "",
      name: item.name || "",
      phone: item.phone || "",
      address: item.address || "",
      created_at: item.created_at || getCurrentDate(),
      image_path: item.image_path || null,
      status: item.status || "",
      note: item.note || "",
    });
 
    const submit = async () => {
      if (
        form.content === "" ||
        form.title === "" ||
        form.name === "" ||
        form.phone === "" ||
        form.address === ""||
        form.status === ""
      ) {
        return Alert.alert("Vui lòng điền đẩy đủ dữ liệu");
      }
    
      setUploading(true);
      try {
        // Prepare data to send
        const formData = new FormData();
        formData.append('id', form.id);
        formData.append('title', form.title);
        formData.append('content', form.content);
        formData.append('name', form.name);
        formData.append('phone', form.phone);
        formData.append('address', form.address);
        formData.append('status', form.status);
        formData.append('note', form.note);

        // Gửi dữ liệu tới sever
        await axios.post('https://danvanthanhphothuduc.org/diemden/edit_report.php', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
    
        Alert.alert("Success", "Yêu cầu chỉnh sửa đã được gửi đi");
    
      } catch (error) {
        Alert.alert("Error", error.message);
      } finally {
        // Reset form after submission
      
        setUploading(false);
      }
    };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-secondary-200 font-psemibold">Chỉnh sửa yêu cầu</Text>

        <FormField
          title="Tiêu đề:"
          value={form.title}
          placeholder="Tiêu đề cho yêu cầu..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Image
            source={{ uri: `${SERVER_DOMAIN}/${form.image_path}` }}
            resizeMode="cover"
            style={{ width: '100%', height: 600, borderRadius: 20}} // Đặt chiều cao cụ thể
          />
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
          placeholder="10 số"
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
          title="Ngày gửi yêu cầu:"
          value={form.created_at}
          placeholder={getCurrentDate()}
          handleChangeText={(e) => setForm({ ...form, created_at: e })}
          otherStyles="mt-7"
          editable={false}
        />

        <FormField
          title="Trạng thái:"
          value={form.status}
          placeholder= "0: chưa xử lý | 1: đã xử lý"
          handleChangeText={(e) => setForm({ ...form, status: e })}
          otherStyles="mt-7"
        
        />
        <FormField
          title="Ghi chú:"
          value={form.note}
          placeholder= "Chú thích liên quan"
          handleChangeText={(e) => setForm({ ...form, note: e })}
          otherStyles="mt-7"
        />

        <CustomButton
          title="Sửa yêu cầu"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};



export default EditReport;
