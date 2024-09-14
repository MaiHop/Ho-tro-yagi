import { useState, useEffect, useCallback } from "react";
import { SafeAreaView, FlatList, Image, Text, View, RefreshControl, TouchableWithoutFeedback } from "react-native";
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EmptyState, SearchInput} from "../../components";
import { images } from "../../constants";
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

// Dòng 22 hàm axios.get cần sửa DOMAIN
const SERVER_DOMAIN = "https://danvanthanhphothuduc.org/diemden/upload/";

const Home = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Hàm lấy dữ liệu
  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://danvanthanhphothuduc.org/diemden/get_reports.php', {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  //Hàm Refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };
 //Hàm chuyển đến chi tiết
  const handlePress = (item) => {
    navigation.navigate('detail/reportDetail', { report: item });
  };

  //Hàm tìm kiếm
  const handleSearch = (searchResults) => {
    setPosts(searchResults); // Cập nhật posts với kết quả tìm kiếm
  };

  //Hàm kiểm tra đăng nhập
  const checkLoggedIn = useCallback(async () => {
    try {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        setIsLoggedIn(true);
        fetchPosts();
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

  if (loading) {
    return (
      <SafeAreaView className="bg-primary flex-1 justify-center items-center">
        <Text className="text-white">Đang tải...</Text>
      </SafeAreaView>
    );
  }

  if (!isLoggedIn) {
    return (
      <SafeAreaView className="bg-primary flex-1">
        
      <FlatList   
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6" style={{ alignItems: 'flex-start', paddingTop: 15, marginBottom: 0 }}>
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-white">
                  <Text className="text-red-500">Cấp cứu </Text>
                    hỗ trợ
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  Bão
                  <Text className="text-green-500"> Yagi </Text>
                </Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logo1}
                  className="w-14 h-14"
                  resizeMode="contain"
                />
              </View>
            </View>

            <SearchInput onSearch={handleSearch}/>

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-lg font-pregular text-gray-100 mb-3" style={{ marginBottom: 0 }}>Yêu cầu hỗ trợ gần đây</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="Chưa có yêu cầu hỗ trợ"
            subtitle="Nhập mã yêu cầu hoặc sđt để xem các yêu cầu"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
    );
  }else{
    return (
      <SafeAreaView className="bg-primary flex-1">
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id.toString()}  // Sử dụng id làm key
          renderItem={({ item }) => (
            <View className="mb-4 pl-4 pr-4" style={{ alignItems: 'flex-start' }}>
              <Text className="text-secondary-200 text-lg font-bold mb-2">{item.title} - #{item.id}</Text>
              
              {item.image_path ? (
                  <TouchableWithoutFeedback onPress={() => handlePress(item)}>
                  <Image
                    source={{ uri: `${SERVER_DOMAIN}/${item.image_path}` }}
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
            <View className="flex my-6 px-4 space-y-6" style={{ alignItems: 'flex-start', paddingTop: 15, marginBottom: 0 }}>
              <View className="flex justify-between items-start flex-row mb-6">
                <View>
                  <Text className="font-pmedium text-sm text-white">
                    <Text className="text-red-500">Cứu trợ  </Text>
                      cứu nạn
                  </Text>
                  <Text className="text-2xl font-psemibold text-white">
                    Bão
                    <Text className="text-green-500"> Yagi </Text>
                  </Text>
                </View>
                <View className="mt-1.5">
                  <Image
                    source={images.logo1}
                    className="w-14 h-14"
                    resizeMode="contain"
                  />
                </View>
              </View>
  
              <SearchInput onSearch={handleSearch}/>
  
              <View className="w-full flex-1 pt-5 pb-8">
                <Text className="text-lg font-pregular text-secondary-200 mb-3" style={{ marginBottom: 0 }}>Yêu cầu hỗ trợ gần đây</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <EmptyState
              title="Chưa có yêu cầu hỗ trợ"
              subtitle="Nhập mã yêu cầu hoặc sđt để xem các yêu cầu"
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      </SafeAreaView>
    );
  }


};

export default Home;
