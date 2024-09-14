import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text, FlatList, Image, TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EmptyState, SearchInput } from "../../components";
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const SERVER_DOMAIN = "https://danvanthanhphothuduc.org/diemden"; // Thay bằng domain của server

// Cài dặt chữ cho status
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

// Cài dặt màu cho status
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

const Search = () => {
  const { query } = useLocalSearchParams();
  const [posts, setPosts] = useState([]);
  const navigation = useNavigation();
  const searchPosts = async (query) => {
    try {
      const url = `${SERVER_DOMAIN}/API_Report_App/search_reports.php?query=${encodeURIComponent(query)}`;
      const response = await axios.get(`${SERVER_DOMAIN}/search_reports.php?query=${encodeURIComponent(query)}`);
      return response.data; 
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const results = await searchPosts(query);
      setPosts(results);
    };
    fetchData();
  }, [query]);

  const handlePress = (item) => {
    navigation.navigate('detail/reportDetail', { report: item });
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id.toString()}  // Sử dụng id làm key
        renderItem={({ item }) => (
          <View className="mb-4 pl-4 pr-4" style={{ alignItems: 'flex-start' }}>
            <Text className="text-secondary-200 text-lg font-bold mb-2">{item.title} - #{item.id}</Text>
            {item.image_path ? (
              <TouchableWithoutFeedback onPress={() => handlePress(item)}>
              <Image
                source={{ uri: `${SERVER_DOMAIN}/upload/${item.image_path}` }}
                className="w-full h-96"
                resizeMode="cover"
                style={{ borderRadius: 20 }}
              />
              </TouchableWithoutFeedback>
            ) : (
              <Text className="text-white text-lg font-bold mb-2">Hình ảnh không có</Text>
            )}
            <Text className={`text-sm text-white`} style={{ paddingTop: 10 }}>
              {new Date(item.created_at).toLocaleDateString()} - Trạng thái:
              <Text className={`${getStatusColor(item.status)}`}> {getStatusText(item.status)}</Text>
            </Text>
          </View>
        )}
        ListHeaderComponent={() => (
          <>
            <View className="flex my-6 px-4">
              <Text className="font-pmedium text-gray-100 text-sm">Kết quả  tìm kiếm</Text>
              <Text className="text-2xl font-psemibold text-white mt-1">{posts.length}</Text>
              <View className="mt-6 mb-8">
                <SearchInput initialQuery={query} onSearch={setPosts} />
              </View>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="Không có kết quả"
            subtitle="Không có yêu cầu nào được tìm kiếm"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
