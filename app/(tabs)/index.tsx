import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Link } from 'expo-router';
import { Heart, BookOpen, TrendingUp, Music, Calendar, ChevronRight, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [todayProgress, setTodayProgress] = useState({
    physical: 0,
    spiritual: 0,
    career: 0,
  });

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('user_progress')
      .select('section, completed')
      .eq('completed_at', today);

    if (data) {
      const counts = { physical: 0, spiritual: 0, career: 0 };
      data.forEach((item: any) => {
        if (item.completed && counts.hasOwnProperty(item.section)) {
          counts[item.section as keyof typeof counts]++;
        }
      });
      setTodayProgress(counts);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#1e3a5f', '#2d5a87', '#3b7ab0']}
          style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Music size={32} color="#ffffff" strokeWidth={2} />
              <Star size={16} color="#fbbf24" fill="#fbbf24" style={styles.starIcon} />
            </View>
            <Text style={styles.appName}>Light Vocal Academy</Text>
            <Text style={styles.subtitle}>Christian Vocal Ministry Training</Text>
            <Text style={styles.creatorText}>by Samuel Bitaki</Text>
          </View>
          <View style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Welcome, Vocal Minister!</Text>
            <Text style={styles.welcomeText}>
              Train your voice, nourish your spirit, and grow in your calling.
            </Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Today's Preparation</Text>
          <Text style={styles.sectionSubtitle}>
            "Whatever you do, work at it with all your heart, as working for the Lord."
          </Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressCard}>
              <View style={[styles.progressIcon, { backgroundColor: '#fef3e2' }]}>
                <Heart size={24} color="#f59e0b" strokeWidth={2} />
              </View>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Physical</Text>
                <Text style={styles.progressValue}>{todayProgress.physical} activities</Text>
              </View>
              <Link href="/physical" asChild>
                <TouchableOpacity style={styles.progressArrow}>
                  <ChevronRight size={20} color="#64748b" />
                </TouchableOpacity>
              </Link>
            </View>

            <View style={styles.progressCard}>
              <View style={[styles.progressIcon, { backgroundColor: '#ede9fe' }]}>
                <BookOpen size={24} color="#8b5cf6" strokeWidth={2} />
              </View>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Spiritual</Text>
                <Text style={styles.progressValue}>{todayProgress.spiritual} activities</Text>
              </View>
              <Link href="/spiritual" asChild>
                <TouchableOpacity style={styles.progressArrow}>
                  <ChevronRight size={20} color="#64748b" />
                </TouchableOpacity>
              </Link>
            </View>

            <View style={styles.progressCard}>
              <View style={[styles.progressIcon, { backgroundColor: '#dcfce7' }]}>
                <TrendingUp size={24} color="#22c55e" strokeWidth={2} />
              </View>
              <View style={styles.progressInfo}>
                <Text style={styles.progressLabel}>Career</Text>
                <Text style={styles.progressValue}>{todayProgress.career} activities</Text>
              </View>
              <Link href="/career" asChild>
                <TouchableOpacity style={styles.progressArrow}>
                  <ChevronRight size={20} color="#64748b" />
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          <Text style={styles.missionTitle}>Our Mission</Text>
          <View style={styles.missionCard}>
            <Text style={styles.missionText}>
              This app is designed to help Christian vocal ministers prepare holistically for their ministry.
              True worship leading involves preparing your body, spirit, and career skills.
              Samuel Bitaki created this platform to guide you through:
            </Text>
            <View style={styles.missionList}>
              <View style={styles.missionItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.missionItemText}>Physical vocal exercises and health</Text>
              </View>
              <View style={styles.missionItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.missionItemText}>Spiritual devotion and growth</Text>
              </View>
              <View style={styles.missionItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.missionItemText}>Career development in gospel music</Text>
              </View>
            </View>
          </View>

          <View style={styles.quickStartSection}>
            <Text style={styles.quickStartTitle}>Quick Start</Text>
            <Link href="/physical" asChild>
              <TouchableOpacity style={styles.quickStartCard}>
                <View style={[styles.quickStartIcon, { backgroundColor: '#2563eb' }]}>
                  <Music size={28} color="#ffffff" strokeWidth={2} />
                </View>
                <View style={styles.quickStartInfo}>
                  <Text style={styles.quickStartLabel}>Start Vocal Warmup</Text>
                  <Text style={styles.quickStartSubtext}>5-10 minute exercises</Text>
                </View>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  starIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  appName: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  creatorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontStyle: 'italic',
  },
  welcomeCard: {
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  welcomeTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#1e3a5f',
    marginBottom: 8,
  },
  welcomeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    color: '#1e293b',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#64748b',
    marginBottom: 16,
    fontStyle: 'italic',
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  progressIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 2,
  },
  progressValue: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#64748b',
  },
  progressArrow: {
    padding: 8,
  },
  missionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1e293b',
    marginBottom: 12,
  },
  missionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 24,
  },
  missionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 16,
  },
  missionList: {
    gap: 10,
  },
  missionItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1e3a5f',
    marginRight: 12,
  },
  missionItemText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#1e293b',
  },
  quickStartSection: {
    marginBottom: 30,
  },
  quickStartTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1e293b',
    marginBottom: 12,
  },
  quickStartCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e3a5f',
    borderRadius: 16,
    padding: 18,
  },
  quickStartIcon: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quickStartInfo: {
    flex: 1,
  },
  quickStartLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    color: '#ffffff',
    marginBottom: 4,
  },
  quickStartSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: 'rgba(255,255,255,0.7)',
  },
});
