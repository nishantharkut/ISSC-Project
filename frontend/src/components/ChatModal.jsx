import { useState, useRef, useEffect } from 'react'
import { XMarkIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline'

export default function ChatModal({ isOpen, onClose, user }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'system',
      content: 'Welcome to AutoElite AI Assistant! I can help you with vehicle information, financing options, and answer any questions about our premium collection.'
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [debugLog, setDebugLog] = useState([])
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addToDebugLog = (functionCall) => {
    setDebugLog(prev => [
      ...prev,
      { 
        timestamp: new Date().toLocaleTimeString(), 
        function: functionCall.function,
        arguments: JSON.stringify(functionCall.arguments),
        result: functionCall.result
      }
    ])
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          user_id: user?.id || 'anonymous'
        })
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      // Add function calls to debug log if present
      if (data.function_calls) {
        data.function_calls.forEach(call => addToDebugLog(call))
      }

      // Create AI message with function call results
      let aiContent = data.response || ''
      
      // If there are function calls, display their results prominently
      if (data.function_calls && data.function_calls.length > 0) {
        let functionResults = ''
        
        data.function_calls.forEach(call => {
          functionResults += `\n\n**${call.function}** executed:\n`
          
          if (call.function === 'debug_sql' && call.result) {
            if (call.result.result && Array.isArray(call.result.result)) {
              functionResults += `**Query:** ${call.result.query}\n`
              functionResults += `**Results:** ${call.result.rows_returned || 0} rows returned\n\n`
              
              // Format the SQL results nicely
              if (call.result.result.length > 0) {
                functionResults += '```\n'
                call.result.result.forEach((row, index) => {
                  functionResults += `${index + 1}. ${JSON.stringify(row, null, 2)}\n`
                })
                functionResults += '```'
              }
            } else {
              functionResults += `**Query:** ${call.result.query}\n`
              functionResults += `**Result:** ${call.result.result}\n`
            }
          } else {
            functionResults += `**Result:** ${JSON.stringify(call.result, null, 2)}\n`
          }
        })
        
        // Combine AI response with function results
        aiContent = aiContent + functionResults
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: aiContent
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const renderMessageContent = (content) => {
    // Split content by code blocks and other formatting
    const parts = content.split(/```/);
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is a code block
        return (
          <pre key={index} className="bg-gray-800 text-green-400 p-3 rounded mt-2 mb-2 overflow-x-auto text-sm font-mono">
            <code>{part}</code>
          </pre>
        )
      } else {
        // Regular content with markdown-style formatting
        return (
          <div key={index} className="whitespace-pre-wrap">
            {part.split('\n').map((line, lineIndex) => {
              if (line.startsWith('**') && line.endsWith('** executed:')) {
                return (
                  <div key={lineIndex} className="font-bold text-blue-600 mt-3 mb-1 text-lg">
                    {line.replace(/\*\*/g, '').replace(' executed:', '')}
                  </div>
                )
              } else if (line.startsWith('**') && line.endsWith('**')) {
                return (
                  <div key={lineIndex} className="font-semibold text-gray-700 mt-2">
                    {line.replace(/\*\*/g, '')}
                  </div>
                )
              } else {
                return (
                  <div key={lineIndex}>
                    {line}
                  </div>
                )
              }
            })}
          </div>
        )
      }
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-900 to-accent-800 text-white p-6 rounded-t-2xl flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center space-x-3">
            <span>AutoElite AI Assistant</span>
          </h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/10 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 animate-slide-up ${
                message.type === 'user' ? 'ml-auto' : message.type === 'system' ? 'mx-auto' : ''
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl ${
                  message.type === 'user'
                    ? 'bg-accent-600 text-white ml-auto rounded-br-sm'
                    : message.type === 'ai'
                    ? 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                    : 'bg-gold-400 text-primary-900 text-center font-semibold max-w-full'
                }`}
              >
                {message.type === 'ai' ? renderMessageContent(message.content) : message.content}
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="mb-4">
              <div className="bg-white text-gray-800 border border-gray-200 max-w-[80%] p-4 rounded-2xl rounded-bl-sm">
                <div className="flex items-center space-x-2">
                  <span>AI is typing</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-accent-600 rounded-full animate-bounce-dots"></div>
                    <div className="w-2 h-2 bg-accent-600 rounded-full animate-bounce-dots" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-accent-600 rounded-full animate-bounce-dots" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Section */}
        <div className="p-6 bg-white border-t border-gray-200 rounded-b-2xl">
          <div className="flex space-x-4">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about our cars, products, or services..."
              className="flex-1 p-4 border-2 border-gray-300 rounded-xl focus:border-accent-600 focus:outline-none transition-colors"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-accent-600 to-accent-500 text-white px-6 py-4 rounded-xl font-semibold hover:from-accent-700 hover:to-accent-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center space-x-2"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
              <span>Send</span>
            </button>
          </div>
        </div>

        {/* Debug Panel */}
        {debugLog.length > 0 && (
          <div className="bg-gray-100 border-t border-gray-200 max-h-48 overflow-y-auto">
            <div className="p-4">
              <h4 className="text-sm font-semibold text-gray-600 mb-2 flex items-center space-x-2">
                <span>Function Calls Debug</span>
              </h4>
              <div className="space-y-2">
                {debugLog.map((log, index) => (
                  <div key={index} className="text-xs font-mono text-gray-700 bg-white p-2 rounded border">
                    <div className="text-gray-500 font-bold">[{log.timestamp}] {log.function}</div>
                    <div className="text-blue-600">Args: {log.arguments}</div>
                    {log.result && (
                      <div className="text-green-600 mt-1">
                        Result: {typeof log.result === 'object' ? JSON.stringify(log.result, null, 2) : log.result}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}