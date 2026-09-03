import { aiSampleResponses } from '@/data/mock-greetings'

export interface VoiceCommandResult {
  transcript: string
  response: string
  action?: 'todo' | 'games' | 'profile' | 'notifications' | 'home'
}

const SAMPLE_COMMANDS: Array<{ transcript: string; action: VoiceCommandResult['action'] }> = [
  { transcript: 'Show my to-do list', action: 'todo' },
  { transcript: 'Start a memory game', action: 'games' },
  { transcript: 'Read my notifications', action: 'notifications' },
  { transcript: 'Show my profile', action: 'profile' },
]

/**
 * Simulates sending an audio command to `POST /voice/command`.
 * Swap this implementation for a real fetch call once the backend
 * and speech-to-text pipeline are ready.
 */
export async function sendVoiceCommand(): Promise<VoiceCommandResult> {
  const command = SAMPLE_COMMANDS[Math.floor(Math.random() * SAMPLE_COMMANDS.length)]
  const response = aiSampleResponses[Math.floor(Math.random() * aiSampleResponses.length)]

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ transcript: command.transcript, response, action: command.action })
    }, 900)
  })
}
