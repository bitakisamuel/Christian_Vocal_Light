import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  BookOpen, Calendar, Sun, Moon, Star, Heart,
  ChevronRight, X, CheckCircle, MessageCircle
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { supabase, Devotional } from '@/lib/supabase';

const spiritualActivities = [
  { id: 'morning_prayer', name: 'Morning Prayer', icon: Sun, color: '#f59e0b' },
  { id: 'scripture_reading', name: 'Scripture Reading', icon: BookOpen, color: '#3b82f6' },
  { id: 'worship_meditation', name: 'Worship Meditation', icon: Star, color: '#8b5cf6' },
  { id: 'evening_reflection', name: 'Evening Reflection', icon: Moon, color: '#6366f1' },
];

export default function SpiritualScreen() {
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [selectedDevotional, setSelectedDevotional] = useState<Devotional | null>(null);
  const [completedActivities, setCompletedActivities] = useState<string[]>([]);

  useEffect(() => {
    fetchDevotionals();
    fetchCompletedActivities();
  }, []);

  const fetchDevotionals = async () => {
    const { data, error } = await supabase
      .from('daily_devotionals')
      .select('*')
      .order('date', { ascending: false })
      .limit(7);

    if (!error && data) {
      setDevotionals(data as Devotional[]);
    }
  };

  const fetchCompletedActivities = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('user_progress')
      .select('activity_id')
      .eq('section', 'spiritual')
      .eq('completed', true)
      .gte('completed_at', today);

    if (data) {
      setCompletedActivities(data.map((item: any) => item.activity_id));
    }
  };

  const toggleActivityComplete = async (activityId: string) => {
    const isCompleted = completedActivities.includes(activityId);

    if (isCompleted) {
      await supabase
        .from('user_progress')
        .delete()
        .eq('activity_id', activityId)
        .eq('section', 'spiritual');
      setCompletedActivities(prev => prev.filter(id => id !== activityId));
    } else {
      await supabase
        .from('user_progress')
        .insert({
          section: 'spiritual',
          activity_id: activityId,
          completed: true,
          completed_at: new Date().toISOString(),
        });
      setCompletedActivities(prev => [...prev, activityId]);
    }
  };

  const todayDevotional = devotionals[0];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#8b5cf6', '#7c3aed', '#6d28d9']}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <BookOpen size={28} color="#ffffff" strokeWidth={2} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Spiritual Preparation</Text>
            <Text style={styles.headerSubtitle}>Nourish your spirit for ministry</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completedActivities.length}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{spiritualActivities.length}</Text>
            <Text style={styles.statLabel}>Daily Goals</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Daily Spiritual Practices</Text>
        <Text style={styles.sectionSubtitle}>
          Complete each daily activity to strengthen your spirit
        </Text>

        <View style={styles.activitiesGrid}>
          {spiritualActivities.map((activity) => {
            const Icon = activity.icon;
            const isCompleted = completedActivities.includes(activity.id);
            return (
              <TouchableOpacity
                key={activity.id}
                style={[
                  styles.activityCard,
                  isCompleted && { borderColor: '#22c55e', borderWidth: 2 }
                ]}
                onPress={() => toggleActivityComplete(activity.id)}>
                <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
                  <Icon size={24} color={activity.color} strokeWidth={2} />
                </View>
                <Text style={styles.activityName}>{activity.name}</Text>
                {isCompleted && (
                  <View style={styles.completedBadge}>
                    <CheckCircle size={16} color="#22c55e" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Today's Devotional</Text>
        {todayDevotional && (
          <TouchableOpacity
            style={styles.devotionalCard}
            onPress={() => setSelectedDevotional(todayDevotional)}>
            <View style={styles.devotionalHeader}>
              <View style={styles.calendarBadge}>
                <Calendar size={18} color="#ffffff" />
                <Text style={styles.calendarText}>Daily</Text>
              </View>
              <ChevronRight size={20} color="#94a3b8" />
            </View>
            <Text style={styles.devotionalTitle}>{todayDevotional.title}</Text>
            <Text style={styles.devotionalScripture}>{todayDevotional.scripture}</Text>
            <Text style={styles.devotionalPreview} numberOfLines={2}>
              {todayDevotional.message}
            </Text>
          </TouchableOpacity>
        )}

        <Text style={styles.sectionTitle}>Recent Devotionals</Text>
        {devotionals.slice(1).map((devotional) => (
          <TouchableOpacity
            key={devotional.id}
            style={styles.miniDevotionalCard}
            onPress={() => setSelectedDevotional(devotional)}>
            <View style={styles.miniDevotionalContent}>
              <Text style={styles.miniDevotionalTitle}>{devotional.title}</Text>
              <Text style={styles.miniDevotionalDate}>
                {new Date(devotional.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                })}
              </Text>
            </View>
            <ChevronRight size={18} color="#94a3b8" />
          </TouchableOpacity>
        ))}

        <View style={styles.scriptureCard}>
          <Text style={styles.scriptureText}>
            "Let the word of Christ dwell in you richly, teaching and admonishing one another in all wisdom, singing psalms and hymns and spiritual songs, with thankfulness in your hearts to God."
          </Text>
          <Text style={styles.scriptureReference}>Colossians 3:16</Text>
        </View>
      </ScrollView>

      <Modal
        visible={!!selectedDevotional}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedDevotional(null)}>
        {selectedDevotional && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedDevotional.title}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedDevotional(null)}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <View style={styles.scriptureBox}>
                <BookOpen size={20} color="#8b5cf6" />
                <Text style={styles.modalScripture}>{selectedDevotional.scripture}</Text>
              </View>

              <Text style={styles.devotionalMessage}>
                {selectedDevotional.message}
              </Text>

              <Text style={styles.sectionLabel}>Prayer Points</Text>
              {selectedDevotional.prayer_points.map((point, index) => (
                <View key={index} style={styles.prayerItem}>
                  <View style={styles.prayerBullet}>
                    <MessageCircle size={12} color="#ffffff" />
                  </View>
                  <Text style={styles.prayerText}>{point}</Text>
                </View>
              ))}

              <TouchableOpacity
                style={styles.prayButton}
                onPress={() => {
                  toggleActivityComplete('scripture_reading');
                  setSelectedDevotional(null);
                }}>
                <Heart size={20} color="#ffffff" />
                <Text style={styles.prayButtonText}>Mark Scripture Reading Complete</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        )}
      </Modal>
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
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  headerTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 30,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  statValue: {
    fontFamily: 'Inter-Bold',
    fontSize: 28,
    color: '#ffffff',
  },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1e293b',
    marginBottom: 4,
    marginTop: 4,
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  activitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  activityCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  activityIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  activityName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1e293b',
    textAlign: 'center',
  },
  completedBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  devotionalCard: {
    backgroundColor: '#8b5cf6',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  devotionalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calendarBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    gap: 6,
  },
  calendarText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#ffffff',
  },
  devotionalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 8,
  },
  devotionalScripture: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  devotionalPreview: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
  },
  miniDevotionalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  miniDevotionalContent: {
    flex: 1,
  },
  miniDevotionalTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#1e293b',
    marginBottom: 2,
  },
  miniDevotionalDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#94a3b8',
  },
  scriptureCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  scriptureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  scriptureReference: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: '#8b5cf6',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1e293b',
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  scriptureBox: {
    backgroundColor: '#ede9fe',
    borderRadius: 14,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#8b5cf6',
  },
  modalScripture: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: '#5b21b6',
    flex: 1,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  devotionalMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#475569',
    lineHeight: 26,
    marginBottom: 24,
  },
  sectionLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 12,
  },
  prayerItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  prayerBullet: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#8b5cf6',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  prayerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#475569',
    flex: 1,
    lineHeight: 24,
  },
  prayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8b5cf6',
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 16,
    marginBottom: 30,
    gap: 10,
  },
  prayButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
});
