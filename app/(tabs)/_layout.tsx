import { Tabs } from 'expo-router';
import { Home, Heart, BookOpen, TrendingUp } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

export default function TabLayout() {
  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarActiveTintColor: '#1e3a5f',
          tabBarInactiveTintColor: '#94a3b8',
          tabBarLabelStyle: styles.tabBarLabel,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ size, color }) => (
              <Home size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="physical"
          options={{
            title: 'Physical',
            tabBarIcon: ({ size, color }) => (
              <Heart size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="spiritual"
          options={{
            title: 'Spiritual',
            tabBarIcon: ({ size, color }) => (
              <BookOpen size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
        <Tabs.Screen
          name="career"
          options={{
            title: 'Career',
            tabBarIcon: ({ size, color }) => (
              <TrendingUp size={size} color={color} strokeWidth={2} />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabBar: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    height: 85,
    paddingBottom: 25,
    paddingTop: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  tabBarLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 11,
    marginTop: 4,
  },
});
