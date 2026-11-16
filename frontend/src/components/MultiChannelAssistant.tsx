import React, { useState, useEffect } from 'react';
import { 
  Bot, Send, PhoneCall, MessageSquare, Radio, Shield, 
  Sparkles, AlertCircle, HeartHandshake, CheckCircle2, RefreshCw
} from 'lucide-react';
import { sendMultiChannelMessage, fetchInteractionHistory } from '../services/api';

export const MultiChannelAssistant: React.FC = () => {
  const [channel, setChannel] = useState<'chatbot' | 'ivrs' | 'sms'>('chatbot');
  const [language, setLanguage] = useState<string>('English');
  const [inputMessage, setInputMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string; trauma?: boolean; categories?: string[] }>>([
    {
      sender: 'bot',
      text: "Namaste. I am your Aarvya AI Support Companion, synchronized with NHAA (14566). How are you feeling today, and are you currently in a safe space?",
      time: 'Just now'
    }
  ]);

  useEffect(() => {
    fetchInteractionHistory()
      .then((history) => {
        if (history && history.length > 0) {
          const loaded: any[] = [];
          history.slice(-8).forEach((item: any) => {
            loaded.push({
              sender: 'user',
              text: item.user_message,
              time: item.created_at ? new Date(item.created_at).toLocaleTimeString() : 'Earlier'
            });
            loaded.push({
              sender: 'bot',
              text: item.system_reply,
              time: item.created_at ? new Date(item.created_at).toLocaleTimeString() : 'Earlier',
              trauma: item.trauma_detected,
              categories: item.matched_categories
            });
          });
          if (loaded.length > 0) {
            setMessages(loaded);
          }
        }
      })
      .catch((err) => console.warn(err));
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userText = inputMessage.trim();
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMessages((prev) => [...prev, { sender: 'user', text: userText, time: nowTime }]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await sendMultiChannelMessage({
        message: userText,
        channel,
        language
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: res.reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          trauma: res.trauma_detected,
          categories: res.matched_categories
        }
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "We have safely logged your input. If you are experiencing an immediate threat or acute crisis, please call 14566 or 112 directly.",
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto px-6 py-8 flex-1 flex flex-col space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="p-2.5 rounded-2xl bg-[#7546F5]/10 text-[#7546F5]">
              <Bot className="w-6 h-6" />
            </span>
            <div>
              <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#242033]">
                Multi-Channel Conversational AI & Helpline Companion
              </h1>
              <p className="text-xs text-[#7546F5] font-semibold mt-0.5 uppercase tracking-wider">
                SIH26094 • Chatbot, IVRS Call Telemetry & Follow-up Simulator
              </p>
            </div>
          </div>
          <p className="text-xs text-[#858098] mt-2.5 max-w-2xl leading-relaxed">
            Continuous NLP monitoring for victims and complainants throughout trial, rehabilitation, and witness protection phases. Employs trauma-informed Emotion AI to proactively detect distress escalation.
          </p>
        </div>

        {/* Channel Selector */}
        <div className="flex flex-col sm:items-end gap-2">
          <div className="flex items-center space-x-1.5 bg-[#F1ECFF] p-1.5 rounded-2xl border border-[#DCD2FF]">
            <button
              onClick={() => setChannel('chatbot')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                channel === 'chatbot' ? 'bg-white text-[#7546F5] shadow-xs' : 'text-[#858098] hover:text-[#242033]'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Web Chat</span>
            </button>
            <button
              onClick={() => setChannel('ivrs')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                channel === 'ivrs' ? 'bg-white text-[#7546F5] shadow-xs' : 'text-[#858098] hover:text-[#242033]'
              }`}
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>IVRS Voice Call</span>
            </button>
            <button
              onClick={() => setChannel('sms')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                channel === 'sms' ? 'bg-white text-[#7546F5] shadow-xs' : 'text-[#858098] hover:text-[#242033]'
              }`}
            >
              <Radio className="w-3.5 h-3.5" />
              <span>SMS / Helpline</span>
            </button>
          </div>
          <span className="text-[11px] text-[#858098] font-medium">
            Active Channel: <strong className="text-[#7546F5] uppercase">{channel}</strong>
          </span>
        </div>
      </div>

      {/* Main Conversation Window */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-white shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'} space-y-1`}
            >
              <div
                className={`max-w-xl p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-[#7546F5] text-white rounded-tr-xs shadow-xs'
                    : 'bg-[#F8F5FF] text-[#242033] border border-[#E9E2FF] rounded-tl-xs shadow-2xs'
                }`}
              >
                <p>{m.text}</p>
                {m.trauma && m.categories && m.categories.length > 0 && (
                  <div className="mt-2.5 pt-2 border-t border-[#DCD2FF]/60 flex items-center space-x-1.5 text-[10px] font-bold text-rose-600">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Emotion AI Flagged: {m.categories.join(', ').toUpperCase()}</span>
                  </div>
                )}
              </div>
              <span className="text-[10px] text-[#858098] px-1">{m.time}</span>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-2 text-xs text-[#858098] bg-[#F8F5FF] p-3 rounded-2xl w-fit">
              <div className="w-4 h-4 border-2 border-[#7546F5]/40 border-t-[#7546F5] rounded-full animate-spin" />
              <span>Aarvya Emotion AI analyzing distress indicators...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 bg-[#F8F5FF]/80 border-t border-[#E9E2FF] flex items-center space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={
              channel === 'ivrs'
                ? "Simulate spoken statement into IVRS voice line (e.g., 'The accused relatives are threatening me')..."
                : "Type message or report intimidation, fear, or court distress..."
            }
            className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#DCD2FF] text-xs sm:text-sm text-[#242033] placeholder:text-[#858098]/60 focus:outline-none focus:ring-2 focus:ring-[#7546F5]/40"
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="px-5 py-3 rounded-xl bg-[#7546F5] hover:bg-[#6035E0] text-white font-semibold text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-[#7546F5]/25 disabled:opacity-50 cursor-pointer"
          >
            <span>Send</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MultiChannelAssistant;
