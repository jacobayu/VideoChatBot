from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv('OPENAI_API_KEY')

# Initialize the OpenAI client with your API key
client = OpenAI(api_key=api_key)

# Contextual information for the chatbot
bot_context = {
    "description": "",
    "instructions": ""
}

def set_bot_context(description, instructions):
    bot_context["description"] = description
    bot_context["instructions"] = instructions

def chat_with_bot(prompt_text, chat_history):
    full_prompt = f"{bot_context['description']} {bot_context['instructions']} {prompt_text}"
    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",  # Replace with your specific GPT-4 model identifier
        messages=chat_history + [{"role": "user", "content": full_prompt}]
    )
    message = response.choices[0].message.content
    return message, chat_history + [{"role": "user", "content": prompt_text}, {"role": "assistant", "content": message}]

def main():
    print("Chatbot initialized. Type 'quit' to exit.")
    
    # Example context setting
    set_bot_context(
        description="You are a chatbot being used in a linguistics class.",
        instructions="Be patient and provide detailed explanations when needed."
    )

    chat_history = []
    while True:
        user_input = input("You: ")
        if user_input.lower() == "quit":
            print("Chatbot exiting. Goodbye!")
            break
        bot_response, chat_history = chat_with_bot(user_input, chat_history)
        print("Bot:", bot_response)

if __name__ == "__main__":
    main()
