#!/bin/bash

# Use kdialog to show a file picker for the source directory
source_directory=$(kdialog --getexistingdirectory ~)

# Check if the directory is valid (i.e., not empty)
if [ -z "$source_directory" ]; then
  echo "No directory selected. Exiting."
  exit 1
fi

# Check if the source directory exists
if [ ! -d "$source_directory" ]; then
  echo "Source directory does not exist. Exiting."
  exit 1
fi

# Use kdialog to show a file picker for the destination directory
destination_directory=$(kdialog --getexistingdirectory ~)

# Check if the destination directory is valid (i.e., not empty)
if [ -z "$destination_directory" ]; then
  echo "No destination directory selected. Exiting."
  exit 1
fi

# Check if the destination directory exists
if [ ! -d "$destination_directory" ]; then
  echo "Destination directory does not exist. Exiting."
  exit 1
fi

# Loop through all audio files in the source directory (e.g., .mp3, .wav, .flac)
for file in "$source_directory"/*.{mp3,wav,flac,ogg}; do
  # Check if the file exists and is a regular file
  if [ -f "$file" ]; then
    # Get the file name without the extension
    basename="${file%.*}"

    # Set the output file path in the destination directory, with .ogg extension
    output="${destination_directory}/$(basename "${basename}.ogg")"

    # Perform loudness normalization with FFmpeg and export as .ogg
    echo "Normalizing and converting $file to OGG format..."
    ffmpeg -i "$file" -filter:a loudnorm -c:a libvorbis "$output"
  fi
done

echo "Normalization and conversion complete for all audio files."
