from moviepy.editor import ImageClip, AudioFileClip, concatenate_videoclips
import os

# Your parameters
T_FadeIn = 0.5  # in seconds
T_AudioDelay = 0.5  # in seconds
T_Sustain = 0.2  # in seconds
T_FadeOut = 0.5  # in seconds

input_dir = "video-in"

# Assuming files are named '000.mp3', '000.png', '001.mp3', '001.png', etc.
num_files = 1000  # Total number of files

clips = []

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

# Concatenate all clips
final_clip = concatenate_videoclips(clips, method="compose") if clips else None

# Write to a file if there are any clips
if final_clip:
    final_clip.write_videofile("video-out/final_video.mp4", fps=24)
else:
    print("No valid file pairs found. No video created.")
