import { MemoryGameObject, GameQuestion, Difficulty, CognitiveGameMeta } from '@/types/game'
import { SupportedLanguage } from '@/types/language'

// Culturally familiar objects from North Eastern India and broader heritage,
// designed for elderly recall and emotional resonance.
export const FAMILIAR_OBJECTS: MemoryGameObject[] = [
  {
    id: 'obj_rhino',
    name: 'Kaziranga Rhino',
    hindiName: 'एक सींग वाला गैंडा (Rhino)',
    assameseName: 'এশিঙীয়া গঁড়',
    category: 'Nature',
    emoji: '🦏',
    description: 'Majestic one-horned rhinoceros of Kaziranga National Park',
    voicePrompt: 'One-horned rhino, the pride of Kaziranga',
    names: {
      en: 'Kaziranga Rhino',
      hi: 'एक सींग वाला गैंडा',
      as: 'এশিঙীয়া গঁড়',
    },
    descriptions: {
      en: 'Majestic one-horned rhinoceros of Kaziranga',
      hi: 'काजीरंगा का प्रसिद्ध एक सींग वाला गैंडा',
      as: 'কাজিৰঙাৰ গৌৰৱ এশিঙীয়া গঁড়',
    },
    voicePrompts: {
      en: 'One-horned rhinoceros of Kaziranga',
      hi: 'काजीरंगा का एक सींग वाला गैंडा',
      as: 'কাজিৰঙাৰ মহিমামণ্ডিত এশিঙীয়া গঁড়',
    },
  },
  {
    id: 'obj_tea',
    name: 'Assam Tea Leaves',
    hindiName: 'असम चाय की पत्तियां',
    assameseName: 'অসমৰ চাহপাত',
    category: 'Nature',
    emoji: '🍃',
    description: 'Fresh aromatic green tea leaves from lush Assam gardens',
    voicePrompt: 'Fresh green tea leaves from the garden',
    names: {
      en: 'Assam Tea Leaves',
      hi: 'असम चाय की पत्तियां',
      as: 'অসমৰ চাহপাত',
    },
    descriptions: {
      en: 'Fresh aromatic tea leaves from Assam tea gardens',
      hi: 'असम के बागानों की सुगंधित चाय पत्तियां',
      as: 'অসমৰ চাহ বাগিচাৰ সতেজ সুগন্ধি চাহপাত',
    },
    voicePrompts: {
      en: 'Aromatic Assam tea leaves',
      hi: 'असम के बागानों की हरी चाय पत्तियां',
      as: 'অসমৰ সুগন্ধি সেউজীয়া চাহপাত',
    },
  },
  {
    id: 'obj_japi',
    name: 'Assamese Japi',
    hindiName: 'असमिया जापी टोपी',
    assameseName: 'অসমীয়া জাপি',
    category: 'Culture',
    emoji: '👒',
    description: 'Traditional conical woven headgear crafted from bamboo and tokou leaves',
    voicePrompt: 'Traditional woven Japi hat of Assam',
    names: {
      en: 'Assamese Japi',
      hi: 'असमिया जापी टोपी',
      as: 'অসমীয়া জাপি',
    },
    descriptions: {
      en: 'Traditional bamboo and tokou leaf headgear',
      hi: 'बांस और पत्तों से बनी पारंपरिक जापी टोपी',
      as: 'বাঁহ আৰু তোকো পাতেৰে সজা পৰম্পৰাগত জাপি',
    },
    voicePrompts: {
      en: 'Traditional Assamese woven Japi hat',
      hi: 'असम की पारंपरिक जापी टोपी',
      as: 'পৰম্পৰাগত সন্মানৰ অসমীয়া জাপি',
    },
  },
  {
    id: 'obj_dhol',
    name: 'Bihu Dhol',
    hindiName: 'बिहू ढोल',
    assameseName: 'বিহুৰ ঢোল',
    category: 'Culture',
    emoji: '🥁',
    description: 'Rhythmic two-sided drum played during festive Bihu celebrations',
    voicePrompt: 'Festive Bihu dhol drum',
    names: {
      en: 'Bihu Dhol',
      hi: 'बिहू ढोल',
      as: 'বিহুৰ ঢোল',
    },
    descriptions: {
      en: 'Festive two-sided drum played during spring Bihu',
      hi: 'उत्सवों में बजने वाला पारंपरिक बिहू ढोल',
      as: 'বসন্তৰ উৎসৱত বজোৱা আনন্দময় বিহুৰ ঢোল',
    },
    voicePrompts: {
      en: 'Festive rhythmic Bihu dhol',
      hi: 'मधुर ताल वाला बिहू ढोल',
      as: 'মন মতলীয়া কৰা বিহুৰ ঢোল',
    },
  },
  {
    id: 'obj_orchid',
    name: 'Foxtail Orchid',
    hindiName: 'कपो फूल (ऑर्किड)',
    assameseName: 'কপৌ ফুল',
    category: 'Nature',
    emoji: '🌸',
    description: 'Delicate pink and purple Kopou orchid worn during spring festivals',
    voicePrompt: 'Fragrant pink foxtail Kopou orchid',
    names: {
      en: 'Foxtail Orchid (Kopou)',
      hi: 'कपो फूल (ऑर्किड)',
      as: 'কপৌ ফুল',
    },
    descriptions: {
      en: 'Delicate pink orchid blooming in spring',
      hi: 'वसंत में खिलने वाला सुंदर कपो फूल',
      as: 'বসন্তকালত ফুলা মোহনীয়া কপৌ ফুল',
    },
    voicePrompts: {
      en: 'Delicate pink Kopou orchid blossom',
      hi: 'सुगंधित कपो फूल',
      as: 'বিহুত খোপাত মৰা সুবাসিত কপৌ ফুল',
    },
  },
  {
    id: 'obj_bamboo',
    name: 'Bamboo Craft Basket',
    hindiName: 'बांस की टोकरी',
    assameseName: 'বাঁহৰ সাজ-বাচন',
    category: 'Household',
    emoji: '🧺',
    description: 'Artfully woven bamboo craft widely used in North Eastern homes',
    voicePrompt: 'Handcrafted woven bamboo basket',
    names: {
      en: 'Bamboo Craft Basket',
      hi: 'बांस की टोकरी',
      as: 'বাঁহৰ সাজ-বাচন',
    },
    descriptions: {
      en: 'Handmade woven bamboo basket for daily use',
      hi: 'घरेलू उपयोग के लिए सुंदर बांस की टोकरी',
      as: 'ঘৰুৱা ব্যৱহাৰৰ বাবে হাতৰে তৈয়াৰী বাঁহৰ বাচন',
    },
    voicePrompts: {
      en: 'Handcrafted woven bamboo basket',
      hi: 'हाथ से बुनी बांस की टोकरी',
      as: 'হাতৰে সজা বাঁহৰ ধুনীয়া সাজ',
    },
  },
  {
    id: 'obj_diya',
    name: 'Clay Lamp (Diya)',
    hindiName: 'दीया (Diya)',
    assameseName: 'মাটিৰ চাকি',
    category: 'Household',
    emoji: '🪔',
    description: 'Traditional earthen oil lamp bringing warmth and light',
    voicePrompt: 'Clay lamp, a traditional diya glowing with warm light',
    names: {
      en: 'Clay Lamp (Diya)',
      hi: 'दीया (Diya)',
      as: 'মাটিৰ চাকি',
    },
    descriptions: {
      en: 'Warm earthen oil lamp for peace and light',
      hi: 'शांति और रोशनी देने वाला मिट्टी का दीया',
      as: 'পবিত্ৰ পোহৰ বিলাবলৈ মাটিৰ চাকি',
    },
    voicePrompts: {
      en: 'Traditional glowing clay diya',
      hi: 'रोशनी देता पारंपरिक मिट्टी का दीया',
      as: 'উজ্জ্বল পোহৰ দিয়া মাটিৰ চাকি',
    },
  },
  {
    id: 'obj_peacock',
    name: 'Royal Peacock',
    hindiName: 'मोर (Mor)',
    assameseName: 'ময়ূৰ চৰাই',
    category: 'Nature',
    emoji: '🦚',
    description: 'Beautiful peacock with vibrant blue and emerald feathers',
    voicePrompt: 'Peacock, with colorful feathers',
    names: {
      en: 'Royal Peacock',
      hi: 'मोर (Mor)',
      as: 'ময়ূৰ চৰাই',
    },
    descriptions: {
      en: 'Graceful peacock with iridescent feathers',
      hi: 'सुंदर पंखों वाला मनमोहक मोर',
      as: 'ধুনীয়া পাখিৰে শোভিত ময়ূৰ চৰাই',
    },
    voicePrompts: {
      en: 'Graceful peacock with vibrant feathers',
      hi: 'नीले और हरे पंखों वाला मोर',
      as: 'ৰঙীন পাখি মেলা ময়ূৰ চৰাই',
    },
  },
  {
    id: 'obj_elephant',
    name: 'Gentle Elephant',
    hindiName: 'हाथी (Haathi)',
    assameseName: 'বনৰীয়া হাতী',
    category: 'Nature',
    emoji: '🐘',
    description: 'Wise and gentle elephant from the sub-Himalayan forests',
    voicePrompt: 'Gentle elephant, wise and majestic',
    names: {
      en: 'Gentle Elephant',
      hi: 'हाथी (Haathi)',
      as: 'বনৰীয়া হাতী',
    },
    descriptions: {
      en: 'Calm and wise gentle forest elephant',
      hi: 'शांत और बुद्धिमान सौम्य हाथी',
      as: 'অৰণ্যৰ শান্ত আৰু শক্তিশালী বনৰীয়া হাতী',
    },
    voicePrompts: {
      en: 'Gentle and wise elephant',
      hi: 'विशाल और दयालु हाथी',
      as: 'মৰমিয়াল আৰু শান্ত বনৰীয়া হাতী',
    },
  },
  {
    id: 'obj_mango',
    name: 'Ripe Mango',
    hindiName: 'आम (Aam)',
    assameseName: 'মিঠা আম',
    category: 'Food',
    emoji: '🥭',
    description: 'Sweet and golden king of fruits',
    voicePrompt: 'Ripe golden mango, sweet and delicious',
    names: {
      en: 'Ripe Mango',
      hi: 'मीठा आम',
      as: 'মিঠা আম',
    },
    descriptions: {
      en: 'Sweet golden mango full of sunny flavor',
      hi: 'मीठा और रसीला पका हुआ आम',
      as: 'সোৱাদযুক্ত আৰু মিঠা পকা আম',
    },
    voicePrompts: {
      en: 'Sweet ripe golden mango',
      hi: 'मीठा और स्वादिष्ट रसीला आम',
      as: 'অতি সোৱাদযুক্ত মিঠা পকা আম',
    },
  },
]

export const COGNITIVE_GAMES_CATALOG: CognitiveGameMeta[] = [
  {
    id: 'game_memory_1',
    title: 'Memory Recall & Recognition',
    category: 'memory',
    description: 'Observe familiar objects for a few moments, then pick out what you saw.',
    skillTrained: 'Visual Short-Term Memory & Object Recognition',
    defaultDifficulty: 'Easy',
    route: '/games/memory',
    status: 'active',
  },
  {
    id: 'game_attention_1',
    title: 'Focused Attention',
    category: 'attention',
    description: 'Spot subtle details and gentle audio cues with guided focus.',
    skillTrained: 'Sustained Attention & Reaction',
    defaultDifficulty: 'Easy',
    route: '/games/attention',
    status: 'coming_soon',
  },
  {
    id: 'game_pattern_1',
    title: 'Pattern & Sequence',
    category: 'pattern',
    description: 'Follow colorful patterns and relaxing rhythmic sequences.',
    skillTrained: 'Pattern Recognition & Working Memory',
    defaultDifficulty: 'Easy',
    route: '/games/pattern',
    status: 'coming_soon',
  },
]

export function getLocalizedObjectName(obj: MemoryGameObject, lang: SupportedLanguage): string {
  if (obj.names && obj.names[lang]) return obj.names[lang]
  if (lang === 'hi' && obj.hindiName) return obj.hindiName
  if (lang === 'as' && obj.assameseName) return obj.assameseName
  return obj.name
}

export function getLocalizedObjectDescription(obj: MemoryGameObject, lang: SupportedLanguage): string {
  if (obj.descriptions && obj.descriptions[lang]) return obj.descriptions[lang]
  return obj.description
}

export function getLocalizedObjectVoicePrompt(obj: MemoryGameObject, lang: SupportedLanguage): string {
  if (obj.voicePrompts && obj.voicePrompts[lang]) return obj.voicePrompts[lang]
  return obj.voicePrompt
}

// Question generation logic tailored by difficulty
export function generateMemoryQuestions(difficulty: Difficulty): GameQuestion[] {
  const targetCount = difficulty === 'Easy' ? 3 : difficulty === 'Medium' ? 4 : 5
  const memorizeSeconds = difficulty === 'Easy' ? 5 : difficulty === 'Medium' ? 4 : 3
  const optionsCount = difficulty === 'Easy' ? 3 : 4
  const totalQuestions = 5

  const questions: GameQuestion[] = []

  for (let qIdx = 0; qIdx < totalQuestions; qIdx++) {
    // Shuffle pool of familiar objects
    const shuffledPool = [...FAMILIAR_OBJECTS].sort(() => 0.5 - Math.random())

    // Select target objects to memorize
    const targets = shuffledPool.slice(0, targetCount)

    // Select one target to be the correct answer
    const correctTarget = targets[Math.floor(Math.random() * targets.length)]

    // Select distractors (objects that were NOT in targets)
    const availableDistractors = shuffledPool.slice(targetCount)
    const distractors = availableDistractors.slice(0, optionsCount - 1)

    // Assemble options and shuffle
    const options = [correctTarget, ...distractors].sort(() => 0.5 - Math.random())

    questions.push({
      id: `q_${difficulty.toLowerCase()}_${qIdx + 1}_${Date.now()}`,
      targetObjects: targets,
      questionText: 'Which of these objects was shown on the card?',
      options,
      correctAnswerId: correctTarget.id,
      memorizeSeconds,
    })
  }

  return questions
}
