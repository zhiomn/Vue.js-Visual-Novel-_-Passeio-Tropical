import os
from PIL import Image

# --- Configuration ---
# 1. Folder with your original images
input_folder = "gallery" 

# 2. Folder where thumbnails will be saved
output_folder = "thumbnails"

# 3. Desired thumbnail size (width, height)
target_size = (1240, 1754) 

# 4. List of file extensions to look for (add more if needed)
#    (The dot is important, and it should be lowercase)
allowed_extensions = (".webp", ".jpeg", ".jpg")
# ---------------------


# Ensure the output folder exists
# This now creates the thumbnails folder at the top level, next to 'gallery'
os.makedirs(output_folder, exist_ok=True)

print(f"Searching for {', '.join(allowed_extensions)} images in '{input_folder}'...")

# Check if the input folder exists to prevent errors
if not os.path.isdir(input_folder):
    print(f"!! Error: Input folder '{input_folder}' not found. Please check the path.")
else:
    # Loop through all files in the input folder
    for filename in os.listdir(input_folder):
        # Check if the file has one of the allowed extensions
        if filename.lower().endswith(allowed_extensions):
            input_path = os.path.join(input_folder, filename)
            
            # --- CHANGE: Standardize output filename to .webp ---
            # Get the filename without its original extension
            base_filename = os.path.splitext(filename)[0]
            # Create the new filename with a .webp extension
            output_filename = f"{base_filename}.webp"
            output_path = os.path.join(output_folder, output_filename)
            
            try:
                # Open the image
                with Image.open(input_path) as img:
                    # Convert images with transparency to RGBA for consistency
                    if img.mode in ("P", "LA"):
                        img = img.convert("RGBA")
                    # Resize the image
                    thumbnail = img.resize(target_size, Image.Resampling.LANCZOS)
                    
                    # Save the new thumbnail in WEBP format
                    thumbnail.save(output_path, "WEBP")
                    
                    print(f"  -> Converted {filename} to {output_filename}")

            except Exception as e:
                print(f"  !! Failed to process {filename}: {e}")

    print("\nThumbnail generation complete!")
    print(f"Your new thumbnails are in the '{output_folder}' folder.")
