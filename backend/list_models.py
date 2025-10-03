import google.generativeai as genai
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv('API_KEY'))

print("=" * 60)
print("Available Gemini Models:")
print("=" * 60)

for model in genai.list_models():
    if 'generateContent' in model.supported_generation_methods:
        print(f"\nAVAILABLE: {model.name}")
        print(f"   Display Name: {model.display_name}")
        print(f"   Description: {model.description}")
        print(f"   Supported Methods: {', '.join(model.supported_generation_methods)}")

print("\n" + "=" * 60)
