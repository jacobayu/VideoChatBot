from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')

# Initialize the OpenAI client with your API key
client = OpenAI(api_key=api_key)

def chat_with_bot(prompt_text):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",  # Replace with your specific GPT-4 model identifier
        messages=[
            {"role": "user", "content": prompt_text}
        ]
    )
    # Accessing the content from the response's choices attribute
    message = response.choices[0].message.content
    return message



def main():
    print("Chatbot initialized. You can start chatting with me! Type 'quit' to exit.")
    
    while True:
        user_input = input("You: ")
        if user_input.lower() == "quit":
            print("Chatbot exiting. Goodbye!")
            break
        bot_response = chat_with_bot(user_input)
        print("Bot:", bot_response)

if __name__ == "__main__":
    main()