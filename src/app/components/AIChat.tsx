import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Sparkles, AlertCircle, Settings, X } from 'lucide-react';
import { LottieAnimation, LottieLayer } from '../../types/lottie';
import { LottieEvent } from '../../machines/lottieStateMachine';
import * as S from '../../styles/AIChatStyles';

interface AIChatProps {
  animation: LottieAnimation | null;
  selectedLayer: LottieLayer | null;
  selectedLayerIndex: number | null;
  onSend: (event: LottieEvent) => void;
}

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  preview?: {
    property: string;
    oldValue: any;
    newValue: any;
  };
  applied?: boolean;
  error?: boolean;
}

interface AIResponse {
  action: 'UPDATE_LAYER_PROPERTY' | 'error';
  layerIndex: number;
  property: string;
  value: any;
  explanation: string;
  reasoning?: string;
}

async function callClaudeAPI(
  userMessage: string,
  animation: LottieAnimation | null,
  selectedLayer: LottieLayer | null,
  selectedLayerIndex: number | null,
  apiKey: string
): Promise<AIResponse> {
  const systemPrompt = `You are an expert Lottie animation editor. You help users edit animations by understanding natural language requests and generating precise property updates.

CRITICAL: Always return the COMPLETE property object with both 'a' (animation flag) and 'k' (value) fields.

Property structure:
- Static properties: { "a": 0, "k": <value> }
- Animated properties: { "a": 1, "k": [<keyframe objects>] }

IMPORTANT RULES:
1. Respond ONLY with valid JSON, no markdown code blocks
2. ALWAYS include BOTH "a" and "k" fields in the value object
3. Use dot-notation paths: "ks.r" for rotation, "ks.p" for position, "ks.s" for scale, "ks.o" for opacity
4. For arrays (position, scale, anchor), ensure all 3 values [x, y, z] are present

Common property formats:
- Position: { "a": 0, "k": [x, y, 0] }
- Scale: { "a": 0, "k": [scaleX%, scaleY%, 100] }
- Rotation: { "a": 0, "k": degrees }
- Opacity: { "a": 0, "k": 0-100 }
- Anchor: { "a": 0, "k": [x, y, 0] }

EXAMPLE RESPONSES:
For "double the scale" (current scale [100, 100, 100]):
{
  "action": "UPDATE_LAYER_PROPERTY",
  "layerIndex": 0,
  "property": "ks.s",
  "value": { "a": 0, "k": [200, 200, 100] },
  "explanation": "Doubled the scale from 100% to 200%",
  "reasoning": "Multiplied X and Y scale by 2, kept Z unchanged"
}

For "rotate 45 degrees":
{
  "action": "UPDATE_LAYER_PROPERTY",
  "layerIndex": 0,
  "property": "ks.r",
  "value": { "a": 0, "k": 45 },
  "explanation": "Set rotation to 45 degrees",
  "reasoning": "Applied clockwise rotation as requested"
}

If you cannot parse the request safely, respond:
{
  "action": "error",
  "explanation": "Could not understand request",
  "reasoning": "Please be more specific about which property to change"
}`;

  const userPrompt = `Current animation context:
Animation: ${animation?.nm || 'Untitled'}
Total layers: ${animation?.layers?.length || 0}
${selectedLayer ? `
Selected layer: "${selectedLayer.nm || 'Unnamed'}" (index ${selectedLayerIndex})
Layer type: ${selectedLayer.ty === 4 ? 'Shape' : selectedLayer.ty === 2 ? 'Image' : 'Other'}
Current transform (FULL PROPERTY OBJECTS):
- Position: ${JSON.stringify(selectedLayer.ks?.p)}
- Rotation: ${JSON.stringify(selectedLayer.ks?.r)}
- Scale: ${JSON.stringify(selectedLayer.ks?.s)}
- Opacity: ${JSON.stringify(selectedLayer.ks?.o)}
- Anchor: ${JSON.stringify(selectedLayer.ks?.a)}

REMEMBER: Return the COMPLETE property object with both "a" and "k" fields.
For animated properties (a:1), preserve the keyframe structure.
For static properties (a:0), return { "a": 0, "k": <new value> }.
` : 'No layer selected - please select a layer first'}

User request: "${userMessage}"

Generate the appropriate property update with COMPLETE property object:`;

  // Use different endpoint for dev vs production
  const endpoint = import.meta.env.MODE === 'development'
    ? '/api/anthropic/v1/messages'  // Dev proxy
    : '/api/anthropic';              // Vercel serverless function

  console.log('Calling API with key:', apiKey ? `${apiKey.substring(0, 10)}...` : 'NO KEY');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{
        role: 'user',
        content: userPrompt,
      }],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMessage = errorData.error?.message || response.statusText;
    console.error('API Error Response:', errorData);
    throw new Error(`API error (${response.status}): ${errorMessage}`);
  }

  const data = await response.json();
  const textContent = data.content?.[0]?.text || '{}';
  
  // Strip markdown code blocks if present
  const cleanJson = textContent
    .replace(/```json\n?/g, '')
    .replace(/```\n?/g, '')
    .trim();

  return JSON.parse(cleanJson);
}

function MessageBubble({ message, onApply }: { 
  message: Message; 
  onApply?: () => void;
}) {
  const isUser = message.role === 'user';
  const isError = message.error;

  return (
    <S.MessageWrapper $isUser={isUser}>
      <S.MessageContent $isUser={isUser}>
        <S.MessageBubble $isUser={isUser} $isError={isError}>
          <S.MessageText>
            {message.content}
          </S.MessageText>

          {/* Preview changes */}
          {message.preview && !message.applied && (
            <S.PreviewContainer>
              <S.PreviewLabel>Preview:</S.PreviewLabel>
              <S.PreviewCode>
                <S.PreviewOldValue>
                  {message.preview.property}: {JSON.stringify(message.preview.oldValue)}
                </S.PreviewOldValue>
                <S.PreviewNewValue>
                  → {JSON.stringify(message.preview.newValue)}
                </S.PreviewNewValue>
              </S.PreviewCode>
              <S.ApplyButton onClick={onApply}>
                Apply Changes
              </S.ApplyButton>
            </S.PreviewContainer>
          )}

          {/* Applied indicator */}
          {message.applied && (
            <S.AppliedIndicator>
              <S.AppliedDot />
              Changes applied
            </S.AppliedIndicator>
          )}
        </S.MessageBubble>

        <S.MessageTimestamp $isUser={isUser}>
          {new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </S.MessageTimestamp>
      </S.MessageContent>
    </S.MessageWrapper>
  );
}

function SuggestedPrompts({ onSelect }: { onSelect: (prompt: string) => void }) {
  const prompts = [
    "Make this rotate 360 degrees",
    "Double the scale",
    "Move 50 pixels to the right",
    "Fade in over 2 seconds",
    "Make it bounce",
    "Reduce opacity to 50%",
  ];

  return (
    <S.SuggestedPromptsContainer>
      <S.SuggestedPromptsTitle>
        Try asking:
      </S.SuggestedPromptsTitle>
      <S.SuggestedPromptsGrid>
        {prompts.map((prompt, i) => (
          <S.PromptButton
            key={i}
            onClick={() => onSelect(prompt)}
          >
            {prompt}
          </S.PromptButton>
        ))}
      </S.SuggestedPromptsGrid>
    </S.SuggestedPromptsContainer>
  );
}

export function AIChat({
  animation,
  selectedLayer,
  selectedLayerIndex,
  onSend,
}: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'system',
      content: 'Hi! I can help you edit animations with natural language. Select a layer and tell me what you want to change.',
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingChange, setPendingChange] = useState<AIResponse | null>(null);
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('anthropic_api_key') || '';
  });
  const [showApiKeyInput, setShowApiKeyInput] = useState(() => {
    return !localStorage.getItem('anthropic_api_key');
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Check API key
    if (!apiKey.trim()) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Please set your Anthropic API key first. Click the settings icon above.',
        timestamp: Date.now(),
        error: true,
      };
      setMessages(prev => [...prev, errorMessage]);
      setShowApiKeyInput(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Check if layer is selected
      if (!selectedLayer || selectedLayerIndex === null) {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Please select a layer from the Layers tab first, then come back here to edit it.',
          timestamp: Date.now(),
          error: true,
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
        return;
      }

      // Call Claude API
      const aiResponse = await callClaudeAPI(
        input,
        animation,
        selectedLayer,
        selectedLayerIndex,
        apiKey
      );

      if (aiResponse.action === 'error') {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `${aiResponse.explanation}\n\n${aiResponse.reasoning || ''}`,
          timestamp: Date.now(),
          error: true,
        };
        setMessages(prev => [...prev, errorMessage]);
      } else {
        // Show preview with explanation
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `${aiResponse.explanation}\n\n${aiResponse.reasoning || ''}`,
          timestamp: Date.now(),
          preview: {
            property: aiResponse.property,
            oldValue: selectedLayer.ks?.[aiResponse.property.split('.')[1] as keyof typeof selectedLayer.ks],
            newValue: aiResponse.value,
          },
        };
        setMessages(prev => [...prev, assistantMessage]);
        setPendingChange(aiResponse);
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to process request'}. ${!apiKey.trim() ? 'Please set your Anthropic API key.' : 'Please check your API key and try again.'}`,
        timestamp: Date.now(),
        error: true,
      };
      setMessages(prev => [...prev, errorMessage]);
      if (!apiKey.trim()) {
        setShowApiKeyInput(true);
      }
    }

    setIsLoading(false);
  };

  const handleApplyChanges = () => {
    if (!pendingChange) return;

    onSend({
      type: 'UPDATE_LAYER_PROPERTY',
      layerIndex: pendingChange.layerIndex,
      property: pendingChange.property,
      value: pendingChange.value,
    });

    // Update message to show applied
    setMessages(prev =>
      prev.map(msg =>
        msg.preview && !msg.applied
          ? { ...msg, applied: true, preview: undefined }
          : msg
      )
    );

    setPendingChange(null);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
    inputRef.current?.focus();
  };

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      if (!apiKey.trim().startsWith('sk-ant-')) {
        const errorMessage: Message = {
          id: Date.now().toString(),
          role: 'assistant',
          content: 'Invalid API key format. Anthropic API keys should start with "sk-ant-"',
          timestamp: Date.now(),
          error: true,
        };
        setMessages(prev => [...prev, errorMessage]);
        return;
      }
      
      localStorage.setItem('anthropic_api_key', apiKey.trim());
      setShowApiKeyInput(false);
      
      const confirmMessage: Message = {
        id: Date.now().toString(),
        role: 'system',
        content: 'API key saved! You can now start chatting.',
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, confirmMessage]);
    }
  };

  const handleClearApiKey = () => {
    setApiKey('');
    localStorage.removeItem('anthropic_api_key');
    setShowApiKeyInput(true);
  };

  return (
    <S.ChatContainer>
      <S.Header>
        <Sparkles />
        <S.HeaderTitle>
          AI Assistant
        </S.HeaderTitle>
        <S.SettingsButton 
          onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          title={apiKey ? 'Change API Key' : 'Set API Key'}
        >
          <Settings />
        </S.SettingsButton>
      </S.Header>

      {showApiKeyInput && (
        <S.ApiKeyContainer>
          <S.ApiKeyLabel>Anthropic API Key</S.ApiKeyLabel>
          <S.ApiKeyInputWrapper>
            <S.ApiKeyInput
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-ant-..."
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSaveApiKey();
                }
              }}
            />
            <S.ApiKeyButton onClick={handleSaveApiKey} disabled={!apiKey.trim()}>
              Save
            </S.ApiKeyButton>
            {apiKey && (
              <S.ApiKeyClearButton onClick={handleClearApiKey} title="Clear API key">
                <X />
              </S.ApiKeyClearButton>
            )}
          </S.ApiKeyInputWrapper>
          <S.ApiKeyHelp>
            Get your API key from{' '}
            <a href="https://console.anthropic.com/" target="_blank" rel="noopener noreferrer">
              console.anthropic.com
            </a>
          </S.ApiKeyHelp>
        </S.ApiKeyContainer>
      )}

      {!apiKey.trim() ? (
        <S.InfoBanner>
          <AlertCircle />
          <S.InfoText>
            Set your Anthropic API key above to start using AI features
          </S.InfoText>
        </S.InfoBanner>
      ) : (!selectedLayer || selectedLayerIndex === null) && (
        <S.InfoBanner>
          <AlertCircle />
          <S.InfoText>
            Select a layer from the Layers tab first to start editing
          </S.InfoText>
        </S.InfoBanner>
      )}

      <SuggestedPrompts onSelect={handleSuggestedPrompt} />

      <S.MessagesContainer>
        {messages.map(message => (
          <MessageBubble
            key={message.id}
            message={message}
            onApply={message.preview ? handleApplyChanges : undefined}
          />
        ))}

        {isLoading && (
          <S.LoadingBubble>
            <div>
              <Loader2 />
              <span>Thinking...</span>
            </div>
          </S.LoadingBubble>
        )}

        <div ref={messagesEndRef} />
      </S.MessagesContainer>

      <S.InputForm onSubmit={handleSubmit}>
        <S.InputContainer>
          <S.Input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder={
              !apiKey.trim()
                ? "Set API key first..."
                : selectedLayer 
                ? `Edit Layer "${selectedLayer.nm || 'layer'}"`
                : "Select a layer first..."
            }
            disabled={isLoading || !selectedLayer || !apiKey.trim()}
          />
          <S.SendButton
            type="submit"
            disabled={isLoading || !input.trim() || !selectedLayer || !apiKey.trim()}
          >
            <Send />
          </S.SendButton>
        </S.InputContainer>
      </S.InputForm>
    </S.ChatContainer>
  );
}
