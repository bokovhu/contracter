import dotenv
dotenv.load_dotenv()
from openai import OpenAI
import os
import json

SYSTEM_PROMPT = """
Be creative, and write a novel script for a video, based on the user's description! The video script consists of { narrationText, backgroundImageDescription } objects, and it must be a JSON array. The narration text is the text for the voice-over in the video for a scene, while the background image description should precisely describe how the background looks like in this scene.

You MUST answer with NOTHING ELSE, just a single JSON Array of { narrationText, backgroundImageDescription } objects. Your response MUST IN ALL CASES start with a "[", and NOTHING ELSE!
""".strip()

openai = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)
# input_prompt = "Write me the script for a video, that is a sales pitch for a Smart Contract editor application. First, talk about how it makes Smart Contract Development available to any user. Then, talk about how it enables the enforcement of contracts via digital methods, and cryptography, which is a new and exciting way to make deals in our lives. Who would want to expose theirselves to being robbed? Who would want to not get the work they have paid for? Contracter, our application is the solution to these problems. It is also compatible with multiple blockchains. Contracter generates Smart Contracts, and shows a UI to the users. On this UI, users can track their tasks, and rewards associated with the contracts. It enables enforcement of contracts by being the first-class handler of the money involved in the deals."
input_prompt = "Write me a script for a video, it is set is Paris. The first scene is a cafe, with a view of the Eiffel Tower. The second scene is a park, with a view of the Seine River. The third scene is a street, with a view of the Notre Dame Cathedral. The fourth scene is a museum, with a view of the Louvre Pyramid. The fifth scene is a restaurant, with a view of the Arc de Triomphe. The sixth scene is a hotel, with a view of the Sacre Coeur Basilica. The seventh scene is a shop, with a view of the Moulin Rouge. The eighth scene is a theater, with a view of the Palais Garnier. The ninth scene is a library, with a view of the Sainte Chapelle. The tenth scene is a cinema, with a view of the Pantheon. The eleventh scene is a gallery, with a view of the Centre Pompidou."

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
input_dir = "video-in"
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
