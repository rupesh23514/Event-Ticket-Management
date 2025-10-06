import React, { useState, useEffect } from 'react';
import { testSupabaseConnection, testSupabaseSignup, testSupabaseLogin, checkUserExists } from '../utils/supabaseTest';
import { supabase } from '../supabaseClient';

function SupabaseDiagnostic() {
  const [connectionStatus, setConnectionStatus] = useState('Not tested');
  const [authStatus, setAuthStatus] = useState('Not tested');
  const [signupStatus, setSignupStatus] = useState('Not tested');
  const [loginStatus, setLoginStatus] = useState('Not tested');
  const [userExistsStatus, setUserExistsStatus] = useState('Not tested');
  const [testEmail, setTestEmail] = useState('test_' + Math.random().toString(36).substring(2, 10) + '@example.com');
  const [testPassword, setTestPassword] = useState('Password123!');
  const [existingEmail, setExistingEmail] = useState('');
  const [existingPassword, setExistingPassword] = useState('');
  const [emailToCheck, setEmailToCheck] = useState('');
  const [loading, setLoading] = useState(false);
  const [logEntries, setLogEntries] = useState([]);
  const [loginResult, setLoginResult] = useState(null);
  const [supabaseInfo, setSupabaseInfo] = useState({
    url: '',
    key: ''
  });

  const addLog = (message) => {
    setLogEntries(prev => [...prev, `${new Date().toISOString()}: ${message}`]);
  };
  
  useEffect(() => {
    // Get Supabase information
    addLog('Loading Supabase configuration...');
    setSupabaseInfo({
      url: import.meta.env.VITE_SUPABASE_URL || 'Not available',
      key: import.meta.env.VITE_SUPABASE_ANON_KEY ? 
           `${import.meta.env.VITE_SUPABASE_ANON_KEY.substring(0, 5)}...` : 
           'Not available'
    });
  }, []);
  
  const runConnectionTest = async () => {
    setLoading(true);
    setConnectionStatus('Testing...');
    
    try {
      const result = await testSupabaseConnection();
      
      if (result.success) {
        setConnectionStatus('✅ Connected');
        setAuthStatus(result.session ? '✅ Working' : '✅ Ready (no session)');
      } else {
        setConnectionStatus(`❌ Failed: ${result.message}`);
      }
    } catch (error) {
      setConnectionStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const runSignupTest = async () => {
    setLoading(true);
    setSignupStatus('Testing...');
    
    try {
      const result = await testSupabaseSignup(testEmail, testPassword);
      
      if (result.success) {
        setSignupStatus(`✅ Successful: ${testEmail}`);
      } else {
        setSignupStatus(`❌ Failed: ${result.message}`);
      }
    } catch (error) {
      setSignupStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const checkActiveUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      alert(`Error checking user: ${error.message}`);
    } else if (data.user) {
      alert(`Active user found: ${data.user.email} (ID: ${data.user.id})`);
    } else {
      alert('No active user session found');
    }
  };
  
  const runLoginTest = async () => {
    setLoading(true);
    setLoginStatus('Testing...');
    
    try {
      const result = await testSupabaseLogin(existingEmail, existingPassword);
      
      if (result.success) {
        setLoginStatus(`✅ Login successful: ${existingEmail}`);
        setLoginResult(result.data);
      } else {
        setLoginStatus(`❌ Failed: ${result.message}`);
        setLoginResult(null);
      }
    } catch (error) {
      setLoginStatus(`❌ Error: ${error.message}`);
      setLoginResult(null);
    } finally {
      setLoading(false);
    }
  };
  
  const runUserExistsCheck = async () => {
    setLoading(true);
    setUserExistsStatus('Checking...');
    
    try {
      const result = await checkUserExists(emailToCheck);
      setUserExistsStatus(`${result.exists ? '✅' : '❌'} ${result.message}`);
    } catch (error) {
      setUserExistsStatus(`❌ Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h1 className="text-2xl font-bold mb-6">Supabase Diagnostic Tool</h1>
      
      <div className="bg-gray-100 p-4 rounded-md mb-6">
        <h2 className="font-bold mb-2">Supabase Configuration</h2>
        <div className="grid grid-cols-2 gap-2">
          <div>URL:</div>
          <div>{supabaseInfo.url}</div>
          <div>API Key:</div>
          <div>{supabaseInfo.key}</div>
        </div>
      </div>
      
      <div className="mb-6">
        <h2 className="font-bold mb-2">Connection Test</h2>
        <div className="flex items-center gap-4 mb-2">
          <span>Status: <span className="font-medium">{connectionStatus}</span></span>
          <button 
            onClick={runConnectionTest}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Test Connection
          </button>
        </div>
        <div>
          <span>Auth System: <span className="font-medium">{authStatus}</span></span>
        </div>
        <div className="mt-2">
          <button 
            onClick={checkActiveUser}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Check Active User
          </button>
        </div>
      </div>
      
      <div className="mb-6 border-t pt-4">
        <h2 className="font-bold mb-2">Signup Test</h2>
        <div className="mb-4">
          <label className="block mb-1">Test Email:</label>
          <input 
            type="email" 
            value={testEmail} 
            onChange={(e) => setTestEmail(e.target.value)} 
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Test Password:</label>
          <input 
            type="text" 
            value={testPassword} 
            onChange={(e) => setTestPassword(e.target.value)} 
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="flex items-center gap-4">
          <span>Status: <span className="font-medium">{signupStatus}</span></span>
          <button 
            onClick={runSignupTest}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            Test Signup
          </button>
        </div>
      </div>
      
      <div className="mb-6 border-t pt-4">
        <h2 className="font-bold mb-2">Login Test (Existing User)</h2>
        <div className="mb-4">
          <label className="block mb-1">Email:</label>
          <input 
            type="email" 
            value={existingEmail} 
            onChange={(e) => setExistingEmail(e.target.value)} 
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Password:</label>
          <input 
            type="password" 
            value={existingPassword} 
            onChange={(e) => setExistingPassword(e.target.value)} 
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="flex items-center gap-4 mb-2">
          <span>Status: <span className="font-medium">{loginStatus}</span></span>
          <button 
            onClick={runLoginTest}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Test Login
          </button>
        </div>
        {loginResult && (
          <div className="mt-2 p-3 bg-gray-100 rounded-md text-sm">
            <p className="font-semibold">Login successful!</p>
            <p>User ID: {loginResult.user?.id}</p>
            <p>Email: {loginResult.user?.email}</p>
            <p className="mt-1">Session active: {loginResult.session ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>
      
      <div className="mb-6 border-t pt-4">
        <h2 className="font-bold mb-2">Check If User Exists</h2>
        <div className="mb-4">
          <label className="block mb-1">Email to check:</label>
          <input 
            type="email" 
            value={emailToCheck} 
            onChange={(e) => setEmailToCheck(e.target.value)} 
            className="w-full p-2 border rounded-md"
          />
        </div>
        <div className="flex items-center gap-4">
          <span>Status: <span className="font-medium">{userExistsStatus}</span></span>
          <button 
            onClick={runUserExistsCheck}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            Check User
          </button>
        </div>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-md">
        <h2 className="font-bold mb-2">Troubleshooting Tips</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          <li>Check if the Supabase project is active and not paused</li>
          <li>Verify that email authentication is enabled in Supabase Auth settings</li>
          <li>Ensure the API keys are correct and have the necessary permissions</li>
          <li>Check if email confirmation is required (it can prevent immediate login)</li>
          <li>Verify that the redirect URLs are configured correctly in Supabase</li>
          <li>For real users, make sure their email was verified if verification is required</li>
          <li>Try using a private/incognito window to avoid conflicting sessions</li>
        </ul>
      </div>
      
      <div className="mt-6 border-t pt-4">
        <h2 className="font-bold mb-2">Diagnostic Logs</h2>
        <div className="bg-black text-green-400 p-3 rounded-md h-40 overflow-y-auto font-mono text-sm">
          {logEntries.length > 0 ? (
            logEntries.map((log, index) => (
              <div key={index}>{log}</div>
            ))
          ) : (
            <div className="text-gray-500">No logs yet...</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SupabaseDiagnostic;