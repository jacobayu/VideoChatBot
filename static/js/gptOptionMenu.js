document.addEventListener('DOMContentLoaded', (event) => {
    const transcriptContainer = document.getElementById('transcript-container');
    const contextMenu = document.getElementById('context-menu');
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
        const encodedText = encodeURIComponent(selectedText);

        // Add user's action to the chat history
        chatHistory.push({
            role: 'user',
            content: `Translate this text: "${selectedText}"`
        });

        // Make an AJAX call to the Flask server to get the summary
        fetch('/translate/' + encodedText)
        .then(response => response.text())
        .then(translation => {
            // Now, you would open a chatbox with the summary
            console.log(translation)

            // Add the summary to the chat history
            chatHistory.push({
                role: 'assistant',
                content: "Can you translate this to Chinese for me? " + translation
            });

            // openChatBox(translation);
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
        const encodedText = encodeURIComponent(selectedText);

        // Make an AJAX call to the Flask server to get the summary
        fetch('/summarize/' + encodedText)
        .then(response => response.text())
        .then(summary => {
            // Now, you would open a chatbox with the summary
            console.log(summary)

            // Add the summary to the chat history
            chatHistory.push({
                role: 'assistant',
                content: "Can you summarize this for me? " + summary
            });

            openChatBox(summary);
        })
        .catch(error => {
            console.error('Error during summary:', error);
        });
    };

    window.explainText = function() {
        // new conversation -- clear chat history
        chatHistory = [];

        console.log('Elaborate:', selectedText);
        const encodedText = encodeURIComponent(selectedText);

        // Make an AJAX call to the Flask server to get the summary
        fetch('/explain/' + encodedText)
        .then(response => response.text())
        .then(explanation => {
            // Now, you would open a chatbox with the summary
            console.log(explanation)

            // Add the summary to the chat history
            chatHistory.push({
                role: 'assistant',
                content: "Can you explain this to me? " + explanation
            });

            openChatBox(explanation);
        })
        .catch(error => {
            console.error('Error during explanation:', error);
        });
    };

    function openChatBox() {
        const chatbox = document.getElementById('chatbox');
        chatbox.innerHTML = ''; // Clear previous content
    
        chatHistory.forEach(message => {
            const messageRole = message.role === 'user' ? 'You' : 'ChatGPT';
            chatbox.innerHTML += `<div>${messageRole}: ${message.content}</div>`;
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

    window.sendMessage = function() {
        const inputField = document.getElementById('chatboxInput');
        const userInput = inputField.value.trim();
        const chatbox = document.getElementById('chatbox');
    
        if (userInput) {
            // Add user message to chat history
            chatHistory.push({
                role: 'user',
                content: userInput
            });
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
                body: JSON.stringify({ message: userInput, chatHistory: JSON.stringify(chatHistory) }),
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
