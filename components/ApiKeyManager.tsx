import { useState, useEffect } from 'react';

export function ApiKeyManager() {
  const [apiKey, setApiKey] = useState('');
  const [isSet, setIsSet] = useState(false);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
      setIsSet(true);
    } else {
      setShowInput(true);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem('gemini_api_key', apiKey.trim());
      setIsSet(true);
      setShowInput(false);
    }
  };

  const handleReset = () => {
    if (confirm('Bạn có chắc muốn xóa API key?')) {
      localStorage.removeItem('gemini_api_key');
      setApiKey('');
      setIsSet(false);
      setShowInput(true);
    }
  };

  if (isSet && !showInput) {
    return (
      <div style={{
        padding: '12px 16px',
        background: '#e8f5e9',
        borderRadius: '8px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <span style={{ color: '#2e7d32', fontWeight: '500' }}>
          ✓ API key đã được cấu hình
        </span>
        <button 
          onClick={() => setShowInput(true)}
          style={{
            padding: '6px 12px',
            background: 'white',
            border: '1px solid #2e7d32',
            borderRadius: '4px',
            color: '#2e7d32',
            cursor: 'pointer'
          }}
        >
          Đổi API key
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      background: '#f5f5f5',
      borderRadius: '8px',
      marginBottom: '20px',
      border: '2px solid #e0e0e0'
    }}>
      <h3 style={{ marginTop: 0 }}>🔑 Cấu hình API Key</h3>
      <p style={{ color: '#666' }}>
        Nhập API key của bạn từ <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener">Google AI Studio</a>
      </p>
      <input
        type="password"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        placeholder="Nhập Gemini API key..."
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '12px',
          border: '1px solid #ccc',
          borderRadius: '4px',
          fontSize: '14px',
          boxSizing: 'border-box'
        }}
        onKeyPress={(e) => e.key === 'Enter' && handleSave()}
      />
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={handleSave}
          style={{
            padding: '10px 20px',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500'
          }}
        >
          Lưu API Key
        </button>
        {isSet && (
          <button 
            onClick={handleReset}
            style={{
              padding: '10px 20px',
              background: '#d32f2f',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Xóa
          </button>
        )}
      </div>
      <p style={{ fontSize: '12px', color: '#666', marginTop: '12px', marginBottom: 0 }}>
        🔒 API key chỉ lưu trên trình duyệt của bạn, không gửi lên server
      </p>
    </div>
  );
}

// Export helper function để các component khác sử dụng
export function getApiKey(): string | null {
  return localStorage.getItem('gemini_api_key');
}