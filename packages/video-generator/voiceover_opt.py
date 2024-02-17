import os
import dotenv
from openai import OpenAI
from concurrent.futures import ThreadPoolExecutor, as_completed
import queue

# Load environment variables
dotenv.load_dotenv()

# Initialize OpenAI client
openai = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Define directory and number of files
input_dir = "video-in"
num_files = 1000  # Total number of files

# Define the task function
def process_file(i):
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

# Create a queue for tasks
task_queue = queue.Queue()

# Add tasks to the queue
for i in range(num_files):
    task_queue.put(i)

# Define the number of workers
num_workers = 4

# Process tasks in parallel using ThreadPoolExecutor
with ThreadPoolExecutor(max_workers=num_workers) as executor:
    # Submit tasks to the executor
    futures = [executor.submit(process_file, task_queue.get()) for _ in range(num_files)]

    # Wait for all futures to complete
    for future in as_completed(futures):
        future.result()  # This can be used to handle exceptions if needed

print("All tasks completed.")
