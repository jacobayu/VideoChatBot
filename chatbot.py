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

bot_system_content = "You are a helpful assistant that is going to help students at Harvard University understand a video for a linguistics class. The title of the lecture is \"How to use bracket-based syntax tree builders for Introductory Linguistics Trees.\" You will be asked to explain, summarize, and translate selected portions of the transcript.  You may also be given context that the selected portion of the transcript appears in, but only use the additional context to better analyze the selected portion of the transcript."

def set_bot_context(description, instructions):
    bot_context["description"] = description
    bot_context["instructions"] = instructions

def chat_with_bot(prompt_text, chat_history_text=None):
    """
    This function handles both initial and follow-up messages for a chatbot.

    :param prompt_text: The new user message to send to the chatbot.
    :param chat_history_text: The existing chat history in JSON format, if any.
                              If None, it's an initial message.

    :return: The chatbot's response.
    """
    # If there is no chat history, it's an initial message
    if chat_history_text is None:
        full_prompt = f"{bot_context['description']} {bot_context['instructions']} {prompt_text}"
        messages = [{"role":"system", "content":bot_system_content},
                    {"role": "user", "content": full_prompt}]
    else:
        # Parse the chat history text into a list of dictionaries
        print("chat_history_text!!!! ", chat_history_text)
        full_prompt = f"{bot_context['description']} {bot_context['instructions']}{prompt_text}"
        print(full_prompt)

        messages = chat_history_text + [{"role":"system", "content":bot_system_content},
                                        {"role": "user", "content": full_prompt}]

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
