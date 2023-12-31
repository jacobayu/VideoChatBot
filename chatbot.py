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

bot_system_content = "You are a tutor that is going to help students at Harvard University understand a video for a linguistics class. The title of the lecture is \"How to use bracket-based syntax tree builders for Introductory Linguistics Trees.\" In addition to the selected portion of the transcript, you will also be given the context around the selected portion of the transcript. However, please only analyze the selected portion, not the context around it. Please always answer to the best of your abilities, even if you do not have enough context."

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
        model="gpt-4-1106-preview",  # Replace with your specific GPT-4 model identifier
        messages=messages
    )
    message = response.choices[0].message.content

    return message

def main():
    print("Chatbot initialized. Type 'quit' to exit.")
    
    # Example context setting
    set_bot_context(
        description="This app enhances learning by converting MP4 lecture files into transcripts and offering interactive chat features, including summarization, explanation, and translation. It's designed for students, with a focus on introductory linguistics classes. The chatbot utilizes natural language understanding to provide context-sensitive responses.",
        instructions="Respond to user queries about lecture content. When a transcript section is highlighted for 'summarize', 'explain', or 'translate', deliver accurate, concise, and relevant responses. Adapt to the complexity and context of each query. Clarify unclear or incomplete user requests. The primary content source is Professor Will Styler’s lectures on introductory linguistics."
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
