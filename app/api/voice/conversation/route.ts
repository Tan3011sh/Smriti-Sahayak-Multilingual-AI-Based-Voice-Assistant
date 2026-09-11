import { NextRequest, NextResponse } from 'next/server';
import { handleConversationTurn, ConversationRequest } from '@/lib/services/sarvam-service';
import { SupportedLanguage } from '@/types/language';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || '';

    let audioBuffer: Buffer | undefined;
    let mimeType: string = 'audio/webm';
    let text: string | undefined;
    let language: SupportedLanguage = 'en';
    let patientName: string | undefined;
    let history: Array<{ role: 'user' | 'assistant'; content: string }> = [];

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('audio') as Blob | null;
      if (file && typeof file.arrayBuffer === 'function') {
        const arrayBuffer = await file.arrayBuffer();
        audioBuffer = Buffer.from(arrayBuffer);
        mimeType = file.type || 'audio/webm';
      }

      const textVal = formData.get('text');
      if (typeof textVal === 'string') {
        text = textVal;
      }

      const langVal = formData.get('language') as string | null;
      if (langVal === 'en' || langVal === 'hi' || langVal === 'as') {
        language = langVal;
      }

      const nameVal = formData.get('patientName');
      if (typeof nameVal === 'string') {
        patientName = nameVal.slice(0, 50).trim();
      }

      const historyVal = formData.get('history');
      if (typeof historyVal === 'string') {
        try {
          const parsed = JSON.parse(historyVal);
          if (Array.isArray(parsed)) {
            history = parsed;
          }
        } catch {
          // ignore invalid history JSON
        }
      }
    } else {
      const body = await req.json().catch(() => ({}));
      text = typeof body.text === 'string' ? body.text : undefined;
      if (body.language === 'en' || body.language === 'hi' || body.language === 'as') {
        language = body.language;
      }
      if (typeof body.patientName === 'string') {
        patientName = body.patientName.slice(0, 50).trim();
      }
      if (Array.isArray(body.history)) {
        history = body.history;
      }
    }

    const conversationRequest: ConversationRequest = {
      audioBuffer,
      mimeType,
      text,
      language,
      patientName,
      history,
    };

    const result = await handleConversationTurn(conversationRequest);

    return NextResponse.json({
      success: true,
      transcript: result.transcript,
      response: result.response,
      audioBase64: result.audioBase64,
      language: result.language,
    });
  } catch (error) {
    console.error('[VoiceAPI] Conversation route error:', error);

    // Never leak internal details or keys
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to process voice request. Please try again.',
        transcript: '',
        response: 'I am here with you. Please feel free to tap to speak again or use text.',
        audioBase64: null,
      },
      { status: 200 } // Return 200 with fallback so client UI gracefully handles it without crashing
    );
  }
}
