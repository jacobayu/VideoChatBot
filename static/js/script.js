document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('uploadForm').addEventListener('submit', function(e) {
        // When the form is submitted, prevents the default form submission and 
        // instead sends the video file to the Flask server using fetch.
        e.preventDefault();

        // create formData object:  create a set of key/value pairs representing 
        // form fields and their values, which includes the uploaded file
        const formData = new FormData();
        let videoFile = document.querySelector('input[type="file"]').files[0];

        // ffmpeg (server-side) doesn't work with file names with spaces
        // so replace spaces with underscores
        let fileName = videoFile.name.replace(/\s/g, '_');
        videoFile = new File([videoFile], fileName, {type: videoFile.type});

        formData.append('video', videoFile);

        // Display the video immediately from the local file
        const videoPlayer = document.getElementById('videoPlayer');
        videoPlayer.style.display = 'block';
        videoPlayer.src = URL.createObjectURL(videoFile);

        fetch('/upload-video', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // Display the video
            // const videoPlayer = document.getElementById('videoPlayer');
            // videoPlayer.style.display = 'block';
            // videoPlayer.src = URL.createObjectURL(videoFile);

            // Display the transcript
            const transcriptDiv = document.getElementById('transcript');
            console.log(data);
            console.log(data.transcript['text'])
            transcriptDiv.textContent = data.transcript['text'];
        })
        .catch(error => console.error('Error:', error));
    });
});