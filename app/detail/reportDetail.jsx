// ReportDetail.js
import {React, useState, useCallback} from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CustomButton } from "../../components";


const SERVER_DOMAIN = "https://danvanthanhphothuduc.org/diemden/upload/";

const ReportDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const { report } = route.params;

  const getStatusText = (status) => {
    switch (status) {
      case 0:
        return "Chưa xử lý";
      case 1:
        return "Đã xử lý";
      default:
        return "Không xác định";
    }
  };

  const handleEditPress = () => {
    if (report) {
      navigation.navigate('edit/editReport', { item : report }); // Truyền thông tin báo cáo đến màn hình edit_report
    }
  };

  const checkLoggedIn = useCallback(async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        setLoading(false); // Stop loading since no token
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra đăng nhập:', error);
      setLoading(false); // Stop loading in case of error
    }
  }, []);
  useFocusEffect(
    useCallback(() => {
      checkLoggedIn();
    }, [checkLoggedIn])
  );

  // Đặt này chữ cho status
  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return "text-red-500"; // Màu đỏ
      case 1:
        return "text-green-500"; // Màu xanh
      default:
        return "text-gray-400"; // Màu xám cho trạng thái không xác định
    }
  };

  // Định dạng ngày giờ theo D-M-Y H:M:S
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');

    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <SafeAreaView className="bg-primary h-full">
        <ScrollView className="px-4 my-6">
            <Text className="text-2xl text-secondary-200 font-psemibold">Chi tiết yêu cầu</Text>
            <View className="mb-4 pl-4 pr-4" style={{ alignItems: 'flex-start' }}>
                <Text className="text-secondary-200 text-lg font-bold mb-2">{report.title} - #{report.id}</Text>
                    {report.image_path ? (
                        <Image
                        source={{ uri: `${SERVER_DOMAIN}/${report.image_path}` }}
                        className="w-full h-96"
                        resizeMode="cover"
                        style={{ borderRadius: 20 }}
                        />
                    ) : (
                        <Text className="text-white text-lg font-bold mb-2">Hình ảnh không có</Text>
                    )}
                    <Text className="text-secondary-200 text-lg font-bold mb-2">Nội dung yêu cầu:</Text>
                    <Text className={`text-sm text-white`}>{report.content}</Text>
                    <Text className="text-secondary-200 text-lg font-bold mb-2">Khu vực yêu cầu:</Text>
                    <Text className={`text-sm text-white`}>{report.address}</Text>
                    <Text className="text-secondary-200 text-lg font-bold mb-2">Tên người yêu cầu:</Text>
                    <Text className={`text-sm text-white`}>{report.name}</Text>
                    <Text className="text-secondary-200 text-lg font-bold mb-2">SĐT liên hệ:</Text>
                    <Text className={`text-sm text-white`}>{report.phone}</Text>
                    <Text className="text-secondary-200 text-lg font-bold mb-2">Ngày yêu cầu:</Text>
                    <Text className={`text-sm text-white`}>{formatDate(report.created_at)}</Text>
                    <Text className="text-secondary-200 text-lg font-bold mb-2">Trạng thái:</Text>
                    <Text className={`${getStatusColor(report.status)}`}> {getStatusText(report.status)}</Text>
                    <Text className="text-secondary-200 text-lg font-bold mb-2">Ghi chú:</Text>
                    <Text className={`text-sm text-white`}> {report.note}</Text>
                    {isLoggedIn ? (
                        <CustomButton
                        title="            Chỉnh sửa yêu cầu            "
                        containerStyles="mt-7"
                        isLoading={uploading}
                        handlePress={handleEditPress}
                        
                      />
                    ):null}
            </View>
        </ScrollView>
    </SafeAreaView>
  );
};




export default ReportDetail;

