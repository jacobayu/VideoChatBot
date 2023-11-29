document.addEventListener('DOMContentLoaded', (event) => {

    fetch('/audio-files/VidTranscript.json')
    .then(response => response.json()) // Parse the JSON string in the response
    .then(data => {
        const transcriptDiv = document.getElementById('transcript');
        console.log(data); // Here's your data in JavaScript object format
        console.log(data['text'])

        const videoPlayer = document.getElementById('videoPlayer');
        const transcriptContainer = document.getElementById('transcript');
        const transcriptData = data;
        const container = document.getElementById('transcript-container');
        const MIN_LENGTH = 30; 

        videoPlayer.style.display = 'block';
        let currentSpan = null;

        // Generate transcript HTML from JSON data
        transcriptData.segments.forEach(segment => {
            let textLength = segment.text.trim().length;

            if (!currentSpan || textLength >= MIN_LENGTH) {
                currentSpan = document.createElement('span');
                currentSpan.classList.add('transcript-segment');
                currentSpan.textContent = segment.text + ' ';
                transcriptContainer.appendChild(currentSpan);
            } else {
                currentSpan.textContent += segment.text + ' ';
            }

            currentSpan.setAttribute('data-start', segment.start);
            currentSpan.setAttribute('data-end', segment.end);
        });

        const segments = document.getElementsByClassName('transcript-segment');

        videoPlayer.addEventListener('timeupdate', function() {
            let currentTime = videoPlayer.currentTime;
            let activeSegment = null;
    
            for (let segment of segments) {
                let start = parseFloat(segment.getAttribute('data-start'));
                let end = parseFloat(segment.getAttribute('data-end'));
    
                if (currentTime >= start && currentTime <= end) {
                    segment.classList.add('active-segment');
                    activeSegment = segment;
                } else {
                    segment.classList.remove('active-segment');
                }
            }
    
            // Auto-scroll within the transcript container
            if (activeSegment) {
                let activeSegmentTop = activeSegment.offsetTop;
                let containerHalfHeight = container.offsetHeight / 2;
                container.scrollTop = activeSegmentTop - containerHalfHeight + (activeSegment.offsetHeight / 2);
            }
        });

        window.onload = function() {
            var videoHeight = document.getElementById('videoPlayer').offsetHeight;
            document.getElementById('chatboxModal').style.height = videoHeight + 'px';
        };
    })    
});