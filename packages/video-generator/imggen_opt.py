import os
import dotenv
import requests
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
    prompt_file = f"{input_dir}/{str(i).zfill(3)}.imgprompt"
    image_file = f"{input_dir}/{str(i).zfill(3)}.png"

    if os.path.exists(image_file):
        print(f"Image for {i} already exists.")
        return

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
