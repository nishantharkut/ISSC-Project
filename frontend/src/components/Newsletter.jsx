import { useState } from 'react'
import { EnvelopeIcon, CheckCircleIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email) {
      setError('Please enter an email address')
      return
    }

    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // Use the AI chat interface to trigger newsletter subscription
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `Subscribe ${email} to the newsletter`
        }),
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        setResult(data)
        setEmail('') // Clear form on success
      } else {
        setError(data.error || 'Failed to subscribe to newsletter')
      }
    } catch (err) {
      setError('Failed to connect to server')
    } finally {
      setIsLoading(false)
    }
  }

  const getInjectionWarning = () => {
    const hasCommandPattern = email.includes('$(') || email.includes('`') || email.includes(';')
    const hasShellCommand = email.includes('whoami') || email.includes('rm ') || email.includes('ls ') || email.includes('cat ')
    
    if (hasCommandPattern || hasShellCommand) {
      return (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center space-x-2 text-red-700 mb-2">
            <ExclamationTriangleIcon className="h-4 w-4" />
            <span className="text-sm font-medium">Potential Command Injection Detected</span>
          </div>
          <div className="text-xs text-red-600 space-y-1">
            <p>Your input contains patterns that could execute system commands:</p>
            <div className="bg-red-100 p-2 rounded font-mono text-xs">
              {email}
            </div>
            {hasCommandPattern && (
              <p>• Command substitution patterns detected: $(...) or `...`</p>
            )}
            {hasShellCommand && (
              <p>• Shell commands detected in input</p>
            )}
            <p className="text-red-700 font-medium">⚠️ This will be processed by the backend system</p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <section className="py-16 bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-primary-900 mb-4">
            Stay Updated with AutoElite
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Subscribe to our newsletter for the latest luxury vehicles, exclusive deals, and automotive news.
          </p>
        </div>

        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email (try: $(whoami)@example.com)"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                disabled={isLoading}
              />
            </div>

            {getInjectionWarning()}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-accent-600 to-accent-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-accent-700 hover:to-accent-600 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 transform hover:-translate-y-1 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Subscribing...</span>
                </div>
              ) : (
                'Subscribe to Newsletter'
              )}
            </button>
          </form>

          {/* Success Message */}
          {result && !error && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2 text-green-700 mb-2">
                <CheckCircleIcon className="h-5 w-5" />
                <span className="font-medium">Subscription Successful!</span>
              </div>
              
              {/* Show function call results if any */}
              {result.function_calls && result.function_calls.length > 0 && (
                <div className="mt-3 space-y-2">
                  {result.function_calls.map((call, index) => (
                    <div key={index} className="bg-white p-3 rounded border">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Newsletter Subscription Result
                      </div>
                      {call.result && (
                        <div className="text-xs space-y-2">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Email:</span>
                            <span className="font-mono text-gray-800">{call.result.email}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Status:</span>
                            <span className="font-semibold text-green-600">{call.result.status}</span>
                          </div>
                          
                          {/* Command Injection Detection and Results */}
                          {call.result.injection_detected && (
                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                              <div className="flex items-center space-x-2 text-red-700 mb-2">
                                <ExclamationTriangleIcon className="h-4 w-4" />
                                <span className="font-bold">COMMAND INJECTION DETECTED!</span>
                              </div>
                              
                              <div className="space-y-2 text-sm">
                                <div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-xs">
                                  <div className="text-gray-400">$ {call.result.command_executed}</div>
                                  <div className="text-white">{call.result.command_output}</div>
                                </div>
                                
                                {call.result.files_affected && call.result.files_affected.length > 0 && (
                                  <div className="bg-yellow-50 border border-yellow-200 p-2 rounded">
                                    <div className="font-medium text-yellow-800">Files Affected:</div>
                                    <div className="text-yellow-700 font-mono text-xs">
                                      {call.result.files_affected.join(', ')}
                                    </div>
                                  </div>
                                )}
                                
                                {call.result.filesystem_status && (
                                  <div className="bg-blue-50 border border-blue-200 p-2 rounded">
                                    <div className="font-medium text-blue-800">Current File System:</div>
                                    <div className="text-blue-700 font-mono text-xs">
                                      {call.result.filesystem_status}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                          
                          {/* Regular subscription (no injection) */}
                          {!call.result.injection_detected && (
                            <div className="text-green-600 text-sm">
                              ✓ Successfully subscribed to AutoElite Motors newsletter
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {result.response && (
                <div className="mt-3 text-sm text-gray-600">
                  <strong>AI Response:</strong> {result.response}
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 text-red-700">
                <ExclamationTriangleIcon className="h-5 w-5" />
                <span className="font-medium">Subscription Failed</span>
              </div>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}