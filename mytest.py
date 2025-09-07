import requests
import json

def call_deepseek_api(prompt):
    api_key = "your-api-key-here"  # Replace with your actual API key
    url = "https://api.deepseek.com/v1/chat/completions"
    
    headers = {
        "Authorization": f"Bearer sk-5e8d1926ed6a469ba1dac4d2ba37f326",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "deepseek-chat",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7
    }
    
    response = requests.post(url, headers=headers, json=payload)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        print(response.text)
        return None

# Usage
result = call_deepseek_api("Hello, how are you?")
print(result)