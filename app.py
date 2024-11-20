from flask import Flask, request, jsonify
import yt_dlp
import os

app = Flask(__name__)

# Path to save downloaded files
DOWNLOAD_FOLDER = '/tmp/downloads'
if not os.path.exists(DOWNLOAD_FOLDER):
    os.makedirs(DOWNLOAD_FOLDER)

# Route for the root page
@app.route('/')
def home():
    return "Flask app is running!"


# Endpoint to handle video download requests
@app.route('/download', methods=['POST'])
def download_video():
    data = request.get_json()

    # Extract the URL and formats from the request
    video_url = data.get("videoUrl")
    formats = data.get("formats")

    if not video_url:
        return jsonify({"status": "error", "message": "No video URL provided"}), 400

    # Setup options for yt-dlp
    download_options = {
        'format': formats.get('video', 'best'),
        'outtmpl': os.path.join(DOWNLOAD_FOLDER, '%(title)s.%(ext)s'),
        'noplaylist': True,
        'quiet': False
    }

    if formats.get('audio'):
        download_options['audio_quality'] = formats['audio']
        
    if formats.get('subtitles'):
        download_options['subtitleslangs'] = [formats['subtitles']]

    try:
        # Initialize yt-dlp and download
        with yt_dlp.YoutubeDL(download_options) as ydl:
            result = ydl.download([video_url])

        # If download is successful, return success message
        return jsonify({
            "status": "success",
            "message": f"Download started for {video_url}"
        }), 200

    except Exception as e:
        # If there's an error, return the error message
        return jsonify({
            "status": "error",
            "message": f"Failed to download: {str(e)}"
        }), 500


if __name__ == '__main__':
    # For local testing
    app.run(debug=True, host="0.0.0.0", port=80)
