// app/(tabs)/index.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  TextInput, 
  ScrollView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define our high-level triggers
const TRIGGERS = [
  { id: 'feelings', label: 'Big Feelings', icon: 'water-outline', color: '#3B82F6' }, // blue-500
  { id: 'aggression', label: 'Aggression', icon: 'warning-outline', color: '#EF4444' }, // red-500
  { id: 'sleep', label: 'Sleep Struggles', icon: 'moon-outline', color: '#8B5CF6' }, // purple-500
  { id: 'school', label: 'School Refusal', icon: 'school-outline', color: '#F59E0B' }, // amber-500
];

export default function SupportDashboard() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedTrigger, setSelectedTrigger] = useState<string | null>(null);
  const [specificDetails, setSpecificDetails] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [script, setScript] = useState<{
    regulate: string;
    connect: string;
    guide: string;
    whatIf: string;
  } | null>(null);

  // --- Step 1: Select a Trigger ---
  const handleTriggerSelect = (triggerId: string) => {
    setSelectedTrigger(triggerId);
    setStep(2);
  };

  // --- Step 2: Generate Script (Mock API Call for now) ---
  const handleGenerateScript = async () => {
    if (!specificDetails.trim()) return;
    
    setIsLoading(true);
    setStep(3);

    // Simulate network request to your Gemini Edge Function
    setTimeout(() => {
      setScript({
        regulate: "Take a deep breath. Lower your physical level to match theirs.",
        connect: `I see how hard this is. You are having a really tough time with ${specificDetails}.`,
        guide: "It is my job to keep you safe. I am going to move this toy so nobody gets hurt.",
        whatIf: "If they continue escalating, offer silent presence. 'I will sit right here until you are ready.'"
      });
      setIsLoading(false);
    }, 2000);
  };

  // --- Reset to start ---
  const handleReset = () => {
    setStep(1);
    setSelectedTrigger(null);
    setSpecificDetails('');
    setScript(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }}>
        
        {/* HEADER */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">Support</Text>
          <Text className="text-gray-500 text-base">
            {step === 1 ? 'What is happening right now?' : 
             step === 2 ? 'Add a quick detail.' : 
             'Here is your script.'}
          </Text>
        </View>

        {/* STEP 1: TRIGGER GRID */}
        {step === 1 && (
          <View className="flex-row flex-wrap justify-between gap-y-4">
            {TRIGGERS.map((trigger) => (
              <TouchableOpacity
                key={trigger.id}
                onPress={() => handleTriggerSelect(trigger.id)}
                className="w-[48%] bg-white p-6 rounded-2xl border border-gray-100 shadow-sm items-center justify-center aspect-square"
              >
                <View className="w-14 h-14 rounded-full items-center justify-center mb-3" style={{ backgroundColor: `${trigger.color}15` }}>
                  <Ionicons name={trigger.icon as any} size={28} color={trigger.color} />
                </View>
                <Text className="font-semibold text-gray-800 text-center">{trigger.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* STEP 2: SPECIFIC DETAILS */}
        {step === 2 && (
          <View className="flex-1 animate-fade-in">
            <TouchableOpacity onPress={handleReset} className="mb-6 flex-row items-center">
              <Ionicons name="arrow-back" size={20} color="#6B7280" />
              <Text className="text-gray-500 ml-2 font-medium">Back to triggers</Text>
            </TouchableOpacity>

            <View className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-6">
              <Text className="text-gray-900 font-semibold mb-4 text-lg">
                What specifically is triggering the {TRIGGERS.find(t => t.id === selectedTrigger)?.label.toLowerCase()}?
              </Text>
              <TextInput
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 text-base min-h-[100px]"
                placeholder="e.g., throwing toys, refusing to put on shoes..."
                placeholderTextColor="#9CA3AF"
                multiline
                textAlignVertical="top"
                value={specificDetails}
                onChangeText={setSpecificDetails}
              />
            </View>

            <TouchableOpacity 
              onPress={handleGenerateScript}
              disabled={!specificDetails.trim()}
              className={`w-full py-4 rounded-xl items-center ${
                specificDetails.trim() ? 'bg-[#EAA05B]' : 'bg-gray-300'
              }`}
            >
              <Text className="text-white font-bold text-lg">Generate Script</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* STEP 3: THE SCRIPT */}
        {step === 3 && (
          <View className="flex-1 animate-fade-in pb-10">
            {isLoading ? (
              <View className="flex-1 items-center justify-center py-20">
                <ActivityIndicator size="large" color="#EAA05B" />
                <Text className="text-gray-500 mt-4 font-medium">Finding the right words...</Text>
              </View>
            ) : script ? (
              <View className="gap-4">
                {/* 1. Regulate */}
                <View className="bg-blue-50/50 border border-blue-100 p-5 rounded-2xl">
                  <Text className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">1. Regulate</Text>
                  <Text className="text-gray-800 text-base leading-relaxed">{script.regulate}</Text>
                </View>

                {/* 2. Connect */}
                <View className="bg-orange-50/50 border border-orange-100 p-5 rounded-2xl">
                  <Text className="text-xs font-bold text-[#EAA05B] uppercase tracking-widest mb-2">2. Connect</Text>
                  <Text className="text-gray-900 font-medium text-lg leading-relaxed">"{script.connect}"</Text>
                </View>

                {/* 3. Guide */}
                <View className="bg-green-50/50 border border-green-100 p-5 rounded-2xl">
                  <Text className="text-xs font-bold text-green-600 uppercase tracking-widest mb-2">3. Guide</Text>
                  <Text className="text-gray-800 text-base leading-relaxed">{script.guide}</Text>
                </View>

                {/* 4. What If */}
                <View className="bg-gray-50 border border-gray-200 p-5 rounded-2xl">
                  <Text className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">What if it escalates?</Text>
                  <Text className="text-gray-600 text-sm leading-relaxed">{script.whatIf}</Text>
                </View>

                <TouchableOpacity 
                  onPress={handleReset}
                  className="mt-6 border border-gray-300 py-4 rounded-xl items-center bg-white"
                >
                  <Text className="text-gray-600 font-bold text-base">Start Over</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}