import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  TrendingUp, Briefcase, Users, Mic2, Disc, FileText,
  ChevronRight, X, CheckCircle, BookMarked, Star
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { supabase, CareerTip } from '@/lib/supabase';

const careerCategories = [
  { id: 'portfolio', name: 'Portfolio', icon: FileText, color: '#3b82f6', bg: '#dbeafe' },
  { id: 'networking', name: 'Networking', icon: Users, color: '#22c55e', bg: '#dcfce7' },
  { id: 'performance', name: 'Performance', icon: Mic2, color: '#f59e0b', bg: '#fef3e2' },
  { id: 'recording', name: 'Recording', icon: Disc, color: '#8b5cf6', bg: '#ede9fe' },
];

export default function CareerScreen() {
  const [selectedCategory, setSelectedCategory] = useState('portfolio');
  const [careerTips, setCareerTips] = useState<CareerTip[]>([]);
  const [selectedTip, setSelectedTip] = useState<CareerTip | null>(null);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);

  useEffect(() => {
    fetchCareerTips();
    fetchCompletedSteps();
  }, []);

  const fetchCareerTips = async () => {
    const { data, error } = await supabase
      .from('career_tips')
      .select('*');

    if (!error && data) {
      setCareerTips(data as CareerTip[]);
    }
  };

  const fetchCompletedSteps = async () => {
    const { data } = await supabase
      .from('user_progress')
      .select('activity_id')
      .eq('section', 'career')
      .eq('completed', true);

    if (data) {
      setCompletedSteps(data.map((item: any) => item.activity_id));
    }
  };

  const toggleStepComplete = async (stepId: string) => {
    const isCompleted = completedSteps.includes(stepId);

    if (isCompleted) {
      await supabase
        .from('user_progress')
        .delete()
        .eq('activity_id', stepId)
        .eq('section', 'career');
      setCompletedSteps(prev => prev.filter(id => id !== stepId));
    } else {
      await supabase
        .from('user_progress')
        .insert({
          section: 'career',
          activity_id: stepId,
          completed: true,
          completed_at: new Date().toISOString(),
        });
      setCompletedSteps(prev => [...prev, stepId]);
    }
  };

  const filteredTips = careerTips.filter(tip => tip.category === selectedCategory);
  const currentCategory = careerCategories.find(c => c.id === selectedCategory);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <LinearGradient
        colors={['#22c55e', '#16a34a', '#15803d']}
        style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerIcon}>
            <TrendingUp size={28} color="#ffffff" strokeWidth={2} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Career Growth</Text>
            <Text style={styles.headerSubtitle}>Build your ministry professionally</Text>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{completedSteps.length}</Text>
            <Text style={styles.statLabel}>Steps Done</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{careerTips.reduce((sum, tip) => sum + tip.action_steps.length, 0)}</Text>
            <Text style={styles.statLabel}>Total Steps</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryScroll}
        contentContainerStyle={styles.categoryContent}>
        {careerCategories.map((cat) => {
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
          {currentCategory?.name} Guidance
        </Text>
        <Text style={styles.sectionSubtitle}>
          Practical steps to advance your gospel music career
        </Text>

        {filteredTips.map((tip) => {
          const Icon = currentCategory?.icon || FileText;
          return (
          <TouchableOpacity
            key={tip.id}
            style={styles.tipCard}
            onPress={() => setSelectedTip(tip)}>
            <View style={styles.tipHeader}>
              <View style={[styles.tipIcon, { backgroundColor: currentCategory?.bg }]}>
                <Icon
                  size={20}
                  color={currentCategory?.color}
                  strokeWidth={2}
                />
              </View>
              <View style={styles.tipInfo}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipScripture} numberOfLines={1}>
                  {tip.scripture_reference || 'Guided by scripture'}
                </Text>
              </View>
              <ChevronRight size={20} color="#94a3b8" />
            </View>
            <Text style={styles.tipPreview} numberOfLines={2}>
              {tip.content}
            </Text>
            <View style={styles.progressRow}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${(tip.action_steps.filter((_, i) => completedSteps.includes(`${tip.id}-${i}`)).length / tip.action_steps.length) * 100}%`,
                      backgroundColor: currentCategory?.color
                    }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {tip.action_steps.filter((_, i) => completedSteps.includes(`${tip.id}-${i}`)).length}/{tip.action_steps.length}
              </Text>
            </View>
          </TouchableOpacity>
          );
        })}

        <View style={styles.missionCard}>
          <View style={styles.missionHeader}>
            <BookMarked size={24} color="#22c55e" />
            <Text style={styles.missionTitle}>Your Calling Matters</Text>
          </View>
          <Text style={styles.missionText}>
            God has gifted you with a voice for ministry. Your career growth isn't just about success
            - it's about expanding your reach to touch more lives with the message of Christ through music.
            Every step you take professionally should align with your spiritual calling.
          </Text>
          <Text style={styles.missionScripture}>
            " For we are his workmanship, created in Christ Jesus for good works,
            which God prepared beforehand, that we should walk in them." - Ephesians 2:10
          </Text>
        </View>

        <View style={styles.featuredCard}>
          <View style={styles.featuredHeader}>
            <Star size={16} color="#fbbf24" fill="#fbbf24" />
            <Text style={styles.featuredLabel}>From Light Vocal Academy</Text>
          </View>
          <Text style={styles.featuredTitle}>
            "Your gift is a ministry, not just a career."
          </Text>
          <Text style={styles.featuredMessage}>
            I created this app because I believe vocal ministers need holistic preparation.
            Your voice is an instrument of worship. Treat it with excellence,
            prepare spiritually before every performance, and always remember whose glory you seek.
          </Text>
        </View>
      </ScrollView>

      <Modal
        visible={!!selectedTip}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedTip(null)}>
        {selectedTip && (
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{selectedTip.title}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setSelectedTip(null)}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {selectedTip.scripture_reference && (
                <View style={styles.scriptureBox}>
                  <BookMarked size={18} color="#22c55e" />
                  <Text style={styles.scriptureText}>{selectedTip.scripture_reference}</Text>
                </View>
              )}

              <Text style={styles.guideContent}>{selectedTip.content}</Text>

              <Text style={styles.sectionLabel}>Action Steps</Text>
              {selectedTip.action_steps.map((step, index) => {
                const stepId = `${selectedTip.id}-${index}`;
                const isCompleted = completedSteps.includes(stepId);
                return (
                  <TouchableOpacity
                    key={index}
                    style={styles.actionItem}
                    onPress={() => toggleStepComplete(stepId)}>
                    <View style={[
                      styles.actionCheckbox,
                      isCompleted && { backgroundColor: '#22c55e', borderColor: '#22c55e' }
                    ]}>
                      {isCompleted && <CheckCircle size={14} color="#ffffff" />}
                    </View>
                    <Text style={[
                      styles.actionText,
                      isCompleted && styles.actionCompleted
                    ]}>
                      {step}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => {
                  selectedTip.action_steps.forEach((_, index) => {
                    toggleStepComplete(`${selectedTip.id}-${index}`);
                  });
                  // Close modal after completing all
                  setTimeout(() => setSelectedTip(null), 500);
                }}>
                <CheckCircle size={20} color="#ffffff" />
                <Text style={styles.applyButtonText}>Mark All as Complete</Text>
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
  tipCard: {
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
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipInfo: {
    flex: 1,
  },
  tipTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 2,
  },
  tipScripture: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#22c55e',
    fontStyle: 'italic',
  },
  tipPreview: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 10,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e2e8f0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#64748b',
  },
  missionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginTop: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#22c55e',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  missionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    color: '#1e293b',
  },
  missionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 12,
  },
  missionScripture: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#22c55e',
    fontStyle: 'italic',
  },
  featuredCard: {
    backgroundColor: '#1e3a5f',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  featuredLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  featuredTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 17,
    color: '#ffffff',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  featuredMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 22,
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
    fontSize: 18,
    color: '#1e293b',
    flex: 1,
    marginRight: 10,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  scriptureBox: {
    backgroundColor: '#dcfce7',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 12,
  },
  scriptureText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#15803d',
    flex: 1,
    lineHeight: 22,
    fontStyle: 'italic',
  },
  guideContent: {
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
    marginBottom: 14,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
    gap: 12,
  },
  actionCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#d1d5db',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  actionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: '#475569',
    flex: 1,
    lineHeight: 22,
  },
  actionCompleted: {
    color: '#94a3b8',
    textDecorationLine: 'line-through',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 14,
    paddingVertical: 16,
    marginTop: 16,
    marginBottom: 30,
    gap: 10,
  },
  applyButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
});
