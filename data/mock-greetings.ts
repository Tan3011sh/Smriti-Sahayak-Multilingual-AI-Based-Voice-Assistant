export interface Greeting {
  title: string
  subtitle: string
}

export function getTimeOfDayGreeting(name: string, hour: number): Greeting {
  if (hour < 12) {
    return {
      title: `Good morning, ${name}!`,
      subtitle: 'Shall we begin with a fun brain exercise?',
    }
  }
  if (hour < 17) {
    return {
      title: `Namaste, ${name}!`,
      subtitle: 'Would you like to play a memory game today?',
    }
  }
  return {
    title: `Good evening, ${name}!`,
    subtitle: "Let's keep your mind active before dinner.",
  }
}

export const encouragementGreetings: Greeting[] = [
  {
    title: 'Great job today!',
    subtitle: "Let's keep your mind active.",
  },
  {
    title: 'You are doing wonderfully!',
    subtitle: 'A short walk always helps the mind.',
  },
  {
    title: 'I am here with you.',
    subtitle: 'Tap the circle anytime you need me.',
  },
]

export const aiSampleResponses: string[] = [
  "Of course! Let's play a memory matching game together.",
  'Here is your to-do list for today, Ramesh.',
  'You have two reminders today. Would you like to hear them?',
  'Your caregiver Anita has been notified. Take care!',
  'Taking a short walk now would be wonderful for you.',
]
