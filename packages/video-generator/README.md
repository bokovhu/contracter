# Video Generator scripts

This package is a "side-track" for our hackathon. We wanted to be able to create the video presentation quickly, so we opted for _reproducible "builds" of the video_. These scripts do the following:

* `scriptgen.py` - based on an initial prompt, generate the _script of a video_. This script is an array of `{ narrationText, backgroundImageDescription }` objects.
    * The `narrationText` is saved as `video-in/{index}.txt`
    * The `backgroundImageDescription` is saved as `video-in/{index}.imgprompt`
* `voiceover.py` and `voiceover_opt.py` - these read the `000.txt` ... `999.txt` files from `video-in`, and use [openai](https://github.com/openai/openai-python) to generate voiceover `.mp3` clips for each of them.
* `imggen.py` and `imggen_opt.py` - these read the `000.imgprompt` ... `999.imgprompt` files from `video-in`, and use [openai](https://github.com/openai/openai-python) to generate background image `.png` files for each of them (using Dall-E 3).
* `main.py` - This uses `moviepy` to assemble a video from the generated `.mp3` and `.png` files into `video-out/final_video.mp4`
* `main2.py` - This combines all of the steps into a single process, that goes from prompt to mp4

You should install the dependencies of the scripts via `pip install -r requirements.txt`. Then you can launch the individual scripts, starting with `scriptgen.py` after editing.

We have created the [submission video](https://www.youtube.com/watch?v=KUHTHg-tN9Y) with these scripts as well. But it was also pretty amusing to create some other interesting ones. We will also upload some of the funnier ones, and update this readme with links to them.
