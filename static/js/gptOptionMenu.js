document.addEventListener('DOMContentLoaded', (event) => {
    const transcriptContainer = document.getElementById('transcript-container');
    const contextMenu = document.getElementById('context-menu');
    const inputField = document.getElementById('chatboxInput');
    let selectedText = ''

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
            const x = e.clientX;
            const y = e.clientY;
            showContextMenu(x, y);
        }
    });

    window.translateText = function() {
        // new conversation -- clear chat history
        chatHistory = [];

        console.log('Translate:', selectedText);

        // Add user's action to the chat history
        chatHistory.push({
            role: 'user',
            content: `Translate this text to Chinese: "${selectedText}"`
        });

        // Prepare the data to be sent to the server
        const requestData = {
            textToTranslate: selectedText,
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

    window.explainText = function() {
        // new conversation -- clear chat history
        chatHistory = [];

        console.log('Elaborate:', selectedText);

        // Add user's action to the chat history
        chatHistory.push({
            role: 'user',
            content: `Explain this text: "${selectedText}"`
        });

        // Prepare the data to be sent to the server
        const requestData = {
            textToExplain: selectedText,
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

    function openChatBox() {
        const chatbox = document.getElementById('chatbox');
        chatbox.innerHTML = ''; // Clear previous content
    
        chatHistory.forEach(message => {
            /*
            chatbox.innerHTML += message.role === 'user' ? `<div class='text-user'>You: ${message.content}</div>`
                                                : `<div class='text-chatgpt'>ChatGPT: ${message.content}</div>`;*/

                                               
            const messageDiv = document.createElement('div');
            messageDiv.classList.add(message.role === 'user' ? 'text-user' : 'text-chatgpt');
            messageDiv.textContent = message.role === 'user' ? `You: ${message.content}` : `ChatGPT: ${message.content}`;
            chatbox.appendChild(messageDiv);
        
        });

        // Scroll to the bottom of the chatbox to show new messages
        chatbox.scrollTop = chatbox.scrollHeight;
    }

    /*
    function openChatBox(initialMessage) {
        // Display the initial message
        const chatbox = document.getElementById('chatbox');
        chatbox.innerHTML = `<div>ChatGPT: ${initialMessage.toString()}</div>`;
    
        // Show the chatbox modal
        const chatboxModal = document.getElementById('chatboxModal');
        chatboxModal.style.display = 'flex';
    
        // Focus the input field for the user to type their response
        document.getElementById('chatboxInput').focus();
    
        // Close button functionality
        const closeButton = document.querySelector('.close');
        closeButton.onclick = function() {
            chatboxModal.style.display = 'none';
        };
    
        // Close the modal when clicking anywhere outside of it
        window.onclick = function(event) {
            if (event.target === chatboxModal) {
                chatboxModal.style.display = 'none';
            }
        };
    }
    */

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
            chatbox.innerHTML += `<div>You: ${userInput}</div>`;
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
    }
});
