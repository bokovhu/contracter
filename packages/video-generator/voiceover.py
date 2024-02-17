import dotenv
dotenv.load_dotenv()
from openai import OpenAI
import os

openai = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

input_dir = "video-in"
num_files = 1000  # Total number of files

for i in range(num_files):
    txt_file = f"{input_dir}/{str(i).zfill(3)}.txt"
    mp3_file = f"{input_dir}/{str(i).zfill(3)}.mp3"

    if os.path.exists(txt_file):
        with open(txt_file, 'r') as file:
            text = file.read()

        print(f"Generating speech for {i} ...")

        # Generating speech from text
        response = openai.audio.speech.create(
            model="tts-1",
            input=text,
            voice="alloy",
            response_format="mp3"
        )

        # Saving the audio file
        with open(mp3_file, 'wb') as audio_file:
            audio_file.write(response.content)
