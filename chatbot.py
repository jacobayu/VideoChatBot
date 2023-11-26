from openai import OpenAI
import os
from dotenv import load_dotenv
import json

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

def chat_with_bot(prompt_text, task_type, chat_history_text=None):
    """
    This function handles both initial and follow-up messages for a chatbot.

    :param prompt_text: The new user message to send to the chatbot.
    :param chat_history_text: The existing chat history in JSON format, if any.
                              If None, it's an initial message.

    :return: The chatbot's response.
    """
    # Determine the full prompt based on the task type
    if task_type == 'translate':
        # For translation, adjust the prompt accordingly
        prompt_prefix = "Translate this to Chinese: "
    elif task_type == 'summarize':
        prompt_prefix = "Can you summarize this for me? "
    else:
        # Default to explanation
        prompt_prefix = "Can you further elaborate on this? "


    # If there is no chat history, it's an initial message
    if chat_history_text is None:
        full_prompt = f"{bot_context['description']} {bot_context['instructions']} {prompt_prefix}{prompt_text}"
        messages = [{"role": "user", "content": full_prompt}]
    else:
        # Parse the chat history text into a list of dictionaries
        print("chat_history_text!!!! ", chat_history_text)
        chat_history = json.loads(chat_history_text)
        messages = chat_history + [{"role": "user", "content": prompt_text}]

    response = client.chat.completions.create(
        model="gpt-3.5-turbo-1106",  # Replace with your specific GPT-4 model identifier
        messages=messages
    )
    message = response.choices[0].message.content

    return message

def main():
    print("Chatbot initialized. Type 'quit' to exit.")
    
    # Example context setting
    set_bot_context(
        description="You are a chatbot being used in a linguistics class.",
        instructions="Be patient and provide detailed explanations when needed."
    )

    # while True:
    #     user_input = input("You: ")
    #     if user_input.lower() == "quit":
    #         print("Chatbot exiting. Goodbye!")
    #         break
    #     bot_response, chat_history = chat_with_bot(user_input, chat_history)
    #     print("Bot:", bot_response)

if __name__ == "__main__":
    main()
