import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Home } from 'lucide-react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Text style={styles.emojiNum}>404</Text>
        </View>
        <Text style={styles.title}>Page Not Found</Text>
        <Text style={styles.subtitle}>
          This screen doesn't exist in the app.
        </Text>
        <Link href="/" asChild>
          <TouchableOpacity style={styles.homeButton}>
            <Home size={20} color="#ffffff" />
            <Text style={styles.homeButtonText}>Go to Home</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#1e3a5f',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emojiNum: {
    fontFamily: 'Inter-Bold',
    fontSize: 36,
    color: '#ffffff',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
    textAlign: 'center',
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e3a5f',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  homeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
});
