import argparse
import dotenv
import requests
dotenv.load_dotenv()
from openai import OpenAI
import os
import json
from concurrent.futures import ThreadPoolExecutor, as_completed
import queue
from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips

# Your parameters
T_FadeIn = 0.5  # in seconds
T_AudioDelay = 0.5  # in seconds
T_Sustain = 0.2  # in seconds
T_FadeOut = 0.5  # in seconds

openai = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)


def step_scriptgen(projectdir, prompt):

    SYSTEM_PROMPT = """
    Be creative, and write a novel script for a video, based on the user's description! The video script consists of { narrationText, backgroundImageDescription } objects, and it must be a JSON array. The narration text is the text for the voice-over in the video for a scene, while the background image description should precisely describe how the background looks like in this scene.

    You MUST answer with NOTHING ELSE, just a single JSON Array of { narrationText, backgroundImageDescription } objects. Your response MUST IN ALL CASES start with a "[", and NOTHING ELSE!
    """.strip()


    # input_prompt = "Write me the script for a video, that is a sales pitch for a Smart Contract editor application. First, talk about how it makes Smart Contract Development available to any user. Then, talk about how it enables the enforcement of contracts via digital methods, and cryptography, which is a new and exciting way to make deals in our lives. Who would want to expose theirselves to being robbed? Who would want to not get the work they have paid for? Contracter, our application is the solution to these problems. It is also compatible with multiple blockchains. Contracter generates Smart Contracts, and shows a UI to the users. On this UI, users can track their tasks, and rewards associated with the contracts. It enables enforcement of contracts by being the first-class handler of the money involved in the deals."
    input_prompt = prompt

    def try_get_completion():
        try:
            chat_completion = openai.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": SYSTEM_PROMPT
                    },
                    {
                        "role": "user",
                        "content": input_prompt
                    }
                ],
                model="gpt-4-turbo-preview",
                max_tokens=4000,
            )
            assistant_message = chat_completion.choices[0].message.content
            parsed_message = json.loads(assistant_message)
            if not isinstance(parsed_message, list):
                raise Exception("Invalid response format")
            # Validate items
            for item in parsed_message:
                if not isinstance(item, dict):
                    raise Exception("Invalid response format")
                if "narrationText" not in item or "backgroundImageDescription" not in item:
                    raise Exception("Invalid response format")
            
            return parsed_message
        except Exception as e:
            print(f"An error occurred: {e}")
            return None

    assistant_message = try_get_completion()

    if assistant_message is None:
        print("Assistant refused to provide a response. Exiting...")
        exit()

    print("Are you sure you want to continue? (yes/no)")
    user_confirmation = input()
    if user_confirmation != "yes":
        print("Exiting...")
        exit()

    # Remove input_dir/*.{png|mp3|txt|imgprompt}
    input_dir = f"{projectdir}/video-in"
    os.makedirs(input_dir, exist_ok=True)
    for file in os.listdir(input_dir):
        if file.endswith(".png") or file.endswith(".mp3") or file.endswith(".txt") or file.endswith(".imgprompt"):
            os.remove(os.path.join(input_dir, file))

    # Write the assistant's response to input_dir/{xyz}.txt and input_dir/{xyz}.imgprompt files
    scenes = assistant_message
    for i, scene in enumerate(scenes):
        with open(f"{input_dir}/{str(i).zfill(3)}.txt", "w") as file:
            file.write(scene["narrationText"])
        with open(f"{input_dir}/{str(i).zfill(3)}.imgprompt", "w") as file:
            file.write(scene["backgroundImageDescription"])


def step_voice_and_images(projectdir):
    input_dir = f"{projectdir}/video-in"
    num_files = 1000  # Total number of files

    def process_audio_file(i):
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
                voice="onyx",
                response_format="mp3"
            )

            # Saving the audio file
            with open(mp3_file, 'wb') as audio_file:
                audio_file.write(response.content)

    def process_image_file(i):
        prompt_file = f"{input_dir}/{str(i).zfill(3)}.imgprompt"
        image_file = f"{input_dir}/{str(i).zfill(3)}.png"

        if os.path.exists(prompt_file):
            with open(prompt_file, 'r') as file:
                text = file.read()

            print(f"Generating image for {i} ...")

            # Generating image from text
            response = openai.images.generate(
                model="dall-e-3",
                prompt=text,
                quality="hd",
                response_format="url",
                size="1792x1024"
            )

            image_url = response.data[0].url
            image_data = requests.get(image_url).content

            # Saving the image file
            with open(image_file, 'wb') as img_file:
                img_file.write(image_data)
    
    def process_file(tup):
        i, file_type = tup
        if file_type == 'audio':
            process_audio_file(i)
        elif file_type == 'image':
            process_image_file(i)
    
    
    # Create a queue for tasks
    task_queue = queue.Queue()

    # Add tasks to the queue
    for i in range(num_files):
        task_queue.put((i, 'audio'))
        task_queue.put((i, 'image'))
        
    # Define the number of workers
    num_workers = 4

    # Process tasks in parallel using ThreadPoolExecutor
    with ThreadPoolExecutor(max_workers=num_workers) as executor:
        # Submit tasks to the executor
        futures = [executor.submit(process_file, task_queue.get()) for _ in range(num_files)]

        # Wait for all futures to complete
        for future in as_completed(futures):
            future.result()  # This can be used to handle exceptions if needed

def step_final_video(projectdir):
    clips = []
    input_dir = f"{projectdir}/video-in"
    num_files = 1000  # Total number of files

    for i in range(num_files):
        img_file = f"{input_dir}/{str(i).zfill(3)}.png"
        audio_file = f"{input_dir}/{str(i).zfill(3)}.mp3"

        # Check if both the image and audio files exist
        if os.path.exists(img_file) and os.path.exists(audio_file):
            print(f"Processing {img_file} and {audio_file}")
            # Load audio to determine its duration
            audio_clip = AudioFileClip(audio_file)
            audio_duration = audio_clip.duration

            # Create video clip from image
            video_clip = ImageClip(img_file)
            clip_duration = T_FadeIn + T_AudioDelay + audio_duration + T_Sustain + T_FadeOut
            video_clip = video_clip.set_duration(clip_duration)
            video_clip = video_clip.fadein(T_FadeIn).fadeout(T_FadeOut)

            # Set audio to the video clip with delay
            audio_clip = audio_clip.set_start(T_FadeIn + T_AudioDelay)
            video_clip = video_clip.set_audio(audio_clip)

            clips.append(video_clip)

    prevdir = os.getcwd()
    os.chdir(projectdir)

    # Concatenate all clips
    final_clip = concatenate_videoclips(clips, method="compose") if clips else None

    # Write to a file if there are any clips
    if final_clip:
        os.makedirs(f"video-out", exist_ok=True)
        final_clip.write_videofile(f"video-out/final_video.mp4", fps=24)
    else:
        print("No valid file pairs found. No video created.")

    os.chdir(prevdir)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Generate a script for a video")
    parser.add_argument("-p", "--projectdir", type=str, help="The project directory", required=True)
    parser.add_argument("-i", "--input", type=str, help="The input prompt", required=True)
    args = parser.parse_args()

    step_scriptgen(args.projectdir, args.input)
    step_voice_and_images(args.projectdir)
    step_final_video(args.projectdir)
