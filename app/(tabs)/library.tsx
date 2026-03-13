import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { getSavedScripts, removeSavedScript, MAX_SAVED_SCRIPTS, SavedScript } from '@/lib/childProfile';
import { colors, spacing, radius, shadow } from '@/lib/theme';

export default function ScriptLibrary() {
  const [scripts, setScripts] = useState<SavedScript[]>([]);

  const loadScripts = useCallback(() => {
    getSavedScripts().then((saved) => setScripts(saved));
  }, []);

  useFocusEffect(useCallback(() => { loadScripts(); }, [loadScripts]));

  const handleDelete = (id: string) => {
    Alert.alert('Remove script', 'Remove this saved script?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => {
          removeSavedScript(id).then(() => loadScripts());
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.title}>Saved Scripts</Text>
        <Text style={styles.limitNote}>
          {scripts.length} / {MAX_SAVED_SCRIPTS} saved
        </Text>
      </View>

      {scripts.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📖</Text>
          <Text style={styles.emptyTitle}>No saved scripts yet</Text>
          <Text style={styles.emptySub}>
            After generating a crisis script, tap Save to keep it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={scripts}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.card, shadow.soft]}>
              <View style={styles.cardHeader}>
                <Text style={styles.trigger}>{item.trigger}</Text>
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Text style={styles.deleteBtn}>✕</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.situation} numberOfLines={2}>
                {item.situation}
              </Text>
              <Text style={styles.date}>
                {new Date(item.savedAt).toLocaleDateString()}
              </Text>
            </View>
          )}
        />
      )}

      {scripts.length >= MAX_SAVED_SCRIPTS && (
        <View style={styles.limitBanner}>
          <Text style={styles.limitBannerText}>
            🔒 Free plan limit reached. Delete a script or upgrade to save more.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: { fontSize: 24, fontWeight: '700', color: colors.text },
  limitNote: { fontSize: 13, color: colors.grayLight, fontWeight: '500' },
  list: { paddingHorizontal: spacing.md, paddingBottom: spacing.xxl },
  card: {
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  trigger: { fontSize: 14, fontWeight: '700', color: colors.primary },
  deleteBtn: { fontSize: 16, color: colors.grayLight, padding: 2 },
  situation: { fontSize: 14, color: colors.text, lineHeight: 20, marginBottom: 6 },
  date: { fontSize: 12, color: colors.grayLight },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  emptyIcon: { fontSize: 48, marginBottom: spacing.md },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 8 },
  emptySub: { fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 20 },
  limitBanner: {
    margin: spacing.md,
    backgroundColor: colors.amberLight,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  limitBannerText: { fontSize: 13, color: colors.clay, textAlign: 'center' },
});
