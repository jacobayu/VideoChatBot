document.addEventListener('DOMContentLoaded', (event) => {

    const transcriptContainer = document.getElementById('transcript-container');
    const contextMenu = document.getElementById('context-menu');
    const inputField = document.getElementById('chatboxInput');
    let selectedText = ''
    let contextText = ''
    let currentLanguage = 'zh-TW'; // default language
    const languageMap = {
        "en": "English",
        "es": "Español",
        "de": "German",
        "zh-TW": "中文 (Chinese)",
        "hi": "हिन्दी (Hindi)",
    };

    // stores all of the message history
    // can either store assistant (chatgpt) messages:
    // {"role": "assistant", "content": [MESSAGE]}
    // or user messages:
    // {"role": "user", "content": [MESSAGE]}
    let chatHistory = [];

    // Function to show the context menu
    function showContextMenu(x, y) {
        contextMenu.style.top = `${y}px`;
        contextMenu.style.left = `${x}px`;
        contextMenu.style.display = 'block';
    }

    // Hide context menu on click outside
    document.addEventListener('click', function(e) {
        if (e.target !== contextMenu) {
            contextMenu.style.display = 'none';
        }
    });

    // Attach double-click event to the transcript container
    transcriptContainer.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        selectedText = window.getSelection().toString().trim();
        if (selectedText.length > 0) {
            // Get the position of the right-click
            console.log(selectedText)
            let selectedRange = window.getSelection().getRangeAt(0);
            let startContainer = selectedRange.startContainer;
            let endContainer = selectedRange.endContainer;

            // Find the nearest ancestor or self span element
            let startSpan = startContainer.nodeType === 3 ? startContainer.parentNode : startContainer;
            let endSpan = endContainer.nodeType === 3 ? endContainer.parentNode : endContainer;

            // Get the first previous and next siblings
            let firstPrevSpan = startSpan.previousElementSibling;
            let firstNextSpan = endSpan.nextElementSibling;

            // Get the second previous and next siblings
            let secondPrevSpan = firstPrevSpan ? firstPrevSpan.previousElementSibling : null;
            let secondNextSpan = firstNextSpan ? firstNextSpan.nextElementSibling : null;

            // Concatenate the text from these spans
            contextText = (secondPrevSpan ? secondPrevSpan.textContent : '') +
                            (firstPrevSpan ? firstPrevSpan.textContent : '') +
                            selectedText +
                            (firstNextSpan ? firstNextSpan.textContent : '') +
                            (secondNextSpan ? secondNextSpan.textContent : '');
            // contextText =  (firstPrevSpan ? firstPrevSpan.textContent : '') +
            //                 selectedText +
            //                 (firstNextSpan ? firstNextSpan.textContent : '') 

            console.log(contextText)
            const x = e.clientX;
            const y = e.clientY;
            showContextMenu(x, y);
        }
    });

    
    // set language depending on option selected in the menu
    document.getElementById('languageSelect').addEventListener('change', function() {
        var selectedLanguage = this.value;
        currentLanguage = this.value;
        console.log(currentLanguage);

        // Send this information to the backend
        fetch('/set_language', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ language: selectedLanguage }),
        });
    });

    window.explainText = function() {
        // new conversation -- clear chat history
        chatHistory = [];

        // Add user's action to the chat history
        chatHistory.push({
            role: 'user',
            content: `Explain this text: "${selectedText}" Here is the context in which this selected portion of the transcript appears: '
             ${contextText}`
        });

        // Prepare the data to be sent to the server
        const requestData = {
            textToExplain: selectedText,
            contextText: contextText,
            chatHistory: chatHistory
        };

        // Make an AJAX call to the Flask server to get the explanation
        fetch('/explain', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            // Now, you would open a chatbox with the explanation
            const explain = data.explanation; 
            console.log(explain)

            // Add the explanation to the chat history
            chatHistory.push({
                role: 'assistant',
                content: explain
            });

            openChatBox();
        })
        .catch(error => {
            console.error('Error during explanation:', error);
        });
    };


    window.translateText = function() {
        // new conversation -- clear chat history
        chatHistory = [];

        console.log('Translate:', selectedText);

        // Add user's action to the chat history
        chatHistory.push({
            role: 'user',
            content: `Translate this text to ${languageMap[currentLanguage]}: "${selectedText}" To help you with your translation, here is the context in which text appears: ${contextText}`
        });

        // Prepare the data to be sent to the server
        const requestData = {
            textToTranslate: selectedText,
            contextText: contextText,
            chatHistory: chatHistory
        };

        // Make an AJAX call to the Flask server to get the translation
        fetch('/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            // Now, you would open a chatbox with the translation
            const translation = data.translation; // Assuming the server returns a JSON object with the translation
            console.log(translation)

            // Add the translation to the chat history
            chatHistory.push({
                role: 'assistant',
                content: translation
            });

            openChatBox();
        })
        .catch(error => {
            console.error('Error during translation:', error);
        });
    };

    window.summarizeText = function() {
        // new conversation -- clear chat history
        chatHistory = [];

        console.log('Summarize:', selectedText);

        // Add user's action to the chat history
        chatHistory.push({
            role: 'user',
            content: `Summarize this text: "${selectedText}"`
        });

        // Prepare the data to be sent to the server
        const requestData = {
            textToSummarize: selectedText,
            chatHistory: chatHistory
        };

        // Make an AJAX call to the Flask server to get the summary
        fetch('/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        })
        .then(response => response.json())
        .then(data => {
            // Now, you would open a chatbox with the summary
            const summ = data.summary; 
            console.log(summ)

            // Add the summary to the chat history
            chatHistory.push({
                role: 'assistant',
                content: summ
            });

            openChatBox();
        })
        .catch(error => {
            console.error('Error during summary:', error);
        });
    };

    
    function openChatBox() {
        const chatbox = document.getElementById('chatbox');
        chatbox.innerHTML = ''; // Clear previous content
    
        chatHistory.forEach(message => {
            /*
            chatbox.innerHTML += message.role === 'user' ? `<div class='text-user'>You: ${message.content}</div>`
                                                : `<div class='text-chatgpt'>ChatGPT: ${message.content}</div>`;*/

                                               
            // const messageDiv = document.createElement('div');
            // messageDiv.classList.add(message.role === 'user' ? 'text-user' : 'text-chatgpt');
            // messageDiv.textContent = message.role === 'user' ? `You: ${message.content}` : `ChatGPT: ${message.content}`;
            // chatbox.appendChild(messageDiv);
            const messageDiv = document.createElement('div');
            messageDiv.classList.add(message.role === 'user' ? 'text-user' : 'text-chatgpt');

            // Create a span element for the bold part
            const boldPart = document.createElement('strong');
            boldPart.textContent = message.role === 'user' ? 'You: ' : 'ChatGPT: ';

            // Create a text node for the message content
            const messageContent = document.createTextNode(message.content);

            // Append the bold part and the message content to the messageDiv
            messageDiv.appendChild(boldPart);
            messageDiv.appendChild(messageContent);

            // Append the messageDiv to the chatbox
            chatbox.appendChild(messageDiv);
        
        });

        // Scroll to the bottom of the chatbox to show new messages
        chatbox.scrollTop = chatbox.scrollHeight;
    };

    // Function to handle Enter key press in input field
    inputField.addEventListener('keyup', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent the default action to avoid line breaks in input field
            sendMessage(); // Call your existing sendMessage function
        }
    });

    window.sendMessage = function() {
        const inputField = document.getElementById('chatboxInput');
        const userInput = inputField.value.trim();
        const chatbox = document.getElementById('chatbox');
    
        if (userInput) {
            // Add user message to chat history
            console.log('New message here')
            console.log(userInput)
            chatHistory.push({
                role: 'user',
                content: userInput
            });
            console.log(chatHistory)
            // Display the user's message in the chatbox
            chatbox.innerHTML += `<div style="background-color: #D9E8FF; border-radius: 5px; padding: 5px;"><b>You:</b> ${userInput}</div>`;
            // Clear the input field after sending the message
            inputField.value = '';
            console.log(userInput)
            // Send the message to the server (you'd replace the URL with your actual endpoint)
            fetch('/chat-with-bot', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userInput, chatHistory: chatHistory }),
            })
            .then(response => response.text())
            .then(response => {
                console.log(response);
                chatHistory.push({
                    role: 'assistant',
                    content: response
                });
                openChatBox(); // Updated to show full chat history
                /*
                console.log(response)
                chatbox.innerHTML += `<div>ChatGPT: ${response}</div>`;
                // Scroll to the bottom of the chatbox to show new message
                chatbox.scrollTop = chatbox.scrollHeight;
                */
            })
            .catch(error => {
                console.error('Error:', error);
            });
        }
    };
});