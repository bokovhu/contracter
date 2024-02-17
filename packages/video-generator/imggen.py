import dotenv
dotenv.load_dotenv()
from openai import OpenAI
import os
import requests

openai = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

input_dir = "video-in"
num_files = 1000  # Total number of files

for i in range(num_files):
    prompt_file = f"{input_dir}/{str(i).zfill(3)}.imgprompt"
    image_file = f"{input_dir}/{str(i).zfill(3)}.png"

    if os.path.exists(prompt_file):
        with open(prompt_file, 'r') as file:
            text = file.read()
        
        print(f"Generating image for {i} ...")

        # Generating speech from text
        response = openai.images.generate(
            model="dall-e-3",
            prompt=text,
            quality="hd",
            response_format="url",
            size="1792x1024"
        )

        image_url = response.data[0].url
        image_data = requests.get(image_url).content

        # Saving the audio file
        with open(image_file, 'wb') as img_file:
            img_file.write(image_data)
