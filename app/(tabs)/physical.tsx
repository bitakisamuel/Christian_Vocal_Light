import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  Heart, Wind, Mic, Users, Droplets, Clock, ChevronRight,
  CheckCircle, X, Play
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { supabase, Exercise } from '@/lib/supabase';

const categories = [
  { id: 'breathing', name: 'Breathing', icon: Wind, color: '#f59e0b', bg: '#fef3e2' },
  { id: 'vocal_warmup', name: 'Vocal Warmup', icon: Mic, color: '#8b5cf6', bg: '#ede9fe' },
  { id: 'posture', name: 'Posture', icon: Users, color: '#22c55e', bg: '#dcfce7' },
  { id: 'hydration', name: 'Hydration', icon: Droplets, color: '#3b82f6', bg: '#dbeafe' },
];

export default function PhysicalScreen() {
  const [selectedCategory, setSelectedCategory] = useState('breathing');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  useEffect(() => {
    fetchExercises();
    fetchCompletedExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [selectedCategory]);

  const fetchExercises = async () => {
    const { data, error } = await supabase
      .from('exercises')
      .select('*');

    if (!error && data) {
      setExercises(data as Exercise[]);
    }
  };

  const fetchCompletedExercises = async () => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('user_progress')
      .select('activity_id')
      .eq('section', 'physical')
      .eq('completed', true)
      .gte('completed_at', today);

    if (data) {
      setCompletedExercises(data.map((item: any) => item.activity_id));
    }
  };

  const filterExercises = () => {
    // Exercises are already loaded, UI will filter by category
  };

  const toggleExerciseComplete = async (exercise: Exercise) => {
    const isCompleted = completedExercises.includes(exercise.id);

    if (isCompleted) {
      await supabase
        .from('user_progress')
        .delete()
        .eq('activity_id', exercise.id)
        .eq('section', 'physical');
      setCompletedExercises(prev => prev.filter(id => id !== exercise.id));
    } else {
      await supabase
        .from('user_progress')
        .insert({
          section: 'physical',
          activity_id: exercise.id,
          completed: true,
          completed_at: new Date().toISOString(),
        });
      setCompletedExercises(prev => [...prev, exercise.id]);
    }
  };

  const filteredExercises = exercises.filter(e => e.category === selectedCategory);
  const currentCategory = categories.find(c => c.id === selectedCategory);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#f59e0b', '#d97706', '#b45309']}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <Heart size={28} color="#ffffff" strokeWidth={2} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Physical Preparation</Text>
            <Text style={styles.headerSubtitle}>Strengthen your vocal instrument</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completedExercises.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{exercises.length}</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}>
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                selectedCategory === cat.id && { backgroundColor: cat.color }
              ]}
              onPress={() => setSelectedCategory(cat.id)}>
              <Icon
                size={18}
                color={selectedCategory === cat.id ? '#ffffff' : cat.color}
                strokeWidth={2}
              />
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === cat.id && styles.categoryTextActive
                ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>
          {currentCategory?.name} Exercises
        </Text>
        <Text style={styles.sectionSubtitle}>
          Preparing your body is the first step to vocal excellence
        </Text>

        {filteredExercises.map((exercise) => {
          const isCompleted = completedExercises.includes(exercise.id);
          return (
            <TouchableOpacity
              key={exercise.id}
              style={styles.exerciseCard}
              onPress={() => setSelectedExercise(exercise)}
              activeOpacity={0.8}>
              <View style={[styles.exerciseIcon, { backgroundColor: currentCategory?.bg }]}>
                {isCompleted ? (
                  <CheckCircle size={24} color={currentCategory?.color} strokeWidth={2} />
                ) : (
                  <Play size={24} color={currentCategory?.color} strokeWidth={2} />
                )}
              </View>
              <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <View style={styles.exerciseMeta}>
                  <Clock size={14} color="#64748b" />
                  <Text style={styles.exerciseDuration}>
                    {exercise.duration_minutes} min
                  </Text>
                </View>
              </View>
              <ChevronRight size={20} color="#94a3b8" />
            </TouchableOpacity>
          );
        })}

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Daily Physical Checklist</Text>
          <Text style={styles.tipText}>
            For optimal vocal health and performance, complete at least 2 physical exercises daily.
            Consistency is key to building vocal strength and endurance.
          </Text>
          <Text style={styles.tipScripture}>
            "Do you not know that your body is a temple of the Holy Spirit?" - 1 Corinthians 6:19
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={!!selectedExercise}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedExercise(null)}>
        {selectedExercise && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedExercise.name}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedExercise(null)}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={styles.exerciseDescription}>
                {selectedExercise.description}
              </Text>

              <View style={styles.durationBadge}>
                <Clock size={18} color="#1e3a5f" />
                <Text style={styles.durationText}>
                  {selectedExercise.duration_minutes} minutes
                </Text>
              </View>

              <Text style={styles.sectionLabel}>Instructions</Text>
              {selectedExercise.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.instructionNumber}>
                    <Text style={styles.instructionNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}

              <Text style={styles.sectionLabel}>Benefits</Text>
              <View style={styles.benefitsGrid}>
                {selectedExercise.benefits.map((benefit, index) => (
                  <View key={index} style={styles.benefitItem}>
                    <CheckCircle size={16} color="#22c55e" />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>

              <TouchableOpacity
                style={[
                  styles.completeButton,
                  completedExercises.includes(selectedExercise.id) && styles.completedButton
                ]}
                onPress={() => toggleExerciseComplete(selectedExercise)}>
                <CheckCircle
                  size={20}
                  color={completedExercises.includes(selectedExercise.id) ? '#22c55e' : '#ffffff'}
                />
                <Text style={[
                  styles.completeButtonText,
                  completedExercises.includes(selectedExercise.id) && styles.completedButtonText
                ]}>
                  {completedExercises.includes(selectedExercise.id) ? 'Completed!' : 'Mark as Complete'}
                </Text>
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
  categoryScroll: {
    marginTop: 16,
  },
  categoryContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginRight: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    marginLeft: 8,
    color: '#64748b',
  },
  categoryTextActive: {
    color: '#ffffff',
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
  },
  sectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#64748b',
    marginBottom: 16,
  },
  exerciseCard: {
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
  exerciseIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 4,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  exerciseDuration: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#64748b',
  },
  tipCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    marginBottom: 30,
    borderLeftWidth: 4,
    borderLeftColor: '#f59e0b',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  tipTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 10,
  },
  tipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 12,
  },
  tipScripture: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#f59e0b',
    fontStyle: 'italic',
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
  exerciseDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
    marginBottom: 20,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e0e7ff',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginBottom: 24,
    gap: 8,
  },
  durationText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1e3a5f',
  },
  sectionLabel: {
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 12,
    marginTop: 8,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  instructionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1e3a5f',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  instructionNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    color: '#ffffff',
  },
  instructionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#475569',
    flex: 1,
    lineHeight: 22,
    paddingTop: 4,
  },
  benefitsGrid: {
    gap: 10,
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#475569',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e3a5f',
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 16,
    marginBottom: 30,
    gap: 10,
  },
  completedButton: {
    backgroundColor: '#dcfce7',
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  completeButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  completedButtonText: {
    color: '#22c55e',
  },
});
