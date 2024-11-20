from flask import Flask, request, jsonify
import yt_dlp
from cachetools import TTLCache

app = Flask(__name__)

# Configure cache for downloaded files (adjust timeout as needed)
download_cache = TTLCache(maxsize=10, ttl=60)  # Cache 10 files for 1 minute

@app.route('/')
def home():
    return "Flask app is running!"

@app.route('/download', methods=['POST'])
def download_video():
    data = request.get_json()

    video_url = data.get("videoUrl")
    formats = data.get("formats")

    if not video_url:
        return jsonify({"status": "error", "message": "No video URL provided"}), 400

    download_options = {
        'format': formats.get('video', 'best'),
        'noplaylist': True,
        'quiet': False
    }

    if formats.get('audio'):
        download_options['audio_quality'] = formats['audio']

    if formats.get('subtitles'):
        download_options['subtitleslangs'] = [formats['subtitles']]

    try:
        with yt_dlp.YoutubeDL(download_options) as ydl:
            # Download & store in cache
            info_dict = ydl.extract_info(video_url, download=False)
            filename = os.path.join(DOWNLOAD_FOLDER, f"{info_dict['title']}.{info_dict['ext']}")
            download_cache[filename] = ydl.download([video_url])[0]

        return jsonify({
            "status": "success",
            "message": f"Download started for {video_url}"
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"Failed to download: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=80)