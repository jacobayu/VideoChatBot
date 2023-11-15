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
        videoPlayer.style.display = 'block';

        // Generate transcript HTML from JSON data
        transcriptData.segments.forEach(segment => {
            let span = document.createElement('span');
            span.classList.add('transcript-segment');
            span.setAttribute('data-start', segment.start);
            span.setAttribute('data-end', segment.end);
            span.textContent = segment.text + ' ';
            transcriptContainer.appendChild(span);
        });

        const segments = document.getElementsByClassName('transcript-segment');

        videoPlayer.addEventListener('timeupdate', function() {
            let currentTime = videoPlayer.currentTime;

            for (let segment of segments) {
                let start = parseFloat(segment.getAttribute('data-start'));
                let end = parseFloat(segment.getAttribute('data-end'));

                if (currentTime >= start && currentTime <= end) {
                    segment.style.backgroundColor = 'yellow'; // Highlight the active segment
                } else {
                    segment.style.backgroundColor = ''; // Remove highlight from inactive segments
                }
            }
        });
    })    
});