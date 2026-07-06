// screens/ChangePasswordScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { API_URL } from '../../../config/api';

export default function ChangePasswordScreen() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChanging, setIsChanging] = useState(false);

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin!');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu không khớp!');
      return;
    }

    try {
      setIsChanging(true);
      const token = await AsyncStorage.getItem('token');

      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          oldPassword: oldPassword,
          newPassword: newPassword
        })
      });

      const data = await response.json();

      if (response.ok && (data.success || data.message === 'Thành công')) {
        Alert.alert('Thành công', 'Đổi mật khẩu thành công!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Lỗi', data.message || 'Mật khẩu cũ không chính xác hoặc có lỗi xảy ra.');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến máy chủ. Vui lòng thử lại sau.');
    } finally {
      setIsChanging(false);
    }
  };

  const handleBack = () => {
    router.replace('/tabs/ProfileScreen');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name='arrow-back' size={24} color="#0d0c0c" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Mật khẩu hiện tại</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Nhập mật khẩu hiện tại" 
              secureTextEntry 
              value={oldPassword} 
              onChangeText={setOldPassword}
            />
          </View>

          <Text style={styles.formLabel}>Mật khẩu mới</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="key-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Nhập mật khẩu mới" 
              secureTextEntry 
              value={newPassword} 
              onChangeText={setNewPassword}
            />
          </View>

          <Text style={styles.formLabel}>Xác nhận mật khẩu mới</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="checkmark-done-outline" size={20} color="#666" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="Nhập lại mật khẩu mới" 
              secureTextEntry 
              value={confirmPassword} 
              onChangeText={setConfirmPassword}
            />
          </View>

          <TouchableOpacity 
            style={[styles.submitButton, isChanging && { opacity: 0.7 }]} 
            onPress={handleChangePassword} 
            disabled={isChanging}
          >
            {isChanging ? 
              <ActivityIndicator color="#fff" /> : 
              <Text style={styles.submitButtonText}>Xác nhận đổi mật khẩu</Text>
            }
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
   backgroundColor: '#f5f5f5',
        paddingVertical: 20,
        paddingHorizontal: 20,
        paddingTop: 10,
        marginTop:18,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#e8e8e8',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f0c0c',
  },
  formContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: '#333',
  },
  submitButton: {
    backgroundColor: '#214D8A',
    borderRadius: 10,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  }
});